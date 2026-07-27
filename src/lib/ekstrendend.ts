// SpajaUltraOmegaCore -∞Ω+∞ — EKSTRENDEND
// Kompanija SPAJA — Digitalna Industrija
//
// Ekstremni Trend Endzin — cross-domain trend velocity i momentum:
//   - Analiza Svega
//   - Potencijal Svega Ovoga Do Sada
//   - Procesuiranje 3
//   - Autofinish Svega (orkestracija)
//   - Ekstremno Procesuiranje Svega
//   - Operativna Spremnost
//   - SpajaPro Engine (6-15)
//   - Gejming Industrija

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranje3 } from './procesuiranje-3';
import { buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { spajaProVerzije } from './spaja-pro';
import { buildGejmingIndustrija } from './gejming-industrija';
import type { EkstrendendSnapshot } from './ekstrendend-store';
import {
  addEkstrendendSnapshot,
  getEkstrendendSnapshots,
} from './ekstrendend-store';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const EKSTRENDEND_CONTRACT_VERSION = 'v1';
export const EKSTRENDEND_MODEL_VERSION = '1.0.0';
export const EKSTRENDEND_SOURCE_OF_TRUTH = '/api/ekstrendend';

// Težine moraju biti normalizovane na 1.0
export const EKSTRENDEND_WEIGHTS = {
  analiza: 0.20,
  potencijal: 0.15,
  procesuiranje: 0.15,
  orkestracija: 0.10,
  ekstremnoProcesuiranje: 0.10,
  operativnaSpremnost: 0.10,
  spajaPro: 0.10,
  gejmingIndustrija: 0.10,
} as const;

export const EKSTRENDEND_SLA_THRESHOLDS = {
  analiza: 75,
  potencijal: 75,
  procesuiranje: 75,
  orkestracija: 60,
  ekstremnoProcesuiranje: 75,
  operativnaSpremnost: 80,
  spajaPro: 50,
  gejmingIndustrija: 50,
} as const;

const EKSTRENDEND_EXPECTED_AUTOFINISH_STAGES = 9;

const weightSum = Object.values(EKSTRENDEND_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`EKSTRENDEND_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

const EKSTRENDEND_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type EkstrendendOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type EkstrendendTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type EkstrendendMomentum = 'bullish' | 'bearish' | 'neutral';

export interface EkstrendendDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: EkstrendendTrendDirection;
  velocity: number;
  momentum: EkstrendendMomentum;
  slaThreshold: number;
}

export interface EkstrendendHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface EkstrendendMeta {
  contractVersion: typeof EKSTRENDEND_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof EKSTRENDEND_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof EKSTRENDEND_WEIGHTS;
  slaThresholds: typeof EKSTRENDEND_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface EkstrendendRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: EkstrendendOcena;
  trendMomentum: EkstrendendMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    analiza: EkstrendendDomenSignal;
    potencijal: EkstrendendDomenSignal;
    procesuiranje: EkstrendendDomenSignal;
    orkestracija: EkstrendendDomenSignal;
    ekstremnoProcesuiranje: EkstrendendDomenSignal;
    operativnaSpremnost: EkstrendendDomenSignal;
    spajaPro: EkstrendendDomenSignal;
    gejmingIndustrija: EkstrendendDomenSignal;
  };
  history: EkstrendendHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: EkstrendendMeta;
  timestamp: string;
}

// ─── Interne pomoćne funkcije ─────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): EkstrendendOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function freshnessFromSourceState(available: boolean, degraded: boolean): 'fresh' | 'stale' | 'unknown' {
  if (!available) return 'unknown';
  return degraded ? 'stale' : 'fresh';
}

function computeConfidence(score: number, available: boolean, degraded: boolean): number {
  if (!available) return 45;
  const base = degraded ? 60 : 88;
  const variance = score >= 90
    ? EKSTRENDEND_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? EKSTRENDEND_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? EKSTRENDEND_CONFIDENCE_VARIANCE.delimicno
        : EKSTRENDEND_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

/**
 * Izračunava trend velocity (rate of change) između trenutnog i prethodnog score-a.
 * Opseg: [-100, 100] — pozitivna = rast, negativna = pad.
 */
function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

/**
 * Određuje trend direction na osnovu velocity i prethodnog velocity (akceleracija).
 */
function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): EkstrendendTrendDirection {
  if (velocity === 0) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0 && acceleration > 0) return 'accelerating';
  if (velocity > 0 && acceleration <= 0) return 'rising';
  if (velocity < 0 && acceleration < 0) return 'decelerating';
  return 'falling';
}

function momentumFromVelocity(velocity: number): EkstrendendMomentum {
  if (velocity > 2) return 'bullish';
  if (velocity < -2) return 'bearish';
  return 'neutral';
}

async function safeCallAsync<T>(
  sourceName: string,
  degradedSources: string[],
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[ekstrendend] source failure: ${sourceName}`, error);
    return null;
  }
}

function safeCallSync<T>(
  sourceName: string,
  degradedSources: string[],
  fn: () => T,
): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[ekstrendend] source failure: ${sourceName}`, error);
    return null;
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Gradi EKSTRENDEND — Ekstremni Trend Endzin za svih 8 domena.
 * Fokus: trend velocity, momentum i projektovana readiness.
 * Politika: continue-on-error — greška jednog izvora ne blokira ostale.
 */
export async function buildEkstrendend(): Promise<EkstrendendRezultat> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  // ── Pokretanje svih izvora paralelno gde je moguće ────────────────────────
  const analizaPromise = safeCallAsync('analiza-svega', degradedSources, () => buildAnalizaSvega());
  const potencijal = safeCallSync('potencijal-svega-ovoga-do-sada', degradedSources, () => buildPotencijalSvegaOvogaDoSada());
  const procesuiranje = safeCallSync('procesuiranje-3', degradedSources, () => buildProcesuiranje3());
  const autofinishInfo = safeCallSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo());
  const ekstremnoProcesuiranje = safeCallSync('ekstremno-procesuiranje-svega', degradedSources, () => buildEkstremnoProcesuiranjeSvega());
  const operativnaSpremnost = safeCallSync('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const gejmingResult = safeCallSync('gejming-industrija', degradedSources, () => buildGejmingIndustrija('ekstrendend'));

  const analiza = await analizaPromise;

  // ── Istorija snimaka pre upisivanja novog ─────────────────────────────────
  const allSnapshots: EkstrendendSnapshot[] = getEkstrendendSnapshots();
  const historyBefore: EkstrendendHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  // Poslednji (prethodni) snimak
  const previousSnapshot: EkstrendendSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  // Snimak pre prethodnog (za računanje akceleracije)
  const prePreviousSnapshot: EkstrendendSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  // ── Računanje domain score-ova ────────────────────────────────────────────

  const analizaScore = analiza?.ukupanScore ?? 0;
  const potencijalScore = potencijal?.ukupniPotencijal ?? 0;
  const procesuiranjeScore = procesuiranje?.ukupanScore ?? 0;
  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / EKSTRENDEND_EXPECTED_AUTOFINISH_STAGES) * 100)
    : 0;
  const ekstremnoProcesuiranjeScore = ekstremnoProcesuiranje?.ukupanProcenat ?? 0;
  const operativnaSpremnostScore = operativnaSpremnost?.spremnost?.ukupanScore ?? 0;

  const spajaProTotal = spajaProVerzije.length;
  const spajaProActiveAndBeta = spajaProVerzije.filter((v) => v.status === 'aktivna' || v.status === 'beta').length;
  const spajaProScore = spajaProTotal > 0 ? clampScore((spajaProActiveAndBeta / spajaProTotal) * 100) : 0;

  const gejmingScore = gejmingResult != null
    ? clampScore(gejmingResult.pregled.prosecnaOptimizacija)
    : 0;

  // ── Globalni score ────────────────────────────────────────────────────────

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const ukupanScore = clampScore(
    analizaScore * EKSTRENDEND_WEIGHTS.analiza
    + potencijalScore * EKSTRENDEND_WEIGHTS.potencijal
    + procesuiranjeScore * EKSTRENDEND_WEIGHTS.procesuiranje
    + orkestracijaScore * EKSTRENDEND_WEIGHTS.orkestracija
    + ekstremnoProcesuiranjeScore * EKSTRENDEND_WEIGHTS.ekstremnoProcesuiranje
    + operativnaSpremnostScore * EKSTRENDEND_WEIGHTS.operativnaSpremnost
    + spajaProScore * EKSTRENDEND_WEIGHTS.spajaPro
    + gejmingScore * EKSTRENDEND_WEIGHTS.gejmingIndustrija,
  );

  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  // ── Per-domain velocity i akceleracija ────────────────────────────────────

  // velocity = current - prev
  // previousVelocity = prev - prePrev (za akceleraciju)
  function domainVelocity(current: number, key: keyof EkstrendendSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof EkstrendendSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const analizaVelocity = domainVelocity(analizaScore, 'analiza');
  const potencijalVelocity = domainVelocity(potencijalScore, 'potencijal');
  const procesuiranjeVelocity = domainVelocity(procesuiranjeScore, 'procesuiranje');
  const orkestracijaVelocity = domainVelocity(orkestracijaScore, 'orkestracija');
  const ekstremnoVelocity = domainVelocity(ekstremnoProcesuiranjeScore, 'ekstremnoProcesuiranje');
  const operativnaVelocity = domainVelocity(operativnaSpremnostScore, 'operativnaSpremnost');
  const spajaProVelocityVal = domainVelocity(spajaProScore, 'spajaPro');
  const gejmingVelocity = domainVelocity(gejmingScore, 'gejmingIndustrija');

  // ── Domeni ────────────────────────────────────────────────────────────────

  const domeni = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      confidence: computeConfidence(analizaScore, analiza !== null, analiza?.meta.degraded ?? false),
      tezina: EKSTRENDEND_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * EKSTRENDEND_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: freshnessFromSourceState(analiza !== null, analiza?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(analizaVelocity, domainPrevVelocity('analiza')),
      velocity: analizaVelocity,
      momentum: momentumFromVelocity(analizaVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.analiza,
    } satisfies EkstrendendDomenSignal,
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      confidence: computeConfidence(potencijalScore, potencijal !== null, potencijal?.meta.degraded ?? false),
      tezina: EKSTRENDEND_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * EKSTRENDEND_WEIGHTS.potencijal),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness: freshnessFromSourceState(potencijal !== null, potencijal?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(potencijalVelocity, domainPrevVelocity('potencijal')),
      velocity: potencijalVelocity,
      momentum: momentumFromVelocity(potencijalVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.potencijal,
    } satisfies EkstrendendDomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje 3',
      score: procesuiranjeScore,
      confidence: computeConfidence(procesuiranjeScore, procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      tezina: EKSTRENDEND_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * EKSTRENDEND_WEIGHTS.procesuiranje),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-3',
      freshness: freshnessFromSourceState(procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(procesuiranjeVelocity, domainPrevVelocity('procesuiranje')),
      velocity: procesuiranjeVelocity,
      momentum: momentumFromVelocity(procesuiranjeVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.procesuiranje,
    } satisfies EkstrendendDomenSignal,
    orkestracija: {
      naziv: 'Autofinish Svega',
      score: orkestracijaScore,
      confidence: computeConfidence(orkestracijaScore, autofinishInfo !== null, false),
      tezina: EKSTRENDEND_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * EKSTRENDEND_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: freshnessFromSourceState(autofinishInfo !== null, false),
      trendDirection: velocityToTrendDirection(orkestracijaVelocity, domainPrevVelocity('orkestracija')),
      velocity: orkestracijaVelocity,
      momentum: momentumFromVelocity(orkestracijaVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.orkestracija,
    } satisfies EkstrendendDomenSignal,
    ekstremnoProcesuiranje: {
      naziv: 'Ekstremno Procesuiranje Svega',
      score: ekstremnoProcesuiranjeScore,
      confidence: computeConfidence(ekstremnoProcesuiranjeScore, ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      tezina: EKSTRENDEND_WEIGHTS.ekstremnoProcesuiranje,
      doprinos: clampScore(ekstremnoProcesuiranjeScore * EKSTRENDEND_WEIGHTS.ekstremnoProcesuiranje),
      sourceOfTruth: ekstremnoProcesuiranje?.meta.sourceOfTruth ?? '/api/ekstremno-procesuiranje-svega',
      freshness: freshnessFromSourceState(ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(ekstremnoVelocity, domainPrevVelocity('ekstremnoProcesuiranje')),
      velocity: ekstremnoVelocity,
      momentum: momentumFromVelocity(ekstremnoVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.ekstremnoProcesuiranje,
    } satisfies EkstrendendDomenSignal,
    operativnaSpremnost: {
      naziv: 'Operativna Spremnost',
      score: operativnaSpremnostScore,
      confidence: computeConfidence(operativnaSpremnostScore, operativnaSpremnost !== null, false),
      tezina: EKSTRENDEND_WEIGHTS.operativnaSpremnost,
      doprinos: clampScore(operativnaSpremnostScore * EKSTRENDEND_WEIGHTS.operativnaSpremnost),
      sourceOfTruth: '/api/status',
      freshness: freshnessFromSourceState(operativnaSpremnost !== null, false),
      trendDirection: velocityToTrendDirection(operativnaVelocity, domainPrevVelocity('operativnaSpremnost')),
      velocity: operativnaVelocity,
      momentum: momentumFromVelocity(operativnaVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.operativnaSpremnost,
    } satisfies EkstrendendDomenSignal,
    spajaPro: {
      naziv: 'SpajaPro Engine (6-15)',
      score: spajaProScore,
      confidence: computeConfidence(spajaProScore, true, false),
      tezina: EKSTRENDEND_WEIGHTS.spajaPro,
      doprinos: clampScore(spajaProScore * EKSTRENDEND_WEIGHTS.spajaPro),
      sourceOfTruth: '/api/spaja-pro',
      freshness: 'fresh',
      trendDirection: velocityToTrendDirection(spajaProVelocityVal, domainPrevVelocity('spajaPro')),
      velocity: spajaProVelocityVal,
      momentum: momentumFromVelocity(spajaProVelocityVal),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.spajaPro,
    } satisfies EkstrendendDomenSignal,
    gejmingIndustrija: {
      naziv: 'Gejming Industrija',
      score: gejmingScore,
      confidence: computeConfidence(gejmingScore, gejmingResult !== null, false),
      tezina: EKSTRENDEND_WEIGHTS.gejmingIndustrija,
      doprinos: clampScore(gejmingScore * EKSTRENDEND_WEIGHTS.gejmingIndustrija),
      sourceOfTruth: '/api/gejming-industrija',
      freshness: freshnessFromSourceState(gejmingResult !== null, false),
      trendDirection: velocityToTrendDirection(gejmingVelocity, domainPrevVelocity('gejmingIndustrija')),
      velocity: gejmingVelocity,
      momentum: momentumFromVelocity(gejmingVelocity),
      slaThreshold: EKSTRENDEND_SLA_THRESHOLDS.gejmingIndustrija,
    } satisfies EkstrendendDomenSignal,
  };

  // ── Kritični domeni i preporuke ───────────────────────────────────────────

  const kriticniDomeni = (Object.values(domeni) as EkstrendendDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as EkstrendendDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish momentum detektovan u: ${bearishDomeni.join(', ')} — pratiti trend.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi domeni iznad SLA praga, bullish ili neutralan momentum — EKSTRENDEND stabilno.');
  }

  // ── Snapshot ─────────────────────────────────────────────────────────────

  addEkstrendendSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      analiza: analizaScore,
      potencijal: potencijalScore,
      procesuiranje: procesuiranjeScore,
      orkestracija: orkestracijaScore,
      ekstremnoProcesuiranje: ekstremnoProcesuiranjeScore,
      operativnaSpremnost: operativnaSpremnostScore,
      spajaPro: spajaProScore,
      gejmingIndustrija: gejmingScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'EKSTRENDEND — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    konacnaOcena: scoreToOcena(ukupanScore),
    trendMomentum,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    trendSnapshotCount: historyBefore.length + 1,
    domeni,
    history: historyBefore,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: EKSTRENDEND_CONTRACT_VERSION,
      modelVersion: EKSTRENDEND_MODEL_VERSION,
      sourceOfTruth: EKSTRENDEND_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: EKSTRENDEND_WEIGHTS,
      slaThresholds: EKSTRENDEND_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
