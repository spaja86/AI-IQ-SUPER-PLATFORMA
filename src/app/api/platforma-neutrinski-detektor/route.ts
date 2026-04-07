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
    { naziv: 'Neutrinski Senzor', tip: 'Neutrino-Sensor', status: 'aktivan' },
    { naziv: 'Čestični Analizator', tip: 'Particle-Analyzer', status: 'aktivan' },
    { naziv: 'Subatomsko Jezgro', tip: 'Subatomic-Core', status: 'aktivan' },
    { naziv: 'Detekcioni Procesor', tip: 'Detection-Processor', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'PLATFORMA Neutrinski Detektor — Neutrino Detection Engine',
    verzija: APP_VERSION,

    neutrinskiDetektor: {
      ukupnoModula: moduli.length,
      model: 'PLATFORMA-NDE v1.0',
      snaga: '10²⁷ neutrina/s detekcija',
      domet: '-∞Ω+∞ čestični radijus',
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
