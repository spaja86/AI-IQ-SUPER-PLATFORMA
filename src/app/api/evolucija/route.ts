import { NextResponse } from 'next/server';
import {
  getEvolucijskaIstorija,
  getKonfiguracija,
  pokeniEvolucijskuDijagnostiku,
} from '@/lib/evolucija';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

export async function GET() {
  const istorija = getEvolucijskaIstorija();
  const konfiguracija = getKonfiguracija();
  const dijagnostika = pokeniEvolucijskuDijagnostiku();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Evolucija Motor',
    verzija: APP_VERSION,
    autofinish: AUTOFINISH_COUNT,

    konfiguracija: {
      cronInterval: konfiguracija.cronInterval,
      maxIssuePoDanu: konfiguracija.maxIssuePoDanu,
      autoMerge: konfiguracija.autoMerge,
      aktivnePersone: konfiguracija.aktivnePersone.length,
    },

    dijagnostika: {
      zdravlje: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      kriticnih: dijagnostika.kriticnih,
    },

    istorija: {
      ukupnoCiklusa: istorija.ukupnoCiklusa,
      uspesnihCiklusa: istorija.uspesnihCiklusa,
      poslednjiCiklus: istorija.poslednjiCiklus,
      sledeciCiklus: istorija.sledeciCiklus,
    },

    timestamp: new Date().toISOString(),
  });
}
