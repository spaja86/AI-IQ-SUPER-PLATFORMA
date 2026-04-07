import { NextResponse } from 'next/server';
import {
  spajaProVerzije,
  getAktivneVerzije,
  getBetaVerzije,
  getNajnovijuAktivnu,
  getUkupnoMogucnosti,
  getPoStatusu,
} from '@/lib/spaja-pro';
import { APP_VERSION, SPAJA_PRO_VERZIJA_COUNT, SPAJA_PRO_RANGE } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneVerzije();
  const beta = getBetaVerzije();
  const najnovija = getNajnovijuAktivnu();
  const mogucnosti = getUkupnoMogucnosti();
  const poStatusu = getPoStatusu();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Benchmark — Performanse Verzija',
    verzija: APP_VERSION,

    pregled: {
      ukupnoVerzija: SPAJA_PRO_VERZIJA_COUNT,
      opseg: SPAJA_PRO_RANGE,
      aktivnih: aktivne.length,
      beta: beta.length,
      ukupnoMogucnosti: mogucnosti,
    },

    najnovija: {
      verzija: najnovija.verzija,
      naziv: najnovija.naziv,
      status: najnovija.status,
    },

    poStatusu,

    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      status: v.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
