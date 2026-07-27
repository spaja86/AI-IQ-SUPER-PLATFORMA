// SpajaUltraOmegaCore -∞Ω+∞ — EKTOND
// Kompanija SPAJA — Digitalna Industrija
//
// Ekstremni Kondenzator Tokova Nadzora Digitalnog —
// cross-domain condensation engine za 6 platformskih tokova:
//   - Analiza Svega
//   - Potencijal Svega Ovoga Do Sada
//   - AI IQ World Bank
//   - Call Centar
//   - Proksi Mreža
//   - Gejming Industrija

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildAiIqWorldBank } from './ai-iq-world-bank';
import { buildCallCentarIzvestaj } from './call-centar';
import { proksiSignali, getAktivniSignali } from './proksi';
import { buildGejmingIndustrija } from './gejming-industrija';
import type { EktondSnapshot } from './ektond-store';
import { addEktondSnapshot, getEktondSnapshots } from './ektond-store';
import { APP_VERSION, AUTOFINISH_COUNT, CALL_CENTAR_AGENATA, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const EKTOND_CONTRACT_VERSION = 'v1';
export const EKTOND_MODEL_VERSION = '1.0.0';
export const EKTOND_SOURCE_OF_TRUTH = '/api/ektond';

// Težine moraju biti normalizovane na 1.0
export const EKTOND_WEIGHTS = {
  analiza: 0.20,
  potencijal: 0.15,
  worldBank: 0.20,
  callCentar: 0.15,
  proksi: 0.15,
  gejming: 0.15,
} as const;

export const EKTOND_SLA_THRESHOLDS = {
  analiza: 75,
  potencijal: 70,
  worldBank: 80,
  callCentar: 65,
  proksi: 70,
  gejming: 50,
} as const;

const EKTOND_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

const weightSum = Object.values(EKTOND_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`EKTOND_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type EktondOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type EktondTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type EktondMomentum = 'bullish' | 'bearish' | 'neutral';

export interface EktondDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: EktondTrendDirection;
  velocity: number;
  momentum: EktondMomentum;
  slaThreshold: number;
}

export interface EktondHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface EktondMeta {
  contractVersion: typeof EKTOND_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof EKTOND_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof EKTOND_WEIGHTS;
  slaThresholds: typeof EKTOND_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface EktondRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: EktondOcena;
  trendMomentum: EktondMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    analiza: EktondDomenSignal;
    potencijal: EktondDomenSignal;
    worldBank: EktondDomenSignal;
    callCentar: EktondDomenSignal;
    proksi: EktondDomenSignal;
    gejming: EktondDomenSignal;
  };
  history: EktondHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: EktondMeta;
  timestamp: string;
}

// ─── Interne pomoćne funkcije ─────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): EktondOcena {
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
    ? EKTOND_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? EKTOND_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? EKTOND_CONFIDENCE_VARIANCE.delimicno
        : EKTOND_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): EktondTrendDirection {
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

function momentumFromVelocity(velocity: number): EktondMomentum {
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
    console.error(`[ektond] source failure: ${sourceName}`, error);
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
    console.error(`[ektond] source failure: ${sourceName}`, error);
    return null;
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Gradi EKTOND — Ekstremni Kondenzator Tokova Nadzora Digitalnog za 6 domena.
 * Fokus: kondenzacija financijsko-infrastrukturnih tokova platforme.
 * Politika: continue-on-error — greška jednog izvora ne blokira ostale.
 */
export async function buildEktond(): Promise<EktondRezultat> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  // ── Pokretanje svih izvora paralelno gde je moguće ────────────────────────
  const analizaPromise = safeCallAsync('analiza-svega', degradedSources, () => buildAnalizaSvega());
  const potencijal = safeCallSync('potencijal-svega-ovoga-do-sada', degradedSources, () => buildPotencijalSvegaOvogaDoSada());
  const worldBank = safeCallSync('ai-iq-world-bank', degradedSources, () => buildAiIqWorldBank('ektond'));
  const callCentar = safeCallSync('call-centar', degradedSources, () => buildCallCentarIzvestaj());
  const gejmingResult = safeCallSync('gejming-industrija', degradedSources, () => buildGejmingIndustrija('ektond'));

  const analiza = await analizaPromise;

  // ── Istorija snimaka pre upisivanja novog ─────────────────────────────────
  const allSnapshots: EktondSnapshot[] = getEktondSnapshots();
  const historyBefore: EktondHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  const previousSnapshot: EktondSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  const prePreviousSnapshot: EktondSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  // ── Računanje domain score-ova ────────────────────────────────────────────

  const analizaScore = analiza?.ukupanScore ?? 0;
  const potencijalScore = potencijal?.ukupniPotencijal ?? 0;

  // WorldBank: aiTacnost je 0-100 procenat tacnosti AI sistema
  const worldBankScore = worldBank ? clampScore(worldBank.kpi.aiTacnost) : 0;

  // CallCentar: score na osnovu broja aktivnih agenata vs kapacitet
  const callCentarScore = callCentar
    ? clampScore((callCentar.agenti.length / CALL_CENTAR_AGENATA) * 100)
    : 0;

  // Proksi: score na osnovu aktivnih signala vs ukupnih
  const svihSignala = proksiSignali.length;
  const aktivnihSignala = safeCallSync('proksi', degradedSources, () => getAktivniSignali().length) ?? 0;
  const proksiScore = svihSignala > 0 ? clampScore((aktivnihSignala / svihSignala) * 100) : 0;

  const gejmingScore = gejmingResult != null
    ? clampScore(gejmingResult.pregled.prosecnaOptimizacija)
    : 0;

  // ── Globalni score ────────────────────────────────────────────────────────

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const ukupanScore = clampScore(
    analizaScore * EKTOND_WEIGHTS.analiza
    + potencijalScore * EKTOND_WEIGHTS.potencijal
    + worldBankScore * EKTOND_WEIGHTS.worldBank
    + callCentarScore * EKTOND_WEIGHTS.callCentar
    + proksiScore * EKTOND_WEIGHTS.proksi
    + gejmingScore * EKTOND_WEIGHTS.gejming,
  );

  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  // ── Per-domain velocity i akceleracija ────────────────────────────────────

  function domainVelocity(current: number, key: keyof EktondSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof EktondSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const analizaVelocity = domainVelocity(analizaScore, 'analiza');
  const potencijalVelocity = domainVelocity(potencijalScore, 'potencijal');
  const worldBankVelocity = domainVelocity(worldBankScore, 'worldBank');
  const callCentarVelocity = domainVelocity(callCentarScore, 'callCentar');
  const proksiVelocity = domainVelocity(proksiScore, 'proksi');
  const gejmingVelocity = domainVelocity(gejmingScore, 'gejming');

  // ── Domeni ────────────────────────────────────────────────────────────────

  const domeni = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      confidence: computeConfidence(analizaScore, analiza !== null, analiza?.meta.degraded ?? false),
      tezina: EKTOND_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * EKTOND_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: freshnessFromSourceState(analiza !== null, analiza?.meta.degraded ?? false),
      trendDirection: velocityToTrendDirection(analizaVelocity, domainPrevVelocity('analiza')),
      velocity: analizaVelocity,
      momentum: momentumFromVelocity(analizaVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.analiza,
    } satisfies EktondDomenSignal,
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      confidence: computeConfidence(potencijalScore, potencijal !== null, false),
      tezina: EKTOND_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * EKTOND_WEIGHTS.potencijal),
      sourceOfTruth: '/api/potencijal-svega-ovoga-do-sada',
      freshness: freshnessFromSourceState(potencijal !== null, false),
      trendDirection: velocityToTrendDirection(potencijalVelocity, domainPrevVelocity('potencijal')),
      velocity: potencijalVelocity,
      momentum: momentumFromVelocity(potencijalVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.potencijal,
    } satisfies EktondDomenSignal,
    worldBank: {
      naziv: 'AI IQ World Bank',
      score: worldBankScore,
      confidence: computeConfidence(worldBankScore, worldBank !== null, false),
      tezina: EKTOND_WEIGHTS.worldBank,
      doprinos: clampScore(worldBankScore * EKTOND_WEIGHTS.worldBank),
      sourceOfTruth: '/api/ai-iq-world-bank',
      freshness: freshnessFromSourceState(worldBank !== null, false),
      trendDirection: velocityToTrendDirection(worldBankVelocity, domainPrevVelocity('worldBank')),
      velocity: worldBankVelocity,
      momentum: momentumFromVelocity(worldBankVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.worldBank,
    } satisfies EktondDomenSignal,
    callCentar: {
      naziv: 'Call Centar',
      score: callCentarScore,
      confidence: computeConfidence(callCentarScore, callCentar !== null, false),
      tezina: EKTOND_WEIGHTS.callCentar,
      doprinos: clampScore(callCentarScore * EKTOND_WEIGHTS.callCentar),
      sourceOfTruth: '/api/call-centar',
      freshness: freshnessFromSourceState(callCentar !== null, false),
      trendDirection: velocityToTrendDirection(callCentarVelocity, domainPrevVelocity('callCentar')),
      velocity: callCentarVelocity,
      momentum: momentumFromVelocity(callCentarVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.callCentar,
    } satisfies EktondDomenSignal,
    proksi: {
      naziv: 'Proksi Mreža',
      score: proksiScore,
      confidence: computeConfidence(proksiScore, svihSignala > 0, false),
      tezina: EKTOND_WEIGHTS.proksi,
      doprinos: clampScore(proksiScore * EKTOND_WEIGHTS.proksi),
      sourceOfTruth: '/api/proksi',
      freshness: freshnessFromSourceState(svihSignala > 0, false),
      trendDirection: velocityToTrendDirection(proksiVelocity, domainPrevVelocity('proksi')),
      velocity: proksiVelocity,
      momentum: momentumFromVelocity(proksiVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.proksi,
    } satisfies EktondDomenSignal,
    gejming: {
      naziv: 'Gejming Industrija',
      score: gejmingScore,
      confidence: computeConfidence(gejmingScore, gejmingResult !== null, false),
      tezina: EKTOND_WEIGHTS.gejming,
      doprinos: clampScore(gejmingScore * EKTOND_WEIGHTS.gejming),
      sourceOfTruth: '/api/gejming-industrija',
      freshness: freshnessFromSourceState(gejmingResult !== null, false),
      trendDirection: velocityToTrendDirection(gejmingVelocity, domainPrevVelocity('gejming')),
      velocity: gejmingVelocity,
      momentum: momentumFromVelocity(gejmingVelocity),
      slaThreshold: EKTOND_SLA_THRESHOLDS.gejming,
    } satisfies EktondDomenSignal,
  };

  // ── Kritični domeni i preporuke ───────────────────────────────────────────

  const kriticniDomeni = (Object.values(domeni) as EktondDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as EktondDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish momentum detektovan u: ${bearishDomeni.join(', ')} — pratiti trend.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi domeni iznad SLA praga, bullish ili neutralan momentum — EKTOND stabilno.');
  }

  // ── Snapshot ─────────────────────────────────────────────────────────────

  addEktondSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      analiza: analizaScore,
      potencijal: potencijalScore,
      worldBank: worldBankScore,
      callCentar: callCentarScore,
      proksi: proksiScore,
      gejming: gejmingScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'EKTOND — Digitalna Industrija',
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
      contractVersion: EKTOND_CONTRACT_VERSION,
      modelVersion: EKTOND_MODEL_VERSION,
      sourceOfTruth: EKTOND_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: EKTOND_WEIGHTS,
      slaThresholds: EKTOND_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
