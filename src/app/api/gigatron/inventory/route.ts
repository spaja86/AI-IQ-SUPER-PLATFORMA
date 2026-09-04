import { NextResponse } from 'next/server';
import { getInventoryMetrike, getInventoryAlerti, getInventorySve } from '@/lib/gigatron/gigatron-inventory';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrike = getInventoryMetrike();
  const alerti = getInventoryAlerti();
  const zalihe = getInventorySve();

  return NextResponse.json({
    ok: true,
    metrike,
    alerti,
    zalihe,
    timestamp: new Date().toISOString(),
  });
}
