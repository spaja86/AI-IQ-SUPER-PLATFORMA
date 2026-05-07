import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  const milestone = 1000;
  const postignut = TOTAL_API_ROUTES >= milestone;

  return NextResponse.json({
    naziv: 'Autofinish API Milestone 1000',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    status: 'aktivan',
    milestone: {
      ciljBroj: milestone,
      trenutniBroj: TOTAL_API_ROUTES,
      postignut,
      procenat: Math.round((TOTAL_API_ROUTES / milestone) * 100),
    },
    ekosistem: {
      ukupnoRuta: TOTAL_ROUTES,
      ukupnoApiRuta: TOTAL_API_ROUTES,
      ukupnoDijagnostika: TOTAL_DIAGNOSTIKA,
    },
    poruka: postignut
      ? `🎉 API Milestone ${milestone} postignut! Platforma ima ${TOTAL_API_ROUTES} API ruta.`
      : `Napredak ka API Milestone ${milestone}: ${TOTAL_API_ROUTES}/${milestone}`,
    timestamp: new Date().toISOString(),
  });
}
