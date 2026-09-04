// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Engine (Orchestrator)
// Kompanija SPAJA — Digitalna Industrija

import type {
  AudienceSegment,
  BroadcastTarget,
  RadicalLevel,
  ReklamitiнHealthReport,
  ReklamitiнRequest,
  ReklamitiнResult,
} from './types';
import {
  REKLAMITIN_API_RESPONSE_MAX_MS,
  REKLAMITIN_BROADCAST_DISPATCH_MAX_MS,
  REKLAMITIN_CONTRACT_VERSION,
  REKLAMITIN_DISCLAIMER,
  REKLAMITIN_DISPLAY_NAME,
  REKLAMITIN_HIPERMREZA_NODE,
  REKLAMITIN_LINKED_REPO_IMPACT,
  REKLAMITIN_MODULE_VERSION,
  REKLAMITIN_NOTE,
  REKLAMITIN_OCTAVE,
  REKLAMITIN_OKRID,
  REKLAMITIN_PERFORMANCE_MAX_MS,
  REKLAMITIN_PERSONA_ID,
  REKLAMITIN_SLUG,
} from './types';
import { LEVEL_CONFIGS, LEVEL_ORDER } from './registry';
import { broadcastAll, computeTotalReachScore, isValidTarget, SUPPORTED_TARGETS } from './broadcast-engine';
import { computeIntensityScore, isValidLevel, getLevelConfig } from './level-engine';
import { getAudienceMultiplier, isValidSegment, SUPPORTED_SEGMENTS } from './reach-engine';

let evaluations = 0;
let lastLevel: RadicalLevel | null = null;
let lastEvaluatedAt: string | null = null;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function invalidResult(
  referenceId: string | undefined,
  level: RadicalLevel,
  warning: string,
  start: number,
): ReklamitiнResult {
  return {
    referenceId: referenceId ?? 'n/a',
    adId: 'n/a',
    level,
    intensityScore: 0,
    reachMultiplier: 0,
    frequencyCapHz: 0,
    zeroCap: false,
    totalReachScore: 0,
    broadcastResults: [],
    audienceSegment: 'GENERAL',
    warnings: [warning],
    disclaimer: REKLAMITIN_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

export function evaluateReklamitin(req: ReklamitiнRequest): ReklamitiнResult {
  const start = performance.now();

  if (!req || typeof req !== 'object') {
    return invalidResult(undefined, 'STANDARD', 'request must be an object', start);
  }

  if (!isValidLevel(req.level)) {
    return invalidResult(
      req.referenceId,
      'STANDARD',
      `level must be one of: ${LEVEL_ORDER.join(', ')}`,
      start,
    );
  }

  if (!Array.isArray(req.broadcastTargets) || req.broadcastTargets.length === 0) {
    return invalidResult(req.referenceId, req.level, 'broadcastTargets must be a non-empty array', start);
  }

  const invalidTargets = req.broadcastTargets.filter((t) => !isValidTarget(t));
  if (invalidTargets.length > 0) {
    return invalidResult(
      req.referenceId,
      req.level,
      `unsupported broadcastTargets: ${invalidTargets.join(', ')}`,
      start,
    );
  }

  if (!isValidSegment(req.audienceSegment)) {
    return invalidResult(
      req.referenceId,
      req.level,
      `audienceSegment must be one of: ${SUPPORTED_SEGMENTS.join(', ')}`,
      start,
    );
  }

  if (typeof req.durationSeconds !== 'number' || !Number.isFinite(req.durationSeconds) || req.durationSeconds < 0) {
    return invalidResult(req.referenceId, req.level, 'durationSeconds must be a non-negative finite number', start);
  }

  if (typeof req.budgetScore !== 'number' || !Number.isFinite(req.budgetScore) || req.budgetScore < 0) {
    return invalidResult(req.referenceId, req.level, 'budgetScore must be a non-negative finite number', start);
  }

  const levelConfig = getLevelConfig(req.level);
  const audienceMultiplier = getAudienceMultiplier(req.audienceSegment);
  const intensityScore = computeIntensityScore(req.level, req.budgetScore, req.durationSeconds);
  const broadcastResults = broadcastAll(
    req.broadcastTargets as BroadcastTarget[],
    req.level,
    levelConfig.reachMultiplier,
    audienceMultiplier,
  );
  const totalReachScore = computeTotalReachScore(broadcastResults);

  const warnings: string[] = [];

  if (req.level === 'RADICAL') {
    warnings.push('RADICAL level activated: zero-cap frequency, maximum engagement, full cross-platform broadcast.');
  }

  if (intensityScore >= 950 && req.level !== 'RADICAL') {
    warnings.push('Intensity score near maximum; consider escalating to RADICAL level for full reach.');
  }

  if (req.durationSeconds > 300) {
    warnings.push('Ad duration exceeds 300 seconds; consider shorter format for higher engagement.');
  }

  if (req.budgetScore < 50) {
    warnings.push('Low budgetScore detected; broadcast reach may be limited.');
  }

  evaluations += 1;
  lastLevel = req.level;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: req.referenceId ?? 'n/a',
    adId: req.adId ?? `RKL-AUTO-${evaluations}`,
    level: req.level,
    intensityScore,
    reachMultiplier: levelConfig.reachMultiplier,
    frequencyCapHz: levelConfig.frequencyCapHz,
    zeroCap: levelConfig.zeroCap,
    totalReachScore,
    broadcastResults,
    audienceSegment: req.audienceSegment as AudienceSegment,
    warnings,
    disclaimer: REKLAMITIN_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getReklamitiнHealthReport(): ReklamitiнHealthReport {
  return {
    personaId: REKLAMITIN_PERSONA_ID,
    displayName: REKLAMITIN_DISPLAY_NAME,
    slug: REKLAMITIN_SLUG,
    contractVersion: REKLAMITIN_CONTRACT_VERSION,
    moduleVersion: REKLAMITIN_MODULE_VERSION,
    okrid: REKLAMITIN_OKRID,
    note: REKLAMITIN_NOTE,
    octave: REKLAMITIN_OCTAVE,
    hipermrezaNode: REKLAMITIN_HIPERMREZA_NODE,
    linkedRepoImpact: REKLAMITIN_LINKED_REPO_IMPACT,
    evaluations,
    lastLevel,
    lastEvaluatedAt,
    supportedLevels: [...LEVEL_ORDER],
    supportedTargets: [...SUPPORTED_TARGETS],
    supportedSegments: [...SUPPORTED_SEGMENTS],
    performanceMaxMs: REKLAMITIN_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: REKLAMITIN_API_RESPONSE_MAX_MS,
    broadcastDispatchMaxMs: REKLAMITIN_BROADCAST_DISPATCH_MAX_MS,
  };
}

export function _resetReklamitiнMetrics(): void {
  evaluations = 0;
  lastLevel = null;
  lastEvaluatedAt = null;
}

// Re-export for convenience
export { LEVEL_CONFIGS };
