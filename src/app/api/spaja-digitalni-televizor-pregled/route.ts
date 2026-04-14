import { NextResponse } from 'next/server';
import { getTVPregled } from '@/lib/spaja-digitalni-televizor';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Digitalni Televizor — Pregled',
    verzija: APP_VERSION,
    pregled: getTVPregled(),
    timestamp: new Date().toISOString(),
  });
}
