import { NextResponse } from 'next/server';
import { promptovi } from '@/lib/prompt';
import { spajaProVerzije, getVerziju } from '@/lib/spaja-pro';
import { APP_VERSION, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';
import { obradiPrompt, formatOdgovor, pretraziEkosistem } from '@/lib/spaja-pro-prompt-engine';

export const dynamic = 'force-dynamic';

interface ExecuteBody {
  prompt: string;
  verzija: number;
  parametri: Record<string, string>;
  promptId?: string;
}

/**
 * SpajaPro Prompt Execute API — Funkcionalni AI Prompt Engine
 *
 * Aktivni Prompt endpoint — prima prompt, obrađuje ga kroz SpajaPro engine,
 * i vraća funkcionalni, inteligentni odgovor. SpajaPro v6-v15.
 *
 * Ovo je srce Digitalne Industrije — 29 promptova koji funkcionišu
 * kao ChatGPT zamena kroz SpajaPro engine.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExecuteBody;
    const { prompt, verzija, parametri, promptId } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt je obavezan.' }, { status: 400 });
    }

    // Find SpajaPro version
    const spajaVerzija = getVerziju(verzija as 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15);
    if (!spajaVerzija) {
      return NextResponse.json({ error: `SpajaPro verzija ${verzija} ne postoji.` }, { status: 400 });
    }

    // Find prompt definition if promptId provided
    const promptDef = promptId ? promptovi.find((p) => p.id === promptId) : null;

    // Process prompt through the intelligent engine
    const odgovor = obradiPrompt(prompt, spajaVerzija, promptDef);

    // Build parameter string for metadata
    const paramStr = Object.entries(parametri ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');

    // Format the response as text
    const rezultat = formatOdgovor(odgovor);

    // Include search results if the prompt looks like a search query
    const pretragaTekst = prompt.toLowerCase();
    const isPretragaQuery =
      pretragaTekst.includes('pronađi') ||
      pretragaTekst.includes('traži') ||
      pretragaTekst.includes('pretraži') ||
      pretragaTekst.includes('koji') ||
      pretragaTekst.includes('šta je') ||
      pretragaTekst.includes('kako');

    const pretraga = isPretragaQuery ? pretraziEkosistem(prompt) : null;

    return NextResponse.json({
      status: 'uspesno',
      verzija: spajaVerzija.verzija,
      engine: spajaVerzija.naziv,
      kodnoIme: spajaVerzija.kodnoIme,
      rezultat: pretraga ? `${rezultat}\n\n🔍 PRETRAGA EKOSISTEMA:\n${pretraga}` : rezultat,
      odgovor: {
        naslov: odgovor.naslov,
        sadrzaj: odgovor.sadrzaj,
        sekcije: odgovor.sekcije,
        preporuke: odgovor.preporuke,
      },
      meta: {
        ...odgovor.meta,
        promptId: promptDef?.id ?? null,
        parametri: parametri ?? {},
        paramStr: paramStr || null,
        appVerzija: APP_VERSION,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri obradi prompta. Pokušajte ponovo.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'SpajaPro Prompt Execute — Funkcionalni AI Engine',
    verzija: APP_VERSION,
    opis: 'Aktivni Prompt UI — SpajaPro v6-v15 engine sa 29 funkcionalnih promptova. Zamena za ChatGPT.',
    funkcionalnost: [
      'Slobodni korisniki upiti (ChatGPT stil)',
      'Biblioteka od 29 specijalizovanih promptova',
      'Pretraga celokupnog ekosistema',
      'Persona-specifični odgovori (21 persona)',
      'Platformski odgovori',
      'Sistemski izveštaji (inicijalizacija, zdravlje)',
      'Baza znanja sa 16 tema',
      'Inteligentno prepoznavanje konteksta',
    ],
    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      kodnoIme: v.kodnoIme,
      status: v.status,
      maxTokena: v.promptPodrska.maxTokena,
    })),
    ukupnoPromptova: promptovi.length,
    omegaAI: `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} persona`,
    status: 'aktivan',
  });
}
