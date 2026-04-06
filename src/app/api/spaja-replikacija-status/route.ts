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
  const replikacioniCvorovi = [
    { cvor: 'Primarni', region: 'EU-Central', replika: 'master', lag: '0ms', status: 'aktivan' },
    { cvor: 'Sekundarni-1', region: 'US-East', replika: 'slave', lag: '12ms', status: 'aktivan' },
    { cvor: 'Sekundarni-2', region: 'AP-Southeast', replika: 'slave', lag: '45ms', status: 'aktivan' },
    { cvor: 'Kvorum', region: 'EU-West', replika: 'arbiter', lag: '8ms', status: 'aktivan' },
    { cvor: 'Backup', region: 'US-West', replika: 'cold-standby', lag: '200ms', status: 'aktivan' },
  ];

  const replikacijaMetrike = {
    ukupnoCvorova: replikacioniCvorovi.length,
    aktivnihCvorova: replikacioniCvorovi.filter((c) => c.status === 'aktivan').length,
    konzistentnost: 'strong',
    protokol: 'Raft + SPAJA-Sync',
    throughput: '1M writes/s',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Replikacija Status — Distributed Replication',
    verzija: APP_VERSION,

    replikacija: {
      ...replikacijaMetrike,
      cvorovi: replikacioniCvorovi,
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
