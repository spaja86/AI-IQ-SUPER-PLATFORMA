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
  const registri = [
    { registar: 'QR-Alpha', kubiti: 2048, tip: 'Superconducting', errorRate: '0.001%', status: 'aktivan' },
    { registar: 'QR-Beta', kubiti: 4096, tip: 'Trapped Ion', errorRate: '0.0005%', status: 'aktivan' },
    { registar: 'QR-Gamma', kubiti: 8192, tip: 'Photonic', errorRate: '0.0001%', status: 'aktivan' },
    { registar: 'SPAJA-QR', kubiti: 50000, tip: 'SPAJA-Hybrid', errorRate: '0.00001%', status: 'aktivan' },
    { registar: 'OMEGA-QR', kubiti: 1000000, tip: 'OMEGA-Topological', errorRate: '0%', status: 'aktivan' },
  ];

  const metrike = {
    ukupnoRegistara: registri.length,
    aktivnihRegistara: registri.filter((r) => r.status === 'aktivan').length,
    ukupnoKubita: registri.reduce((sum, r) => sum + r.kubiti, 0),
    entanglement: 'Bell State + GHZ + SPAJA-Cluster',
    korekcija: 'Surface Code + Shor Code + SPAJA-EC',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Kvantni Registar — Quantum Register',
    verzija: APP_VERSION,

    kvantniRegistar: {
      ...metrike,
      registri,
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
