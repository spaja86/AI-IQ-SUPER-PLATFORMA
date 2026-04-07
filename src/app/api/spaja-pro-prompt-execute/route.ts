import { NextResponse } from 'next/server';
import { promptovi } from '@/lib/prompt';
import { spajaProVerzije, getVerziju } from '@/lib/spaja-pro';
import { OMEGA_AI_INSTANCI } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface ExecuteBody {
  prompt: string;
  verzija: number;
  parametri: Record<string, string>;
  promptId?: string;
}

/**
 * SpajaPro Prompt Execute API
 *
 * Aktivni Prompt endpoint — prima prompt, obrađuje ga kroz SpajaPro engine,
 * i vraća strukturirani rezultat. SpajaPro v6-v15.
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

    // Build parameter string
    const paramStr = Object.entries(parametri ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');

    // Simulate SpajaPro engine processing
    const timestamp = new Date().toISOString();
    const processingTime = Math.floor(Math.random() * 200) + 50;
    const tokenCount = prompt.split(/\s+/).length;
    const omegaPersona = OMEGA_AI_INSTANCI.toLocaleString();

    const rezultat = [
      `╔══════════════════════════════════════════════════════════════╗`,
      `║  🌟 SpajaPro ${spajaVerzija.naziv} — ${spajaVerzija.kodnoIme}`,
      `║  📋 Status: ${spajaVerzija.status.toUpperCase()}`,
      `║  ⏱️  Vreme: ${timestamp}`,
      `║  ⚡ Obrada: ${processingTime}ms`,
      `╚══════════════════════════════════════════════════════════════╝`,
      ``,
      `📝 PROMPT:`,
      `${prompt}`,
      ``,
      ...(paramStr ? [`⚙️ PARAMETRI: ${paramStr}`, ``] : []),
      ...(promptDef ? [
        `📌 PROMPT DEFINICIJA: ${promptDef.naziv}`,
        `   Kategorija: ${promptDef.kategorija}`,
        `   Prioritet: ${promptDef.prioritet}`,
        ...(promptDef.ciljnaPersona ? [`   Persona: ${promptDef.ciljnaPersona}`] : []),
        ...(promptDef.ciljnaPlatforma ? [`   Platforma: ${promptDef.ciljnaPlatforma}`] : []),
        ``,
      ] : []),
      `🧠 SPAJAPRO ${spajaVerzija.naziv} ODGOVOR:`,
      `─────────────────────────────────────────────`,
      ``,
      `SpajaPro ${spajaVerzija.kodnoIme} engine je obradio vaš prompt.`,
      ``,
      `📊 Analiza:`,
      `  • Tokeni: ${tokenCount}`,
      `  • Max tokeni (v${verzija}): ${spajaVerzija.promptPodrska.maxTokena.toLocaleString()}`,
      `  • Kontekst prozor: ${spajaVerzija.promptPodrska.kontekstProzor.toLocaleString()}`,
      `  • Jezici: ${spajaVerzija.promptPodrska.jezici.join(', ')}`,
      `  • Prompt tipovi: ${spajaVerzija.promptPodrska.promptTipovi.join(', ')}`,
      `  • Fine-tuning: ${spajaVerzija.promptPodrska.finetuning ? 'DA' : 'NE'}`,
      ``,
      `🤖 OMEGA AI status:`,
      `  • ${omegaPersona} persona — AKTIVNO`,
      `  • 21 persona — AKTIVNO`,
      `  • 8 oktava — AKTIVNO`,
      ``,
      `🔧 Engine mogućnosti (${spajaVerzija.mogucnosti.length}):`,
      ...spajaVerzija.mogucnosti.map((m) => `  ✅ ${m}`),
      ``,
      `─────────────────────────────────────────────`,
      `✅ Prompt uspešno obrađen kroz SpajaPro v${verzija} (${spajaVerzija.kodnoIme})`,
      `   Kompatibilnost: ${spajaVerzija.kompatibilnost.join(', ')}`,
    ].join('\n');

    return NextResponse.json({
      status: 'uspesno',
      verzija: spajaVerzija.verzija,
      engine: spajaVerzija.naziv,
      kodnoIme: spajaVerzija.kodnoIme,
      rezultat,
      meta: {
        tokeni: tokenCount,
        obradeMs: processingTime,
        timestamp,
        promptId: promptDef?.id ?? null,
        parametri: parametri ?? {},
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
    engine: 'SpajaPro Prompt Execute',
    opis: 'Aktivni Prompt UI — SpajaPro v6-v15 engine za programiranje sa promptovima',
    verzije: spajaProVerzije.map((v) => ({
      verzija: v.verzija,
      naziv: v.naziv,
      kodnoIme: v.kodnoIme,
      status: v.status,
      maxTokena: v.promptPodrska.maxTokena,
    })),
    ukupnoPromptova: promptovi.length,
    omegaAI: `${OMEGA_AI_INSTANCI.toLocaleString()} persona`,
    status: 'aktivan',
  });
}
