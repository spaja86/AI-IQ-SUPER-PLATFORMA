import { NextResponse } from 'next/server';
import { sajtovi } from '@/lib/sajtovi';
import { APP_VERSION } from '@/lib/constants';
import type { KategorijaSajta } from '@/lib/types';

export async function GET() {
  const kategorije = [...new Set(sajtovi.map((s) => s.kategorija))] as KategorijaSajta[];
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    brojSajtova: sajtovi.filter((s) => s.kategorija === kat).length,
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Sajtovi Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoSajtova: sajtovi.length,
      kategorija: kategorije.length,
    },

    poKategoriji,

    sajtovi: sajtovi.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      url: s.url,
      kategorija: s.kategorija,
      opis: s.opis,
    })),

    timestamp: new Date().toISOString(),
  });
}
