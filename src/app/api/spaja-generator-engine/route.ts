import { NextResponse } from 'next/server';
import {
  spajaGeneratorEngine,
  generisaniEngini,
  generatorKonfiguracije,
  getAktivniEngini,
  getProsecnaOptimizacija,
  getEnginiPoTipu,
  getGeneratorStatistika,
} from '@/lib/spaja-generator-engine';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getGeneratorStatistika();
  const aktivni = getAktivniEngini();

  return NextResponse.json({
    sistem: 'SPAJA Generator za Endžine',
    verzija: spajaGeneratorEngine.verzija,
    appVerzija: APP_VERSION,
    opis: spajaGeneratorEngine.opis,
    link: spajaGeneratorEngine.link,
    ukupnoEngina: generisaniEngini.length,
    aktivnihEngina: aktivni.length,
    prosecnaOptimizacija: getProsecnaOptimizacija(),
    konfiguracija: generatorKonfiguracije.length,
    statistika,
    enginiPoTipu: {
      core: getEnginiPoTipu('core').length,
      ai: getEnginiPoTipu('ai').length,
      mreza: getEnginiPoTipu('mreza').length,
      deploy: getEnginiPoTipu('deploy').length,
      gaming: getEnginiPoTipu('gaming').length,
      finansije: getEnginiPoTipu('finansije').length,
      bezbednost: getEnginiPoTipu('bezbednost').length,
      komunikacija: getEnginiPoTipu('komunikacija').length,
    },
    engini: generisaniEngini,
    timestamp: new Date().toISOString(),
  });
}
