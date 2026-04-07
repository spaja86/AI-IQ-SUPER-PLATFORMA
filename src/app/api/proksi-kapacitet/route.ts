import { NextResponse } from 'next/server';
import {
  proksiMreza,
  proksiCvorovi,
  proksiSignali,
  getAktivniSignali,
  getBrojPovezanihPlatformi,
} from '@/lib/proksi';
import { APP_VERSION, PROKSI_KAPACITET } from '@/lib/constants';

export async function GET() {
  const aktivniSignali = getAktivniSignali();
  const povezanePlatforme = getBrojPovezanihPlatformi();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Proksi Kapacitet — Mrežni Pregled',
    verzija: APP_VERSION,

    pregled: {
      kapacitet: PROKSI_KAPACITET,
      ukupnoCvorova: proksiCvorovi.length,
      ukupnoSignala: proksiSignali.length,
      aktivnihSignala: aktivniSignali.length,
      povezanihPlatformi: povezanePlatforme,
    },

    mreza: {
      naziv: proksiMreza.naziv,
      opis: proksiMreza.opis,
      ukupniKapacitet: proksiMreza.ukupniKapacitet,
      topologija: proksiMreza.topologija,
    },

    cvorovi: proksiCvorovi.map((c) => ({
      id: c.id,
      naziv: c.naziv,
      kapacitet: c.kapacitet,
      latencija: c.latencija,
    })),

    timestamp: new Date().toISOString(),
  });
}
