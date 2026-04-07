import { NextResponse } from 'next/server';
import { mobilneCentrale, mobilniServisi } from '@/lib/mobilna-mreza';
import { APP_VERSION, MOBILNE_CENTRALE, MOBILNI_POZIVNI } from '@/lib/constants';

export async function GET() {
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

    timestamp: new Date().toISOString(),
  });
}
