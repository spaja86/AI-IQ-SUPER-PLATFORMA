import { NextResponse } from 'next/server';
import {
  getPromptBiblioteka,
  getBrojPromptova,
  getPromptKategorije,
} from '@/lib/prompt';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const biblioteka = getPromptBiblioteka();
  const ukupno = getBrojPromptova();
  const kategorije = getPromptKategorije();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Prompt Pregled — Kompletna Prompt Biblioteka',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPromptova: ukupno,
      kategorija: kategorije.length,
    },

    kategorije,

    biblioteka: {
      ukupnoPromptova: biblioteka.ukupnoPromptova,
      personaPromptovi: biblioteka.personaPromptovi,
      platformaPromptovi: biblioteka.platformaPromptovi,
      spajaProVerzije: biblioteka.spajaProVerzije.length,
    },

    timestamp: new Date().toISOString(),
  });
}
