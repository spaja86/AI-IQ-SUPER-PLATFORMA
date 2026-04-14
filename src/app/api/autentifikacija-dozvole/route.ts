import { NextResponse } from 'next/server';
import { dozvole } from '@/lib/autentifikacija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Autentifikacija — Dozvole',
    verzija: APP_VERSION,
    ukupnoDozvola: dozvole.length,
    dozvole,
    timestamp: new Date().toISOString(),
  });
}
