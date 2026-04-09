import { NextResponse } from 'next/server';
import { spajaPlatniSistem } from '@/lib/spaja-platni-sistem';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Platni Sistem',
    verzija: APP_VERSION,
    platniSistem: {
      ...spajaPlatniSistem,
      konfiguracija: {
        ...spajaPlatniSistem.konfiguracija,
        secretKey: '***ZAŠTIĆENO***',
        webhookSecret: '***ZAŠTIĆENO***',
      },
    },
    timestamp: new Date().toISOString(),
  });
}
