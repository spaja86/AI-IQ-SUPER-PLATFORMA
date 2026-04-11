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
  const politike = [
    {
      id: 'cpu-politika',
      naziv: 'CPU Bazirana Politika',
      opis: 'Automatsko skaliranje na osnovu CPU iskorišćenosti',
      prag: '70%',
      akcija: 'Dodaj novu instancu',
      cooldown: '60s',
      status: 'aktivna',
    },
    {
      id: 'memorija-politika',
      naziv: 'Memorija Bazirana Politika',
      opis: 'Automatsko skaliranje na osnovu memorije',
      prag: '80%',
      akcija: 'Povećaj RAM za 50%',
      cooldown: '120s',
      status: 'aktivna',
    },
    {
      id: 'latency-politika',
      naziv: 'Latency Bazirana Politika',
      opis: 'Automatsko skaliranje na osnovu P99 latencije',
      prag: '100ms',
      akcija: 'Dodaj API repliku',
      cooldown: '30s',
      status: 'aktivna',
    },
    {
      id: 'request-politika',
      naziv: 'Request Bazirana Politika',
      opis: 'Automatsko skaliranje na osnovu broja zahteva',
      prag: '10⁵ req/s',
      akcija: 'Horizontalno skaliranje +2 instance',
      cooldown: '90s',
      status: 'aktivna',
    },
    {
      id: 'prediktivna-politika',
      naziv: 'Prediktivna Politika',
      opis: 'ML bazirana predikcija opterećenja i preemptivno skaliranje',
      prag: 'AI predikcija',
      akcija: 'Pre-skaliranje pre špicea',
      cooldown: '300s',
      status: 'aktivna',
    },
  ];

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Adaptivni Skaliranje — Politike',
    verzija: APP_VERSION,
    opis: 'Sve politike automatskog skaliranja u AI-IQ-SUPER-PLATFORMA ekosistemu.',
    ukupnoPolitika: politike.length,
    politike,
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
