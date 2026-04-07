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
  const komore = [
    { naziv: 'Primarna Anihilaciona Komora', tip: 'Annihilation-Chamber-Alpha', status: 'aktivan' },
    { naziv: 'Magnetni Konfinement Sistem', tip: 'Magnetic-Confinement', status: 'aktivan' },
    { naziv: 'Pozitronski Emiter', tip: 'Positron-Emitter', status: 'aktivan' },
    { naziv: 'Energetski Kolektorski Prsten', tip: 'Energy-Collector-Ring', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'MEGA Antimaterija Generator — Antimatter Energy Production',
    verzija: APP_VERSION,

    antimaterijaGenerator: {
      ukupnoKomora: komore.length,
      model: 'MEGA-AMG v1.0',
      proizvodnja: '10²² eV antimaterija/s',
      efikasnost: '99.97% konverzija',
      komore,
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
