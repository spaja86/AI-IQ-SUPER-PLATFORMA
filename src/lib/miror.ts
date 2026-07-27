// SpajaUltraOmegaCore -∞Ω+∞ — MIROR
// Kompanija SPAJA — Digitalna Industrija
//
// Modularna Inteligentna Refleksija Operativnih Ritmova —
// cross-domain refleksioni engine za 6 operativnih tokova:
//   - Rezonancija
//   - Sintetizacija
//   - Distribucija
//   - BAR KOD
//   - Digitalna Observatorija
//   - Vektorizacija

import { buildBarKod } from './bar-kod';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';
import { getDistribucijaKpi, getDistribucijaModel } from './distribucija';
import { getObservatorijaStatistika } from './digitalna-observatorija';
import type { MirorSnapshot } from './miror-store';
import { addMirorSnapshot, getMirorSnapshots } from './miror-store';
import { buildRezonancija } from './rezonancija';
import { buildSintetizacija } from './sintetizacija';
import { buildVektorizacija } from './vektorizacija';

export const MIROR_CONTRACT_VERSION = 'v1';
export const MIROR_MODEL_VERSION = '1.0.0';
export const MIROR_SOURCE_OF_TRUTH = '/api/miror';

export const MIROR_WEIGHTS = {
  rezonancija: 0.20,
  sintetizacija: 0.20,
  distribucija: 0.20,
  barKod: 0.15,
  observatorija: 0.10,
  vektorizacija: 0.15,
} as const;

export const MIROR_SLA_THRESHOLDS = {
  rezonancija: 75,
  sintetizacija: 70,
  distribucija: 75,
  barKod: 70,
  observatorija: 65,
  vektorizacija: 70,
} as const;

const MIROR_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

const BAR_KOD_SCORE_FULL = 100;
const BAR_KOD_SCORE_PARTIAL = 50;
const BAR_KOD_SCORE_UNAVAILABLE = 0;

const weightSum = Object.values(MIROR_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`MIROR_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

export type MirorOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type MirorTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type MirorMomentum = 'bullish' | 'bearish' | 'neutral';

export interface MirorDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: MirorTrendDirection;
  velocity: number;
  momentum: MirorMomentum;
  slaThreshold: number;
}

export interface MirorHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface MirorMeta {
  contractVersion: typeof MIROR_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof MIROR_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof MIROR_WEIGHTS;
  slaThresholds: typeof MIROR_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface MirorRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: MirorOcena;
  trendMomentum: MirorMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    rezonancija: MirorDomenSignal;
    sintetizacija: MirorDomenSignal;
    distribucija: MirorDomenSignal;
    barKod: MirorDomenSignal;
    observatorija: MirorDomenSignal;
    vektorizacija: MirorDomenSignal;
  };
  history: MirorHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: MirorMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): MirorOcena {
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
    ? MIROR_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? MIROR_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? MIROR_CONFIDENCE_VARIANCE.delimicno
        : MIROR_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): MirorTrendDirection {
  if (velocity === 0) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0 && acceleration > 0) return 'accelerating';
  if (velocity > 0 && acceleration <= 0) return 'rising';
  if (velocity < 0 && acceleration < 0) return 'accelerating';
  if (velocity < 0 && acceleration === 0) return 'falling';
  return 'decelerating';
}

function momentumFromVelocity(velocity: number): MirorMomentum {
  if (velocity > 2) return 'bullish';
  if (velocity < -2) return 'bearish';
  return 'neutral';
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
    console.error(`[miror] source failure: ${sourceName}`, error);
    return null;
  }
}

function observatorijaScoreFromStatistika(
  statistika: ReturnType<typeof getObservatorijaStatistika>,
): number {
  if (statistika.ukupnoSesija <= 0) {
    return statistika.otvorenihAlarma > 0 ? 0 : 100;
  }
  return clampScore(100 - (statistika.otvorenihAlarma / statistika.ukupnoSesija) * 100);
}

export function buildMiror(): MirorRezultat {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const rezonancija = safeCallSync('rezonancija', degradedSources, () => buildRezonancija('system'));
  const sintetizacija = safeCallSync('sintetizacija', degradedSources, () => buildSintetizacija('system'));
  const distribucijaModel = safeCallSync('distribucija-model', degradedSources, () => getDistribucijaModel());
  const distribucijaKpi = safeCallSync('distribucija-kpi', degradedSources, () => getDistribucijaKpi());
  const barKod = safeCallSync('bar-kod', degradedSources, () => buildBarKod('system'));
  const observatorija = safeCallSync('digitalna-observatorija', degradedSources, () => getObservatorijaStatistika());
  const vektorizacija = safeCallSync('vektorizacija', degradedSources, () => buildVektorizacija('system'));

  const allSnapshots: MirorSnapshot[] = getMirorSnapshots();
  const historyBefore: MirorHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  const previousSnapshot: MirorSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  const prePreviousSnapshot: MirorSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  const rezonancijaScore = clampScore((rezonancija?.indeksRezonancije ?? 0) * 100);
  const sintetizacijaScore = clampScore((sintetizacija?.indeksSinteze ?? 0) * 100);
  const distribucijaUkupnoCvorova = distribucijaKpi?.ukupnoCvorova;
  const distribucijaAktivnihCvorova = distribucijaKpi?.aktivnihCvorova;
  const distribucijaScore = (
    typeof distribucijaUkupnoCvorova === 'number'
    && distribucijaUkupnoCvorova > 0
    && typeof distribucijaAktivnihCvorova === 'number'
  )
    ? clampScore((distribucijaAktivnihCvorova / distribucijaUkupnoCvorova) * 100)
    : 0;
  const barKodScore = barKod
    ? (barKod.kpi.ukupnoBarKodova > 0 ? BAR_KOD_SCORE_FULL : BAR_KOD_SCORE_PARTIAL)
    : BAR_KOD_SCORE_UNAVAILABLE;
  const observatorijaScore = observatorija ? observatorijaScoreFromStatistika(observatorija) : 0;
  const vektorizacijaScore = clampScore((vektorizacija?.indeksVektorizacije ?? 0) * 100);

  const ukupanScore = clampScore(
    rezonancijaScore * MIROR_WEIGHTS.rezonancija
    + sintetizacijaScore * MIROR_WEIGHTS.sintetizacija
    + distribucijaScore * MIROR_WEIGHTS.distribucija
    + barKodScore * MIROR_WEIGHTS.barKod
    + observatorijaScore * MIROR_WEIGHTS.observatorija
    + vektorizacijaScore * MIROR_WEIGHTS.vektorizacija,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof MirorSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof MirorSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const rezonancijaVelocity = domainVelocity(rezonancijaScore, 'rezonancija');
  const sintetizacijaVelocity = domainVelocity(sintetizacijaScore, 'sintetizacija');
  const distribucijaVelocity = domainVelocity(distribucijaScore, 'distribucija');
  const barKodVelocity = domainVelocity(barKodScore, 'barKod');
  const observatorijaVelocity = domainVelocity(observatorijaScore, 'observatorija');
  const vektorizacijaVelocity = domainVelocity(vektorizacijaScore, 'vektorizacija');

  const distribucijaDegraded = distribucijaModel?.status !== 'aktivan';
  const observatorijaDegraded = observatorija !== null && observatorija.otvorenihAlarma > 0;

  const domeni = {
    rezonancija: {
      naziv: 'Rezonancija',
      score: rezonancijaScore,
      confidence: computeConfidence(rezonancijaScore, rezonancija !== null, false),
      tezina: MIROR_WEIGHTS.rezonancija,
      doprinos: clampScore(rezonancijaScore * MIROR_WEIGHTS.rezonancija),
      sourceOfTruth: '/api/rezonancija',
      freshness: freshnessFromSourceState(rezonancija !== null, false),
      trendDirection: velocityToTrendDirection(rezonancijaVelocity, domainPrevVelocity('rezonancija')),
      velocity: rezonancijaVelocity,
      momentum: momentumFromVelocity(rezonancijaVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.rezonancija,
    } satisfies MirorDomenSignal,
    sintetizacija: {
      naziv: 'Sintetizacija',
      score: sintetizacijaScore,
      confidence: computeConfidence(sintetizacijaScore, sintetizacija !== null, false),
      tezina: MIROR_WEIGHTS.sintetizacija,
      doprinos: clampScore(sintetizacijaScore * MIROR_WEIGHTS.sintetizacija),
      sourceOfTruth: '/api/sintetizacija',
      freshness: freshnessFromSourceState(sintetizacija !== null, false),
      trendDirection: velocityToTrendDirection(sintetizacijaVelocity, domainPrevVelocity('sintetizacija')),
      velocity: sintetizacijaVelocity,
      momentum: momentumFromVelocity(sintetizacijaVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.sintetizacija,
    } satisfies MirorDomenSignal,
    distribucija: {
      naziv: 'Distribucija',
      score: distribucijaScore,
      confidence: computeConfidence(distribucijaScore, distribucijaKpi !== null, distribucijaDegraded),
      tezina: MIROR_WEIGHTS.distribucija,
      doprinos: clampScore(distribucijaScore * MIROR_WEIGHTS.distribucija),
      sourceOfTruth: distribucijaModel?.apiLink ?? '/api/distribucija',
      freshness: freshnessFromSourceState(distribucijaKpi !== null, distribucijaDegraded),
      trendDirection: velocityToTrendDirection(distribucijaVelocity, domainPrevVelocity('distribucija')),
      velocity: distribucijaVelocity,
      momentum: momentumFromVelocity(distribucijaVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.distribucija,
    } satisfies MirorDomenSignal,
    barKod: {
      naziv: 'BAR KOD',
      score: barKodScore,
      confidence: computeConfidence(barKodScore, barKod !== null, false),
      tezina: MIROR_WEIGHTS.barKod,
      doprinos: clampScore(barKodScore * MIROR_WEIGHTS.barKod),
      sourceOfTruth: '/api/bar-kod',
      freshness: freshnessFromSourceState(barKod !== null, false),
      trendDirection: velocityToTrendDirection(barKodVelocity, domainPrevVelocity('barKod')),
      velocity: barKodVelocity,
      momentum: momentumFromVelocity(barKodVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.barKod,
    } satisfies MirorDomenSignal,
    observatorija: {
      naziv: 'Digitalna Observatorija',
      score: observatorijaScore,
      confidence: computeConfidence(observatorijaScore, observatorija !== null, observatorijaDegraded),
      tezina: MIROR_WEIGHTS.observatorija,
      doprinos: clampScore(observatorijaScore * MIROR_WEIGHTS.observatorija),
      sourceOfTruth: '/api/digitalna-observatorija',
      freshness: freshnessFromSourceState(observatorija !== null, observatorijaDegraded),
      trendDirection: velocityToTrendDirection(observatorijaVelocity, domainPrevVelocity('observatorija')),
      velocity: observatorijaVelocity,
      momentum: momentumFromVelocity(observatorijaVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.observatorija,
    } satisfies MirorDomenSignal,
    vektorizacija: {
      naziv: 'Vektorizacija',
      score: vektorizacijaScore,
      confidence: computeConfidence(vektorizacijaScore, vektorizacija !== null, false),
      tezina: MIROR_WEIGHTS.vektorizacija,
      doprinos: clampScore(vektorizacijaScore * MIROR_WEIGHTS.vektorizacija),
      sourceOfTruth: '/api/vektorizacija',
      freshness: freshnessFromSourceState(vektorizacija !== null, false),
      trendDirection: velocityToTrendDirection(vektorizacijaVelocity, domainPrevVelocity('vektorizacija')),
      velocity: vektorizacijaVelocity,
      momentum: momentumFromVelocity(vektorizacijaVelocity),
      slaThreshold: MIROR_SLA_THRESHOLDS.vektorizacija,
    } satisfies MirorDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as MirorDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati MIROR domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as MirorDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish refleksija detektovana u: ${bearishDomeni.join(', ')} — pratiti pad ritma.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za MIROR: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi MIROR domeni su iznad SLA praga uz stabilan ili bullish refleksioni ritam.');
  }

  addMirorSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      rezonancija: rezonancijaScore,
      sintetizacija: sintetizacijaScore,
      distribucija: distribucijaScore,
      barKod: barKodScore,
      observatorija: observatorijaScore,
      vektorizacija: vektorizacijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'MIROR — Digitalna Industrija',
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
      contractVersion: MIROR_CONTRACT_VERSION,
      modelVersion: MIROR_MODEL_VERSION,
      sourceOfTruth: MIROR_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: MIROR_WEIGHTS,
      slaThresholds: MIROR_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
