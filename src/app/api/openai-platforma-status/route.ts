import { NextResponse } from 'next/server';
import { APP_VERSION, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OpenAI Platforma Status',
    verzija: APP_VERSION,

    openaiPlatforma: {
      id: 'openai-platforma',
      naziv: 'OpenAI Platforma — Digitalna Industrija',
      status: 'aktivna',
      tip: 'SOPSTVENA platforma — NIJE partner',
      repo: 'spaja86/openai-platform',
      digitalnaIndustrija: true,
      evolucija: 'non-stop',
      progres: 100,
    },

    povezanost: {
      omegaAI: { status: 'aktivan', persona: OMEGA_AI_PERSONA_UKUPNO },
      spajaProEngine: { status: 'aktivan', verzije: 'v6-15' },
      digitalnaIndustrija: { status: 'aktivan', uloga: 'interna-platforma' },
      ekosistem: { status: 'aktivan', povezanePlatforme: 14 },
    },

    timestamp: new Date().toISOString(),
  });
}
