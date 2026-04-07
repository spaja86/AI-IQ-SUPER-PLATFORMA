import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
} from '@/lib/constants';
import {
  spajaGeneratorEngine,
  generisaniEngini,
  generatorKonfiguracije,
  getAktivniEngini,
  getEnginiUGenerisanju,
  getEnginiUOptimizaciji,
  getAktivneKonfiguracije,
  getProsecnaOptimizacija,
} from '@/lib/spaja-generator-engine';

export async function GET() {
  const aktivni = getAktivniEngini();
  const uGenerisanju = getEnginiUGenerisanju();
  const uOptimizaciji = getEnginiUOptimizaciji();
  const aktivneKonfig = getAktivneKonfiguracije();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Generator za Endžine — Pregled',
    verzija: APP_VERSION,
    generatorVerzija: spajaGeneratorEngine.verzija,
    link: spajaGeneratorEngine.link,
    opis: spajaGeneratorEngine.opis,
    pregled: {
      ukupnoEngina: generisaniEngini.length,
      aktivnihEngina: aktivni.length,
      uGenerisanju: uGenerisanju.length,
      uOptimizaciji: uOptimizaciji.length,
      prosecnaOptimizacija: getProsecnaOptimizacija(),
      konfiguracija: generatorKonfiguracije.length,
      aktivnihKonfiguracija: aktivneKonfig.length,
    },
    engini: generisaniEngini.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      tip: e.tip,
      status: e.status,
      verzija: e.verzija,
      ciljniModul: e.ciljniModul,
      mogucnosti: e.mogucnosti.length,
      optimizacija: `${e.optimizacija}%`,
      generisanDatum: e.generisanDatum,
    })),
    konfiguracije: generatorKonfiguracije.map((k) => ({
      id: k.id,
      naziv: k.naziv,
      ciljniRepozitorijum: k.ciljniRepozitorijum,
      parametri: k.parametri.length,
      aktivna: k.aktivna,
    })),
    infrastruktura: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
    },
    timestamp: new Date().toISOString(),
  });
}
