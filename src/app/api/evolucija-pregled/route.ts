import { NextResponse } from 'next/server';
import { podrazumevanaKonfiguracija, kreirajEvolucijskiCiklus } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const ciklus = kreirajEvolucijskiCiklus();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Evolucija Pregled — Omega Evolucioni Motor',
    verzija: APP_VERSION,

    konfiguracija: {
      cronInterval: podrazumevanaKonfiguracija.cronInterval,
      autoMerge: podrazumevanaKonfiguracija.autoMerge,
      maxIssuePoDanu: podrazumevanaKonfiguracija.maxIssuePoDanu,
      aktivnePersone: podrazumevanaKonfiguracija.aktivnePersone.length,
    },

    trenutniCiklus: {
      id: ciklus.id,
      status: ciklus.status,
      verzija: ciklus.verzija,
      dijagnostika: {
        zdravlje: ciklus.dijagnostika.zdravlje,
        ukupnoProvera: ciklus.dijagnostika.ukupnoProvera,
        uspesnih: ciklus.dijagnostika.uspesnih,
      },
      akcija: ciklus.akcije.length,
    },

    akcije: ciklus.akcije.slice(0, 5).map((a) => ({
      id: a.id,
      tip: a.tip,
      status: a.status,
    })),

    timestamp: new Date().toISOString(),
  });
}
