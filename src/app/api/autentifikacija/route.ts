import { NextResponse } from 'next/server';
import { autentifikacijaSistem } from '@/lib/autentifikacija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Autentifikacija & Sigurnosni Sistem',
    verzija: APP_VERSION,
    autentifikacija: {
      ...autentifikacijaSistem,
      konfiguracija: {
        ...autentifikacijaSistem.konfiguracija,
        jwtTajna: '***ZAŠTIĆENO***',
      },
    },
    timestamp: new Date().toISOString(),
  });
}
