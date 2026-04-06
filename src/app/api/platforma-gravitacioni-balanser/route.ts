import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  const cvorovi = [
    { naziv: 'Graviton-Alpha', zona: 'EU-West', tezina: 0.35, status: 'aktivan' },
    { naziv: 'Graviton-Beta', zona: 'US-East', tezina: 0.30, status: 'aktivan' },
    { naziv: 'Graviton-Gamma', zona: 'APAC-Central', tezina: 0.20, status: 'aktivan' },
    { naziv: 'Graviton-Omega', zona: 'Global-Edge', tezina: 0.15, status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforma Gravitacioni Balanser — Gravity Load Balancer',
    verzija: APP_VERSION,

    gravitacioniBalanser: {
      ukupnoCvorova: cvorovi.length,
      algoritam: 'SPAJA-GravityHash v2.0',
      distribucija: 'Gravitacioni gradijent — automatsko privlačenje',
      latencija: '<1ms — gravitaciona propagacija',
      cvorovi,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
