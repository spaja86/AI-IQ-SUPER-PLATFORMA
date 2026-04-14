import { NextResponse } from 'next/server';
import { spajaDigitalniTelevizor } from '@/lib/spaja-digitalni-televizor';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Digitalni Televizor — Kanali',
    verzija: APP_VERSION,
    ukupnoKanala: spajaDigitalniTelevizor.kanali.length,
    kanali: spajaDigitalniTelevizor.kanali,
    timestamp: new Date().toISOString(),
  });
}
