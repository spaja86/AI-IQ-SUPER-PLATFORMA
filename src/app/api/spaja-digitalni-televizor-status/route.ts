import { NextResponse } from 'next/server';
import { spajaDigitalniTelevizor, getTVSignalReadiness } from '@/lib/spaja-digitalni-televizor';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const signal = getTVSignalReadiness();
  return NextResponse.json({
    sistem: 'SPAJA Digitalni Televizor — Status',
    verzija: APP_VERSION,
    status: spajaDigitalniTelevizor.status,
    ukupnoKanala: spajaDigitalniTelevizor.kanali.length,
    statistika: spajaDigitalniTelevizor.statistika,
    signal,
    timestamp: new Date().toISOString(),
  });
}
