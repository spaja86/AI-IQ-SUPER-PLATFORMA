// SpajaUltraOmegaCore -∞Ω+∞ — DRESING
// Kompanija SPAJA — Digitalna Industrija

import type {
  DresscodeStatus,
  DresingHealthReport,
  DresingInput,
  DresingResult,
} from './types';
import {
  DRESING_API_RESPONSE_MAX_MS,
  DRESING_CONTRACT_VERSION,
  DRESING_DISCLAIMER,
  DRESING_MODULE_VERSION,
  DRESING_PERFORMANCE_MAX_MS,
  DRESING_PERSONA_ID,
} from './types';
import {
  OCCASION_FORMALITY,
  STYLE_OCCASION_BONUS,
  VALID_OCCASIONS,
  VALID_STYLES,
  getWeatherAdaptation,
} from './registry';

let evaluations = 0;
let lastFitScore = 0;
let lastStatus: DresscodeStatus = 'ACCEPTABLE';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formalityScore(formalityLevel: number, occasion: DresingInput['occasion']): number {
  const expected = OCCASION_FORMALITY[occasion];
  const diff = Math.abs(formalityLevel - expected);
  return clamp(100 - diff * 15, 0, 100);
}

function styleCoherenceScore(style: DresingInput['preferredStyle'], occasion: DresingInput['occasion']): number {
  const bonusOccasions = STYLE_OCCASION_BONUS[style] ?? [];
  return bonusOccasions.includes(occasion) ? 100 : 50;
}

function weatherComfortScore(tempC: number): number {
  if (tempC < -20 || tempC > 45) return 0;
  if (tempC >= 18 && tempC <= 28) return 100;
  if (tempC >= 5 && tempC < 18) return 75;
  if (tempC >= 28 && tempC <= 35) return 75;
  return 40;
}

function resolveDresscodeStatus(
  score: number,
  formalityMismatch: number,
  hasExtremeWeather: boolean,
): DresscodeStatus {
  if (hasExtremeWeather) return 'NEEDS_ADJUSTMENT';
  if (formalityMismatch > 4) return 'MISMATCH';
  if (score >= 88) return 'PERFECT_FIT';
  if (score >= 72) return 'APPROPRIATE';
  if (score >= 55) return 'ACCEPTABLE';
  if (score >= 35) return 'NEEDS_ADJUSTMENT';
  return 'MISMATCH';
}

function buildRecommendations(
  input: DresingInput,
  status: DresscodeStatus,
  weatherAdaptation: string,
): string[] {
  const recs: string[] = [];
  const expectedFormality = OCCASION_FORMALITY[input.occasion];
  const diff = input.formalityLevel - expectedFormality;

  if (status === 'MISMATCH') {
    recs.push(
      `Formality mismatch detected. Expected ~${expectedFormality}/10 for ${input.occasion}; you selected ${input.formalityLevel}/10.`,
    );
  }
  if (diff > 2) recs.push('Consider a less formal outfit for this occasion.');
  if (diff < -2) recs.push('Consider a more formal outfit for this occasion.');
  if (input.colorPalette.length === 0) recs.push('No color palette provided — defaulting to neutral/universal tones.');
  if (weatherAdaptation) recs.push(`Weather adaptation: ${weatherAdaptation}`);
  if (recs.length === 0) recs.push('Your outfit selection aligns well with the occasion and conditions.');
  return recs;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DresingResult {
  return {
    referenceId: referenceId ?? 'n/a',
    fitScore: 0,
    dresscodeStatus: 'MISMATCH',
    recommendations: [warning],
    weatherAdaptation: '',
    styleCoherence: 0,
    valid: false,
    warnings: [warning],
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: DRESING_DISCLAIMER,
  };
}

export function evaluateDresing(input: DresingInput): DresingResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!VALID_OCCASIONS.includes(input.occasion)) {
    return invalidResult(
      input.referenceId,
      `occasion must be one of: ${VALID_OCCASIONS.join(', ')}`,
      start,
    );
  }

  if (!Number.isFinite(input.weatherTempC)) {
    return invalidResult(input.referenceId, 'weatherTempC must be a finite number', start);
  }

  if (!Number.isFinite(input.windSpeedKmh) || input.windSpeedKmh < 0) {
    return invalidResult(input.referenceId, 'windSpeedKmh must be a non-negative number', start);
  }

  if (!Number.isFinite(input.precipitation) || input.precipitation < 0 || input.precipitation > 100) {
    return invalidResult(input.referenceId, 'precipitation must be 0–100', start);
  }

  if (!Number.isFinite(input.formalityLevel) || input.formalityLevel < 0 || input.formalityLevel > 10) {
    return invalidResult(input.referenceId, 'formalityLevel must be 0–10', start);
  }

  if (!Array.isArray(input.colorPalette)) {
    return invalidResult(input.referenceId, 'colorPalette must be an array', start);
  }

  if (!VALID_STYLES.includes(input.preferredStyle)) {
    return invalidResult(
      input.referenceId,
      `preferredStyle must be one of: ${VALID_STYLES.join(', ')}`,
      start,
    );
  }

  const warnings: string[] = [];
  const extremeWeather = input.weatherTempC < -20 || input.weatherTempC > 45;
  if (extremeWeather) warnings.push(`Extreme weather: ${input.weatherTempC}°C — outfit must prioritize safety.`);
  if (input.colorPalette.length === 0) warnings.push('No color palette provided; using neutral recommendation.');

  const fScore = formalityScore(input.formalityLevel, input.occasion);
  const sScore = styleCoherenceScore(input.preferredStyle, input.occasion);
  const wScore = weatherComfortScore(input.weatherTempC);
  const rawScore = fScore * 0.45 + sScore * 0.30 + wScore * 0.25;
  const fitScore = Math.round(clamp(rawScore, 0, 100) * 100) / 100;
  const formalityMismatch = Math.abs(input.formalityLevel - OCCASION_FORMALITY[input.occasion]);
  const dresscodeStatus = resolveDresscodeStatus(fitScore, formalityMismatch, extremeWeather);
  const weatherAdaptation = getWeatherAdaptation(input.weatherTempC, input.windSpeedKmh, input.precipitation);
  const styleCoherence = sScore;
  const recommendations = buildRecommendations(input, dresscodeStatus, weatherAdaptation);

  evaluations += 1;
  lastFitScore = fitScore;
  lastStatus = dresscodeStatus;

  return {
    referenceId: input.referenceId ?? 'n/a',
    fitScore,
    dresscodeStatus,
    recommendations,
    weatherAdaptation,
    styleCoherence,
    valid: true,
    warnings,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: DRESING_DISCLAIMER,
  };
}

export function getDresingHealthReport(): DresingHealthReport {
  return {
    personaId: DRESING_PERSONA_ID,
    contractVersion: DRESING_CONTRACT_VERSION,
    moduleVersion: DRESING_MODULE_VERSION,
    evaluations,
    lastFitScore,
    lastStatus,
    performanceMaxMs: DRESING_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DRESING_API_RESPONSE_MAX_MS,
  };
}

export function _resetDresingMetrics(): void {
  evaluations = 0;
  lastFitScore = 0;
  lastStatus = 'ACCEPTABLE';
}
