// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING
// Kompanija SPAJA — Digitalna Industrija

import type {
  SwimingHealthReport,
  SwimingInput,
  SwimingIntensity,
  SwimingResult,
} from './types';
import {
  SWIMING_API_RESPONSE_MAX_MS,
  SWIMING_CONTRACT_VERSION,
  SWIMING_DISCLAIMER,
  SWIMING_MAX_DURATION_MIN,
  SWIMING_MODULE_VERSION,
  SWIMING_PERFORMANCE_MAX_MS,
  SWIMING_PERSONA_ID,
} from './types';
import {
  FITNESS_BASE_SCORE,
  INTENSITY_MAP,
  STROKE_MET,
  VALID_FITNESS_LEVELS,
  VALID_STROKES,
} from './registry';

let evaluations = 0;
let lastReadinessScore = 0;
let lastIntensity: SwimingIntensity = 'RECOVERY';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Estimate calories: MET × weight_kg × hours (assume 70kg default) */
function estimateCalories(met: number, durationMin: number): number {
  const weightKg = 70;
  return Math.round(met * weightKg * (durationMin / 60));
}

function waterTempScore(tempC: number): { score: number; alert?: string } {
  if (tempC < 18) return { score: 10, alert: `Water temperature ${tempC}°C is too cold — hypothermia risk.` };
  if (tempC > 32) return { score: 10, alert: `Water temperature ${tempC}°C is too warm — overheating risk.` };
  if (tempC >= 26 && tempC <= 28) return { score: 100 };
  if (tempC >= 22 && tempC < 26) return { score: 85 };
  if (tempC >= 28 && tempC <= 32) return { score: 75 };
  return { score: 60 };
}

function hrScore(restingHR: number): { score: number; warning?: string } {
  if (restingHR > 100) return { score: 0, warning: 'Resting heart rate > 100 bpm — recommend AVOID or consult physician.' };
  if (restingHR > 80)  return { score: 50 };
  if (restingHR > 60)  return { score: 80 };
  return { score: 100 };
}

function resolveIntensity(readiness: number, fitnessLevel: SwimingInput['fitnessLevel']): SwimingIntensity {
  const map = INTENSITY_MAP[fitnessLevel];
  if (readiness >= 75) return map.high;
  if (readiness >= 45) return map.mid;
  return map.low;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): SwimingResult {
  return {
    referenceId: referenceId ?? 'n/a',
    readinessScore: 0,
    intensityRecommendation: 'RECOVERY',
    estimatedCalories: 0,
    hydrationAlert: false,
    safetyAlerts: [warning],
    valid: false,
    warnings: [warning],
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: SWIMING_DISCLAIMER,
  };
}

export function evaluateSwiming(input: SwimingInput): SwimingResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!VALID_STROKES.includes(input.strokeType)) {
    return invalidResult(
      input.referenceId,
      `strokeType must be one of: ${VALID_STROKES.join(', ')}`,
      start,
    );
  }

  if (!Number.isFinite(input.sessionDurationMin) || input.sessionDurationMin <= 0) {
    return invalidResult(input.referenceId, 'sessionDurationMin must be a positive number', start);
  }

  if (!Number.isFinite(input.poolLengthM) || input.poolLengthM <= 0) {
    return invalidResult(input.referenceId, 'poolLengthM must be a positive number', start);
  }

  if (!Number.isFinite(input.restingHeartRate) || input.restingHeartRate <= 0) {
    return invalidResult(input.referenceId, 'restingHeartRate must be a positive number', start);
  }

  if (!Number.isFinite(input.waterTempC)) {
    return invalidResult(input.referenceId, 'waterTempC must be a finite number', start);
  }

  if (!VALID_FITNESS_LEVELS.includes(input.fitnessLevel)) {
    return invalidResult(
      input.referenceId,
      `fitnessLevel must be one of: ${VALID_FITNESS_LEVELS.join(', ')}`,
      start,
    );
  }

  const warnings: string[] = [];
  const safetyAlerts: string[] = [];

  // Cap duration
  let effectiveDuration = input.sessionDurationMin;
  if (effectiveDuration > SWIMING_MAX_DURATION_MIN) {
    warnings.push(`sessionDurationMin capped at ${SWIMING_MAX_DURATION_MIN} min`);
    effectiveDuration = SWIMING_MAX_DURATION_MIN;
  }

  const wt = waterTempScore(input.waterTempC);
  if (wt.alert) safetyAlerts.push(wt.alert);

  const hr = hrScore(input.restingHeartRate);
  if (hr.warning) {
    safetyAlerts.push(hr.warning);
    warnings.push(hr.warning);
  }

  const baseScore = FITNESS_BASE_SCORE[input.fitnessLevel];
  const rawScore = baseScore * 0.50 + wt.score * 0.25 + hr.score * 0.25;
  const readinessScore = Math.round(clamp(rawScore, 0, 100) * 100) / 100;
  const intensityRecommendation = resolveIntensity(readinessScore, input.fitnessLevel);
  const met = STROKE_MET[input.strokeType];
  const estimatedCalories = estimateCalories(met, effectiveDuration);
  const hydrationAlert = effectiveDuration >= 45;

  evaluations += 1;
  lastReadinessScore = readinessScore;
  lastIntensity = intensityRecommendation;

  return {
    referenceId: input.referenceId ?? 'n/a',
    readinessScore,
    intensityRecommendation,
    estimatedCalories,
    hydrationAlert,
    safetyAlerts,
    valid: true,
    warnings,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: SWIMING_DISCLAIMER,
  };
}

export function getSwimingHealthReport(): SwimingHealthReport {
  return {
    personaId: SWIMING_PERSONA_ID,
    contractVersion: SWIMING_CONTRACT_VERSION,
    moduleVersion: SWIMING_MODULE_VERSION,
    evaluations,
    lastReadinessScore,
    lastIntensity,
    performanceMaxMs: SWIMING_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: SWIMING_API_RESPONSE_MAX_MS,
  };
}

export function _resetSwimingMetrics(): void {
  evaluations = 0;
  lastReadinessScore = 0;
  lastIntensity = 'RECOVERY';
}
