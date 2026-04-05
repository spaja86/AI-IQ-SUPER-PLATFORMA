import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  MOBILNE_CENTRALE,
  PROKSI_KAPACITET,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ekosistem Indeks — Kompletni Registar Entiteta',
    verzija: APP_VERSION,
    platforma: APP_NAME,
    kompanija: KOMPANIJA,

    entiteti: {
      stranice: { broj: TOTAL_PAGES, tip: 'Next.js stranice (App Router)' },
      apiEndpointi: { broj: TOTAL_API_ROUTES, tip: 'REST API JSON endpointi' },
      ukupnoRuta: { broj: TOTAL_ROUTES, tip: 'Sve rute (stranice + API)' },
      dijagnostike: { broj: TOTAL_DIAGNOSTIKA, tip: 'Auto-repair provere' },
      igrice: { broj: TOTAL_IGRICA, tip: 'Gaming kolekcija' },
      omegaPersone: { broj: OMEGA_AI_PERSONA_COUNT, tip: 'OMEGA AI persone' },
      omegaOktave: { broj: OMEGA_AI_OKTAVA_COUNT, tip: 'OMEGA AI oktave' },
      spajaProVerzije: { broj: SPAJA_PRO_VERZIJA_COUNT, tip: 'SpajaPro verzije (v6–v15)' },
      mobilneCentrale: { broj: MOBILNE_CENTRALE, tip: 'SPAJA Mobilna centrale' },
      autofinish: { broj: AUTOFINISH_COUNT, tip: 'Autofinish iteracije' },
    },

    infrastruktura: {
      proksiKapacitet: PROKSI_KAPACITET,
      hosting: 'Vercel',
      framework: 'Next.js 16 (Turbopack)',
      jezik: 'TypeScript',
      stil: 'TailwindCSS 4',
    },

    moduli: [
      'OMEGA AI Engine', 'SpajaPro Prompt', 'Proksi Mreža',
      'SPAJA Mobilna', 'Auto-Repair', 'Evolucija Engine',
      'Ekosistem Health', 'Dimenzije Engine', 'Gaming Engine',
      'Deploy Pipeline', 'Security Module', 'SEO Engine',
    ],

    timestamp: new Date().toISOString(),
  });
}
