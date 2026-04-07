import { NextResponse } from 'next/server';
import { dimenzije, geometrijskeForme } from '@/lib/dimenzije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dimenzije Mapa — Vizuelni Pregled Dimenzija',
    verzija: APP_VERSION,

    pregled: {
      ukupnoDimenzija: dimenzije.length,
      ukupnoFormi: geometrijskeForme.length,
    },

    dimenzije: dimenzije.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      nivo: d.nivo,
      tip: d.tip,
    })),

    forme: geometrijskeForme.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      sloj: f.sloj,
    })),

    timestamp: new Date().toISOString(),
  });
}
