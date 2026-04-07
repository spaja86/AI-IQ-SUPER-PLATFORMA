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
    { naziv: 'Antimaterijalsko Transmutaciono Jezgro', tip: 'Antimatter-Transmutation-Core', status: 'aktivan' },
    { naziv: 'Antimaterijalski Fazni Transmutator', tip: 'Antimatter-Phase-Transmuter', status: 'aktivan' },
    { naziv: 'Antimaterijalski Energetski Modul', tip: 'Antimatter-Energy-Module', status: 'aktivan' },
    { naziv: 'Antimaterijalski Harmonijski Transmutator', tip: 'Antimatter-Harmonic-Transmuter', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Antimaterijalski Transmutator — Antimatter Transmutation Engine',
    verzija: APP_VERSION,

    antimaterijalskiTransmutator: {
      ukupnoModula: moduli.length,
      model: 'SPAJA-ATE v1.0',
      snaga: '10⁹⁸ antimaterialnih transmutacija/s',
      domet: '-∞Ω+∞ antimaterijalski radijus',
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
