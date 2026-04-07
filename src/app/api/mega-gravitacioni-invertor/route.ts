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
  const moduli = [
    { naziv: 'Gravitacioni Inverzioni Reaktor', tip: 'Gravity-Inversion-Reactor', status: 'aktivan' },
    { naziv: 'Anti-Gravitacioni Stabilizator', tip: 'Anti-Gravity-Stabilizer', status: 'aktivan' },
    { naziv: 'Maseni Modulator', tip: 'Mass-Modulator', status: 'aktivan' },
    { naziv: 'Gravitacioni Flux Regulator', tip: 'Gravity-Flux-Regulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'MEGA Gravitacioni Invertor — Gravity Inversion Engine',
    verzija: APP_VERSION,

    gravitacioniInvertor: {
      ukupnoModula: moduli.length,
      model: 'MEGA-GIE v1.0',
      snaga: '10³⁵ gravitacionih inverzija/s',
      domet: '-∞Ω+∞ gravitacioni radijus',
      moduli,
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
