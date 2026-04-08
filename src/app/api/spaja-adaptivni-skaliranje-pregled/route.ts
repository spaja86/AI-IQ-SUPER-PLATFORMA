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

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Adaptivni Skaliranje — Pregled',
    verzija: APP_VERSION,
    opis: 'Kompletni pregled svih skaliranih sistema u AI-IQ-SUPER-PLATFORMA ekosistemu.',
    skaliraneStranice: { ukupno: TOTAL_PAGES, status: 'skalirane' },
    skaliraniEndpointi: { ukupno: TOTAL_API_ROUTES, status: 'skalirani' },
    skaliraneRute: { ukupno: TOTAL_ROUTES, status: 'skalirane' },
    skaliraneDijagnostike: { ukupno: TOTAL_DIAGNOSTIKA, status: 'skalirane' },
    skaliraneIgrice: { ukupno: TOTAL_IGRICA, status: 'skalirane' },
    skaliranePersone: { ukupno: OMEGA_AI_PERSONA_COUNT, status: 'skalirane' },
    politikeSkaliranja: [
      { tip: 'CPU bazirana', prag: '70%', akcija: 'dodaj instancu' },
      { tip: 'Memorija bazirana', prag: '80%', akcija: 'povećaj RAM' },
      { tip: 'Latency bazirana', prag: '100ms', akcija: 'dodaj repliku' },
      { tip: 'Request bazirana', prag: '10⁵ req/s', akcija: 'horizontalno skaliranje' },
    ],
    autofinish: { iteracija: AUTOFINISH_COUNT, trend: 'rastući' },
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
    },
    timestamp: new Date().toISOString(),
  });
}
