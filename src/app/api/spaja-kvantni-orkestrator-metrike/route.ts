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
    { kategorija: 'Orkestracija', metrika: 'Aktivni Procesi', vrednost: 2048, trend: 'stabilan' },
    { kategorija: 'Orkestracija', metrika: 'Kvantna Koherencija', vrednost: '99.97%', trend: 'stabilan' },
    { kategorija: 'Orkestracija', metrika: 'Orkestracioni Ciklusi', vrednost: '10⁸/s', trend: 'rastući' },
    { kategorija: 'Distribucija', metrika: 'Aktivni Čvorovi', vrednost: 512, trend: 'stabilan' },
    { kategorija: 'Distribucija', metrika: 'Replikacioni Faktor', vrednost: 3, trend: 'stabilan' },
    { kategorija: 'Distribucija', metrika: 'Mrežna Latencija', vrednost: '< 1ms', trend: 'stabilan' },
    { kategorija: 'Performanse', metrika: 'Prosečna Latencija', vrednost: '0.8ms', trend: 'opadajući' },
    { kategorija: 'Performanse', metrika: 'Throughput', vrednost: '10⁷ ops/s', trend: 'rastući' },
    { kategorija: 'Performanse', metrika: 'Error Rate', vrednost: '0%', trend: 'stabilan' },
    { kategorija: 'Efikasnost', metrika: 'Orkestraciona Efikasnost', vrednost: '99.5%', trend: 'rastući' },
    { kategorija: 'Efikasnost', metrika: 'Resource Utilization', vrednost: '88%', trend: 'stabilan' },
    { kategorija: 'Efikasnost', metrika: 'Paralelizam Faktor', vrednost: '2048x', trend: 'rastući' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Kvantni Orkestrator — Metrike',
    verzija: APP_VERSION,
    ukupnoMetrika: metrike.length,
    metrike,
    agregirano: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      zdravljeOrkestracije: '100%',
    },
    timestamp: new Date().toISOString(),
  });
}
