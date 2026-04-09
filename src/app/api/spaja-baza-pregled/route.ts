import { NextResponse } from 'next/server';
import { getBazaPregled } from '@/lib/spaja-baza';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA BAZA — Pregled',
    verzija: APP_VERSION,
    pregled: getBazaPregled(),
    timestamp: new Date().toISOString(),
  });
}
