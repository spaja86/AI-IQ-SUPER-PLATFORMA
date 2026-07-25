// SpajaUltraOmegaCore -∞Ω+∞ — EKSTRIMLI EKSTREM
// Kompanija SPAJA — Digitalna Industrija
//
// V4 apsolutni master signal — MOŽE SVE:
//   - Analiza Svega
//   - Potencijal Svega Ovoga Do Sada
//   - Procesuiranje 3
//   - Autofinish Svega (orkestracija)
//   - Ekstremno Procesuiranje Svega
//   - Operativna Spremnost
//   - SpajaPro Engine (6-15)
//   - Gejming Industrija
//   - Proksi Mreža
//   - OMEGA AI (21 persona, 8 oktava)

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranje3 } from './procesuiranje-3';
import { buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { spajaProVerzije } from './spaja-pro';
import { buildGejmingIndustrija } from './gejming-industrija';
import { proksiSignali, proksiCvorovi } from './proksi';
import { omegaPersone } from './omega-ai';
import {
  addEktrimliEkstremSnapshot,
  getEktrimliEkstremLastSnapshot,
  getEktrimliEkstremSnapshots,
} from './ekstrimli-ekstrem-store';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, OMEGA_AI_OKTAVA_COUNT, OMEGA_AI_PERSONA_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const EKSTRIMLI_EKSTREM_CONTRACT_VERSION = 'v4';
export const EKSTRIMLI_EKSTREM_MODEL_VERSION = '4.0.0';
export const EKSTRIMLI_EKSTREM_SOURCE_OF_TRUTH = '/api/ekstrimli-ekstrem';

// Težine moraju biti normalizovane na 1.0
export const EKSTRIMLI_EKSTREM_WEIGHTS = {
  analiza: 0.15,
  potencijal: 0.12,
  procesuiranje: 0.12,
  orkestracija: 0.08,
  ekstremnoProcesuiranje: 0.12,
  operativnaSpremnost: 0.12,
  spajaPro: 0.10,
  gejmingIndustrija: 0.07,
  proksi: 0.07,
  omegaAI: 0.05,
} as const;

export const EKSTRIMLI_EKSTREM_SLA_THRESHOLDS = {
  analiza: 75,
  potencijal: 75,
  procesuiranje: 75,
  orkestracija: 60,
  ekstremnoProcesuiranje: 75,
  operativnaSpremnost: 80,
  spajaPro: 50,
  gejmingIndustrija: 50,
  proksi: 70,
  omegaAI: 70,
} as const;

const EKSTRIMLI_EKSTREM_EXPECTED_AUTOFINISH_STAGES = 9;

const weightSum = Object.values(EKSTRIMLI_EKSTREM_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`EKSTRIMLI_EKSTREM_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

const EKSTRIMLI_EKSTREM_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type EktrimliEkstremOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type EktrimliEkstremTrendDirection = 'up' | 'down' | 'flat';

export interface EktrimliEkstremDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: EktrimliEkstremTrendDirection;
  slaThreshold: number;
}

export interface EktrimliEkstremHistoryEntry {
  score: number;
  timestamp: string;
}

export interface EktrimliEkstremTrend {
  direction: EktrimliEkstremTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface EktrimliEkstremMeta {
  contractVersion: typeof EKSTRIMLI_EKSTREM_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof EKSTRIMLI_EKSTREM_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof EKSTRIMLI_EKSTREM_WEIGHTS;
  slaThresholds: typeof EKSTRIMLI_EKSTREM_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface EktrimliEkstremRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  konacnaOcena: EktrimliEkstremOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  domeni: {
    analiza: EktrimliEkstremDomenSignal;
    potencijal: EktrimliEkstremDomenSignal;
    procesuiranje: EktrimliEkstremDomenSignal;
    orkestracija: EktrimliEkstremDomenSignal;
    ekstremnoProcesuiranje: EktrimliEkstremDomenSignal;
    operativnaSpremnost: EktrimliEkstremDomenSignal;
    spajaPro: EktrimliEkstremDomenSignal;
    gejmingIndustrija: EktrimliEkstremDomenSignal;
    proksi: EktrimliEkstremDomenSignal;
    omegaAI: EktrimliEkstremDomenSignal;
  };
  trend: EktrimliEkstremTrend;
  history: EktrimliEkstremHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
    omegaPersona: number;
    omegaOktava: number;
  };
  meta: EktrimliEkstremMeta;
  timestamp: string;
}

// ─── Interne pomoćne funkcije ─────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): EktrimliEkstremOcena {
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
    ? EKSTRIMLI_EKSTREM_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? EKSTRIMLI_EKSTREM_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? EKSTRIMLI_EKSTREM_CONFIDENCE_VARIANCE.delimicno
        : EKSTRIMLI_EKSTREM_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function scoreDeltaDirection(current: number, previous: number | null): EktrimliEkstremTrendDirection {
  if (previous === null) return 'flat';
  const delta = current - previous;
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
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
    console.error(`[ekstrimli-ekstrem] source failure: ${sourceName}`, error);
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
    console.error(`[ekstrimli-ekstrem] source failure: ${sourceName}`, error);
    return null;
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Gradi EKSTRIMLI EKSTREM — V4 apsolutni master signal svih 10 domena.
 * Politika: continue-on-error — greška jednog izvora ne blokira ostale.
 */
export async function buildEktrimliEkstrem(): Promise<EktrimliEkstremRezultat> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  // ── Pokretanje svih izvora paralelno gde je moguće ────────────────────────
  const analizaPromise = safeCallAsync('analiza-svega', degradedSources, () => buildAnalizaSvega());
  const potencijal = safeCallSync('potencijal-svega-ovoga-do-sada', degradedSources, () => buildPotencijalSvegaOvogaDoSada());
  const procesuiranje = safeCallSync('procesuiranje-3', degradedSources, () => buildProcesuiranje3());
  const autofinishInfo = safeCallSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo());
  const ekstremnoProcesuiranje = safeCallSync('ekstremno-procesuiranje-svega', degradedSources, () => buildEkstremnoProcesuiranjeSvega());
  const operativnaSpremnost = safeCallSync('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const gejmingResult = safeCallSync('gejming-industrija', degradedSources, () => buildGejmingIndustrija('ekstrimli-ekstrem'));

  const analiza = await analizaPromise;

  // ── Snimak istorije pre upisivanja novog ──────────────────────────────────
  const historyBefore = getEktrimliEkstremSnapshots().map((s) => ({ score: s.ukupanScore, timestamp: s.timestamp }));
  const previousSnapshot = getEktrimliEkstremLastSnapshot();

  // ── Računanje domain score-ova ────────────────────────────────────────────

  const analizaScore = analiza?.ukupanScore ?? 0;
  const potencijalScore = potencijal?.ukupniPotencijal ?? 0;
  const procesuiranjeScore = procesuiranje?.ukupanScore ?? 0;
  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / EKSTRIMLI_EKSTREM_EXPECTED_AUTOFINISH_STAGES) * 100)
    : 0;
  const ekstremnoProcesuiranjeScore = ekstremnoProcesuiranje?.ukupanProcenat ?? 0;
  const operativnaSpremnostScore = operativnaSpremnost?.spremnost?.ukupanScore ?? 0;

  const spajaProTotal = spajaProVerzije.length;
  const spajaProActiveAndBeta = spajaProVerzije.filter((v) => v.status === 'aktivna' || v.status === 'beta').length;
  const spajaProScore = spajaProTotal > 0 ? clampScore((spajaProActiveAndBeta / spajaProTotal) * 100) : 0;

  const gejmingScore = gejmingResult != null
    ? clampScore(gejmingResult.pregled.prosecnaOptimizacija)
    : 0;

  // Proksi score: procenat aktivnih signala
  const proksiUkupno = proksiSignali.length + proksiCvorovi.length;
  const proksiAktivnih = proksiSignali.filter((s) => s.status === 'aktivan').length
    + proksiCvorovi.length; // čvorovi uvek aktivni
  const proksiScore = proksiUkupno > 0 ? clampScore((proksiAktivnih / proksiUkupno) * 100) : 0;

  // OMEGA AI score: procenat aktivnih persona
  const omegaUkupno = omegaPersone.length;
  const omegaAktivnih = omegaPersone.filter((p) => p.aktivna).length;
  const omegaAIScore = omegaUkupno > 0 ? clampScore((omegaAktivnih / omegaUkupno) * 100) : 0;

  // ── Globalni score ────────────────────────────────────────────────────────

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const ukupanScore = clampScore(
    analizaScore * EKSTRIMLI_EKSTREM_WEIGHTS.analiza
      + potencijalScore * EKSTRIMLI_EKSTREM_WEIGHTS.potencijal
      + procesuiranjeScore * EKSTRIMLI_EKSTREM_WEIGHTS.procesuiranje
      + orkestracijaScore * EKSTRIMLI_EKSTREM_WEIGHTS.orkestracija
      + ekstremnoProcesuiranjeScore * EKSTRIMLI_EKSTREM_WEIGHTS.ekstremnoProcesuiranje
      + operativnaSpremnostScore * EKSTRIMLI_EKSTREM_WEIGHTS.operativnaSpremnost
      + spajaProScore * EKSTRIMLI_EKSTREM_WEIGHTS.spajaPro
      + gejmingScore * EKSTRIMLI_EKSTREM_WEIGHTS.gejmingIndustrija
      + proksiScore * EKSTRIMLI_EKSTREM_WEIGHTS.proksi
      + omegaAIScore * EKSTRIMLI_EKSTREM_WEIGHTS.omegaAI,
  );

  const deltaScore = globalPreviousScore === null ? 0 : ukupanScore - globalPreviousScore;
  const trendDirection = scoreDeltaDirection(ukupanScore, globalPreviousScore);

  // ── Domeni ────────────────────────────────────────────────────────────────

  const domeni = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      confidence: computeConfidence(analizaScore, analiza !== null, analiza?.meta.degraded ?? false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * EKSTRIMLI_EKSTREM_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: freshnessFromSourceState(analiza !== null, analiza?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(analizaScore, previousSnapshot?.domenScores.analiza ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.analiza,
    } satisfies EktrimliEkstremDomenSignal,
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      confidence: computeConfidence(potencijalScore, potencijal !== null, potencijal?.meta.degraded ?? false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * EKSTRIMLI_EKSTREM_WEIGHTS.potencijal),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness: freshnessFromSourceState(potencijal !== null, potencijal?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(potencijalScore, previousSnapshot?.domenScores.potencijal ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.potencijal,
    } satisfies EktrimliEkstremDomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje 3',
      score: procesuiranjeScore,
      confidence: computeConfidence(procesuiranjeScore, procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * EKSTRIMLI_EKSTREM_WEIGHTS.procesuiranje),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-3',
      freshness: freshnessFromSourceState(procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(procesuiranjeScore, previousSnapshot?.domenScores.procesuiranje ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.procesuiranje,
    } satisfies EktrimliEkstremDomenSignal,
    orkestracija: {
      naziv: 'Autofinish Svega',
      score: orkestracijaScore,
      confidence: computeConfidence(orkestracijaScore, autofinishInfo !== null, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * EKSTRIMLI_EKSTREM_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: freshnessFromSourceState(autofinishInfo !== null, false),
      trendDirection: scoreDeltaDirection(orkestracijaScore, previousSnapshot?.domenScores.orkestracija ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.orkestracija,
    } satisfies EktrimliEkstremDomenSignal,
    ekstremnoProcesuiranje: {
      naziv: 'Ekstremno Procesuiranje Svega',
      score: ekstremnoProcesuiranjeScore,
      confidence: computeConfidence(ekstremnoProcesuiranjeScore, ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.ekstremnoProcesuiranje,
      doprinos: clampScore(ekstremnoProcesuiranjeScore * EKSTRIMLI_EKSTREM_WEIGHTS.ekstremnoProcesuiranje),
      sourceOfTruth: ekstremnoProcesuiranje?.meta.sourceOfTruth ?? '/api/ekstremno-procesuiranje-svega',
      freshness: freshnessFromSourceState(ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(ekstremnoProcesuiranjeScore, previousSnapshot?.domenScores.ekstremnoProcesuiranje ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.ekstremnoProcesuiranje,
    } satisfies EktrimliEkstremDomenSignal,
    operativnaSpremnost: {
      naziv: 'Operativna Spremnost',
      score: operativnaSpremnostScore,
      confidence: computeConfidence(operativnaSpremnostScore, operativnaSpremnost !== null, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.operativnaSpremnost,
      doprinos: clampScore(operativnaSpremnostScore * EKSTRIMLI_EKSTREM_WEIGHTS.operativnaSpremnost),
      sourceOfTruth: '/api/status',
      freshness: freshnessFromSourceState(operativnaSpremnost !== null, false),
      trendDirection: scoreDeltaDirection(operativnaSpremnostScore, previousSnapshot?.domenScores.operativnaSpremnost ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.operativnaSpremnost,
    } satisfies EktrimliEkstremDomenSignal,
    spajaPro: {
      naziv: 'SpajaPro Engine (6-15)',
      score: spajaProScore,
      confidence: computeConfidence(spajaProScore, true, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.spajaPro,
      doprinos: clampScore(spajaProScore * EKSTRIMLI_EKSTREM_WEIGHTS.spajaPro),
      sourceOfTruth: '/api/spaja-pro',
      freshness: 'fresh',
      trendDirection: scoreDeltaDirection(spajaProScore, previousSnapshot?.domenScores.spajaPro ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.spajaPro,
    } satisfies EktrimliEkstremDomenSignal,
    gejmingIndustrija: {
      naziv: 'Gejming Industrija',
      score: gejmingScore,
      confidence: computeConfidence(gejmingScore, gejmingResult !== null, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.gejmingIndustrija,
      doprinos: clampScore(gejmingScore * EKSTRIMLI_EKSTREM_WEIGHTS.gejmingIndustrija),
      sourceOfTruth: '/api/gejming-industrija',
      freshness: freshnessFromSourceState(gejmingResult !== null, false),
      trendDirection: scoreDeltaDirection(gejmingScore, previousSnapshot?.domenScores.gejmingIndustrija ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.gejmingIndustrija,
    } satisfies EktrimliEkstremDomenSignal,
    proksi: {
      naziv: 'Proksi Mreža',
      score: proksiScore,
      confidence: computeConfidence(proksiScore, true, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.proksi,
      doprinos: clampScore(proksiScore * EKSTRIMLI_EKSTREM_WEIGHTS.proksi),
      sourceOfTruth: '/proksi',
      freshness: 'fresh',
      trendDirection: scoreDeltaDirection(proksiScore, previousSnapshot?.domenScores.proksi ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.proksi,
    } satisfies EktrimliEkstremDomenSignal,
    omegaAI: {
      naziv: `OMEGA AI (${OMEGA_AI_PERSONA_COUNT} persona, ${OMEGA_AI_OKTAVA_COUNT} oktava)`,
      score: omegaAIScore,
      confidence: computeConfidence(omegaAIScore, true, false),
      tezina: EKSTRIMLI_EKSTREM_WEIGHTS.omegaAI,
      doprinos: clampScore(omegaAIScore * EKSTRIMLI_EKSTREM_WEIGHTS.omegaAI),
      sourceOfTruth: '/api/omega-ai',
      freshness: 'fresh',
      trendDirection: scoreDeltaDirection(omegaAIScore, previousSnapshot?.domenScores.omegaAI ?? null),
      slaThreshold: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS.omegaAI,
    } satisfies EktrimliEkstremDomenSignal,
  };

  // ── Kritični domeni i preporuke ───────────────────────────────────────────

  const kriticniDomeni = (Object.values(domeni) as EktrimliEkstremDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi domeni su iznad SLA praga — EKSTRIMLI EKSTREM: MOŽE SVE. Nastaviti monitoring.');
  }

  // ── Snapshot ─────────────────────────────────────────────────────────────

  addEktrimliEkstremSnapshot({
    ukupanScore,
    domenScores: {
      analiza: analizaScore,
      potencijal: potencijalScore,
      procesuiranje: procesuiranjeScore,
      orkestracija: orkestracijaScore,
      ekstremnoProcesuiranje: ekstremnoProcesuiranjeScore,
      operativnaSpremnost: operativnaSpremnostScore,
      spajaPro: spajaProScore,
      gejmingIndustrija: gejmingScore,
      proksi: proksiScore,
      omegaAI: omegaAIScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'EKSTRIMLI EKSTREM — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    domeni,
    trend: {
      direction: trendDirection,
      deltaScore,
      previousScore: globalPreviousScore,
      currentScore: ukupanScore,
      reliable: globalPreviousScore !== null,
    },
    history: historyBefore,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      omegaPersona: OMEGA_AI_PERSONA_COUNT,
      omegaOktava: OMEGA_AI_OKTAVA_COUNT,
    },
    meta: {
      contractVersion: EKSTRIMLI_EKSTREM_CONTRACT_VERSION,
      modelVersion: EKSTRIMLI_EKSTREM_MODEL_VERSION,
      sourceOfTruth: EKSTRIMLI_EKSTREM_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: EKSTRIMLI_EKSTREM_WEIGHTS,
      slaThresholds: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

/**
 * Vraća metapodatke o EKSTRIMLI EKSTREM sistemu bez pokretanja pipeline-ova.
 */
export function getEktrimliEkstremInfo() {
  return {
    sistem: 'EKSTRIMLI EKSTREM — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: EKSTRIMLI_EKSTREM_SOURCE_OF_TRUTH,
    contractVersion: EKSTRIMLI_EKSTREM_CONTRACT_VERSION,
    modelVersion: EKSTRIMLI_EKSTREM_MODEL_VERSION,
    scoreWeights: EKSTRIMLI_EKSTREM_WEIGHTS,
    slaThresholds: EKSTRIMLI_EKSTREM_SLA_THRESHOLDS,
    domeni: Object.keys(EKSTRIMLI_EKSTREM_WEIGHTS),
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      omegaPersona: OMEGA_AI_PERSONA_COUNT,
      omegaOktava: OMEGA_AI_OKTAVA_COUNT,
    },
    timestamp: new Date().toISOString(),
  };
}
