import { NextResponse } from 'next/server';
import { spajaAiIqMonitoring } from '@/lib/spaja-ai-iq-monitoring';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA AI IQ Monitoring',
    verzija: APP_VERSION,
    aiIqMonitoring: spajaAiIqMonitoring,
    timestamp: new Date().toISOString(),
  });
}
