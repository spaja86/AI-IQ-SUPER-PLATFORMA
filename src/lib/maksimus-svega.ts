// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za objedinjeni "master" pregled:
//   - Analiza Svega (stanje)
//   - Potencijal Svega Ovoga Do Sada (uplift)
//   - Procesuiranje Svega (operativni pipeline)
//   - Autofinish Svega (orkestracija)

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

export type MaksimusOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';

export const MAKSIMUS_SVEGA_CONTRACT_VERSION = 'v1';
export const MAKSIMUS_SVEGA_MODEL_VERSION = '1.0.0';
export const MAKSIMUS_SVEGA_SOURCE_OF_TRUTH = '/api/maksimus-svega';

const MAKSIMUS_WEIGHTS = {
  analiza: 0.35,
  potencijal: 0.3,
  procesuiranje: 0.25,
  orkestracija: 0.1,
} as const;

export interface MaksimusDomenSignal {
  naziv: string;
  score: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
}

export interface MaksimusMeta {
  contractVersion: typeof MAKSIMUS_SVEGA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof MAKSIMUS_SVEGA_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof MAKSIMUS_WEIGHTS;
  degraded: boolean;
  degradedSources: string[];
}

export interface MaksimusSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  konacnaOcena: MaksimusOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  preporuke: string[];
  domeni: {
    analiza: MaksimusDomenSignal;
    potencijal: MaksimusDomenSignal;
    procesuiranje: MaksimusDomenSignal;
    orkestracija: MaksimusDomenSignal;
  };
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: MaksimusMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): MaksimusOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

async function safeCallAsync<T>(sourceName: string, degradedSources: string[], fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[maksimus-svega] source failure: ${sourceName}`, error);
    return null;
  }
}

function safeCallSync<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[maksimus-svega] source failure: ${sourceName}`, error);
    return null;
  }
}

function freshnessFromSignals(...signals: Array<'fresh' | 'stale' | 'unknown'>): 'fresh' | 'stale' | 'unknown' {
  if (signals.includes('stale')) return 'stale';
  if (signals.includes('unknown')) return 'unknown';
  return 'fresh';
}

export async function buildMaksimusSvega(): Promise<MaksimusSvega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const analizaPromise = safeCallAsync('analiza-svega', degradedSources, () => buildAnalizaSvega());
  const potencijalPromise = Promise.resolve(
    safeCallSync('potencijal-svega-ovoga-do-sada', degradedSources, () => buildPotencijalSvegaOvogaDoSada()),
  );
  const procesuiranjePromise = Promise.resolve(
    safeCallSync('procesuiranje-svega', degradedSources, () => buildProcesuiranjeSvega()),
  );
  const autofinishInfoPromise = Promise.resolve(
    safeCallSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo()),
  );

  const [analiza, potencijal, procesuiranje, autofinishInfo] = await Promise.all([
    analizaPromise,
    potencijalPromise,
    procesuiranjePromise,
    autofinishInfoPromise,
  ]);

  const analizaScore = analiza?.ukupanScore ?? 0;
  const potencijalScore = potencijal?.ukupniPotencijal ?? 0;
  const procesuiranjeScore = procesuiranje?.ukupanProcenat ?? 0;
  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / 4) * 100)
    : 0;

  const domeni = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      tezina: MAKSIMUS_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * MAKSIMUS_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: analiza?.meta.degraded ? 'stale' : 'fresh',
    } satisfies MaksimusDomenSignal,
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      tezina: MAKSIMUS_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * MAKSIMUS_WEIGHTS.potencijal),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness: potencijal?.meta.degraded ? 'stale' : 'fresh',
    } satisfies MaksimusDomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje Svega',
      score: procesuiranjeScore,
      tezina: MAKSIMUS_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * MAKSIMUS_WEIGHTS.procesuiranje),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-svega',
      freshness: procesuiranje?.meta.degraded ? 'stale' : 'fresh',
    } satisfies MaksimusDomenSignal,
    orkestracija: {
      naziv: 'Autofinish Svega',
      score: orkestracijaScore,
      tezina: MAKSIMUS_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * MAKSIMUS_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: 'fresh',
    } satisfies MaksimusDomenSignal,
  };

  const ukupanScore = clampScore(
    domeni.analiza.score * MAKSIMUS_WEIGHTS.analiza
      + domeni.potencijal.score * MAKSIMUS_WEIGHTS.potencijal
      + domeni.procesuiranje.score * MAKSIMUS_WEIGHTS.procesuiranje
      + domeni.orkestracija.score * MAKSIMUS_WEIGHTS.orkestracija,
  );

  const kriticniDomeni = Object.values(domeni).filter((domen) => domen.score < 75).map((domen) => domen.naziv);
  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi ključni domeni su stabilni; nastaviti regularni monitoring i iterativnu optimizaciju.');
  }

  return {
    sistem: 'MAKSIMUS SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    preporuke,
    domeni,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: MAKSIMUS_SVEGA_CONTRACT_VERSION,
      modelVersion: MAKSIMUS_SVEGA_MODEL_VERSION,
      sourceOfTruth: MAKSIMUS_SVEGA_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: MAKSIMUS_WEIGHTS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export function getMaksimusSvegaInfo() {
  return {
    sistem: 'MAKSIMUS SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: MAKSIMUS_SVEGA_SOURCE_OF_TRUTH,
    contractVersion: MAKSIMUS_SVEGA_CONTRACT_VERSION,
    modelVersion: MAKSIMUS_SVEGA_MODEL_VERSION,
    scoreWeights: MAKSIMUS_WEIGHTS,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}
