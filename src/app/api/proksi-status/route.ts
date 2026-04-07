import { NextResponse } from 'next/server';
import { proksiSignali, proksiCvorovi } from '@/lib/proksi';
import { APP_VERSION, PROKSI_KAPACITET } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Proksi Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoSignala: proksiSignali.length,
      ukupnoCvorova: proksiCvorovi.length,
      kapacitet: PROKSI_KAPACITET,
    },

    signali: proksiSignali.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      tip: s.tip,
      opis: s.opis,
    })),

    cvorovi: proksiCvorovi.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      kapacitet: c.kapacitet,
      latencija: c.latencija,
      opis: c.opis,
    })),

    timestamp: new Date().toISOString(),
  });
}
