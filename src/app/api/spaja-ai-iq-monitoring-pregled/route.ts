import { NextResponse } from 'next/server';
import { getMonitoringPregled } from '@/lib/spaja-ai-iq-monitoring';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA AI IQ Monitoring — Pregled',
    verzija: APP_VERSION,
    pregled: getMonitoringPregled(),
    timestamp: new Date().toISOString(),
  });
}
