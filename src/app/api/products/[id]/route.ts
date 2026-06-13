// ============================================================
// GVR Gold & Silver — Single Product API (Read, Update, Delete)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/s3';
import { verifyToken } from '@/lib/auth';
import { sampleProducts } from '@/data/sample-products';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/products/[id] — Get a single product by ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    let product;
    try {
      product = await getProductById(id);
    } catch {
      // S3 not available, fallback
      product = null;
    }

    // Fallback to sample data
    if (!product) {
      product = sampleProducts.find(p => p.id === id) || null;
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — Update a product
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;
    const body = await request.json();

    try {
      const updated = await updateProduct(id, body);
      if (!updated) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Product updated successfully',
      });
    } catch (s3Error) {
      console.error('S3 update error:', s3Error);
      return NextResponse.json(
        { error: 'Failed to update product. S3 may not be configured.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] — Delete a product
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    try {
      const deleted = await deleteProduct(id);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (s3Error) {
      console.error('S3 delete error:', s3Error);
      return NextResponse.json(
        { error: 'Failed to delete product. S3 may not be configured.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
