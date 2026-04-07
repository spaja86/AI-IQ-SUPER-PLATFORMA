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
    { naziv: 'Plazmoidno Reaktorsko Jezgro', tip: 'Plasmoid-Reactor-Core', status: 'aktivan' },
    { naziv: 'Plazmoidni Stabilizator', tip: 'Plasmoid-Stabilizer', status: 'aktivan' },
    { naziv: 'Plazmoidni Energetski Kanalizator', tip: 'Plasmoid-Energy-Channeler', status: 'aktivan' },
    { naziv: 'Fuzijski Plazmoidni Pojačivač', tip: 'Fusion-Plasmoid-Amplifier', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Plazmoidni Reaktor — Plasmoid Reactor Engine',
    verzija: APP_VERSION,

    plazmoidniReaktor: {
      ukupnoModula: moduli.length,
      model: 'SPAJA-PRE v1.0',
      snaga: '10⁵⁷ plazmoidnih reakcija/s',
      domet: '-∞Ω+∞ plazmoidni radijus',
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
