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
  const kapacitetMetrike = [
    { naziv: 'Ruta Kapacitet', tip: 'Route-Capacity', status: 'aktivan', trenutno: TOTAL_ROUTES, opis: 'Ukupan broj aktivnih ruta u sistemu' },
    { naziv: 'API Kapacitet', tip: 'API-Capacity', status: 'aktivan', trenutno: TOTAL_API_ROUTES, opis: 'Ukupan broj API endpointa u sistemu' },
  ];

  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Kapacitet - Upravljanje Kapacitetom Sistema',
    verzija: APP_VERSION,

    kapacitet: {
      ukupnoMetrika: kapacitetMetrike.length,
      kapacitetOptimalan: true,
      model: 'AUTOFINISH-KAPACITET v1.0',
      metrike: kapacitetMetrike,
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
