import { NextResponse } from 'next/server';
import { getEvolucijskaIstorija, getKonfiguracija } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const istorija = getEvolucijskaIstorija();
  const konfiguracija = getKonfiguracija();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Evolucija Status',
    verzija: APP_VERSION,

    motor: {
      naziv: 'OMEGA Evolucioni Motor',
      verzija: '1.0.0',
      cronInterval: konfiguracija.cronInterval,
      maxIssuePoDanu: konfiguracija.maxIssuePoDanu,
      autoMerge: konfiguracija.autoMerge,
    },

    istorija: {
      ukupnoCiklusa: istorija.ukupnoCiklusa,
      uspesnihCiklusa: istorija.uspesnihCiklusa,
      ukupnoAkcija: istorija.ukupnoAkcija,
      uspesnihAkcija: istorija.uspesnihAkcija,
      poslednjaCiklusId: istorija.ciklusi[istorija.ciklusi.length - 1]?.id ?? null,
    },

    konfiguracija,

    timestamp: new Date().toISOString(),
  });
}
