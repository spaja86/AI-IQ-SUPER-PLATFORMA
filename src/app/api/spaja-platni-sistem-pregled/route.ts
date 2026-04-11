import { NextResponse } from 'next/server';
import { getPlatniSistemPregled } from '@/lib/spaja-platni-sistem';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Platni Sistem — Pregled',
    verzija: APP_VERSION,
    pregled: getPlatniSistemPregled(),
    timestamp: new Date().toISOString(),
  });
}
