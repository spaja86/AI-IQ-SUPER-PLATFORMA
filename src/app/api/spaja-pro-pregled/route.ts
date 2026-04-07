import { NextResponse } from 'next/server';
import {
  spajaProVerzije,
  getAktivneVerzije,
  getBetaVerzije,
  getUkupnoMogucnosti,
  getPoStatusu,
  getNajnovijuAktivnu,
  getMaxTokena,
  getSvePromptTipove,
} from '@/lib/spaja-pro';
import { APP_VERSION, SPAJA_PRO_RANGE, SPAJA_PRO_VERZIJA_COUNT } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneVerzije();
  const beta = getBetaVerzije();
  const poStatusu = getPoStatusu();
  const najnovija = getNajnovijuAktivnu();
  const promptTipovi = getSvePromptTipove();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Pregled — Kompletni AI Engine',
    verzija: APP_VERSION,

    pregled: {
      raspon: SPAJA_PRO_RANGE,
      ukupnoVerzija: SPAJA_PRO_VERZIJA_COUNT,
      aktivnih: aktivne.length,
      beta: beta.length,
      ukupnoMogucnosti: getUkupnoMogucnosti(),
      maxTokena: getMaxTokena(),
      promptTipovi: promptTipovi.length,
    },

    poStatusu,

    najnovija: {
      verzija: najnovija.verzija,
      naziv: najnovija.naziv,
      kodnoIme: najnovija.kodnoIme,
      ikona: najnovija.ikona,
    },

    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      kodnoIme: v.kodnoIme,
      ikona: v.ikona,
      mogucnosti: v.mogucnosti.length,
    })),

    promptTipovi,

    timestamp: new Date().toISOString(),
  });
}
