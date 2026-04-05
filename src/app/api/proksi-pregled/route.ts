import { NextResponse } from 'next/server';
import { proksiSignali, proksiCvorovi, proksiMreza, getAktivniSignali, getBrojPovezanihPlatformi } from '@/lib/proksi';
import { APP_VERSION, PROKSI_KAPACITET } from '@/lib/constants';

export async function GET() {
  const aktivniSignali = getAktivniSignali();
  const povezanihPlatformi = getBrojPovezanihPlatformi();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Proksi Pregled — Kompletna Proksi Mreža',
    verzija: APP_VERSION,

    pregled: {
      signala: proksiSignali.length,
      aktivnihSignala: aktivniSignali.length,
      cvorova: proksiCvorovi.length,
      povezanihPlatformi,
      kapacitet: PROKSI_KAPACITET,
    },

    mreza: {
      naziv: proksiMreza.naziv,
      topologija: proksiMreza.topologija,
      ukupniKapacitet: proksiMreza.ukupniKapacitet,
    },

    signali: proksiSignali.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      ikona: s.ikona,
      tip: s.tip,
      frekvencija: s.frekvencija,
    })),

    cvorovi: proksiCvorovi.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      ikona: c.ikona,
      kapacitet: c.kapacitet,
      latencija: c.latencija,
    })),

    timestamp: new Date().toISOString(),
  });
}
