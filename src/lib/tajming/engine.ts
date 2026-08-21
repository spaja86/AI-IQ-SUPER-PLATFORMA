// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING
// Kompanija SPAJA — Digitalna Industrija

import type {
  TajmingActivity,
  TajmingHealthReport,
  TajmingInput,
  TajmingResult,
  TajmingStatus,
} from './types';
import {
  TAJMING_API_RESPONSE_MAX_MS,
  TAJMING_CONTRACT_VERSION,
  TAJMING_MODULE_VERSION,
  TAJMING_PERFORMANCE_MAX_MS,
  TAJMING_PERSONA_ID,
} from './types';
import { ACTIVITY_PEAK_WINDOWS, VALID_ACTIVITIES } from './registry';

let evaluations = 0;
let lastTimingScore = 0;
let lastStatus: TajmingStatus = 'NEUTRAL';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function circadianScore(activity: TajmingActivity, timeOfDay: number): number {
  const window = ACTIVITY_PEAK_WINDOWS[activity];
  const span = window.end - window.start;
  const mid = window.start + span / 2;
  const distance = Math.abs(timeOfDay - mid);
  const maxDistance = 12;
  return clamp(100 - (distance / maxDistance) * 100, 0, 100);
}

function deadlineScore(deadline: string | undefined): { score: number; warning?: string } {
  if (!deadline) return { score: 50 };
  const ms = new Date(deadline).getTime() - Date.now();
  if (isNaN(ms)) return { score: 50, warning: 'deadline is not a valid ISO timestamp; ignored' };
  if (ms < 0) return { score: 0, warning: 'deadline is in the past' };
  const hoursUntil = ms / 3_600_000;
  if (hoursUntil < 1) return { score: 100 };
  if (hoursUntil < 4) return { score: 85 };
  if (hoursUntil < 24) return { score: 65 };
  return { score: 40 };
}

function resolveStatus(score: number): TajmingStatus {
  if (score >= 85) return 'OPTIMAL_WINDOW';
  if (score >= 70) return 'GOOD_WINDOW';
  if (score >= 50) return 'NEUTRAL';
  if (score >= 30) return 'SUBOPTIMAL';
  return 'AVOID';
}

function buildRecommendation(status: TajmingStatus, activity: TajmingActivity): string {
  const label = ACTIVITY_PEAK_WINDOWS[activity].label;
  switch (status) {
    case 'OPTIMAL_WINDOW':
      return `Excellent time for ${activity} work. Proceed with full engagement.`;
    case 'GOOD_WINDOW':
      return `Good timing for ${activity}. Conditions are favorable.`;
    case 'NEUTRAL':
      return `Acceptable window, but peak hours are ${label}. Consider rescheduling if possible.`;
    case 'SUBOPTIMAL':
      return `Suboptimal timing. Peak window is ${label}. Reduce session intensity.`;
    case 'AVOID':
      return `Not recommended at this hour. Ideal window is ${label}. Postpone if feasible.`;
  }
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): TajmingResult {
  return {
    referenceId: referenceId ?? 'n/a',
    timingScore: 0,
    status: 'AVOID',
    optimalWindow: '',
    recommendation: warning,
    valid: false,
    warnings: [warning],
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function evaluateTajming(input: TajmingInput): TajmingResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!VALID_ACTIVITIES.includes(input.activity)) {
    return invalidResult(
      input.referenceId,
      `activity must be one of: ${VALID_ACTIVITIES.join(', ')}`,
      start,
    );
  }

  if (!Number.isFinite(input.timeOfDay) || input.timeOfDay < 0 || input.timeOfDay > 23) {
    return invalidResult(input.referenceId, 'timeOfDay must be an integer 0–23', start);
  }

  if (!Number.isFinite(input.energyLevel) || input.energyLevel < 0 || input.energyLevel > 100) {
    return invalidResult(input.referenceId, 'energyLevel must be 0–100', start);
  }

  const warnings: string[] = [];
  const dl = deadlineScore(input.deadline);
  if (dl.warning) warnings.push(dl.warning);

  const cScore = circadianScore(input.activity, input.timeOfDay);
  const rawScore = cScore * 0.55 + input.energyLevel * 0.30 + dl.score * 0.15;
  const timingScore = Math.round(clamp(rawScore, 0, 100) * 100) / 100;
  const status = resolveStatus(timingScore);
  const optimalWindow = ACTIVITY_PEAK_WINDOWS[input.activity].label;
  const recommendation = buildRecommendation(status, input.activity);

  evaluations += 1;
  lastTimingScore = timingScore;
  lastStatus = status;

  return {
    referenceId: input.referenceId ?? 'n/a',
    timingScore,
    status,
    optimalWindow,
    recommendation,
    valid: true,
    warnings,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getTajmingHealthReport(): TajmingHealthReport {
  return {
    personaId: TAJMING_PERSONA_ID,
    contractVersion: TAJMING_CONTRACT_VERSION,
    moduleVersion: TAJMING_MODULE_VERSION,
    evaluations,
    lastTimingScore,
    lastStatus,
    performanceMaxMs: TAJMING_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: TAJMING_API_RESPONSE_MAX_MS,
  };
}

export function _resetTajmingMetrics(): void {
  evaluations = 0;
  lastTimingScore = 0;
  lastStatus = 'NEUTRAL';
}
