import { NextResponse } from 'next/server';
import { spajaRealtimeSistem, getAktivniKanali } from '@/lib/spaja-realtime';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Real-Time — Kanali',
    verzija: APP_VERSION,
    ukupnoKanala: spajaRealtimeSistem.kanali.length,
    aktivnihKanala: getAktivniKanali().length,
    kanali: spajaRealtimeSistem.kanali,
    timestamp: new Date().toISOString(),
  });
}
