import { NextResponse } from 'next/server';
import { getMonitoringLivePregled } from '@/lib/spaja-monitoring-live';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Monitoring Live — Pregled',
    verzija: APP_VERSION,
    pregled: getMonitoringLivePregled(),
    timestamp: new Date().toISOString(),
  });
}
