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
    { naziv: 'Kvarkovsko Akceleraciono Jezgro', tip: 'Quark-Acceleration-Core', status: 'aktivan' },
    { naziv: 'Kvarkovni Fazni Akcelerator', tip: 'Quark-Phase-Accelerator', status: 'aktivan' },
    { naziv: 'Kvarkovni Energetski Modul', tip: 'Quark-Energy-Module', status: 'aktivan' },
    { naziv: 'Kvarkovni Harmonijski Akcelerator', tip: 'Quark-Harmonic-Accelerator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'ULTRA Kvarkovni Akcelerator — Quark Acceleration Engine',
    verzija: APP_VERSION,

    kvarkovniAkcelerator: {
      ukupnoModula: moduli.length,
      model: 'ULTRA-QAE v1.0',
      snaga: '10¹¹⁴ kvarkovnih akceleracija/s',
      domet: '-∞Ω+∞ kvarkovni radijus',
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
