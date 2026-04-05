import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_IGRICA,
  TOTAL_DIAGNOSTIKA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  MOBILNE_CENTRALE,
  PROKSI_KAPACITET,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforma Arhitektura — Kompletni Pregled',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    platforma: APP_NAME,

    arhitektura: {
      frontend: {
        framework: 'Next.js 16 (App Router)',
        jezik: 'TypeScript',
        stil: 'TailwindCSS 4',
        stranice: TOTAL_PAGES,
      },

      api: {
        endpointa: TOTAL_API_ROUTES,
        ukupnoRuta: TOTAL_ROUTES,
        format: 'JSON REST API',
      },

      ai: {
        persone: OMEGA_AI_PERSONA_COUNT,
        oktave: OMEGA_AI_OKTAVA_COUNT,
        spajaPro: SPAJA_PRO_VERZIJA_COUNT,
      },

      infrastruktura: {
        proksiKapacitet: PROKSI_KAPACITET,
        mobilneCentrale: MOBILNE_CENTRALE,
        dijagnostika: TOTAL_DIAGNOSTIKA,
        igrice: TOTAL_IGRICA,
      },

      autofinish: {
        brojac: AUTOFINISH_COUNT,
        cilj: AUTOFINISH_TARGET,
        procenat: `${((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2)}%`,
      },
    },

    moduli: [
      'SpajaPro Prompt Engine',
      'OMEGA AI Persone',
      'Proksi Mreža',
      'SPAJA Mobilna',
      'Auto-Repair Dijagnostika',
      'Evolucija Engine',
      'Upgrade Engine',
      'Ekosistem Health',
    ],

    timestamp: new Date().toISOString(),
  });
}
