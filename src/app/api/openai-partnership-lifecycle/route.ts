// OpenAI Partnership Lifecycle — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET  /api/openai-partnership-lifecycle  — kompletni lifecycle status
// POST /api/openai-partnership-lifecycle  — lifecycle stanje tranzicija

import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { upisiEnterpriseKomunikaciju, type EnterpriseKontaktKanal } from '@/lib/enterprise-ugovor-modul';
import { getOpenAILifecycleStatus, LIFECYCLE_STANJA, type OpenAIPartnershipState } from '@/lib/openai-partnership-lifecycle';

const VALID_STANJA = new Set<OpenAIPartnershipState>(
  LIFECYCLE_STANJA.map((s) => s.id),
);

const VALID_KANALI = new Set<EnterpriseKontaktKanal>([
  'kontakt_forma',
  'email',
  'poziv',
  'sastanak',
]);

export async function GET() {
  try {
    const lifecycleStatus = getOpenAILifecycleStatus();
    return NextResponse.json({
      status: 'aktivan',
      verzija: APP_VERSION,
      opis: 'Formalni lifecycle za OpenAI Enterprise + Partnership request: u_pripremi → spreman_za_slanje → poslato → kontaktiran → u_pregovorima → prihvaceno / odbijeno / fallback_aktiviran.',
      ...lifecycleStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri čitanju lifecycle statusa', detalji: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Neispravan JSON body' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Body mora biti objekat' }, { status: 400 });
    }

    const { state, kanal, kontaktOsoba, napomena } = body as Record<string, unknown>;

    if (!state || typeof state !== 'string' || !VALID_STANJA.has(state as OpenAIPartnershipState)) {
      return NextResponse.json(
        {
          error: 'Neispravan parametar state',
          validnaStanja: [...VALID_STANJA],
        },
        { status: 400 },
      );
    }

    if (kanal !== undefined && (typeof kanal !== 'string' || !VALID_KANALI.has(kanal as EnterpriseKontaktKanal))) {
      return NextResponse.json(
        {
          error: 'Neispravan parametar kanal',
          validniKanali: [...VALID_KANALI],
        },
        { status: 400 },
      );
    }

    const kanalValue = (kanal ?? 'email') as EnterpriseKontaktKanal;
    const kontaktOsobaValue = typeof kontaktOsoba === 'string' ? kontaktOsoba : 'sistem';
    const napomenaValue =
      typeof napomena === 'string'
        ? napomena
        : `Lifecycle tranzicija → ${state}`;

    await upisiEnterpriseKomunikaciju({
      provider: 'openai',
      podtip: 'osnovni',
      status: state === 'prihvaceno' ? 'potpisano' : state === 'kontaktiran' ? 'kontaktiran' : 'pending',
      kanal: kanalValue,
      kontaktOsoba: kontaktOsobaValue,
      napomena: `[lifecycle:${state}] ${napomenaValue}`,
    });

    const noviStatus = getOpenAILifecycleStatus();

    return NextResponse.json({
      success: true,
      poruka: `Lifecycle tranzicija upisana: ${state}`,
      novoStanje: state,
      evidencijaPrimljena: true,
      lifecycle: noviStatus.summary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri tranziciji lifecycle stanja', detalji: String(error) },
      { status: 500 },
    );
  }
}
