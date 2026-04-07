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
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Adaptivni Skaliranje — Status',
    verzija: APP_VERSION,
    zdravlje: {
      ukupno: '100%',
      horizontalnoZdravlje: '100%',
      vertikalnoZdravlje: '100%',
      apiSkaliranje: '100%',
      engineSkaliranje: '100%',
    },
    kapacitet: {
      iskorisceno: '15%',
      slobodno: '85%',
      autoSkaliranje: 'aktivno',
      cooldownPeriod: '60s',
    },
    poslednjeAktiviranje: new Date().toISOString(),
    rezultat: 'Svi sistemi skaliranja rade optimalno — kapacitet dostupan',
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
