// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  DnevnaSvetlostHealthReport,
  DnevnaSvetlostInput,
  DnevnaSvetlostMode,
  DnevnaSvetlostResult,
  DnevnaSvetlostStatus,
  DnevnaSvetlostSupportTool,
  DnevnaSvetlostUVProtection,
} from './types';
import {
  DNEVNA_SVETLOST_API_RESPONSE_MAX_MS,
  DNEVNA_SVETLOST_CONTRACT_VERSION,
  DNEVNA_SVETLOST_DISCLAIMER,
  DNEVNA_SVETLOST_DISPLAY_NAME,
  DNEVNA_SVETLOST_LINKED_REPO_IMPACT,
  DNEVNA_SVETLOST_MAX_AMBIENT_LUX,
  DNEVNA_SVETLOST_MAX_EXPOSURE_MINUTES,
  DNEVNA_SVETLOST_MAX_FOCUS_LEVEL,
  DNEVNA_SVETLOST_MAX_SCORE,
  DNEVNA_SVETLOST_MAX_SLEEP_HOURS,
  DNEVNA_SVETLOST_MAX_UV_INDEX,
  DNEVNA_SVETLOST_MIN_SCORE,
  DNEVNA_SVETLOST_MODULE_VERSION,
  DNEVNA_SVETLOST_PERFORMANCE_MAX_MS,
  DNEVNA_SVETLOST_PERSONA_ID,
  DNEVNA_SVETLOST_SLUG,
} from './types';

const MODES = ['MORNING', 'MIDDAY', 'AFTERNOON', 'EVENING'] as const;
const UV_PROTECTIONS = ['NONE', 'SPF_15', 'SPF_30', 'SPF_50', 'FULL_SHADE'] as const;
const SUPPORT_TOOLS = ['SUNGLASSES', 'HAT', 'SUNSCREEN', 'SHADE_UMBRELLA'] as const;

// How much brightness (0-100 normalised lux) each mode shift adds/removes
const MODE_BRIGHTNESS_SHIFT: Record<DnevnaSvetlostMode, number> = {
  MORNING: -10,
  MIDDAY: 15,
  AFTERNOON: 5,
  EVENING: -20,
};

// Productivity base per mode — MORNING and AFTERNOON are circadian peaks
const MODE_PRODUCTIVITY_BASE: Record<DnevnaSvetlostMode, number> = {
  MORNING: 72,
  MIDDAY: 58,
  AFTERNOON: 68,
  EVENING: 40,
};

// How much each UV protection level reduces effective UV penalty
const UV_PROTECTION_FACTOR: Record<DnevnaSvetlostUVProtection, number> = {
  NONE: 0,
  SPF_15: 0.35,
  SPF_30: 0.6,
  SPF_50: 0.8,
  FULL_SHADE: 1.0,
};

const TOOL_COMFORT_BONUS: Record<DnevnaSvetlostSupportTool, number> = {
  SUNGLASSES: 12,
  HAT: 8,
  SUNSCREEN: 6,
  SHADE_UMBRELLA: 14,
};

const MODE_RECOMMENDED_TOOLS: Record<DnevnaSvetlostMode, DnevnaSvetlostSupportTool[]> = {
  MORNING: ['SUNGLASSES'],
  MIDDAY: ['SUNGLASSES', 'HAT', 'SUNSCREEN', 'SHADE_UMBRELLA'],
  AFTERNOON: ['SUNGLASSES', 'HAT', 'SUNSCREEN'],
  EVENING: [],
};

let evaluations = 0;
let lastStatus: DnevnaSvetlostStatus = 'OPTIMAL';
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isMode(value: unknown): value is DnevnaSvetlostMode {
  return typeof value === 'string' && MODES.includes(value as DnevnaSvetlostMode);
}

function isUVProtection(value: unknown): value is DnevnaSvetlostUVProtection {
  return typeof value === 'string' && UV_PROTECTIONS.includes(value as DnevnaSvetlostUVProtection);
}

function isSupportTool(value: unknown): value is DnevnaSvetlostSupportTool {
  return typeof value === 'string' && SUPPORT_TOOLS.includes(value as DnevnaSvetlostSupportTool);
}

function uniqueTools(tools: DnevnaSvetlostSupportTool[] | undefined): DnevnaSvetlostSupportTool[] {
  return Array.from(new Set(tools ?? []));
}

function invalidResult(
  referenceId: string | undefined,
  mode: DnevnaSvetlostMode,
  uvProtection: DnevnaSvetlostUVProtection,
  warning: string,
  start: number,
): DnevnaSvetlostResult {
  return {
    referenceId: referenceId ?? 'n/a',
    mode,
    uvProtection,
    brightnessScore: 0,
    comfortScore: 0,
    productivityScore: 0,
    wellbeingScore: 0,
    status: 'OVEREXPOSURE',
    recommendedToolset: [],
    warnings: [warning],
    disclaimer: DNEVNA_SVETLOST_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeBrightnessScore(input: DnevnaSvetlostInput): number {
  const normalised = (input.ambientLightLux / DNEVNA_SVETLOST_MAX_AMBIENT_LUX) * 100;
  const protectionMitigation = UV_PROTECTION_FACTOR[input.uvProtection] * 15;
  const raw = normalised + MODE_BRIGHTNESS_SHIFT[input.mode] - protectionMitigation;
  return round2(clamp(raw, DNEVNA_SVETLOST_MIN_SCORE, DNEVNA_SVETLOST_MAX_SCORE));
}

function computeComfortScore(
  input: DnevnaSvetlostInput,
  tools: DnevnaSvetlostSupportTool[],
  brightnessScore: number,
): number {
  const sleepCredit = input.sleepHours * 2;
  const uvPenalty = input.uvIndex * (1 - UV_PROTECTION_FACTOR[input.uvProtection]) * 4;
  const toolBonus = tools.reduce((sum, tool) => sum + TOOL_COMFORT_BONUS[tool], 0);
  const raw = input.focusLevel + sleepCredit - uvPenalty + toolBonus - brightnessScore * 0.2;
  return round2(clamp(raw, DNEVNA_SVETLOST_MIN_SCORE, DNEVNA_SVETLOST_MAX_SCORE));
}

function computeProductivityScore(
  input: DnevnaSvetlostInput,
  brightnessScore: number,
): number {
  const exposurePenalty = input.exposureMinutes * 0.08;
  const brightnessBonus = brightnessScore * 0.15;
  const raw = MODE_PRODUCTIVITY_BASE[input.mode] + brightnessBonus - exposurePenalty;
  return round2(clamp(raw, DNEVNA_SVETLOST_MIN_SCORE, DNEVNA_SVETLOST_MAX_SCORE));
}

function computeWellbeingScore(
  brightnessScore: number,
  comfortScore: number,
  productivityScore: number,
): number {
  const raw = brightnessScore * 0.3 + comfortScore * 0.4 + productivityScore * 0.3;
  return round2(clamp(raw, DNEVNA_SVETLOST_MIN_SCORE, DNEVNA_SVETLOST_MAX_SCORE));
}

function computeStatus(
  uvIndex: number,
  uvProtection: DnevnaSvetlostUVProtection,
  brightnessScore: number,
  comfortScore: number,
): DnevnaSvetlostStatus {
  const effectiveUV = uvIndex * (1 - UV_PROTECTION_FACTOR[uvProtection]);
  if (effectiveUV >= 7 || brightnessScore >= 85 || comfortScore < 20) return 'OVEREXPOSURE';
  if (effectiveUV >= 4 || brightnessScore >= 65 || comfortScore < 40) return 'CAUTION';
  if (effectiveUV >= 2 || brightnessScore >= 40 || comfortScore < 60) return 'MODERATE';
  return 'OPTIMAL';
}

function buildWarnings(
  input: DnevnaSvetlostInput,
  tools: DnevnaSvetlostSupportTool[],
  brightnessScore: number,
  comfortScore: number,
): string[] {
  const warnings: string[] = [];

  if (input.uvIndex > 6 && input.uvProtection === 'NONE') {
    warnings.push('High UV index detected with no protection; apply SPF_30 or higher immediately.');
  }

  if (
    input.uvIndex > 6 &&
    input.uvProtection !== 'NONE' &&
    input.uvProtection !== 'SPF_50' &&
    input.uvProtection !== 'FULL_SHADE'
  ) {
    warnings.push('UV index above 6; consider upgrading to SPF_50 or FULL_SHADE.');
  }

  if (
    input.mode === 'MIDDAY' &&
    input.exposureMinutes > 120 &&
    input.uvProtection !== 'FULL_SHADE' &&
    input.uvProtection !== 'SPF_50'
  ) {
    warnings.push('Extended MIDDAY exposure (>120 min) without maximum protection detected; seek shade or use SPF_50.');
  }

  if (input.focusLevel < 40 && input.sleepHours < 5) {
    warnings.push('Low focus and insufficient sleep detected; rest before high-intensity daylight exposure.');
  }

  if (
    input.mode === 'MORNING' &&
    input.ambientLightLux > 10000 &&
    !tools.includes('SUNGLASSES')
  ) {
    warnings.push('Bright morning light without eye protection; SUNGLASSES are recommended.');
  }

  if (brightnessScore >= 65 && !tools.includes('HAT') && !tools.includes('SHADE_UMBRELLA')) {
    warnings.push('High brightness conditions; consider HAT or SHADE_UMBRELLA for comfort.');
  }

  if (comfortScore < 30 && !tools.includes('SHADE_UMBRELLA')) {
    warnings.push('Low comfort score in current conditions; SHADE_UMBRELLA can significantly improve comfort.');
  }

  return warnings;
}

export function evaluateDnevnaSvetlost(input: DnevnaSvetlostInput): DnevnaSvetlostResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'MORNING', 'NONE', 'input must be an object', start);
  }

  if (!isMode(input.mode)) {
    return invalidResult(
      input.referenceId,
      'MORNING',
      'NONE',
      'mode must be one of: MORNING, MIDDAY, AFTERNOON, EVENING',
      start,
    );
  }

  if (!isUVProtection(input.uvProtection)) {
    return invalidResult(
      input.referenceId,
      input.mode,
      'NONE',
      'uvProtection must be one of: NONE, SPF_15, SPF_30, SPF_50, FULL_SHADE',
      start,
    );
  }

  if (typeof input.ambientLightLux !== 'number' || !Number.isFinite(input.ambientLightLux)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'ambientLightLux must be a finite number', start);
  }

  if (typeof input.uvIndex !== 'number' || !Number.isFinite(input.uvIndex)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'uvIndex must be a finite number', start);
  }

  if (typeof input.focusLevel !== 'number' || !Number.isFinite(input.focusLevel)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'focusLevel must be a finite number', start);
  }

  if (typeof input.sleepHours !== 'number' || !Number.isFinite(input.sleepHours)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'sleepHours must be a finite number', start);
  }

  if (typeof input.exposureMinutes !== 'number' || !Number.isFinite(input.exposureMinutes)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'exposureMinutes must be a finite number', start);
  }

  if (input.ambientLightLux < 0 || input.ambientLightLux > DNEVNA_SVETLOST_MAX_AMBIENT_LUX) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.uvProtection,
      `ambientLightLux must be between 0 and ${DNEVNA_SVETLOST_MAX_AMBIENT_LUX}`,
      start,
    );
  }

  if (input.uvIndex < 0 || input.uvIndex > DNEVNA_SVETLOST_MAX_UV_INDEX) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.uvProtection,
      `uvIndex must be between 0 and ${DNEVNA_SVETLOST_MAX_UV_INDEX}`,
      start,
    );
  }

  if (input.focusLevel < 0 || input.focusLevel > DNEVNA_SVETLOST_MAX_FOCUS_LEVEL) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.uvProtection,
      `focusLevel must be between 0 and ${DNEVNA_SVETLOST_MAX_FOCUS_LEVEL}`,
      start,
    );
  }

  if (input.sleepHours < 0 || input.sleepHours > DNEVNA_SVETLOST_MAX_SLEEP_HOURS) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.uvProtection,
      `sleepHours must be between 0 and ${DNEVNA_SVETLOST_MAX_SLEEP_HOURS}`,
      start,
    );
  }

  if (input.exposureMinutes <= 0 || input.exposureMinutes > DNEVNA_SVETLOST_MAX_EXPOSURE_MINUTES) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.uvProtection,
      `exposureMinutes must be greater than 0 and at most ${DNEVNA_SVETLOST_MAX_EXPOSURE_MINUTES}`,
      start,
    );
  }

  if (input.supportTools && !Array.isArray(input.supportTools)) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'supportTools must be an array when provided', start);
  }

  if (input.supportTools?.some((tool) => !isSupportTool(tool))) {
    return invalidResult(input.referenceId, input.mode, input.uvProtection, 'supportTools contains unsupported identifiers', start);
  }

  const tools = uniqueTools(input.supportTools);
  const brightnessScore = computeBrightnessScore(input);
  const comfortScore = computeComfortScore(input, tools, brightnessScore);
  const productivityScore = computeProductivityScore(input, brightnessScore);
  const wellbeingScore = computeWellbeingScore(brightnessScore, comfortScore, productivityScore);
  const status = computeStatus(input.uvIndex, input.uvProtection, brightnessScore, comfortScore);
  const recommendedToolset = MODE_RECOMMENDED_TOOLS[input.mode].filter((tool) => !tools.includes(tool));
  const warnings = buildWarnings(input, tools, brightnessScore, comfortScore);

  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    mode: input.mode,
    uvProtection: input.uvProtection,
    brightnessScore,
    comfortScore,
    productivityScore,
    wellbeingScore,
    status,
    recommendedToolset,
    warnings,
    disclaimer: DNEVNA_SVETLOST_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getDnevnaSvetlostHealthReport(): DnevnaSvetlostHealthReport {
  return {
    personaId: DNEVNA_SVETLOST_PERSONA_ID,
    displayName: DNEVNA_SVETLOST_DISPLAY_NAME,
    slug: DNEVNA_SVETLOST_SLUG,
    contractVersion: DNEVNA_SVETLOST_CONTRACT_VERSION,
    moduleVersion: DNEVNA_SVETLOST_MODULE_VERSION,
    linkedRepoImpact: DNEVNA_SVETLOST_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedModes: [...MODES],
    supportedTools: [...SUPPORT_TOOLS],
    performanceMaxMs: DNEVNA_SVETLOST_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DNEVNA_SVETLOST_API_RESPONSE_MAX_MS,
  };
}

export function _resetDnevnaSvetlostMetrics(): void {
  evaluations = 0;
  lastStatus = 'OPTIMAL';
  lastEvaluatedAt = null;
}
