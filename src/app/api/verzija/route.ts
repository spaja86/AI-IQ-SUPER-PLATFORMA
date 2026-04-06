import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  SPAJA_PRO_RANGE,
  SPAJA_PRO_VERZIJA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  PROKSI_KAPACITET,
  MOBILNE_CENTRALE,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: APP_NAME,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    status: 'operational',

    brojevi: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAIPersone: OMEGA_AI_PERSONA_COUNT,
      omegaAIOktave: OMEGA_AI_OKTAVA_COUNT,
      spajaProVerzije: SPAJA_PRO_VERZIJA_COUNT,
      spajaProRange: SPAJA_PRO_RANGE,
      proksiKapacitet: PROKSI_KAPACITET,
      mobilneCentrale: MOBILNE_CENTRALE,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    tehnologije: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS 4',
      'Vercel',
      'SpajaPro Engine v6-15',
      'OMEGA AI 21 Persona',
      'Proksi Mreža',
      'SPAJA Mobilna Mreža',
    ],

    timestamp: new Date().toISOString(),
  });
}
