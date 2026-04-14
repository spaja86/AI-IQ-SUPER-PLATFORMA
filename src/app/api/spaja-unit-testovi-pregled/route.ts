import { NextResponse } from 'next/server';
import { getTestoviPregled } from '@/lib/spaja-unit-testovi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Unit Testovi — Pregled',
    verzija: APP_VERSION,
    pregled: getTestoviPregled(),
    timestamp: new Date().toISOString(),
  });
}
