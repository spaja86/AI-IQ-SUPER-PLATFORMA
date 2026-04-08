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
  const partiture = [
    {
      id: 'startup-partitura',
      naziv: 'Startup Partitura',
      opis: 'Redosled pokretanja svih sistema pri inicijalizaciji platforme',
      koraka: 12,
      trajanje: '< 2s',
      status: 'aktivna',
    },
    {
      id: 'scaling-partitura',
      naziv: 'Scaling Partitura',
      opis: 'Orkestracija skaliranja — redosled i zavisnosti komponenti',
      koraka: 8,
      trajanje: '< 500ms',
      status: 'aktivna',
    },
    {
      id: 'failover-partitura',
      naziv: 'Failover Partitura',
      opis: 'Automatski failover — prebacivanje na rezervne sisteme',
      koraka: 6,
      trajanje: '< 100ms',
      status: 'aktivna',
    },
    {
      id: 'deployment-partitura',
      naziv: 'Deployment Partitura',
      opis: 'Blue-green deployment orkestracija bez downtime-a',
      koraka: 15,
      trajanje: '< 30s',
      status: 'aktivna',
    },
    {
      id: 'maintenance-partitura',
      naziv: 'Maintenance Partitura',
      opis: 'Planirano održavanje — rolling update sa nultim downtime-om',
      koraka: 10,
      trajanje: '< 60s',
      status: 'aktivna',
    },
  ];

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Kvantni Orkestrator — Partiture',
    verzija: APP_VERSION,
    opis: 'Sve orkestracione partiture u AI-IQ-SUPER-PLATFORMA ekosistemu — ' +
      'definisani redosledi izvršavanja za različite scenarije.',
    ukupnoPartitura: partiture.length,
    partiture,
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      autofinishTarget: AUTOFINISH_TARGET,
    },
    timestamp: new Date().toISOString(),
  });
}
