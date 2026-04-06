import { NextResponse } from 'next/server';
import { products, getActiveProducts, productCategories } from '@/lib/products';

export async function GET() {
  const active = getActiveProducts();

  return NextResponse.json({
    status: 'operational',
    ukupno: products.length,
    aktivnih: active.length,
    kategorije: Object.keys(productCategories).length,
    proizvodi: products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      status: p.status,
      icon: p.icon,
      version: p.version,
      features: p.features.length,
      techStack: p.techStack,
    })),
    timestamp: new Date().toISOString(),
  });
}
