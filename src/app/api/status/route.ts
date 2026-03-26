import { NextResponse } from 'next/server';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';

export async function GET() {
  return NextResponse.json({
    name: 'AI-IQ SUPER PLATFORMA',
    version: '3.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    ecosystem: {
      platforms: { total: platforms.length, active: platforms.filter((p) => p.status === 'active').length },
      organizations: { total: organizations.length, active: organizations.filter((o) => o.status === 'active').length },
      companies: { total: companies.length, active: companies.filter((c) => c.status === 'active').length },
      products: { total: products.length, active: products.filter((p) => p.status === 'active').length },
    },
  });
}
