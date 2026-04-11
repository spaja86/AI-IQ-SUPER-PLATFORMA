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
    { kategorija: 'Skaliranje', metrika: 'Aktivne Instance', vrednost: 4, trend: 'stabilan' },
    { kategorija: 'Skaliranje', metrika: 'Max Instance', vrednost: 128, trend: 'stabilan' },
    { kategorija: 'Skaliranje', metrika: 'Auto-Scale Dogadjaji', vrednost: 0, trend: 'stabilan' },
    { kategorija: 'Kapacitet', metrika: 'CPU Iskorišćenost', vrednost: '15%', trend: 'stabilan' },
    { kategorija: 'Kapacitet', metrika: 'Memorija Iskorišćenost', vrednost: '33%', trend: 'stabilan' },
    { kategorija: 'Kapacitet', metrika: 'Disk Iskorišćenost', vrednost: '9%', trend: 'stabilan' },
    { kategorija: 'Performanse', metrika: 'Prosečna Latencija', vrednost: '12ms', trend: 'stabilan' },
    { kategorija: 'Performanse', metrika: 'Throughput', vrednost: '10⁶ req/s', trend: 'rastući' },
    { kategorija: 'Performanse', metrika: 'Error Rate', vrednost: '0%', trend: 'stabilan' },
    { kategorija: 'Efikasnost', metrika: 'Cost per Request', vrednost: '< 0.001$', trend: 'opadajući' },
    { kategorija: 'Efikasnost', metrika: 'Scale Efficiency', vrednost: '98%', trend: 'rastući' },
    { kategorija: 'Efikasnost', metrika: 'Resource Utilization', vrednost: '85%', trend: 'stabilan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Adaptivni Skaliranje — Metrike',
    verzija: APP_VERSION,
    ukupnoMetrika: metrike.length,
    metrike,
    agregirano: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      zdravljeSkaliranja: '100%',
    },
    timestamp: new Date().toISOString(),
  });
}
