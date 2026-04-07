import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';
import {
  generisaniEngini,
  generatorKonfiguracije,
  getEnginiPoTipu,
  getProsecnaOptimizacija,
  getGeneratorStatistika,
} from '@/lib/spaja-generator-engine';

export async function GET() {
  const statistika = getGeneratorStatistika();

  const moduliMapa = generisaniEngini.map((e) => ({
    modul: e.ciljniModul,
    engine: e.naziv,
    tip: e.tip,
    status: e.status,
    verzija: e.verzija,
    optimizacija: `${e.optimizacija}%`,
    mogucnosti: e.mogucnosti,
  }));

  const konfigMapa = generatorKonfiguracije.map((k) => ({
    repozitorijum: k.ciljniRepozitorijum,
    konfiguracija: k.naziv,
    parametri: k.parametri,
    aktivna: k.aktivna,
  }));

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Generator za Endžine — Mapa Modula',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
    opis: 'Mapiranje svih modula u AI-IQ-SUPER-PLATFORMA repozitorijumu na njihove odgovarajuće ' +
      'SPAJA Generator engine-e. Svaki modul ima svoj dedicirani engine koji ga optimizuje.',
    statistika,
    moduliPoTipu: {
      core: getEnginiPoTipu('core').map((e) => e.ciljniModul),
      ai: getEnginiPoTipu('ai').map((e) => e.ciljniModul),
      mreza: getEnginiPoTipu('mreza').map((e) => e.ciljniModul),
      deploy: getEnginiPoTipu('deploy').map((e) => e.ciljniModul),
      gaming: getEnginiPoTipu('gaming').map((e) => e.ciljniModul),
      finansije: getEnginiPoTipu('finansije').map((e) => e.ciljniModul),
      bezbednost: getEnginiPoTipu('bezbednost').map((e) => e.ciljniModul),
      komunikacija: getEnginiPoTipu('komunikacija').map((e) => e.ciljniModul),
      'repo-engine': getEnginiPoTipu('repo-engine').map((e) => e.ciljniModul),
    },
    prosecnaOptimizacija: getProsecnaOptimizacija(),
    moduliMapa,
    konfigMapa,
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
    },
    timestamp: new Date().toISOString(),
  });
}
