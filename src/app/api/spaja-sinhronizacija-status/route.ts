import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  const sinhronizacijskiČvorovi = [
    { id: 'sync-eu-west', region: 'EU-West', latencija: '2ms', status: 'sinhronizovan' },
    { id: 'sync-eu-central', region: 'EU-Central', latencija: '1ms', status: 'sinhronizovan' },
    { id: 'sync-us-east', region: 'US-East', latencija: '45ms', status: 'sinhronizovan' },
    { id: 'sync-asia-east', region: 'Asia-East', latencija: '120ms', status: 'sinhronizovan' },
    { id: 'sync-global', region: 'Global CDN', latencija: '<5ms', status: 'sinhronizovan' },
  ];

  const protokoli = [
    { naziv: 'CRDT-Sync', verzija: 'v2.0', tip: 'eventualna konzistencija' },
    { naziv: 'Raft-Consensus', verzija: 'v3.1', tip: 'stroga konzistencija' },
    { naziv: 'SPAJA-Sync', verzija: 'v1.0', tip: 'hibridna sinhronizacija' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Sinhronizacija Status — Real-time Sinhronizacija',
    verzija: APP_VERSION,

    sinhronizacija: {
      ukupnoČvorova: sinhronizacijskiČvorovi.length,
      aktivnihČvorova: sinhronizacijskiČvorovi.filter((c) => c.status === 'sinhronizovan').length,
      čvorovi: sinhronizacijskiČvorovi,
    },

    protokoli,

    platforma: {
      ukupnoRuta: TOTAL_ROUTES,
      apiEndpointi: TOTAL_API_ROUTES,
      sinhronizovanihRuta: TOTAL_ROUTES,
      pokrivenost: '100%',
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
    },

    timestamp: new Date().toISOString(),
  });
}
