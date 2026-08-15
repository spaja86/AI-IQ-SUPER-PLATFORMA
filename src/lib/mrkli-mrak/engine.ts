// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  MrkliMrakHealthReport,
  MrkliMrakInput,
  MrkliMrakMode,
  MrkliMrakResult,
  MrkliMrakRiskTolerance,
  MrkliMrakStatus,
  MrkliMrakSupportTool,
} from './types';
import {
  MRKLI_MRAK_API_RESPONSE_MAX_MS,
  MRKLI_MRAK_CONTRACT_VERSION,
  MRKLI_MRAK_DISCLAIMER,
  MRKLI_MRAK_DISPLAY_NAME,
  MRKLI_MRAK_LINKED_REPO_IMPACT,
  MRKLI_MRAK_MAX_AMBIENT_LUX,
  MRKLI_MRAK_MAX_FOCUS_LEVEL,
  MRKLI_MRAK_MAX_SCORE,
  MRKLI_MRAK_MAX_SESSION_MINUTES,
  MRKLI_MRAK_MAX_SLEEP_HOURS,
  MRKLI_MRAK_MIN_SCORE,
  MRKLI_MRAK_MODULE_VERSION,
  MRKLI_MRAK_PERFORMANCE_MAX_MS,
  MRKLI_MRAK_PERSONA_ID,
  MRKLI_MRAK_SLUG,
} from './types';

const MODES = ['EXPLORATION', 'STEALTH', 'RECOVERY'] as const;
const RISK_TOLERANCES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const SUPPORT_TOOLS = ['FLASHLIGHT', 'NIGHT_VISION', 'AUDIO_CUES', 'MAP'] as const;

const MODE_DARKNESS_SHIFT: Record<MrkliMrakMode, number> = {
  EXPLORATION: 10,
  STEALTH: 20,
  RECOVERY: -6,
};

const MODE_CLARITY_BONUS: Record<MrkliMrakMode, number> = {
  EXPLORATION: 8,
  STEALTH: -10,
  RECOVERY: 14,
};

const RISK_DARKNESS_MULTIPLIER: Record<MrkliMrakRiskTolerance, number> = {
  LOW: 0.8,
  MEDIUM: 1,
  HIGH: 1.2,
};

const RISK_STABILITY_BONUS: Record<MrkliMrakRiskTolerance, number> = {
  LOW: 14,
  MEDIUM: 4,
  HIGH: -12,
};

const TOOL_DARKNESS_BONUS: Record<MrkliMrakSupportTool, number> = {
  FLASHLIGHT: -28,
  NIGHT_VISION: -20,
  AUDIO_CUES: -10,
  MAP: -8,
};

const TOOL_STABILITY_BONUS: Record<MrkliMrakSupportTool, number> = {
  FLASHLIGHT: 6,
  NIGHT_VISION: 8,
  AUDIO_CUES: 7,
  MAP: 5,
};

const MODE_RECOMMENDED_TOOLS: Record<MrkliMrakMode, MrkliMrakSupportTool[]> = {
  EXPLORATION: ['MAP', 'FLASHLIGHT'],
  STEALTH: ['NIGHT_VISION', 'AUDIO_CUES'],
  RECOVERY: ['FLASHLIGHT', 'AUDIO_CUES'],
};

let evaluations = 0;
let lastStatus: MrkliMrakStatus = 'CLEAR';
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isMode(value: unknown): value is MrkliMrakMode {
  return typeof value === 'string' && MODES.includes(value as MrkliMrakMode);
}

function isRiskTolerance(value: unknown): value is MrkliMrakRiskTolerance {
  return typeof value === 'string' && RISK_TOLERANCES.includes(value as MrkliMrakRiskTolerance);
}

function isSupportTool(value: unknown): value is MrkliMrakSupportTool {
  return typeof value === 'string' && SUPPORT_TOOLS.includes(value as MrkliMrakSupportTool);
}

function uniqueTools(tools: MrkliMrakSupportTool[] | undefined): MrkliMrakSupportTool[] {
  return Array.from(new Set(tools ?? []));
}

function invalidResult(
  referenceId: string | undefined,
  mode: MrkliMrakMode,
  riskTolerance: MrkliMrakRiskTolerance,
  warning: string,
  start: number,
): MrkliMrakResult {
  return {
    referenceId: referenceId ?? 'n/a',
    mode,
    riskTolerance,
    darknessScore: 100,
    clarityScore: 0,
    stabilityScore: 0,
    confidenceScore: 0,
    status: 'BLACKOUT',
    recommendedToolset: [],
    warnings: [warning],
    disclaimer: MRKLI_MRAK_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeDarknessScore(input: MrkliMrakInput, tools: MrkliMrakSupportTool[]): number {
  const baseFromLux = (1 - input.ambientLightLux / MRKLI_MRAK_MAX_AMBIENT_LUX) * 100;
  const toolMitigation = tools.reduce((sum, tool) => sum + TOOL_DARKNESS_BONUS[tool], 0);
  const raw =
    (baseFromLux + MODE_DARKNESS_SHIFT[input.mode] + toolMitigation) *
    RISK_DARKNESS_MULTIPLIER[input.riskTolerance];
  return round2(clamp(raw, MRKLI_MRAK_MIN_SCORE, MRKLI_MRAK_MAX_SCORE));
}

function computeClarityScore(input: MrkliMrakInput, darknessScore: number): number {
  const sleepCredit = input.sleepHours * 2.5;
  const raw = input.focusLevel - darknessScore * 0.5 + MODE_CLARITY_BONUS[input.mode] + sleepCredit;
  return round2(clamp(raw, MRKLI_MRAK_MIN_SCORE, MRKLI_MRAK_MAX_SCORE));
}

function computeStabilityScore(
  input: MrkliMrakInput,
  tools: MrkliMrakSupportTool[],
  darknessScore: number,
): number {
  const sessionPenalty = input.sessionMinutes * 0.18;
  const toolBonus = tools.reduce((sum, tool) => sum + TOOL_STABILITY_BONUS[tool], 0);
  const raw = 70 - sessionPenalty - darknessScore * 0.35 + toolBonus + RISK_STABILITY_BONUS[input.riskTolerance];
  return round2(clamp(raw, MRKLI_MRAK_MIN_SCORE, MRKLI_MRAK_MAX_SCORE));
}

function computeConfidenceScore(clarityScore: number, stabilityScore: number, darknessScore: number): number {
  const raw = clarityScore * 0.5 + stabilityScore * 0.4 + (100 - darknessScore) * 0.1;
  return round2(clamp(raw, MRKLI_MRAK_MIN_SCORE, MRKLI_MRAK_MAX_SCORE));
}

function computeStatus(darknessScore: number, clarityScore: number, stabilityScore: number): MrkliMrakStatus {
  if (darknessScore >= 80 || clarityScore < 30 || stabilityScore < 25) return 'BLACKOUT';
  if (darknessScore >= 60 || clarityScore < 45 || stabilityScore < 40) return 'DENSE';
  if (darknessScore >= 40 || clarityScore < 60 || stabilityScore < 55) return 'CAUTION';
  return 'CLEAR';
}

function buildWarnings(
  input: MrkliMrakInput,
  tools: MrkliMrakSupportTool[],
  darknessScore: number,
  clarityScore: number,
  stabilityScore: number,
): string[] {
  const warnings: string[] = [];

  if (input.ambientLightLux <= 5 && !tools.includes('NIGHT_VISION')) {
    warnings.push('Extremely low ambient light detected; NIGHT_VISION is recommended.');
  }

  if (input.sessionMinutes > 180) {
    warnings.push('Long session duration may reduce operational stability.');
  }

  if (clarityScore < 45 && input.sleepHours < 5) {
    warnings.push('Low sleep + low clarity detected; consider recovery cycle before critical activity.');
  }

  if (input.riskTolerance === 'HIGH' && darknessScore > 65) {
    warnings.push('High risk tolerance in dense darkness increases operational uncertainty.');
  }

  if (stabilityScore < 35 && !tools.includes('AUDIO_CUES')) {
    warnings.push('AUDIO_CUES can improve stability in low-visibility conditions.');
  }

  return warnings;
}

export function evaluateMrkliMrak(input: MrkliMrakInput): MrkliMrakResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'EXPLORATION', 'MEDIUM', 'input must be an object', start);
  }

  if (!isMode(input.mode)) {
    return invalidResult(input.referenceId, 'EXPLORATION', 'MEDIUM', 'mode must be one of: EXPLORATION, STEALTH, RECOVERY', start);
  }

  if (!isRiskTolerance(input.riskTolerance)) {
    return invalidResult(
      input.referenceId,
      input.mode,
      'MEDIUM',
      'riskTolerance must be one of: LOW, MEDIUM, HIGH',
      start,
    );
  }

  if (typeof input.ambientLightLux !== 'number' || !Number.isFinite(input.ambientLightLux)) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'ambientLightLux must be a finite number', start);
  }

  if (typeof input.focusLevel !== 'number' || !Number.isFinite(input.focusLevel)) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'focusLevel must be a finite number', start);
  }

  if (typeof input.sleepHours !== 'number' || !Number.isFinite(input.sleepHours)) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'sleepHours must be a finite number', start);
  }

  if (typeof input.sessionMinutes !== 'number' || !Number.isFinite(input.sessionMinutes)) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'sessionMinutes must be a finite number', start);
  }

  if (input.ambientLightLux < 0 || input.ambientLightLux > MRKLI_MRAK_MAX_AMBIENT_LUX) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.riskTolerance,
      `ambientLightLux must be between 0 and ${MRKLI_MRAK_MAX_AMBIENT_LUX}`,
      start,
    );
  }

  if (input.focusLevel < 0 || input.focusLevel > MRKLI_MRAK_MAX_FOCUS_LEVEL) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.riskTolerance,
      `focusLevel must be between 0 and ${MRKLI_MRAK_MAX_FOCUS_LEVEL}`,
      start,
    );
  }

  if (input.sleepHours < 0 || input.sleepHours > MRKLI_MRAK_MAX_SLEEP_HOURS) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.riskTolerance,
      `sleepHours must be between 0 and ${MRKLI_MRAK_MAX_SLEEP_HOURS}`,
      start,
    );
  }

  if (input.sessionMinutes <= 0 || input.sessionMinutes > MRKLI_MRAK_MAX_SESSION_MINUTES) {
    return invalidResult(
      input.referenceId,
      input.mode,
      input.riskTolerance,
      `sessionMinutes must be greater than 0 and at most ${MRKLI_MRAK_MAX_SESSION_MINUTES}`,
      start,
    );
  }

  if (input.supportTools && !Array.isArray(input.supportTools)) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'supportTools must be an array when provided', start);
  }

  if (input.supportTools?.some((tool) => !isSupportTool(tool))) {
    return invalidResult(input.referenceId, input.mode, input.riskTolerance, 'supportTools contains unsupported identifiers', start);
  }

  const tools = uniqueTools(input.supportTools);
  const darknessScore = computeDarknessScore(input, tools);
  const clarityScore = computeClarityScore(input, darknessScore);
  const stabilityScore = computeStabilityScore(input, tools, darknessScore);
  const confidenceScore = computeConfidenceScore(clarityScore, stabilityScore, darknessScore);
  const status = computeStatus(darknessScore, clarityScore, stabilityScore);
  const recommendedToolset = MODE_RECOMMENDED_TOOLS[input.mode].filter((tool) => !tools.includes(tool));
  const warnings = buildWarnings(input, tools, darknessScore, clarityScore, stabilityScore);

  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    mode: input.mode,
    riskTolerance: input.riskTolerance,
    darknessScore,
    clarityScore,
    stabilityScore,
    confidenceScore,
    status,
    recommendedToolset,
    warnings,
    disclaimer: MRKLI_MRAK_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getMrkliMrakHealthReport(): MrkliMrakHealthReport {
  return {
    personaId: MRKLI_MRAK_PERSONA_ID,
    displayName: MRKLI_MRAK_DISPLAY_NAME,
    slug: MRKLI_MRAK_SLUG,
    contractVersion: MRKLI_MRAK_CONTRACT_VERSION,
    moduleVersion: MRKLI_MRAK_MODULE_VERSION,
    linkedRepoImpact: MRKLI_MRAK_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedModes: [...MODES],
    supportedTools: [...SUPPORT_TOOLS],
    performanceMaxMs: MRKLI_MRAK_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: MRKLI_MRAK_API_RESPONSE_MAX_MS,
  };
}

export function _resetMrkliMrakMetrics(): void {
  evaluations = 0;
  lastStatus = 'CLEAR';
  lastEvaluatedAt = null;
}
