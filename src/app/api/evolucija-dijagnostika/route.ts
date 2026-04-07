import { NextResponse } from 'next/server';
import {
  pokeniEvolucijskuDijagnostiku,
  getEvolucijskaIstorija,
  getKonfiguracija,
} from '@/lib/evolucija/engine';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const dijagnostika = pokeniEvolucijskuDijagnostiku();
  const istorija = getEvolucijskaIstorija();
  const konfiguracija = getKonfiguracija();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Evolucija Dijagnostika — Evolucijski Ciklusi',
    verzija: APP_VERSION,

    dijagnostika: {
      zdravlje: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
    },

    istorija: {
      ciklusa: istorija.ciklusi.length,
      ukupnoCiklusa: istorija.ukupnoCiklusa,
      uspesnihCiklusa: istorija.uspesnihCiklusa,
      poslednjiCiklus: istorija.poslednjiCiklus,
    },

    konfiguracija: {
      cronInterval: konfiguracija.cronInterval,
      autoMerge: konfiguracija.autoMerge,
    },

    timestamp: new Date().toISOString(),
  });
}
