import { NextResponse } from 'next/server';
import { spajaMonitoringLive } from '@/lib/spaja-monitoring-live';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Monitoring Live — Status',
    verzija: APP_VERSION,
    status: spajaMonitoringLive.status,
    ukupnoStreamova: spajaMonitoringLive.streamovi.length,
    statistika: spajaMonitoringLive.statistika,
    timestamp: new Date().toISOString(),
  });
}
