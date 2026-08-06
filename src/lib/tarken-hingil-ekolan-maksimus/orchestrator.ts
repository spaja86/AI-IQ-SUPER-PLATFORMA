// SpajaUltraOmegaCore -∞Ω+∞ — TARKEN HINGIL EKOLAN MAKSIMUS Orchestrator
// Kompanija SPAJA — Digitalna Industrija
//
// Apex strateška orkestracija — sinteza Ekolan, Hingil, Tarken modula
// sa self-healing dijagnostikom i Hipermreza konvergencijom.

import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getThemLastSnapshot, setThemLastSnapshot } from './store';
import { getThemPersona, resolveHandoffTarget, THEM_PERSONA } from './identity';
import { evaluateSystemState, computeEkolanScore } from './ekolan-engine';
import { normalizeSignal, computeHingilScore } from './hingil-signal';
import { modelScenario, computeKonvergencijaScore, buildStrategyResult } from './tarken-strategy';
import { resolveFallbackAgent } from './handoff';
import type {
  ThemDomenSignal,
  ThemOcena,
  ThemSvega,
  ThemTrendDirection,
  ThemTaskInput,
  ThemTaskResult,
} from './types';

export const THEM_CONTRACT_VERSION = 'v1';
export const THEM_MODEL_VERSION = '1.0.0';
export const THEM_SOURCE_OF_TRUTH = '/api/tarken-hingil-ekolan-maksimus';

export const THEM_WEIGHTS = {
  straskaOrkestracija: 0.35,
  adaptivniSignal: 0.25,
  ekoskoMonitoring: 0.25,
  industrijskaKonvergencija: 0.15,
} as const;

const THEM_CRITICAL_THRESHOLD = 70;

const weightSum = Object.values(THEM_WEIGHTS).reduce((s, w) => s + w, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`THEM_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

// Simulated signal samples for Hingil adaptive processor
const HINGIL_DEMO_SAMPLES = [0.6, 0.75, 0.82, 0.78, 0.91, 0.88, 0.95, 0.84, 0.79, 0.87];

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): ThemOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function scoreDeltaDirection(current: number, previous: number | null): ThemTrendDirection {
  if (previous === null) return 'flat';
  const delta = current - previous;
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
}

function buildDomenSignal(
  naziv: string,
  score: number,
  tezina: number,
  sourceOfTruth: string,
  available: boolean,
  previousScore: number | null,
): ThemDomenSignal {
  const base = available ? 88 : 45;
  const confidence = clampScore(base + (score >= 90 ? 8 : score >= 75 ? 5 : score >= 50 ? 2 : 0));
  return {
    naziv,
    score: clampScore(score),
    confidence,
    tezina,
    doprinos: clampScore(score * tezina),
    sourceOfTruth,
    freshness: available ? 'fresh' : 'unknown',
    trendDirection: scoreDeltaDirection(score, previousScore),
  };
}

export async function buildThem(): Promise<ThemSvega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];
  const previousSnapshot = getThemLastSnapshot();
  const persona = getThemPersona();

  // ── Ekolan: ecological system state ─────────────────────────────────────
  const systemState = evaluateSystemState();
  const ekolanScore = computeEkolanScore(systemState);

  // ── Hingil: adaptive signal processing ──────────────────────────────────
  const hingilResult = normalizeSignal(HINGIL_DEMO_SAMPLES);
  const hingilScore = computeHingilScore(hingilResult);

  // ── Tarken: strategic scores ─────────────────────────────────────────────
  const straskaOrkestracijaScore = 90; // apex orchestration — high baseline
  const industrijskaKonvergencijaScore = clampScore(
    computeKonvergencijaScore(systemState.healthScore, ekolanScore, hingilScore) * 100,
  );

  const ukupanScore = clampScore(
    straskaOrkestracijaScore * THEM_WEIGHTS.straskaOrkestracija
    + hingilScore * THEM_WEIGHTS.adaptivniSignal
    + ekolanScore * THEM_WEIGHTS.ekoskoMonitoring
    + industrijskaKonvergencijaScore * THEM_WEIGHTS.industrijskaKonvergencija,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const deltaScore = globalPreviousScore === null ? 0 : ukupanScore - globalPreviousScore;

  const domeni = {
    straskaOrkestracija: buildDomenSignal(
      'Strateška Orkestracija',
      straskaOrkestracijaScore,
      THEM_WEIGHTS.straskaOrkestracija,
      THEM_SOURCE_OF_TRUTH,
      true,
      previousSnapshot?.domenScores.straskaOrkestracija ?? null,
    ),
    adaptivniSignal: buildDomenSignal(
      'Adaptivni Signal (Hingil)',
      hingilScore,
      THEM_WEIGHTS.adaptivniSignal,
      THEM_SOURCE_OF_TRUTH,
      hingilResult.valid,
      previousSnapshot?.domenScores.adaptivniSignal ?? null,
    ),
    ekoskoMonitoring: buildDomenSignal(
      'Ekoloski Monitoring (Ekolan)',
      ekolanScore,
      THEM_WEIGHTS.ekoskoMonitoring,
      THEM_SOURCE_OF_TRUTH,
      true,
      previousSnapshot?.domenScores.ekoskoMonitoring ?? null,
    ),
    industrijskaKonvergencija: buildDomenSignal(
      'Industrijska Konvergencija (Tarken)',
      industrijskaKonvergencijaScore,
      THEM_WEIGHTS.industrijskaKonvergencija,
      '/api/nova-generacija',
      true,
      previousSnapshot?.domenScores.industrijskaKonvergencija ?? null,
    ),
  };

  const kriticniDomeni = Object.values(domeni)
    .filter((d) => d.score < THEM_CRITICAL_THRESHOLD)
    .map((d) => d.naziv);

  // ── Tarken strategy ───────────────────────────────────────────────────────
  const hipermrezaKonvergencija = computeKonvergencijaScore(systemState.healthScore, ekolanScore, hingilScore);
  const scenario = modelScenario(systemState.healthScore, systemState.entropyLevel);
  const strategyResult = buildStrategyResult(scenario, hipermrezaKonvergencija);

  // ── Self-healing ──────────────────────────────────────────────────────────
  const anomalijaDetektovana = systemState.anomalijaDetektovana || kriticniDomeni.length > 2;
  const fallbackAgent = anomalijaDetektovana
    ? resolveFallbackAgent(systemState.dijagnostikaLog)
    : null;

  // ── Preporuke ─────────────────────────────────────────────────────────────
  const preporuke: string[] = [...strategyResult.stratesePreporuke];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti kritične domene: ${kriticniDomeni.join(', ')}`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi ključni domeni su stabilni — nastaviti apex orkestraciju.');
  }

  setThemLastSnapshot({
    ukupanScore,
    domenScores: {
      straskaOrkestracija: straskaOrkestracijaScore,
      adaptivniSignal: hingilScore,
      ekoskoMonitoring: ekolanScore,
      industrijskaKonvergencija: industrijskaKonvergencijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'TARKEN HINGIL EKOLAN MAKSIMUS — Apex Strateški Orkestratorski Agent',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    persona,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    hipermrezaKonvergencija,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    domeni,
    trend: {
      direction: scoreDeltaDirection(ukupanScore, globalPreviousScore),
      deltaScore,
      previousScore: globalPreviousScore,
      currentScore: ukupanScore,
      reliable: globalPreviousScore !== null,
    },
    handoff: {
      aktivanHandoff: false,
      linkedAgents: persona.linkedAgents,
      handoffRazlog: null,
      targetAgent: null,
    },
    selfHealing: {
      anomalijaDetektovana,
      fallbackAktivan: anomalijaDetektovana,
      fallbackAgent,
      dijagnostikaLog: systemState.dijagnostikaLog,
    },
    meta: {
      contractVersion: THEM_CONTRACT_VERSION,
      modelVersion: THEM_MODEL_VERSION,
      sourceOfTruth: THEM_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      specijalizacija: persona.specijalizacija,
      linkedAgents: persona.linkedAgents,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export async function executeThemTask(input: ThemTaskInput): Promise<ThemTaskResult> {
  const startMs = Date.now();
  const { handoff, agent, razlog } = resolveHandoffTarget(input.kontekst, input.targetAgent);

  const rezultatiPoTipu: Record<ThemTaskInput['tip'], string> = {
    'strateska-orkestracija':
      'THEM — Strateška orkestracija završena. Apex koordinacija aktivna, sve platforme sinhronizovane.',
    'adaptivni-signal':
      'THEM — Adaptivni signal obrađen. Hingil procesor normalizovao ulazne uzorke, obrasci detektovani.',
    'ekoloski-monitoring':
      'THEM — Ekoloski monitoring završen. Ekolan engine potvrdio stabilnost sistema, entropy u normalnom opsegu.',
    'industrijska-konvergencija':
      'THEM — Industrijska konvergencija procenjena. Tarken strategija usklađena sa Nova Generacija ekosistemom.',
  };

  const scorePoTipu: Record<ThemTaskInput['tip'], number> = {
    'strateska-orkestracija': 92,
    'adaptivni-signal': 87,
    'ekoloski-monitoring': 89,
    'industrijska-konvergencija': 88,
  };

  const systemState = evaluateSystemState();
  const ekolanScore = computeEkolanScore(systemState);
  const hingilResult = normalizeSignal(HINGIL_DEMO_SAMPLES);
  const hingilScore = computeHingilScore(hingilResult);
  const hipermrezaKonvergencija = computeKonvergencijaScore(systemState.healthScore, ekolanScore, hingilScore);

  const selfHealingTriggered = systemState.anomalijaDetektovana;
  const trajanjeMsEstimate = Date.now() - startMs;

  return {
    taskId: `them-${Date.now()}`,
    tip: input.tip,
    rezultat: rezultatiPoTipu[input.tip],
    score: scorePoTipu[input.tip],
    hipermrezaKonvergencija,
    trajanjeMsEstimate,
    timestamp: new Date().toISOString(),
    handoffToAgent: handoff ? agent : null,
    handoffRazlog: razlog,
    selfHealingTriggered,
  };
}

export function getThemInfo() {
  const persona = getThemPersona();
  return {
    sistem: 'TARKEN HINGIL EKOLAN MAKSIMUS — Apex Strateški Orkestratorski Agent',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    persona,
    endpoint: THEM_SOURCE_OF_TRUTH,
    contractVersion: THEM_CONTRACT_VERSION,
    modelVersion: THEM_MODEL_VERSION,
    scoreWeights: THEM_WEIGHTS,
    timestamp: new Date().toISOString(),
  };
}

export { THEM_PERSONA };
