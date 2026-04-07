import { NextResponse } from 'next/server';
import { companies, getActiveCompanies } from '@/lib/companies';

export async function GET() {
  const active = getActiveCompanies();

  return NextResponse.json({
    status: 'operational',
    ukupno: companies.length,
    aktivnih: active.length,
    kompanije: companies.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      status: c.status,
      icon: c.icon,
      industry: c.industry,
      products: c.products.length,
      platforms: c.platformIds.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
