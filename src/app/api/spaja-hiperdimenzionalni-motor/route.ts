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
    { naziv: 'Dimenzionalni Skener', tip: 'HyperScan-Unit', status: 'aktivan' },
    { naziv: 'Prostorni Kompenzator', tip: 'Spatial-Compensator', status: 'aktivan' },
    { naziv: 'Hiperprostorni Navigacioni Jezgro', tip: 'HyperNav-Core', status: 'aktivan' },
    { naziv: 'Energetski Konvertor', tip: 'Energy-Converter', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Hiperdimenzionalni Motor — Hyperspace Propulsion Engine',
    verzija: APP_VERSION,

    hiperdimenzionalniMotor: {
      ukupnoModula: moduli.length,
      pogon: 'SPAJA-HPE v1.0',
      brzina: '10²⁸ dimenzija/s',
      domet: '-∞Ω+∞ hiperprostor',
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
