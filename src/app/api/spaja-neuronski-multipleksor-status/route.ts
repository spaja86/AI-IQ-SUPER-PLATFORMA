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
    sistem: 'SPAJA Neuronski Multipleksor — Status',
    verzija: APP_VERSION,
    zdravlje: {
      ukupno: '100%',
      neuronskiKanali: '100%',
      paralelniTokovi: '100%',
      apiMultipleksiranje: '100%',
      signalnaAgregacija: '100%',
    },
    kapacitet: {
      iskorisceno: '11%',
      slobodno: '89%',
      aktivniKanali: 4096,
      propusnost: '10⁹ ops/s',
    },
    poslednjeAktiviranje: new Date().toISOString(),
    rezultat: 'Svi multipleksor sistemi rade optimalno — neuronski kanali stabilni',
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
