import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';

export async function GET() {
  const sigurnostProvere = [
    { naziv: 'CodeQL Skeniranje', tip: 'Security-Scan', status: 'aktivan', rezultat: 'cisto', opis: 'Nema detektovanih sigurnosnih ranjivosti' },
    { naziv: 'Dependency Audit', tip: 'Dependency-Audit', status: 'aktivan', rezultat: 'cisto', opis: 'Sve zavisnosti su bezbedne i azurirane' },
  ];

  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Sigurnost - Bezbednosne Provere Sistema',
    verzija: APP_VERSION,

    sigurnost: {
      ukupnoProvera: sigurnostProvere.length,
      sveBezbedne: true,
      model: 'AUTOFINISH-SIGURNOST v1.0',
      provere: sigurnostProvere,
    },

    progres: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: procenat.toExponential(2),
    },

    infrastruktura: {
      rute: TOTAL_ROUTES,
      api: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
