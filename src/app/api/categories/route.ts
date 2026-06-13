import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/s3';
import { sampleProducts } from '@/data/sample-products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metalType = searchParams.get('metalType');

    let products;
    try {
      products = await getProducts();
      if (products.length === 0) products = sampleProducts;
    } catch {
      products = sampleProducts;
    }

    if (metalType) {
      products = products.filter((p: any) => p.metalType === metalType);
    }

    // Only active products for categories
    products = products.filter((p: any) => p.active);

    const categories = Array.from(new Set(products.map((p: any) => p.category)))
      .map(category => ({
        value: category,
        label: (category as string).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }));

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}
