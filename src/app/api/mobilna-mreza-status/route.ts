import { NextResponse } from 'next/server';
import { mobilneCentrale, mobilniServisi, mobilniSignali, mreza1873G, getAktivniMobilniSignali } from '@/lib/mobilna-mreza';
import { APP_VERSION, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
  const aktivniSignali = getAktivniMobilniSignali();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Mobilna Mreža Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoCentrala: MOBILNE_CENTRALE,
      detektovanoCentrala: mobilneCentrale.length,
      ukupnoServisa: mobilniServisi.length,
      pozivniBrojevi: MOBILNI_POZIVNI,
    },

    centrale: mobilneCentrale.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      opis: c.opis,
    })),

    servisi: mobilniServisi.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      opis: s.opis,
    })),

    signali: {
      ukupno: mobilniSignali.length,
      aktivnih: aktivniSignali.length,
      lista: mobilniSignali.map((s) => ({
        id: s.id,
        naziv: s.naziv,
        tip: s.tip,
        generacija: s.generacija,
        status: s.status,
      })),
    },

    mreza1873G: {
      naziv: mreza1873G.naziv,
      opseg: mreza1873G.opseg,
      bezAntena: mreza1873G.bezAntena,
      bezCentrale: mreza1873G.bezCentrale,
      razlogBezCentrale: mreza1873G.razlogBezCentrale,
      kruzniPovrat: mreza1873G.kruzniPovrat,
    },

    timestamp: new Date().toISOString(),
  });
}
