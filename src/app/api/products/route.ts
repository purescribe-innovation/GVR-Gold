// ============================================================
// GVR Gold & Silver — Products API (List & Create)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, generateProductId } from '@/lib/s3';
import { verifyToken } from '@/lib/auth';
import { sampleProducts } from '@/data/sample-products';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/products — List all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metalType = searchParams.get('metalType');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10); // Default to 100 for backward compatibility

    let products: Product[];

    try {
      products = await getProducts();
      // If no products in S3, use sample data
      if (products.length === 0) {
        products = sampleProducts;
      }
    } catch {
      // S3 not available, use sample data
      products = sampleProducts;
    }

    // Apply filters
    if (metalType) {
      products = products.filter(p => p.metalType === metalType);
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }
    const search = searchParams.get('search');
    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.id.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s)
      );
    }
    if (featured !== null && featured !== undefined) {
      products = products.filter(p => p.featured === (featured === 'true'));
    }
    if (active !== null && active !== undefined) {
      products = products.filter(p => p.active === (active === 'true'));
    }

    const sort = searchParams.get('sort') || 'featured';
    
    // Sort products
    products = products.sort((a, b) => {
      if (sort === 'weight-asc') return a.weight - b.weight;
      if (sort === 'weight-desc') return b.weight - a.weight;
      if (sort === 'newest') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      // featured default: featured items first
      if (sort === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      return 0;
    });

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      total: paginatedProducts.length,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Graceful fallback
    return NextResponse.json({
      success: true,
      data: sampleProducts,
      total: sampleProducts.length,
      fallback: true,
    });
  }
}

// POST /api/products — Create a new product
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('gvr_admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'metalType', 'purity', 'weight'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get existing products to generate ID
    let existingProducts: Product[];
    try {
      existingProducts = await getProducts();
    } catch {
      existingProducts = [];
    }

    const productId = generateProductId(body.metalType, existingProducts);

    const newProduct: Product = {
      id: productId,
      name: body.name,
      category: body.category,
      metalType: body.metalType,
      purity: body.purity,
      weight: parseFloat(body.weight),
      makingCharges: parseFloat(body.makingCharges) || 0,
      makingChargeType: body.makingChargeType || 'percentage',
      description: body.description || '',
      images: body.images || [],
      featured: body.featured || false,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addProduct(newProduct);
    } catch (s3Error) {
      console.error('S3 save error:', s3Error);
      return NextResponse.json(
        { error: 'Failed to save product. S3 may not be configured.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: true, data: newProduct, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
