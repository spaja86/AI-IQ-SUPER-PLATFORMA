import { NextResponse } from 'next/server';
import { getGigatronKatalogMetrike } from '@/lib/gigatron/gigatron-catalog';
import { getInventoryMetrike } from '@/lib/gigatron/gigatron-inventory';

export const dynamic = 'force-dynamic';

export async function GET() {
  const katalogMetrike = getGigatronKatalogMetrike();
  const inventoryMetrike = getInventoryMetrike();

  return NextResponse.json({
    ok: true,
    status: 'healthy',
    gigatron: {
      verzija: '1.0.0',
      platforma: 'AI IQ SUPER PLATFORMA',
      owner: '@spaja86',
      runtime: 'Next.js 16',
      runtimeSurface: ['/gigatron', '/api/gigatron'],
      kpis: {
        apiResponseTarget: '≤ 200ms',
        catalogAvailability: '99.9%',
        orderSuccessRate: '≥ 99%',
        affiliateAccuracy: '100%',
      },
    },
    katalog: katalogMetrike,
    inventory: {
      ukupnoProizvoda: inventoryMetrike.ukupnoProizvoda,
      naStanju: inventoryMetrike.naStanju,
      ukupnoDostupno: inventoryMetrike.ukupnoDostupno,
    },
    timestamp: new Date().toISOString(),
  });
}
