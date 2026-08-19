// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Engine
// Kompanija SPAJA — Digitalna Industrija

import {
  buildEkselencioRecommendation,
  buildPillarBreakdown,
  computeEkselencioTier,
  geometricMeanTop4,
} from './ekuare-engine';
import { computeEvolutionSignal } from './evolution-signal';
import type {
  EkselencioHealthReport,
  EkselencioInput,
  EkselencioResult,
  EkselencioTier,
  EkuarePillar,
} from './types';
import {
  EKSELENCIO_API_RESPONSE_MAX_MS,
  EKSELENCIO_CONTRACT_VERSION,
  EKSELENCIO_DISCLAIMER,
  EKSELENCIO_MAX_EKUARE_SCORE,
  EKSELENCIO_MODULE_VERSION,
  EKSELENCIO_PERFORMANCE_MAX_MS,
  EKSELENCIO_PERSONA_ID,
} from './types';

// ─── In-memory metrics ────────────────────────────────────────────────────────

let evaluations = 0;
let lastTier: EkselencioTier = 'GENESIS';

// ─── Invalid result helper ────────────────────────────────────────────────────

function invalidResult(agentId: string, start: number): EkselencioResult {
  return {
    agentId,
    ekuareRaScore: 0,
    tier: 'GENESIS',
    pillars: [],
    blindSpots: [],
    evolutionSignal: 0,
    recommendation: '',
    disclaimer: EKSELENCIO_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function evaluateEkselencio(input: EkselencioInput): EkselencioResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult('n/a', start);
  }

  if (!input.agentId || typeof input.agentId !== 'string' || input.agentId.trim() === '') {
    return invalidResult('n/a', start);
  }

  const domainScores = input.domainScores ?? {};
  const pillars = buildPillarBreakdown(domainScores);
  const scores = pillars.map((p) => p.score);

  const rawEkuare = geometricMeanTop4(scores) * 10;
  const ekuareRaScore = Math.min(
    EKSELENCIO_MAX_EKUARE_SCORE,
    Math.round(rawEkuare * 100) / 100,
  );

  const tier = computeEkselencioTier(ekuareRaScore);
  const blindSpots = pillars.filter((p) => p.isBlindSpot).map((p) => p.pillar as EkuarePillar);
  const evolutionSignal = computeEvolutionSignal(input.historyVector);
  const recommendation = buildEkselencioRecommendation(tier, blindSpots);

  evaluations += 1;
  lastTier = tier;

  return {
    agentId: input.agentId,
    ekuareRaScore,
    tier,
    pillars,
    blindSpots,
    evolutionSignal,
    recommendation,
    disclaimer: EKSELENCIO_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getEkselencioHealthReport(): EkselencioHealthReport {
  return {
    personaId: EKSELENCIO_PERSONA_ID,
    contractVersion: EKSELENCIO_CONTRACT_VERSION,
    moduleVersion: EKSELENCIO_MODULE_VERSION,
    evaluations,
    lastTier,
    performanceMaxMs: EKSELENCIO_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EKSELENCIO_API_RESPONSE_MAX_MS,
  };
}

export function _resetEkselencioMetrics(): void {
  evaluations = 0;
  lastTier = 'GENESIS';
}
