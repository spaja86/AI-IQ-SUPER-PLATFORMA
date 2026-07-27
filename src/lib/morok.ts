// SpajaUltraOmegaCore -∞Ω+∞ — MOROK
// Kompanija SPAJA — Digitalna Industrija
//
// Modularna Orkestracija Ritmova i Operativnog Kapaciteta —
// cross-domain operativno-ritmički engine za 6 kapacitetnih tokova:
//   - Mobilna Mreža
//   - Operativna Spremnost
//   - Procesuiranje 3
//   - Ekstremno Procesuiranje Svega
//   - Autofinish Orkestracija
//   - SpajaPro Engine (6-15)

import { getAktivneCentrale, mobilneCentrale } from './mobilna-mreza';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { buildProcesuiranje3 } from './procesuiranje-3';
import { buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import { spajaProVerzije } from './spaja-pro';
import type { MorokSnapshot } from './morok-store';
import { addMorokSnapshot, getMorokSnapshots } from './morok-store';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, MOBILNE_CENTRALE, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const MOROK_CONTRACT_VERSION = 'v1';
export const MOROK_MODEL_VERSION = '1.0.0';
export const MOROK_SOURCE_OF_TRUTH = '/api/morok';

// Težine moraju biti normalizovane na 1.0
export const MOROK_WEIGHTS = {
  mobilnaMreza: 0.20,
  operativnaSpremnost: 0.20,
  procesuiranje: 0.15,
  ekstremnoProcesuiranje: 0.15,
  orkestracija: 0.15,
  spajaPro: 0.15,
} as const;

export const MOROK_SLA_THRESHOLDS = {
  mobilnaMreza: 75,
  operativnaSpremnost: 80,
  procesuiranje: 75,
  ekstremnoProcesuiranje: 70,
  orkestracija: 60,
  spajaPro: 50,
} as const;

const MOROK_EXPECTED_AUTOFINISH_STAGES = 9;

const MOROK_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

const weightSum = Object.values(MOROK_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`MOROK_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type MorokOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type MorokTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type MorokMomentum = 'bullish' | 'bearish' | 'neutral';

export interface MorokDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: MorokTrendDirection;
  velocity: number;
  momentum: MorokMomentum;
  slaThreshold: number;
}

export interface MorokHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface MorokMeta {
  contractVersion: typeof MOROK_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof MOROK_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof MOROK_WEIGHTS;
  slaThresholds: typeof MOROK_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface MorokRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: MorokOcena;
  trendMomentum: MorokMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    mobilnaMreza: MorokDomenSignal;
    operativnaSpremnost: MorokDomenSignal;
    procesuiranje: MorokDomenSignal;
    ekstremnoProcesuiranje: MorokDomenSignal;
    orkestracija: MorokDomenSignal;
    spajaPro: MorokDomenSignal;
  };
  history: MorokHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: MorokMeta;
  timestamp: string;
}

// ─── Interne pomoćne funkcije ─────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): MorokOcena {
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
    ? MOROK_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? MOROK_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? MOROK_CONFIDENCE_VARIANCE.delimicno
        : MOROK_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): MorokTrendDirection {
  if (velocity === 0) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0 && acceleration > 0) return 'accelerating';
  if (velocity > 0 && acceleration <= 0) return 'rising';
  if (velocity < 0 && acceleration < 0) return 'accelerating';
  return 'decelerating';
}

function momentumFromVelocity(velocity: number): MorokMomentum {
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
    console.error(`[morok] source failure: ${sourceName}`, error);
    return null;
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Gradi MOROK — Modularna Orkestracija Ritmova i Operativnog Kapaciteta za 6 domena.
 * Fokus: operativno-ritmička orkestarca kapacitetnih tokova platforme.
 * Politika: continue-on-error — greška jednog izvora ne blokira ostale.
 */
export function buildMorok(): MorokRezultat {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  // ── Pokretanje svih izvora ─────────────────────────────────────────────────
  const operativnaSpremnost = safeCallSync('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const procesuiranje = safeCallSync('procesuiranje-3', degradedSources, () => buildProcesuiranje3());
  const ekstremnoProcesuiranje = safeCallSync('ekstremno-procesuiranje-svega', degradedSources, () => buildEkstremnoProcesuiranjeSvega());
  const autofinishInfo = safeCallSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo());

  // ── Istorija snimaka pre upisivanja novog ─────────────────────────────────
  const allSnapshots: MorokSnapshot[] = getMorokSnapshots();
  const historyBefore: MorokHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  const previousSnapshot: MorokSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  const prePreviousSnapshot: MorokSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  // ── Računanje domain score-ova ────────────────────────────────────────────

  // Mobilna Mreža: score na osnovu aktivnih centrala vs ukupnih
  const ukupnoCentrala = mobilneCentrale.length > 0 ? mobilneCentrale.length : MOBILNE_CENTRALE;
  const aktivnihCentrala = safeCallSync('mobilna-mreza', degradedSources, () => getAktivneCentrale().length) ?? 0;
  const mobilnaMrezaScore = ukupnoCentrala > 0
    ? clampScore((aktivnihCentrala / ukupnoCentrala) * 100)
    : 0;

  const operativnaSpremnostScore = operativnaSpremnost?.spremnost?.ukupanScore ?? 0;

  const procesuiranjeScore = procesuiranje?.ukupanScore ?? 0;

  const ekstremnoProcesuiranjeScore = ekstremnoProcesuiranje?.ukupanProcenat ?? 0;

  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / MOROK_EXPECTED_AUTOFINISH_STAGES) * 100)
    : 0;

  const spajaProTotal = spajaProVerzije.length;
  const spajaProActiveAndBeta = spajaProVerzije.filter((v) => v.status === 'aktivna' || v.status === 'beta').length;
  const spajaProScore = spajaProTotal > 0 ? clampScore((spajaProActiveAndBeta / spajaProTotal) * 100) : 0;

  // ── Globalni score ────────────────────────────────────────────────────────

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const ukupanScore = clampScore(
    mobilnaMrezaScore * MOROK_WEIGHTS.mobilnaMreza
    + operativnaSpremnostScore * MOROK_WEIGHTS.operativnaSpremnost
    + procesuiranjeScore * MOROK_WEIGHTS.procesuiranje
    + ekstremnoProcesuiranjeScore * MOROK_WEIGHTS.ekstremnoProcesuiranje
    + orkestracijaScore * MOROK_WEIGHTS.orkestracija
    + spajaProScore * MOROK_WEIGHTS.spajaPro,
  );

  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  // ── Per-domain velocity i akceleracija ────────────────────────────────────

  function domainVelocity(current: number, key: keyof MorokSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof MorokSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const mobilnaVelocity = domainVelocity(mobilnaMrezaScore, 'mobilnaMreza');
  const operativnaVelocity = domainVelocity(operativnaSpremnostScore, 'operativnaSpremnost');
  const procesuiranjeVelocity = domainVelocity(procesuiranjeScore, 'procesuiranje');
  const ekstremnoVelocity = domainVelocity(ekstremnoProcesuiranjeScore, 'ekstremnoProcesuiranje');
  const orkestracijaVelocity = domainVelocity(orkestracijaScore, 'orkestracija');
  const spajaProVelocityVal = domainVelocity(spajaProScore, 'spajaPro');

  // ── Domeni ────────────────────────────────────────────────────────────────

  const domeni = {
    mobilnaMreza: {
      naziv: 'Mobilna Mreža',
      score: mobilnaMrezaScore,
      confidence: computeConfidence(mobilnaMrezaScore, ukupnoCentrala > 0, false),
      tezina: MOROK_WEIGHTS.mobilnaMreza,
      doprinos: clampScore(mobilnaMrezaScore * MOROK_WEIGHTS.mobilnaMreza),
      sourceOfTruth: '/api/mobilna-mreza',
      freshness: freshnessFromSourceState(ukupnoCentrala > 0, false),
      trendDirection: velocityToTrendDirection(mobilnaVelocity, domainPrevVelocity('mobilnaMreza')),
      velocity: mobilnaVelocity,
      momentum: momentumFromVelocity(mobilnaVelocity),
      slaThreshold: MOROK_SLA_THRESHOLDS.mobilnaMreza,
    } satisfies MorokDomenSignal,
    operativnaSpremnost: {
      naziv: 'Operativna Spremnost',
      score: operativnaSpremnostScore,
      confidence: computeConfidence(operativnaSpremnostScore, operativnaSpremnost !== null, false),
      tezina: MOROK_WEIGHTS.operativnaSpremnost,
      doprinos: clampScore(operativnaSpremnostScore * MOROK_WEIGHTS.operativnaSpremnost),
      sourceOfTruth: '/api/status',
      freshness: freshnessFromSourceState(operativnaSpremnost !== null, false),
      trendDirection: velocityToTrendDirection(operativnaVelocity, domainPrevVelocity('operativnaSpremnost')),
      velocity: operativnaVelocity,
      momentum: momentumFromVelocity(operativnaVelocity),
      slaThreshold: MOROK_SLA_THRESHOLDS.operativnaSpremnost,
    } satisfies MorokDomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje 3',
      score: procesuiranjeScore,
      confidence: computeConfidence(procesuiranjeScore, procesuiranje !== null, false),
      tezina: MOROK_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * MOROK_WEIGHTS.procesuiranje),
      sourceOfTruth: '/api/procesuiranje-3',
      freshness: freshnessFromSourceState(procesuiranje !== null, false),
      trendDirection: velocityToTrendDirection(procesuiranjeVelocity, domainPrevVelocity('procesuiranje')),
      velocity: procesuiranjeVelocity,
      momentum: momentumFromVelocity(procesuiranjeVelocity),
      slaThreshold: MOROK_SLA_THRESHOLDS.procesuiranje,
    } satisfies MorokDomenSignal,
    ekstremnoProcesuiranje: {
      naziv: 'Ekstremno Procesuiranje Svega',
      score: ekstremnoProcesuiranjeScore,
      confidence: computeConfidence(ekstremnoProcesuiranjeScore, ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      tezina: MOROK_WEIGHTS.ekstremnoProcesuiranje,
      doprinos: clampScore(ekstremnoProcesuiranjeScore * MOROK_WEIGHTS.ekstremnoProcesuiranje),
      sourceOfTruth: ekstremnoProcesuiranje?.meta.sourceOfTruth ?? '/api/ekstremno-procesuiranje-svega',
      freshness: freshnessFromSourceState(ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(ekstremnoVelocity, domainPrevVelocity('ekstremnoProcesuiranje')),
      velocity: ekstremnoVelocity,
      momentum: momentumFromVelocity(ekstremnoVelocity),
      slaThreshold: MOROK_SLA_THRESHOLDS.ekstremnoProcesuiranje,
    } satisfies MorokDomenSignal,
    orkestracija: {
      naziv: 'Autofinish Orkestracija',
      score: orkestracijaScore,
      confidence: computeConfidence(orkestracijaScore, autofinishInfo !== null, false),
      tezina: MOROK_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * MOROK_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: freshnessFromSourceState(autofinishInfo !== null, false),
      trendDirection: velocityToTrendDirection(orkestracijaVelocity, domainPrevVelocity('orkestracija')),
      velocity: orkestracijaVelocity,
      momentum: momentumFromVelocity(orkestracijaVelocity),
      slaThreshold: MOROK_SLA_THRESHOLDS.orkestracija,
    } satisfies MorokDomenSignal,
    spajaPro: {
      naziv: 'SpajaPro Engine (6-15)',
      score: spajaProScore,
      confidence: computeConfidence(spajaProScore, true, false),
      tezina: MOROK_WEIGHTS.spajaPro,
      doprinos: clampScore(spajaProScore * MOROK_WEIGHTS.spajaPro),
      sourceOfTruth: '/api/spaja-pro',
      freshness: 'fresh',
      trendDirection: velocityToTrendDirection(spajaProVelocityVal, domainPrevVelocity('spajaPro')),
      velocity: spajaProVelocityVal,
      momentum: momentumFromVelocity(spajaProVelocityVal),
      slaThreshold: MOROK_SLA_THRESHOLDS.spajaPro,
    } satisfies MorokDomenSignal,
  };

  // ── Kritični domeni i preporuke ───────────────────────────────────────────

  const kriticniDomeni = (Object.values(domeni) as MorokDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as MorokDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish momentum detektovan u: ${bearishDomeni.join(', ')} — pratiti ritam.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore kapaciteta: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi domeni iznad SLA praga, bullish ili neutralan momentum — MOROK stabilan ritam.');
  }

  // ── Snapshot ─────────────────────────────────────────────────────────────

  addMorokSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      mobilnaMreza: mobilnaMrezaScore,
      operativnaSpremnost: operativnaSpremnostScore,
      procesuiranje: procesuiranjeScore,
      ekstremnoProcesuiranje: ekstremnoProcesuiranjeScore,
      orkestracija: orkestracijaScore,
      spajaPro: spajaProScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'MOROK — Digitalna Industrija',
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
      contractVersion: MOROK_CONTRACT_VERSION,
      modelVersion: MOROK_MODEL_VERSION,
      sourceOfTruth: MOROK_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: MOROK_WEIGHTS,
      slaThresholds: MOROK_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
