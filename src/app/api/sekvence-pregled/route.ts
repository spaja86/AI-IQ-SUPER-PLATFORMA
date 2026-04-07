import { NextResponse } from 'next/server';
import * as sekvence from '@/lib/sekvence';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const sveSekvence = Object.entries(sekvence);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Sekvence Pregled — Kompletne Sekvence Svih Stranica',
    verzija: APP_VERSION,

    pregled: {
      ukupnoSekvenci: sveSekvence.length,
    },

    sekvence: sveSekvence.map(([kljuc, vrednost]) => ({
      modul: kljuc,
      koraka: Array.isArray(vrednost) ? vrednost.length : 0,
    })),

    timestamp: new Date().toISOString(),
  });
}
