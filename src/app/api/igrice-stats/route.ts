import { NextResponse } from 'next/server';
import { igrice, getSveKategorijeIgrica } from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    brojIgrica: igrice.filter((i) => i.kategorija === kat).length,
  }));

  const saLinkom = igrice.filter((i) => 'link' in i && i.link);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Igrice Statistike',
    verzija: APP_VERSION,

    pregled: {
      ukupnoIgrica: TOTAL_IGRICA,
      detektovano: igrice.length,
      kategorija: kategorije.length,
      saEksternimLinkom: saLinkom.length,
    },

    poKategoriji,

    topIgrice: igrice.slice(0, 10).map((i) => ({
      id: i.id,
      naziv: i.naziv,
      kategorija: i.kategorija,
    })),

    timestamp: new Date().toISOString(),
  });
}
