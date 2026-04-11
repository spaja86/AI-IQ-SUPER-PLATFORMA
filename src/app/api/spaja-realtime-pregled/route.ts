import { NextResponse } from 'next/server';
import { getRealtimePregled } from '@/lib/spaja-realtime';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Real-Time — Pregled',
    verzija: APP_VERSION,
    pregled: getRealtimePregled(),
    timestamp: new Date().toISOString(),
  });
}
