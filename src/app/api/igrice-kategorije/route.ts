import { NextResponse } from 'next/server';
import {
  igrice,
  getSveKategorijeIgrica,
  getIgricePoKategoriji,
  getBrojAktivnihIgrica,
} from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();
  const aktivnih = getBrojAktivnihIgrica();

  const poKategorijama = kategorije.map((kat) => ({
    kategorija: kat,
    broj: getIgricePoKategoriji(kat).length,
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Igrice Kategorije — Pregled po Kategorijama',
    verzija: APP_VERSION,

    pregled: {
      ukupnoIgrica: TOTAL_IGRICA,
      aktivnih,
      kategorija: kategorije.length,
    },

    poKategorijama,

    igrice: igrice.map((i) => ({
      id: i.id,
      naziv: i.naziv,
      kategorija: i.kategorija,
      status: i.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
