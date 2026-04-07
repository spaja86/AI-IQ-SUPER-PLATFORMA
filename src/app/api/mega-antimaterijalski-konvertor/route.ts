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
    { naziv: 'Antimaterijalno Konverziono Jezgro', tip: 'Antimatter-Conversion-Core', status: 'aktivan' },
    { naziv: 'Pozitronski Stabilizator', tip: 'Positron-Stabilizer', status: 'aktivan' },
    { naziv: 'Anihilacioni Regulator', tip: 'Annihilation-Regulator', status: 'aktivan' },
    { naziv: 'Energetski Matriksni Akumulator', tip: 'Energy-Matrix-Accumulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'MEGA Antimaterijalski Konvertor — Antimatter Conversion Engine',
    verzija: APP_VERSION,

    antimaterijalni: {
      ukupnoModula: moduli.length,
      model: 'MEGA-ACE v1.0',
      snaga: '10⁴⁵ antimaterijalnskih konverzija/s',
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
