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
    { naziv: 'Gravitacioni Pojačivač', tip: 'Gravity-Booster', status: 'aktivan' },
    { naziv: 'Maseni Reflektor', tip: 'Mass-Reflector', status: 'aktivan' },
    { naziv: 'Prostorno-Gravitaciono Jezgro', tip: 'Spacetime-Gravity-Core', status: 'aktivan' },
    { naziv: 'Kontrolni Dampener', tip: 'Control-Dampener', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Gravitacioni Amplifikator — Gravitational Amplification Engine',
    verzija: APP_VERSION,

    gravitacioniAmplifikator: {
      ukupnoModula: moduli.length,
      model: 'OMEGA-GAE v1.0',
      snaga: '10²⁸ G pojačanje',
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
