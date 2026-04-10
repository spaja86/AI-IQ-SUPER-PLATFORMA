import { NextResponse } from 'next/server';
import { spajaRealtimeSistem } from '@/lib/spaja-realtime';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Real-Time Sistem',
    verzija: APP_VERSION,
    realtimeSistem: spajaRealtimeSistem,
    timestamp: new Date().toISOString(),
  });
}
