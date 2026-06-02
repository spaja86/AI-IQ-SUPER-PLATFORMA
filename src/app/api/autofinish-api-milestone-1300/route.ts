import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_ROUTES,
} from '@/lib/constants';

export async function GET() {
  const milestone = 1300;
  const postignut = TOTAL_API_ROUTES >= milestone;
  const procenat = Math.round((TOTAL_API_ROUTES / milestone) * 100);

  return NextResponse.json({
    naziv: 'Autofinish API Milestone 1300',
    status: 'aktivan',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    milestone: {
      ciljBroj: milestone,
      trenutniBroj: TOTAL_API_ROUTES,
      postignut,
      procenat,
    },
    ekosistem: {
      ukupnoRuta: TOTAL_ROUTES,
      ukupnoApiRuta: TOTAL_API_ROUTES,
      ukupnoDijagnostika: TOTAL_DIAGNOSTIKA,
    },
    poruka: postignut
      ? `✅ API Milestone ${milestone} je aktivan — platforma ima ${TOTAL_API_ROUTES} API ruta.`
      : `Napredak ka API Milestone ${milestone}: ${TOTAL_API_ROUTES}/${milestone}`,
    timestamp: new Date().toISOString(),
  });
}
