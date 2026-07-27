// SpajaUltraOmegaCore -∞Ω+∞ — AGREGATOR SVEGA CORE
// Kompanija SPAJA — Digitalna Industrija
//
// Zajednička osnova za sve "svega" agregatore (SVE OD SVEGA, MAKSIMUS SVEGA, itd.)
// Svaki agregator je tanak wrapper koji poziva `buildAgregiranRezultat` sa sopstvenom
// konfiguracijom (ime, težine, endpoint).

import { EXPECTED_AUTOFINISH_STEPOVI_COUNT } from './constants';
import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type AgregiranOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type AgregiranFreshness = 'fresh' | 'stale' | 'unknown';

/** Prag ispod kojeg se domen smatra kritičnim (u procentima). */
export const AGREGATOR_CRITICAL_THRESHOLD = 75;

export interface AgregiranDomenSignal {
  naziv: string;
  score: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: AgregiranFreshness;
}

export interface AgregiranMeta<W extends Record<string, number>> {
  contractVersion: string;
  modelVersion: string;
  sourceOfTruth: string;
  generatedAt: string;
  scoreWeights: W;
  degraded: boolean;
  degradedSources: string[];
}

export interface AgregiranRezultat<W extends Record<string, number>> {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  konacnaOcena: AgregiranOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  preporuke: string[];
  domeni: Record<string, AgregiranDomenSignal>;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: AgregiranMeta<W>;
  timestamp: string;
}

export interface AgregiranConfig<W extends Record<string, number>> {
  /** Ime sistema, npr. 'SVE OD SVEGA — Digitalna Industrija' */
  sistemNaziv: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  contractVersion: string;
  modelVersion: string;
  sourceOfTruth: string;
  weights: W;
  ekosistem: { apiRute: number; ukupnoRuta: number };
  /**
   * Opcionalne extra-domene koje agregator dodaje pored 4 osnovna.
   * Svaki element je funkcija koja prima degradedSources niz i vraća
   * `AgregiranDomenSignal | null`.
   */
  extraDomeni?: Array<(degradedSources: string[]) => AgregiranDomenSignal | null>;
  /**
   * Ključevi za 4 osnovna domena u `weights` mapi.
   * Redosled: [analizaKey, potencijalKey, procesuiranjeKey, orkestracijaKey]
   */
  coreWeightKeys: [
    keyof W & string,
    keyof W & string,
    keyof W & string,
    keyof W & string,
  ];
}

// ─── Pomoćnici ────────────────────────────────────────────────────────────────

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreToOcena(score: number): AgregiranOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

export async function safeAgregiranAsync<T>(
  naziv: string,
  degradedSources: string[],
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    degradedSources.push(naziv);
    console.error(`[agregator-svega-core] source failure: ${naziv}`, error);
    return null;
  }
}

export function safeAgregiranSync<T>(
  naziv: string,
  degradedSources: string[],
  fn: () => T,
): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(naziv);
    console.error(`[agregator-svega-core] source failure: ${naziv}`, error);
    return null;
  }
}

// ─── Graditelj ───────────────────────────────────────────────────────────────

/**
 * Gradi agregirani rezultat svih "svega" domena.
 * Pozivaju ga tanki wrapperi (sve-od-svega, maksimus-svega, itd.).
 */
export async function buildAgregiranRezultat<W extends Record<string, number>>(
  config: AgregiranConfig<W>,
): Promise<AgregiranRezultat<W>> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const [analiza, potencijal, procesuiranje, autofinishInfo] = await Promise.all([
    safeAgregiranAsync('analiza-svega', degradedSources, () => buildAnalizaSvega()),
    Promise.resolve(
      safeAgregiranSync('potencijal-svega-ovoga-do-sada', degradedSources, () =>
        buildPotencijalSvegaOvogaDoSada(),
      ),
    ),
    Promise.resolve(
      safeAgregiranSync('procesuiranje-svega', degradedSources, () => buildProcesuiranjeSvega()),
    ),
    Promise.resolve(
      safeAgregiranSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo()),
    ),
  ]);

  const [analizaKey, potencijalKey, procesuiranjeKey, orkestracijaKey] = config.coreWeightKeys;

  const analizaScore = clampScore(analiza?.ukupanScore ?? 0);
  const potencijalScore = clampScore(potencijal?.ukupniPotencijal ?? 0);
  const procesuiranjeScore = clampScore(procesuiranje?.ukupanProcenat ?? 0);
  const orkestracijaScore = autofinishInfo
    ? clampScore(
        (autofinishInfo.dostupniStepovi.length / EXPECTED_AUTOFINISH_STEPOVI_COUNT) * 100,
      )
    : 0;

  const coreDomeni: Record<string, AgregiranDomenSignal> = {
    [analizaKey]: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      tezina: config.weights[analizaKey],
      doprinos: clampScore(analizaScore * config.weights[analizaKey]),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: analiza === null ? 'unknown' : analiza.meta.degraded ? 'stale' : 'fresh',
    },
    [potencijalKey]: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      tezina: config.weights[potencijalKey],
      doprinos: clampScore(potencijalScore * config.weights[potencijalKey]),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness:
        potencijal === null ? 'unknown' : potencijal.meta.degraded ? 'stale' : 'fresh',
    },
    [procesuiranjeKey]: {
      naziv: 'Procesuiranje Svega',
      score: procesuiranjeScore,
      tezina: config.weights[procesuiranjeKey],
      doprinos: clampScore(procesuiranjeScore * config.weights[procesuiranjeKey]),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-svega',
      freshness:
        procesuiranje === null ? 'unknown' : procesuiranje.meta.degraded ? 'stale' : 'fresh',
    },
    [orkestracijaKey]: {
      naziv: 'Autofinish Orkestracija',
      score: orkestracijaScore,
      tezina: config.weights[orkestracijaKey],
      doprinos: clampScore(orkestracijaScore * config.weights[orkestracijaKey]),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: 'fresh',
    },
  };

  // Extra domeni (gaming, licensing, itd.)
  const extraDomeniResults: Record<string, AgregiranDomenSignal> = {};
  for (const extraFn of config.extraDomeni ?? []) {
    const domen = extraFn(degradedSources);
    if (domen !== null) {
      // Kljuc je naziv domena konvertovan u camelCase-like ključ
      const key = domen.naziv
        .toLowerCase()
        .replace(/\s+(.)/g, (_, c: string) => c.toUpperCase())
        .replace(/\s/g, '');
      extraDomeniResults[key] = domen;
    }
  }

  const domeni: Record<string, AgregiranDomenSignal> = {
    ...coreDomeni,
    ...extraDomeniResults,
  };

  const ukupanScore = clampScore(
    Object.values(domeni).reduce((sum, d) => sum + d.score * d.tezina, 0),
  );

  const kriticniDomeni = Object.values(domeni)
    .filter((d) => d.score < AGREGATOR_CRITICAL_THRESHOLD)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(
      `Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`,
    );
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push(
      'Svi domeni su stabilni — sistem je u optimalnom stanju. Nastaviti monitoring.',
    );
  }

  return {
    sistem: config.sistemNaziv,
    kompanija: config.kompanija,
    verzija: config.verzija,
    autofinishBroj: config.autofinishBroj,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    preporuke,
    domeni,
    ekosistem: config.ekosistem,
    meta: {
      contractVersion: config.contractVersion,
      modelVersion: config.modelVersion,
      sourceOfTruth: config.sourceOfTruth,
      generatedAt: nowIso,
      scoreWeights: config.weights,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
