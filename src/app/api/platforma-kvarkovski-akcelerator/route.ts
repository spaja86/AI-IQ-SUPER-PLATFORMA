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
    { naziv: 'Kvarkovsko Akceleracijsko Jezgro', tip: 'Quark-Acceleration-Core', status: 'aktivan' },
    { naziv: 'Kvarkovski Česticni Stabilizator', tip: 'Quark-Particle-Stabilizer', status: 'aktivan' },
    { naziv: 'Kvarkovski Energetski Modul', tip: 'Quark-Energy-Module', status: 'aktivan' },
    { naziv: 'Kvarkovski Brzinski Korektor', tip: 'Quark-Speed-Corrector', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'PLATFORMA Kvarkovski Akcelerator — Quark Acceleration Engine',
    verzija: APP_VERSION,

    kvarkovskiAkcelerator: {
      ukupnoModula: moduli.length,
      model: 'PLATFORMA-QAE v1.0',
      snaga: '10⁷⁴ kvarkovskih akceleracija/s',
      domet: '-∞Ω+∞ kvarkovski radijus',
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
