import { NextResponse } from 'next/server';
import { igrice, getSveKategorijeIgrica } from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();

  const topIgrice = igrice
    .filter((i) => i.link)
    .slice(0, 10)
    .map((i) => ({ naziv: i.naziv, kategorija: i.kategorija }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Igrice Pregled — Kompletni Gaming Ekosistem',
    verzija: APP_VERSION,

    pregled: {
      ukupno: TOTAL_IGRICA,
      kategorija: kategorije.length,
      saLinkom: igrice.filter((i) => i.link).length,
      bezLinka: igrice.filter((i) => !i.link).length,
    },

    kategorije: kategorije.map((kat) => ({
      kategorija: kat,
      broj: igrice.filter((i) => i.kategorija === kat).length,
    })),

    topIgrice,

    statistike: {
      prosecnoPoKategoriji: (TOTAL_IGRICA / kategorije.length).toFixed(1),
      najvecaKategorija: kategorije.reduce(
        (max, kat) => {
          const count = igrice.filter((i) => i.kategorija === kat).length;
          return count > max.broj ? { kategorija: kat, broj: count } : max;
        },
        { kategorija: '', broj: 0 }
      ),
    },

    timestamp: new Date().toISOString(),
  });
}
