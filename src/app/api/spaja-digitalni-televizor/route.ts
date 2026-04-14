import { NextResponse } from 'next/server';
import { spajaDigitalniTelevizor } from '@/lib/spaja-digitalni-televizor';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Digitalni Televizor',
    verzija: APP_VERSION,
    digitalniTelevizor: spajaDigitalniTelevizor,
    timestamp: new Date().toISOString(),
  });
}
