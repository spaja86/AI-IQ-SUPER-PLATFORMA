import { NextResponse } from 'next/server';
import { spajaMonitoringLive } from '@/lib/spaja-monitoring-live';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Monitoring Live',
    verzija: APP_VERSION,
    monitoringLive: spajaMonitoringLive,
    timestamp: new Date().toISOString(),
  });
}
