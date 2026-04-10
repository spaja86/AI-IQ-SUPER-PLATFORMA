import { NextResponse } from 'next/server';
import { getAuthPregled } from '@/lib/autentifikacija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Autentifikacija — Pregled',
    verzija: APP_VERSION,
    pregled: getAuthPregled(),
    timestamp: new Date().toISOString(),
  });
}
