import { NextResponse } from 'next/server';
import { spajaDigitalniTelevizor } from '@/lib/spaja-digitalni-televizor';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Digitalni Televizor — Status',
    verzija: APP_VERSION,
    status: spajaDigitalniTelevizor.status,
    ukupnoKanala: spajaDigitalniTelevizor.kanali.length,
    statistika: spajaDigitalniTelevizor.statistika,
    timestamp: new Date().toISOString(),
  });
}
