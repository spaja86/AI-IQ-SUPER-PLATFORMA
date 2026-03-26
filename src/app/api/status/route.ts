import { NextResponse } from 'next/server';
import { getEcosystemStats } from '@/lib/stats';

export async function GET() {
  const stats = getEcosystemStats();
  return NextResponse.json({
    status: 'operational',
    version: '4.0.0',
    platform: 'AI IQ SUPER PLATFORMA',
    owner: 'Kompanija SPAJA',
    stats,
    timestamp: new Date().toISOString(),
  });
}
