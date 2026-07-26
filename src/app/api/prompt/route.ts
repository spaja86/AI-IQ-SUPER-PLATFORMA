import { NextRequest, NextResponse } from 'next/server';
import { getPromptBiblioteka, getPromptKategorije, promptovi } from '@/lib/prompt';
import { omegaPersone } from '@/lib/omega-ai';
import { obradiPrompt } from '@/lib/spaja-pro-prompt-engine';
import { spajaProVerzije, getAktivneVerzije } from '@/lib/spaja-pro';
import { getActivePrompt } from '@/lib/prompt-versioning';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const biblioteka = getPromptBiblioteka();
  const kategorije = getPromptKategorije();

  return NextResponse.json({
    sistem: 'Prompt Sistem — Kompanija SPAJA',
    verzija: APP_VERSION,
    opis: 'Centralni Prompt sistem za ceo ekosistem. Prompt je svuda.',
    engine: 'SpajaPro 6-15',
    statistike: {
      ukupnoPromptova: biblioteka.ukupnoPromptova,
      kategorija: kategorije.length,
      personaPromptova: biblioteka.personaPromptovi,
      platformaPromptova: biblioteka.platformaPromptovi,
      spajaProVerzije: biblioteka.spajaProVerzije,
    },
    kategorije: biblioteka.kategorije,
    personeSaPromptom: omegaPersone.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      prompt: p.prompt,
      spajaProVerzija: p.spajaProVerzija,
      oktavniNivo: p.oktavniNivo,
    })),
    promptovi: biblioteka.promptovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      spajaProVerzija: p.spajaProVerzija,
      ciljnaPersona: p.ciljnaPersona,
      ciljnaPlatforma: p.ciljnaPlatforma,
      tagovi: p.tagovi,
      prioritet: p.prioritet,
    })),
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/prompt
 * Executes a prompt by ID or category with SpajaPro engine.
 *
 * Body:
 *   { promptId?: string, kategorija?: string, upit: string, spajaProVerzija?: number }
 */
export async function POST(request: NextRequest) {
  let body: { promptId?: string; kategorija?: string; upit?: string; spajaProVerzija?: number };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON payload' }, { status: 400 });
  }

  const { promptId, kategorija, upit, spajaProVerzija } = body;

  if (!upit || typeof upit !== 'string' || upit.trim().length === 0) {
    return NextResponse.json({ error: 'upit je obavezan i ne sme biti prazan' }, { status: 400 });
  }

  // Pronađi prompt definiciju
  let promptDef = null;
  if (promptId) {
    promptDef = promptovi.find((p) => p.id === promptId) ?? null;
    if (!promptDef) {
      return NextResponse.json(
        { error: `Prompt '${promptId}' nije pronađen`, dostupniPromptovi: promptovi.map((p) => p.id) },
        { status: 404 },
      );
    }
  } else if (kategorija) {
    promptDef = promptovi.find((p) => p.kategorija === kategorija) ?? null;
  }

  // Odabir SpajaPro verzije
  const aktivne = getAktivneVerzije();
  const targetVerzija = spajaProVerzija ?? promptDef?.spajaProVerzija;
  const engine =
    (targetVerzija
      ? spajaProVerzije.find((v) => v.verzija === targetVerzija && (v.status === 'aktivna' || v.status === 'beta'))
      : null) ??
    aktivne[0] ??
    spajaProVerzije[0];

  if (!engine) {
    return NextResponse.json({ error: 'Nema dostupnih SpajaPro verzija' }, { status: 503 });
  }

  // Učitaj aktivnu sistemsku verziju prompta za kontekst
  const sistemskiPrompt = getActivePrompt('spaja-pro-system');
  const kontekst = sistemskiPrompt
    ? `${sistemskiPrompt.prompt}\n\nKorisnikov upit: ${upit.trim()}`
    : upit.trim();

  const odgovor = obradiPrompt(kontekst, engine, promptDef);

  return NextResponse.json({
    sistem: 'Prompt Sistem — Kompanija SPAJA',
    verzija: APP_VERSION,
    prompt: promptDef
      ? { id: promptDef.id, naziv: promptDef.naziv, kategorija: promptDef.kategorija }
      : null,
    engine: {
      verzija: engine.verzija,
      naziv: engine.naziv,
      kodnoIme: engine.kodnoIme,
    },
    odgovor,
    timestamp: new Date().toISOString(),
  });
}
