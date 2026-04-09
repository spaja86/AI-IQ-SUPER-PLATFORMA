import { NextResponse } from 'next/server';
import { autentifikacijaSistem, authKonfiguracija } from '@/lib/autentifikacija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Autentifikacija — Status',
    verzija: APP_VERSION,
    status: autentifikacijaSistem.status,
    konfiguracija: {
      jwtIsticanje: authKonfiguracija.jwtIsticanje,
      refreshIsticanje: authKonfiguracija.refreshIsticanje,
      maxSesija: authKonfiguracija.maxSesija,
      dvofaktorObavezan: authKonfiguracija.dvofaktorObavezan,
      oauthProvajderi: authKonfiguracija.oauthProvajderi,
      dozvoljeneDomene: authKonfiguracija.dozvoljeneDomene,
    },
    ukupnoDozvola: autentifikacijaSistem.dozvole.length,
    ukupnoMogucnosti: autentifikacijaSistem.mogucnosti.length,
    timestamp: new Date().toISOString(),
  });
}
