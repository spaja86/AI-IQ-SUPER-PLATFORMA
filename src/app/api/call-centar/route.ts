import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { buildCallCentarIzvestaj } from '@/lib/call-centar';

export async function GET() {
  return NextResponse.json({
    sistem: 'CALL CENTAR — Moblini SPAJA',
    verzija: APP_VERSION,
    pregled: buildCallCentarIzvestaj(),
    timestamp: new Date().toISOString(),
  });
}
