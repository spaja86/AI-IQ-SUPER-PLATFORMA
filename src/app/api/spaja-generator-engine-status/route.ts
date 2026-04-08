import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import {
  generisaniEngini,
  getAktivniEngini,
  getProsecnaOptimizacija,
  getGeneratorStatistika,
} from '@/lib/spaja-generator-engine';

export async function GET() {
  const statistika = getGeneratorStatistika();
  const aktivni = getAktivniEngini();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Generator za Endžine — Status',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
    ukupnoEngina: generisaniEngini.length,
    aktivnihEngina: aktivni.length,
    prosecnaOptimizacija: getProsecnaOptimizacija(),
    pokrivenostRepozitorijuma: '100%',
    statistika,
    engini: generisaniEngini.map((e) => ({
      naziv: e.naziv,
      tip: e.tip,
      status: e.status,
      verzija: e.verzija,
      optimizacija: `${e.optimizacija}%`,
    })),
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      autofinishTarget: AUTOFINISH_TARGET,
    },
    timestamp: new Date().toISOString(),
  });
}
