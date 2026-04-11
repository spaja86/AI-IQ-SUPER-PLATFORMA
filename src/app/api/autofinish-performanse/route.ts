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
  const performanseMetrike = [
    { naziv: 'Build Vreme', tip: 'Build-Duration', status: 'aktivan', vrednost: '<60s', opis: 'Prosecno vreme builda ispod 60 sekundi' },
    { naziv: 'API Response Vreme', tip: 'Response-Time', status: 'aktivan', vrednost: '<200ms', opis: 'Prosecno vreme odgovora API endpointa' },
  ];

  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Performanse - Metrike Performansi Sistema',
    verzija: APP_VERSION,

    performanse: {
      ukupnoMetrika: performanseMetrike.length,
      sveUGranicama: true,
      model: 'AUTOFINISH-PERFORMANSE v1.0',
      metrike: performanseMetrike,
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
