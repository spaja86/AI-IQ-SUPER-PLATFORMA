import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';

export async function GET() {
  const stats = getStatistike();
  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'SPAJA',
    verzija: '5.0.0',
    arhitektura: 'sekvence',
    timestamp: new Date().toISOString(),
    statistike: stats,
  });
}
