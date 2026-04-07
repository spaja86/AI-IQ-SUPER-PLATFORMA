import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
} from '@/lib/constants';

const milestones = [
  { verzija: '5.4.0', autofinish: 0, rute: 16, api: 7, dijagnostike: 5, datum: '2026-03-31', opis: 'Početno stanje — main branch' },
  { verzija: '5.5.0', autofinish: 1, rute: 16, api: 7, dijagnostike: 5, datum: '2026-04-01', opis: 'Inicijalni Autofinish — TS fix' },
  { verzija: '6.0.0', autofinish: 3, rute: 28, api: 8, dijagnostike: 10, datum: '2026-04-02', opis: 'Proksi, Mobilna Mreža, WiFi Antena' },
  { verzija: '6.2.0', autofinish: 5, rute: 28, api: 8, dijagnostike: 12, datum: '2026-04-02', opis: 'Igrice sistem — 36 igrica' },
  { verzija: '6.4.0', autofinish: 7, rute: 42, api: 10, dijagnostike: 18, datum: '2026-04-03', opis: '95 igrica, OpenAI + OMEGA AI platforme' },
  { verzija: '6.6.0', autofinish: 9, rute: 43, api: 12, dijagnostike: 18, datum: '2026-04-03', opis: 'Ekosistem API, 30 statistika' },
  { verzija: '6.7.0', autofinish: 12, rute: 47, api: 16, dijagnostike: 23, datum: '2026-04-04', opis: 'Constants centralizacija, 4 nova API' },
  { verzija: '6.8.0', autofinish: 15, rute: 55, api: 24, dijagnostike: 27, datum: '2026-04-04', opis: 'JSON-LD, robots.txt, EN entiteti' },
  { verzija: '7.0.0', autofinish: 20, rute: 60, api: 28, dijagnostike: 30, datum: '2026-04-05', opis: 'Major v7 — PWA manifest, 28 API' },
  { verzija: '7.5.0', autofinish: 25, rute: 65, api: 33, dijagnostike: 34, datum: '2026-04-05', opis: 'Autofinish #25 — graph, summary' },
  { verzija: APP_VERSION, autofinish: AUTOFINISH_COUNT, rute: TOTAL_ROUTES, api: TOTAL_API_ROUTES, dijagnostike: TOTAL_DIAGNOSTIKA, datum: '2026-04-05', opis: `v8.0.0 — Major milestone, ${TOTAL_ROUTES} ruta, ${TOTAL_API_ROUTES} API, ${TOTAL_DIAGNOSTIKA} dijagnostika` },
];

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ SUPER PLATFORMA — Milestones',
    verzija: APP_VERSION,

    trenutno: {
      autofinish: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      rute: TOTAL_ROUTES,
      api: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      stranice: TOTAL_PAGES,
      igrice: TOTAL_IGRICA,
      omegaAI: OMEGA_AI_PERSONA_COUNT,
    },

    milestones,

    rastOdPočetka: {
      rute: `${TOTAL_ROUTES - 16} novih (+${((TOTAL_ROUTES / 16) * 100 - 100).toFixed(0)}%)`,
      api: `${TOTAL_API_ROUTES - 7} novih (+${((TOTAL_API_ROUTES / 7) * 100 - 100).toFixed(0)}%)`,
      dijagnostike: `${TOTAL_DIAGNOSTIKA - 5} novih (+${((TOTAL_DIAGNOSTIKA / 5) * 100 - 100).toFixed(0)}%)`,
    },

    timestamp: new Date().toISOString(),
  });
}
