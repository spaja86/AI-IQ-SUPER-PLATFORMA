import { NextResponse } from 'next/server';
import { APP_VERSION, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    naziv: 'OpenAI Platforma — Digitalna Industrija',
    verzija: APP_VERSION,

    platforma: {
      id: 'openai-platforma',
      naziv: 'OpenAI Platforma — Digitalna Industrija',
      tip: 'SOPSTVENA platforma — NIJE partner',
      opis: 'SOPSTVENA platforma Digitalne Industrije Kompanije SPAJA. OpenAI API integracija sa SpajaPro v6-15 endžinima i OMEGA AI sistemom. Non-stop evolucija unutar Digitalne Industrije.',
      repo: 'spaja86/openai-platform',
      repoUrl: 'https://github.com/spaja86/openai-platform',
      kategorija: 'ai',
      status: 'aktivna',
      progres: 100,
    },

    integracija: {
      digitalnaIndustrija: true,
      omegaAI: true,
      omegaAIPersona: OMEGA_AI_PERSONA_UKUPNO,
      spajaProEngine: 'v6-15',
      ekosistemPovezanost: 'potpuna',
      evolucija: 'non-stop',
    },

    tehnologije: ['TypeScript', 'OpenAI API', 'SpajaPro v6-15 Engine', 'OMEGA AI', 'Vercel', 'Digitalna Industrija'],

    planovi: [
      { naziv: 'Starter', cena: '$29/mes', upitaDnevno: 100, verzije: 'v6-8' },
      { naziv: 'Profesionalni', cena: '$79/mes', upitaDnevno: 500, verzije: 'v6-11' },
      { naziv: 'Biznis', cena: '$199/mes', upitaDnevno: 2000, verzije: 'v6-15' },
      { naziv: 'Enterprise', cena: '$499/mes', upitaDnevno: 'neograniceno', verzije: 'v6-15' },
      { naziv: 'Unlimited VIP', cena: '$999/mes', upitaDnevno: 'neograniceno', verzije: 'v6-15' },
    ],

    timestamp: new Date().toISOString(),
  });
}
