import { NextResponse } from 'next/server';
import { spajaProVerzije, getAktivneVerzije, getBetaVerzije, getUkupnoMogucnosti, getSvePromptTipove, getPoStatusu, getMaxTokena } from '@/lib/spaja-pro';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivneVerzije();
  const beta = getBetaVerzije();
  const ukupnoMogucnosti = getUkupnoMogucnosti();
  const sviPromptTipovi = getSvePromptTipove();
  const poStatusu = getPoStatusu();

  return NextResponse.json({
    sistem: 'SpajaPro Engine — Kompanija SPAJA',
    verzija: APP_VERSION,
    opis: 'SpajaPro 6-15 AI engine — zamena za ChatGPT u celom ekosistemu',
    izvor: 'Kompanija-SPAJA repozitorijum',
    statistike: {
      ukupnoVerzija: spajaProVerzije.length,
      aktivnih: aktivne.length,
      beta: beta.length,
      ukupnoMogucnosti,
      promptTipova: sviPromptTipovi.length,
      maxTokena: getMaxTokena(),
      poStatusu,
    },
    promptTipovi: sviPromptTipovi,
    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      kodnoIme: v.kodnoIme,
      status: v.status,
      mogucnosti: v.mogucnosti.length,
      maxTokena: v.promptPodrska.maxTokena,
      jezici: v.promptPodrska.jezici.length,
      promptTipovi: v.promptPodrska.promptTipovi,
      finetuning: v.promptPodrska.finetuning,
      kompatibilnost: v.kompatibilnost,
    })),
    timestamp: new Date().toISOString(),
  });
}
