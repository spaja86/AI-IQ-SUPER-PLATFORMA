import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  BASE_URL,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_RANGE,
  SPAJA_PRO_VERZIJA_COUNT,
  MOBILNE_CENTRALE,
  PROKSI_KAPACITET,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    runtime: {
      framework: 'Next.js 16',
      language: 'TypeScript 5',
      platform: 'Vercel Edge',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV ?? 'production',
    },

    aplikacija: {
      naziv: APP_NAME,
      verzija: APP_VERSION,
      kompanija: KOMPANIJA,
      url: BASE_URL,
      jezik: 'sr-Latn',
    },

    ekosistem: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAIPersone: OMEGA_AI_PERSONA_COUNT,
      omegaAIOktave: OMEGA_AI_OKTAVA_COUNT,
      spajaProVerzije: SPAJA_PRO_RANGE,
      spajaProBroj: SPAJA_PRO_VERZIJA_COUNT,
      mobilneCentrale: MOBILNE_CENTRALE,
      proksiKapacitet: PROKSI_KAPACITET,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
