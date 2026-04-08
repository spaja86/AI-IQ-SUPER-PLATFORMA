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
  generatorKonfiguracije,
  getRepoEngini,
  getRepoKonfiguracije,
  getProsecnaOptimizacija,
} from '@/lib/spaja-generator-engine';

export async function GET() {
  const repoEngini = getRepoEngini();
  const repoKonfig = getRepoKonfiguracije();

  const repoOptimizacija = repoEngini.length > 0
    ? Math.round(repoEngini.reduce((acc, e) => acc + e.optimizacija, 0) / repoEngini.length)
    : 0;

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Generator za Endžine — Repozitorijumi',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
    opis: 'SPAJA Generator za Endžine prevlači engine-e preko svih repozitorijuma u SPAJA ekosistemu. ' +
      'Svaki repozitorijum dobija svoj dedicirani engine i konfiguraciju.',
    pregled: {
      ukupnoEngina: generisaniEngini.length,
      repoEngina: repoEngini.length,
      ukupnoKonfiguracija: generatorKonfiguracije.length,
      repoKonfiguracija: repoKonfig.length,
      prosecnaOptimizacija: getProsecnaOptimizacija(),
      repoOptimizacija,
    },
    repozitorijumi: repoEngini.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      repo: e.ciljniModul,
      status: e.status,
      verzija: e.verzija,
      mogucnosti: e.mogucnosti,
      optimizacija: `${e.optimizacija}%`,
      generisanDatum: e.generisanDatum,
    })),
    konfiguracije: repoKonfig.map((k) => ({
      id: k.id,
      naziv: k.naziv,
      repo: k.ciljniRepozitorijum,
      parametri: k.parametri,
      aktivna: k.aktivna,
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
