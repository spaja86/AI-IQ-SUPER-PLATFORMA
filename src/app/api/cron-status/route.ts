import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const cronTasks = [
    {
      id: 'evolucija',
      naziv: 'OMEGA Evolucija Ciklus',
      putanja: '/api/cron/evolucija',
      interval: '0 */6 * * *',
      intervalOpis: 'Svakih 6 sati',
      opis: 'Dijagnostikuje sistem, generiše preporuke, kreira GitHub Issues',
    },
    {
      id: 'zdravlje',
      naziv: 'Zdravlje Monitor',
      putanja: '/api/cron/zdravlje',
      interval: '*/30 * * * *',
      intervalOpis: 'Svakih 30 minuta',
      opis: 'Proverava zdravlje platforme i OMEGA AI sistema',
    },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Cron Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoTaskova: cronTasks.length,
      aktivnih: cronTasks.length,
      autorizacija: 'CRON_SECRET Bearer token',
    },

    taskovi: cronTasks,

    timestamp: new Date().toISOString(),
  });
}
