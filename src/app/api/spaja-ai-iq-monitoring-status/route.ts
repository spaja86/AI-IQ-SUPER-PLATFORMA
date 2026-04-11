import { NextResponse } from 'next/server';
import { spajaAiIqMonitoring } from '@/lib/spaja-ai-iq-monitoring';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA AI IQ Monitoring — Status',
    verzija: APP_VERSION,
    status: spajaAiIqMonitoring.status,
    uptime: spajaAiIqMonitoring.statistika.uptimeProcenat,
    ukupnoGresaka: spajaAiIqMonitoring.greske.length,
    timestamp: new Date().toISOString(),
  });
}
