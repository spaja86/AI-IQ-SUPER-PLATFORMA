import { NextResponse } from 'next/server';
import {
  kreirajEvolucijskiCiklus,
  getEvolucijskaIstorija,
  getKonfiguracija,
} from '@/lib/evolucija/engine';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const ciklus = kreirajEvolucijskiCiklus();
  const istorija = getEvolucijskaIstorija();
  const konfiguracija = getKonfiguracija();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Evolucija Ciklus — Trenutni Ciklus Evolucije',
    verzija: APP_VERSION,

    ciklus: {
      id: ciklus.id,
      status: ciklus.status,
      verzija: ciklus.verzija,
      pocetak: ciklus.pocetak,
      akcija: ciklus.akcije.length,
    },

    istorija: {
      ukupnoCiklusa: istorija.ukupnoCiklusa,
      uspesnih: istorija.uspesnihCiklusa,
      ukupnoAkcija: istorija.ukupnoAkcija,
    },

    konfiguracija: {
      cronInterval: konfiguracija.cronInterval,
      autoMerge: konfiguracija.autoMerge,
      maxIssuePoDanu: konfiguracija.maxIssuePoDanu,
    },

    timestamp: new Date().toISOString(),
  });
}
