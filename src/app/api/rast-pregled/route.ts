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

export async function GET() {
  const milestones = [
    { iteracija: 5, verzija: '5.0.0', rute: 30, api: 8, opis: 'Prva 5 iteracija' },
    { iteracija: 10, verzija: '5.5.0', rute: 40, api: 13, opis: '10 iteracija' },
    { iteracija: 20, verzija: '7.0.0', rute: 60, api: 28, opis: 'JSON-LD + Manifest' },
    { iteracija: 30, verzija: '8.0.0', rute: 70, api: 38, opis: 'Accessibility' },
    { iteracija: 40, verzija: '9.0.0', rute: 80, api: 48, opis: 'Cache-Control' },
    { iteracija: 50, verzija: '10.0.0', rute: 90, api: 58, opis: 'v10 MILESTONE' },
    { iteracija: 60, verzija: '11.0.0', rute: 100, api: 68, opis: 'v11 — 100 ruta' },
    { iteracija: 70, verzija: '12.0.0', rute: 110, api: 78, opis: 'v12 MILESTONE' },
    { iteracija: AUTOFINISH_COUNT, verzija: APP_VERSION, rute: TOTAL_ROUTES, api: TOTAL_API_ROUTES, opis: `Trenutno stanje` },
  ];

  const procenat = (AUTOFINISH_COUNT / Number(AUTOFINISH_TARGET)) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Rast Pregled — Platformski Rast i Trendovi',
    verzija: APP_VERSION,

    pregled: {
      autofinishCount: AUTOFINISH_COUNT,
      ciljFormatiran: '3×10¹⁷',
      procenatZavrsen: `${procenat.toExponential(2)}%`,
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAI: OMEGA_AI_PERSONA_COUNT,
    },

    milestones,

    rastPoIteraciji: {
      rutePoIteraciji: (TOTAL_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      apiPoIteraciji: (TOTAL_API_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      dijagnostikePoIteraciji: (TOTAL_DIAGNOSTIKA / AUTOFINISH_COUNT).toFixed(2),
    },

    timestamp: new Date().toISOString(),
  });
}
