import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { callCentarPaketi, callCentarDigitalneUsluge } from '@/lib/call-centar';

export async function GET() {
  return NextResponse.json({
    sistem: 'CALL CENTAR — Paketi digitalnih usluga',
    verzija: APP_VERSION,
    paketi: callCentarPaketi,
    digitalneUsluge: callCentarDigitalneUsluge,
    timestamp: new Date().toISOString(),
  });
}
