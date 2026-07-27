// SpajaUltraOmegaCore -∞Ω+∞ — SILJA
// Kompanija SPAJA — Digitalna Industrija
//
// Sistemska Inteligentna Logika Jezgra Automatizacije —
// cross-domain automation-intelligence engine za 6 operativnih tokova:
//   - Kristalizacija
//   - Harmonizacija
//   - Modulacija
//   - Perkolizonik
//   - Rezonancija
//   - Sintetizacija

import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';
import { buildHarmonizacija } from './harmonizacija';
import { buildKristalizacija } from './kristalizacija';
import { buildModulacija } from './modulacija';
import { buildPerkolizonik } from './perkolizonik';
import { buildRezonancija } from './rezonancija';
import { addSiljaSnapshot, getSiljaSnapshots } from './silja-store';
import { buildSintetizacija } from './sintetizacija';
import type { SiljaSnapshot } from './silja-store';

export const SILJA_CONTRACT_VERSION = 'v1';
export const SILJA_MODEL_VERSION = '1.0.0';
export const SILJA_SOURCE_OF_TRUTH = '/api/silja';

export const SILJA_WEIGHTS = {
  kristalizacija: 0.20,
  harmonizacija: 0.15,
  modulacija: 0.15,
  perkolizonik: 0.20,
  rezonancija: 0.15,
  sintetizacija: 0.15,
} as const;

export const SILJA_SLA_THRESHOLDS = {
  kristalizacija: 75,
  harmonizacija: 72,
  modulacija: 70,
  perkolizonik: 76,
  rezonancija: 75,
  sintetizacija: 72,
} as const;

const SILJA_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;
const SILJA_DEGRADATION_THRESHOLD = 0.7;

const weightSum = Object.values(SILJA_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`SILJA_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

export type SiljaOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type SiljaTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type SiljaMomentum = 'bullish' | 'bearish' | 'neutral';

export interface SiljaDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: SiljaTrendDirection;
  velocity: number;
  momentum: SiljaMomentum;
  slaThreshold: number;
}

export interface SiljaHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface SiljaMeta {
  contractVersion: typeof SILJA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof SILJA_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof SILJA_WEIGHTS;
  slaThresholds: typeof SILJA_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface SiljaRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: SiljaOcena;
  trendMomentum: SiljaMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    kristalizacija: SiljaDomenSignal;
    harmonizacija: SiljaDomenSignal;
    modulacija: SiljaDomenSignal;
    perkolizonik: SiljaDomenSignal;
    rezonancija: SiljaDomenSignal;
    sintetizacija: SiljaDomenSignal;
  };
  history: SiljaHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: SiljaMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): SiljaOcena {
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
    ? SILJA_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? SILJA_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? SILJA_CONFIDENCE_VARIANCE.delimicno
        : SILJA_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): SiljaTrendDirection {
  const epsilon = 0.001;
  if (velocity === 0) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0 && acceleration > epsilon) return 'accelerating';
  if (velocity > 0) return 'rising';
  if (acceleration < -epsilon) return 'falling';
  if (Math.abs(acceleration) <= epsilon) return 'falling';
  return 'decelerating';
}

function momentumFromVelocity(velocity: number): SiljaMomentum {
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
    console.error(`[silja] source failure: ${sourceName}`, error);
    return null;
  }
}

export function buildSilja(): SiljaRezultat {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const kristalizacija = safeCallSync('kristalizacija', degradedSources, () => buildKristalizacija('system'));
  const harmonizacija = safeCallSync('harmonizacija', degradedSources, () => buildHarmonizacija('system'));
  const modulacija = safeCallSync('modulacija', degradedSources, () => buildModulacija('system'));
  const perkolizonik = safeCallSync('perkolizonik', degradedSources, () => buildPerkolizonik('system'));
  const rezonancija = safeCallSync('rezonancija', degradedSources, () => buildRezonancija('system'));
  const sintetizacija = safeCallSync('sintetizacija', degradedSources, () => buildSintetizacija('system'));

  const allSnapshots: SiljaSnapshot[] = getSiljaSnapshots();
  const historyBefore: SiljaHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  const previousSnapshot: SiljaSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  const prePreviousSnapshot: SiljaSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  const kristalizacijaScore = clampScore((kristalizacija?.indeksKristalizacije ?? 0) * 100);
  const harmonizacijaScore = clampScore((harmonizacija?.indeksHarmonije ?? 0) * 100);
  const modulacijaScore = clampScore((modulacija?.indeksModulacije ?? 0) * 100);
  const perkolizonikScore = clampScore((perkolizonik?.operativniIndeks ?? 0) * 100);
  const rezonancijaScore = clampScore((rezonancija?.indeksRezonancije ?? 0) * 100);
  const sintetizacijaScore = clampScore((sintetizacija?.indeksSinteze ?? 0) * 100);

  const ukupanScore = clampScore(
    kristalizacijaScore * SILJA_WEIGHTS.kristalizacija
    + harmonizacijaScore * SILJA_WEIGHTS.harmonizacija
    + modulacijaScore * SILJA_WEIGHTS.modulacija
    + perkolizonikScore * SILJA_WEIGHTS.perkolizonik
    + rezonancijaScore * SILJA_WEIGHTS.rezonancija
    + sintetizacijaScore * SILJA_WEIGHTS.sintetizacija,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof SiljaSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof SiljaSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const kristalizacijaVelocity = domainVelocity(kristalizacijaScore, 'kristalizacija');
  const harmonizacijaVelocity = domainVelocity(harmonizacijaScore, 'harmonizacija');
  const modulacijaVelocity = domainVelocity(modulacijaScore, 'modulacija');
  const perkolizonikVelocity = domainVelocity(perkolizonikScore, 'perkolizonik');
  const rezonancijaVelocity = domainVelocity(rezonancijaScore, 'rezonancija');
  const sintetizacijaVelocity = domainVelocity(sintetizacijaScore, 'sintetizacija');

  const kristalizacijaDegraded =
    kristalizacija !== null && kristalizacija.stabilnostJezgra < SILJA_DEGRADATION_THRESHOLD;
  const harmonizacijaDegraded =
    harmonizacija !== null && harmonizacija.stabilnost < SILJA_DEGRADATION_THRESHOLD;
  const modulacijaDegraded =
    modulacija !== null && modulacija.efikasnostPrenosa < SILJA_DEGRADATION_THRESHOLD;
  const perkolizonikDegraded =
    perkolizonik !== null && perkolizonik.stabilnost < SILJA_DEGRADATION_THRESHOLD;
  const rezonancijaDegraded =
    rezonancija !== null && rezonancija.prosekStabilnosti < SILJA_DEGRADATION_THRESHOLD;
  const sintetizacijaDegraded =
    sintetizacija !== null && sintetizacija.stabilnostSinteze < SILJA_DEGRADATION_THRESHOLD;

  const domeni = {
    kristalizacija: {
      naziv: 'Kristalizacija',
      score: kristalizacijaScore,
      confidence: computeConfidence(kristalizacijaScore, kristalizacija !== null, kristalizacijaDegraded),
      tezina: SILJA_WEIGHTS.kristalizacija,
      doprinos: clampScore(kristalizacijaScore * SILJA_WEIGHTS.kristalizacija),
      sourceOfTruth: '/api/kristalizacija',
      freshness: freshnessFromSourceState(kristalizacija !== null, kristalizacijaDegraded),
      trendDirection: velocityToTrendDirection(kristalizacijaVelocity, domainPrevVelocity('kristalizacija')),
      velocity: kristalizacijaVelocity,
      momentum: momentumFromVelocity(kristalizacijaVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.kristalizacija,
    } satisfies SiljaDomenSignal,
    harmonizacija: {
      naziv: 'Harmonizacija',
      score: harmonizacijaScore,
      confidence: computeConfidence(harmonizacijaScore, harmonizacija !== null, harmonizacijaDegraded),
      tezina: SILJA_WEIGHTS.harmonizacija,
      doprinos: clampScore(harmonizacijaScore * SILJA_WEIGHTS.harmonizacija),
      sourceOfTruth: '/api/harmonizacija',
      freshness: freshnessFromSourceState(harmonizacija !== null, harmonizacijaDegraded),
      trendDirection: velocityToTrendDirection(harmonizacijaVelocity, domainPrevVelocity('harmonizacija')),
      velocity: harmonizacijaVelocity,
      momentum: momentumFromVelocity(harmonizacijaVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.harmonizacija,
    } satisfies SiljaDomenSignal,
    modulacija: {
      naziv: 'Modulacija',
      score: modulacijaScore,
      confidence: computeConfidence(modulacijaScore, modulacija !== null, modulacijaDegraded),
      tezina: SILJA_WEIGHTS.modulacija,
      doprinos: clampScore(modulacijaScore * SILJA_WEIGHTS.modulacija),
      sourceOfTruth: '/api/modulacija',
      freshness: freshnessFromSourceState(modulacija !== null, modulacijaDegraded),
      trendDirection: velocityToTrendDirection(modulacijaVelocity, domainPrevVelocity('modulacija')),
      velocity: modulacijaVelocity,
      momentum: momentumFromVelocity(modulacijaVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.modulacija,
    } satisfies SiljaDomenSignal,
    perkolizonik: {
      naziv: 'Perkolizonik',
      score: perkolizonikScore,
      confidence: computeConfidence(perkolizonikScore, perkolizonik !== null, perkolizonikDegraded),
      tezina: SILJA_WEIGHTS.perkolizonik,
      doprinos: clampScore(perkolizonikScore * SILJA_WEIGHTS.perkolizonik),
      sourceOfTruth: '/api/perkolizonik',
      freshness: freshnessFromSourceState(perkolizonik !== null, perkolizonikDegraded),
      trendDirection: velocityToTrendDirection(perkolizonikVelocity, domainPrevVelocity('perkolizonik')),
      velocity: perkolizonikVelocity,
      momentum: momentumFromVelocity(perkolizonikVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.perkolizonik,
    } satisfies SiljaDomenSignal,
    rezonancija: {
      naziv: 'Rezonancija',
      score: rezonancijaScore,
      confidence: computeConfidence(rezonancijaScore, rezonancija !== null, rezonancijaDegraded),
      tezina: SILJA_WEIGHTS.rezonancija,
      doprinos: clampScore(rezonancijaScore * SILJA_WEIGHTS.rezonancija),
      sourceOfTruth: '/api/rezonancija',
      freshness: freshnessFromSourceState(rezonancija !== null, rezonancijaDegraded),
      trendDirection: velocityToTrendDirection(rezonancijaVelocity, domainPrevVelocity('rezonancija')),
      velocity: rezonancijaVelocity,
      momentum: momentumFromVelocity(rezonancijaVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.rezonancija,
    } satisfies SiljaDomenSignal,
    sintetizacija: {
      naziv: 'Sintetizacija',
      score: sintetizacijaScore,
      confidence: computeConfidence(sintetizacijaScore, sintetizacija !== null, sintetizacijaDegraded),
      tezina: SILJA_WEIGHTS.sintetizacija,
      doprinos: clampScore(sintetizacijaScore * SILJA_WEIGHTS.sintetizacija),
      sourceOfTruth: '/api/sintetizacija',
      freshness: freshnessFromSourceState(sintetizacija !== null, sintetizacijaDegraded),
      trendDirection: velocityToTrendDirection(sintetizacijaVelocity, domainPrevVelocity('sintetizacija')),
      velocity: sintetizacijaVelocity,
      momentum: momentumFromVelocity(sintetizacijaVelocity),
      slaThreshold: SILJA_SLA_THRESHOLDS.sintetizacija,
    } satisfies SiljaDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as SiljaDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati SILJA domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as SiljaDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish automatizaciona refleksija detektovana u: ${bearishDomeni.join(', ')} — pratiti pad ritma.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za SILJA: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi SILJA domeni su iznad SLA praga uz stabilan ili bullish automation-intelligence ritam.');
  }

  addSiljaSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      kristalizacija: kristalizacijaScore,
      harmonizacija: harmonizacijaScore,
      modulacija: modulacijaScore,
      perkolizonik: perkolizonikScore,
      rezonancija: rezonancijaScore,
      sintetizacija: sintetizacijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'SILJA — Sistemska Inteligentna Logika Jezgra Automatizacije',
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
      contractVersion: SILJA_CONTRACT_VERSION,
      modelVersion: SILJA_MODEL_VERSION,
      sourceOfTruth: SILJA_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: SILJA_WEIGHTS,
      slaThresholds: SILJA_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
