import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
} from '@/lib/constants';

export async function GET() {
  const istorija = [
    { verzija: '1.0.0', autofinish: 1, rute: 5, api: 1, opis: 'Početak platforme' },
    { verzija: '2.0.0', autofinish: 5, rute: 15, api: 3, opis: 'Osnovna struktura' },
    { verzija: '3.0.0', autofinish: 10, rute: 25, api: 8, opis: 'SpajaPro integracija' },
    { verzija: '5.0.0', autofinish: 15, rute: 35, api: 13, opis: 'OMEGA AI persone' },
    { verzija: '6.0.0', autofinish: 20, rute: 50, api: 18, opis: 'Proksi mreža' },
    { verzija: '7.0.0', autofinish: 25, rute: 60, api: 28, opis: 'JSON-LD + Manifest' },
    { verzija: '8.0.0', autofinish: 30, rute: 70, api: 38, opis: 'Accessibility' },
    { verzija: '9.0.0', autofinish: 40, rute: 80, api: 48, opis: 'Cache-Control' },
    { verzija: '10.0.0', autofinish: 50, rute: 90, api: 58, opis: 'Milestone 50' },
    { verzija: '11.0.0', autofinish: 60, rute: 100, api: 68, opis: 'Milestone 60' },
    { verzija: '12.0.0', autofinish: 70, rute: 110, api: 78, opis: 'Milestone 70' },
    { verzija: '13.0.0', autofinish: 80, rute: 120, api: 88, opis: 'Milestone 80' },
    { verzija: APP_VERSION, autofinish: AUTOFINISH_COUNT, rute: TOTAL_ROUTES, api: TOTAL_API_ROUTES, opis: 'Trenutna verzija' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Verzija Istorija — Milestone Tracker',
    verzija: APP_VERSION,

    pregled: {
      ukupnoVerzija: istorija.length,
      trenutna: APP_VERSION,
      autofinishBrojac: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      stranice: TOTAL_PAGES,
    },

    istorija,

    timestamp: new Date().toISOString(),
  });
}
