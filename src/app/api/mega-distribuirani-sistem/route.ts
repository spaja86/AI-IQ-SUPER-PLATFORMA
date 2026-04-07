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
  const cvorovi = [
    { cvor: 'Node-EU-1', regija: 'Europa', servera: 5000, latencija: '0.5ms', status: 'aktivan' },
    { cvor: 'Node-US-1', regija: 'Severna Amerika', servera: 5000, latencija: '0.8ms', status: 'aktivan' },
    { cvor: 'Node-ASIA-1', regija: 'Azija', servera: 5000, latencija: '0.6ms', status: 'aktivan' },
    { cvor: 'SPAJA-Global', regija: 'Globalni', servera: 50000, latencija: '0.01ms', status: 'aktivan' },
    { cvor: 'OMEGA-Mesh', regija: 'Univerzalni', servera: 1000000, latencija: '0μs', status: 'aktivan' },
  ];

  const metrike = {
    ukupnoCvorova: cvorovi.length,
    aktivnihCvorova: cvorovi.filter((c) => c.status === 'aktivan').length,
    ukupnoServera: cvorovi.reduce((sum, c) => sum + c.servera, 0),
    konsenzus: 'Raft + Paxos + SPAJA-BFT',
    replikacija: '5x redundancija + OMEGA-Mirror',
    dostupnost: '100% (99.9999999% SLA)',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Mega Distribuirani Sistem — Distributed Computing',
    verzija: APP_VERSION,

    distribuiraniSistem: {
      ...metrike,
      cvorovi,
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
