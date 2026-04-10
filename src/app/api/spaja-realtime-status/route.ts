import { NextResponse } from 'next/server';
import { spajaRealtimeSistem } from '@/lib/spaja-realtime';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Real-Time — Status',
    verzija: APP_VERSION,
    status: spajaRealtimeSistem.status,
    statistika: spajaRealtimeSistem.statistika,
    tehnologije: spajaRealtimeSistem.tehnologije,
    ukupnoMogucnosti: spajaRealtimeSistem.mogucnosti.length,
    timestamp: new Date().toISOString(),
  });
}
