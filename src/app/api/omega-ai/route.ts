import { NextRequest, NextResponse } from 'next/server';
import { createDispatch, getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { omegaPersone } from '@/lib/omega-ai';
import { obradiPrompt } from '@/lib/spaja-pro-prompt-engine';
import { spajaProVerzije, getAktivneVerzije } from '@/lib/spaja-pro';
import { promptovi } from '@/lib/prompt';
import { APP_VERSION, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';

export async function GET() {
  const dispatch = createDispatch();
  const summary = getDispatchSummary();

  return NextResponse.json({
    sistem: 'OMEGA AI Dispatch',
    verzija: APP_VERSION,
    arhitektura: 'sekvencijalno-oktavni',
    ukupnoPersona: omegaPersone.length,
    ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
    dispatch,
    summary,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/omega-ai
 * Dispatches a prompt to a specific OMEGA AI persona and returns the SpajaPro response.
 *
 * Body:
 *   { personaId: string, prompt: string, spajaProVerzija?: number }
 */
export async function POST(request: NextRequest) {
  let body: { personaId?: string; prompt?: string; spajaProVerzija?: number };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON payload' }, { status: 400 });
  }

  const { personaId, prompt: promptTekst, spajaProVerzija } = body;

  if (!personaId || typeof personaId !== 'string') {
    return NextResponse.json({ error: 'personaId je obavezan' }, { status: 400 });
  }
  if (!promptTekst || typeof promptTekst !== 'string' || promptTekst.trim().length === 0) {
    return NextResponse.json({ error: 'prompt je obavezan i ne sme biti prazan' }, { status: 400 });
  }

  const persona = omegaPersone.find((p) => p.id === personaId);
  if (!persona) {
    return NextResponse.json(
      { error: `Persona '${personaId}' nije pronađena`, dostupnePersone: omegaPersone.map((p) => p.id) },
      { status: 404 },
    );
  }

  // Odabir SpajaPro verzije: koristiti zahtevanu, peronu-specifičnu, ili prvu aktivnu
  const aktivne = getAktivneVerzije();
  const targetVerzija = spajaProVerzija ?? persona.spajaProVerzija;
  const engine =
    spajaProVerzije.find((v) => v.verzija === targetVerzija && (v.status === 'aktivna' || v.status === 'beta')) ??
    spajaProVerzije.find((v) => v.verzija === persona.spajaProVerzija) ??
    aktivne[0] ??
    spajaProVerzije[0];

  if (!engine) {
    return NextResponse.json({ error: 'Nema dostupnih SpajaPro verzija' }, { status: 503 });
  }

  // Pronađi persona-specifičan prompt iz biblioteke ako postoji
  const personaPrompt = promptovi.find((p) => p.ciljnaPersona === persona.uloga) ?? null;

  // Obrada prompta kroz SpajaPro engine
  const sistemskiKontekst = `${persona.prompt}\n\nKorisnikov zahtev: ${promptTekst.trim()}`;
  const odgovor = obradiPrompt(sistemskiKontekst, engine, personaPrompt);

  return NextResponse.json({
    sistem: 'OMEGA AI Dispatch',
    verzija: APP_VERSION,
    persona: {
      id: persona.id,
      naziv: persona.naziv,
      ikona: persona.ikona,
      oktavniNivo: persona.oktavniNivo,
      kategorija: persona.kategorija,
    },
    engine: {
      verzija: engine.verzija,
      naziv: engine.naziv,
      kodnoIme: engine.kodnoIme,
    },
    odgovor,
    timestamp: new Date().toISOString(),
  });
}
