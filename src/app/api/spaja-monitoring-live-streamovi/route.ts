import { NextResponse } from 'next/server';
import { spajaMonitoringLive } from '@/lib/spaja-monitoring-live';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Monitoring Live — Streamovi',
    verzija: APP_VERSION,
    ukupnoStreamova: spajaMonitoringLive.streamovi.length,
    streamovi: spajaMonitoringLive.streamovi,
    timestamp: new Date().toISOString(),
  });
}
