import { NextResponse } from 'next/server';
import { spajaProVerzije, getAktivneVerzije } from '@/lib/spaja-pro';
import { APP_VERSION, SPAJA_PRO_RANGE, SPAJA_PRO_VERZIJA_COUNT } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneVerzije();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Status',
    verzija: APP_VERSION,

    pregled: {
      raspon: SPAJA_PRO_RANGE,
      ukupnoVerzija: SPAJA_PRO_VERZIJA_COUNT,
      detektovano: spajaProVerzije.length,
      aktivnih: aktivne.length,
    },

    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      kodnoIme: v.kodnoIme,
      opis: v.opis,
      status: v.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
