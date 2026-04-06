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
    { naziv: 'Neutronsko Sintetičko Jezgro', tip: 'Neutron-Synthesis-Core', status: 'aktivan' },
    { naziv: 'Neutronski Fazni Sintetizator', tip: 'Neutron-Phase-Synthesizer', status: 'aktivan' },
    { naziv: 'Neutronski Energetski Modul', tip: 'Neutron-Energy-Module', status: 'aktivan' },
    { naziv: 'Neutronski Harmonijski Sintetizator', tip: 'Neutron-Harmonic-Synthesizer', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Neutronski Sintetizator — Neutron Synthesis Engine',
    verzija: APP_VERSION,

    neutronskiSintetizator: {
      ukupnoModula: moduli.length,
      model: 'SPAJA-NSE v1.0',
      snaga: '10⁹² neutronskih sinteza/s',
      domet: '-∞Ω+∞ neutronski radijus',
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
