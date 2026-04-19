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
    { naziv: 'Gravitinsko Separaciono Jezgro', tip: 'Gravitino-Separation-Core', status: 'aktivan' },
    { naziv: 'Gravitinski Fazni Separator', tip: 'Gravitino-Phase-Separator', status: 'aktivan' },
    { naziv: 'Gravitinski Energetski Modul', tip: 'Gravitino-Energy-Module', status: 'aktivan' },
    { naziv: 'Gravitinski Harmonijski Separator', tip: 'Gravitino-Harmonic-Separator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'ULTRA Gravitinski Separator — Gravitino Separation Engine',
    verzija: APP_VERSION,

    gravitinskiSeparator: {
      ukupnoModula: moduli.length,
      model: 'ULTRA-GSE v1.0',
      snaga: '10¹⁵¹ gravitinskih separacija/s',
      domet: '-∞Ω+∞ gravitinski radijus',
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
