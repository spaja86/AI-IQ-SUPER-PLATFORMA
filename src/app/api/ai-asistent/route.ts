// SpajaUltraOmegaCore -∞Ω+∞ — AI Asistent API Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/ai-asistent — kontekstualni AI asistent za svaku stranicu

import { NextResponse } from 'next/server';
import { getPagePrompts, getUkupnoAiPagePrompts, getUkupnoStranica } from '@/lib/ai-page-prompts';
import { obradiPrompt, formatOdgovor, pretraziEkosistem } from '@/lib/spaja-pro-prompt-engine';
import { getVerziju } from '@/lib/spaja-pro';
import {
  APP_VERSION,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
} from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface AsistentBody {
  pitanje: string;
  putanja: string;
  kontekst: string;
  naslovStranice: string;
  kategorija: 'ai' | 'spaja-pro-ai';
}

/**
 * AI Asistent API — odgovara na korisnička pitanja u kontekstu stranice.
 * Koristi SpajaPro Prompt Engine za obradu i generisanje odgovora.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AsistentBody;
    const { pitanje, putanja, kontekst, naslovStranice, kategorija } = body;

    if (!pitanje || typeof pitanje !== 'string' || !pitanje.trim()) {
      return NextResponse.json({ error: 'Pitanje je obavezno.' }, { status: 400 });
    }

    // Dohvati SpajaPro v15 engine (najnovija)
    const spajaVerzija = getVerziju(15);
    if (!spajaVerzija) {
      return NextResponse.json({ error: 'SpajaPro engine nije dostupan.' }, { status: 500 });
    }

    // Dohvati konfiguraciju stranice
    const pageConfig = getPagePrompts(putanja ?? '/');

    // Kreiraj kontekstualni prompt za engine
    const kontekstualniPrompt = [
      `[Kontekst stranice: ${naslovStranice ?? pageConfig.naslov}]`,
      kontekst ?? pageConfig.kontekst,
      `[Pitanje korisnika]: ${pitanje.trim()}`,
      kategorija === 'spaja-pro-ai'
        ? '[Odgovori kao SpajaPro AI asistent sa tehnickim detaljima]'
        : '[Odgovori kao AI asistent jasno i prijateljski]',
    ].join('\n');

    // Obradi kroz SpajaPro engine
    const odgovor = obradiPrompt(kontekstualniPrompt, spajaVerzija, null);
    const formatiran = formatOdgovor(odgovor);

    // Dodaj pretragu ekosistema ako je relevantno
    const pretragaTekst = pitanje.toLowerCase();
    const isPretragaQuery =
      pretragaTekst.includes('koliko') ||
      pretragaTekst.includes('koji') ||
      pretragaTekst.includes('šta je') ||
      pretragaTekst.includes('sta je') ||
      pretragaTekst.includes('kako') ||
      pretragaTekst.includes('objasni') ||
      pretragaTekst.includes('gde') ||
      pretragaTekst.includes('pronađi');

    const pretraga = isPretragaQuery ? pretraziEkosistem(pitanje) : '';
    const imaKorisnuPretragu = Boolean(pretraga);

    const finalOdgovor = imaKorisnuPretragu
      ? `${formatiran}\n\n🔍 Dodatne informacije:\n${pretraga}`
      : formatiran;

    return NextResponse.json({
      status: 'uspesno',
      odgovor: finalOdgovor,
      stranica: naslovStranice ?? pageConfig.naslov,
      kategorija,
      engine: `SpajaPro v${spajaVerzija.verzija}`,
      meta: {
        appVerzija: APP_VERSION,
        putanja,
        aiTip: kategorija,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Greska pri obradi pitanja. Pokusajte ponovo.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'AI Asistent — SpajaPro Prompt Engine v15',
    verzija: APP_VERSION,
    opis: 'Kontekstualni AI asistent za svaku stranicu AI IQ SUPER PLATFORMA. Dva moda: AI preporuke i SpajaPro AI preporuke.',
    ukupnoStranica: getUkupnoStranica(),
    ukupnoPromptova: getUkupnoAiPagePrompts(),
    modovi: ['ai', 'spaja-pro-ai'],
    statistika: {
      omegaAI: `${OMEGA_AI_PERSONA_COUNT} persona u ${OMEGA_AI_OKTAVA_COUNT} oktava (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} ukupno)`,
      apiRuta: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      stranica: TOTAL_PAGES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      igrica: TOTAL_IGRICA,
    },
    status: 'aktivan',
  });
}
