import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
} from '@/lib/constants';
import {
  generisaniEngini,
  getAktivniEngini,
  getProsecnaOptimizacija,
} from '@/lib/spaja-generator-engine';

export async function GET() {
  const aktivniEngini = getAktivniEngini();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Autonomni Monitoring — Pregled',
    verzija: APP_VERSION,
    opis: 'Kompletni pregled svih monitorisanih sistema u AI-IQ-SUPER-PLATFORMA ekosistemu.',
    monitorisaniSistemi: {
      stranice: { ukupno: TOTAL_PAGES, status: 'aktivne' },
      apiEndpointi: { ukupno: TOTAL_API_ROUTES, status: 'aktivni' },
      rute: { ukupno: TOTAL_ROUTES, status: 'aktivne' },
      dijagnostike: { ukupno: TOTAL_DIAGNOSTIKA, status: 'aktivne' },
      igrice: { ukupno: TOTAL_IGRICA, status: 'aktivne' },
      omegaAiPersone: { ukupno: OMEGA_AI_PERSONA_COUNT, status: 'aktivne' },
      generatorEngini: {
        ukupno: generisaniEngini.length,
        aktivnih: aktivniEngini.length,
        optimizacija: getProsecnaOptimizacija(),
      },
      autofinish: { iteracija: AUTOFINISH_COUNT, trend: 'rastući' },
    },
    spisakMonitora: [
      'Engine Monitor — praćenje SPAJA Generator engine-a',
      'API Monitor — praćenje svih API endpointa',
      'Dijagnostika Monitor — praćenje auto-repair provera',
      'Build Monitor — praćenje Next.js build procesa',
      'Autofinish Monitor — praćenje iteracija i progresa',
    ],
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
    },
    timestamp: new Date().toISOString(),
  });
}
