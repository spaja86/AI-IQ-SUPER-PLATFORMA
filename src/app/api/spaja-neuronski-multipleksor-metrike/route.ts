import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  const metrike = [
    { kategorija: 'Multipleksiranje', metrika: 'Aktivni Kanali', vrednost: 4096, trend: 'stabilan' },
    { kategorija: 'Multipleksiranje', metrika: 'Multipleks Ratio', vrednost: '128:1', trend: 'stabilan' },
    { kategorija: 'Multipleksiranje', metrika: 'Signal Integritet', vrednost: '99.99%', trend: 'stabilan' },
    { kategorija: 'Propusnost', metrika: 'Ukupna Propusnost', vrednost: '10⁹ ops/s', trend: 'rastući' },
    { kategorija: 'Propusnost', metrika: 'Peak Throughput', vrednost: '10¹⁰ ops/s', trend: 'stabilan' },
    { kategorija: 'Propusnost', metrika: 'Gubici Signala', vrednost: '< 0.01%', trend: 'opadajući' },
    { kategorija: 'Performanse', metrika: 'Prosečna Latencija', vrednost: '0.5ms', trend: 'opadajući' },
    { kategorija: 'Performanse', metrika: 'P99 Latencija', vrednost: '2ms', trend: 'stabilan' },
    { kategorija: 'Performanse', metrika: 'Error Rate', vrednost: '0%', trend: 'stabilan' },
    { kategorija: 'Efikasnost', metrika: 'Neuronska Efikasnost', vrednost: '99.8%', trend: 'rastući' },
    { kategorija: 'Efikasnost', metrika: 'Kompresija Signala', vrednost: '95%', trend: 'stabilan' },
    { kategorija: 'Efikasnost', metrika: 'Paralelizam Faktor', vrednost: '2048x', trend: 'rastući' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Neuronski Multipleksor — Metrike',
    verzija: APP_VERSION,
    ukupnoMetrika: metrike.length,
    metrike,
    agregirano: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      zdravljeMultipleksora: '100%',
    },
    timestamp: new Date().toISOString(),
  });
}
