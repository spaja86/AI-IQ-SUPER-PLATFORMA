import { NextResponse } from 'next/server';
import { sajtovi, getSajtoviPoKategoriji, getBrojSajtova } from '@/lib/sajtovi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const ukupno = getBrojSajtova();
  const kategorije = [...new Set(sajtovi.map((s) => s.kategorija))];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Sajtovi Pregled — Kompletni Pregled Svih Sajtova',
    verzija: APP_VERSION,

    pregled: {
      ukupno,
      kategorija: kategorije.length,
    },

    kategorije: kategorije.map((kat) => ({
      kategorija: kat,
      broj: getSajtoviPoKategoriji(kat).length,
      sajtovi: getSajtoviPoKategoriji(kat).map((s) => ({
        id: s.id,
        naziv: s.naziv,
        url: s.url,
        ikona: s.ikona,
      })),
    })),

    sviSajtovi: sajtovi.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      url: s.url,
      ikona: s.ikona,
      kategorija: s.kategorija,
      opis: s.opis,
    })),

    timestamp: new Date().toISOString(),
  });
}
