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
  const jedinice = [
    { naziv: 'Neutronski Izvor', tip: 'Neutron-Source', status: 'aktivan' },
    { naziv: 'Sintetizatorska Matrica', tip: 'Synthesis-Matrix', status: 'aktivan' },
    { naziv: 'Stabilizator Čestica', tip: 'Particle-Stabilizer', status: 'aktivan' },
    { naziv: 'Izlazni Modulator', tip: 'Output-Modulator', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'MEGA Neutronski Sintetizator — Neutron Synthesis Engine',
    verzija: APP_VERSION,

    neutronskiSintetizator: {
      ukupnoJedinica: jedinice.length,
      model: 'MEGA-NSE v1.0',
      kapacitet: '10²⁶ neutrona/s',
      preciznost: '99.9999% atomska tačnost',
      jedinice,
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
