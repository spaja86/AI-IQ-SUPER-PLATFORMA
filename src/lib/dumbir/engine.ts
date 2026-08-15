// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  DumbirAddon,
  DumbirGoal,
  DumbirHealthReport,
  DumbirInput,
  DumbirPreparation,
  DumbirResult,
  DumbirSensitivity,
  DumbirStatus,
} from './types';
import {
  DUMBIR_API_RESPONSE_MAX_MS,
  DUMBIR_CONTRACT_VERSION,
  DUMBIR_DISCLAIMER,
  DUMBIR_DISPLAY_NAME,
  DUMBIR_LINKED_REPO_IMPACT,
  DUMBIR_MAX_GINGER_GRAMS,
  DUMBIR_MAX_SERVINGS,
  DUMBIR_MAX_STEEP_MINUTES,
  DUMBIR_MAX_WATER_ML,
  DUMBIR_MAX_SCORE,
  DUMBIR_MIN_SCORE,
  DUMBIR_MODULE_VERSION,
  DUMBIR_PERFORMANCE_MAX_MS,
  DUMBIR_PERSONA_ID,
  DUMBIR_SLUG,
} from './types';

const GOALS = ['DIGESTION', 'IMMUNITY', 'FOCUS', 'RECOVERY'] as const;
const SENSITIVITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const PREPARATIONS = ['TEA', 'SHOT', 'TONIC', 'MEAL'] as const;
const ADDONS = ['LEMON', 'HONEY', 'MINT', 'TURMERIC'] as const;

const PREPARATION_POTENCY_BONUS: Record<DumbirPreparation, number> = {
  TEA: 0,
  SHOT: 12,
  TONIC: 4,
  MEAL: -4,
};

const PREPARATION_GOAL_BONUS: Record<DumbirGoal, Record<DumbirPreparation, number>> = {
  DIGESTION: { TEA: 8, SHOT: 2, TONIC: 6, MEAL: 4 },
  IMMUNITY: { TEA: 8, SHOT: 10, TONIC: 5, MEAL: 2 },
  FOCUS: { TEA: 4, SHOT: 8, TONIC: 9, MEAL: 1 },
  RECOVERY: { TEA: 8, SHOT: -2, TONIC: 4, MEAL: 7 },
};

const ADDON_POTENCY_BONUS: Record<DumbirAddon, number> = {
  LEMON: 2,
  HONEY: -2,
  MINT: -3,
  TURMERIC: 6,
};

const ADDON_COMFORT_BONUS: Record<DumbirAddon, number> = {
  LEMON: 2,
  HONEY: 6,
  MINT: 5,
  TURMERIC: 1,
};

const GOAL_TARGET_CENTER: Record<DumbirGoal, number> = {
  DIGESTION: 58,
  IMMUNITY: 72,
  FOCUS: 55,
  RECOVERY: 52,
};

const GOAL_ADDON_BONUS: Record<DumbirGoal, Partial<Record<DumbirAddon, number>>> = {
  DIGESTION: { LEMON: 6, MINT: 8, HONEY: 2, TURMERIC: 2 },
  IMMUNITY: { LEMON: 8, HONEY: 6, TURMERIC: 10 },
  FOCUS: { LEMON: 5, MINT: 7, HONEY: 1 },
  RECOVERY: { HONEY: 8, TURMERIC: 6, MINT: 3 },
};

const SENSITIVITY_MULTIPLIER: Record<DumbirSensitivity, number> = {
  LOW: 0.18,
  MEDIUM: 0.35,
  HIGH: 0.55,
};

const SENSITIVITY_POTENCY_LIMIT: Record<DumbirSensitivity, number> = {
  LOW: 85,
  MEDIUM: 70,
  HIGH: 50,
};

const GOAL_RECOMMENDED_ADDONS: Record<DumbirGoal, DumbirAddon[]> = {
  DIGESTION: ['MINT', 'LEMON'],
  IMMUNITY: ['TURMERIC', 'HONEY'],
  FOCUS: ['LEMON', 'MINT'],
  RECOVERY: ['HONEY', 'TURMERIC'],
};

let evaluations = 0;
let lastStatus: DumbirStatus = 'LIGHT';
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isGoal(value: unknown): value is DumbirGoal {
  return typeof value === 'string' && GOALS.includes(value as DumbirGoal);
}

function isSensitivity(value: unknown): value is DumbirSensitivity {
  return typeof value === 'string' && SENSITIVITIES.includes(value as DumbirSensitivity);
}

function isPreparation(value: unknown): value is DumbirPreparation {
  return typeof value === 'string' && PREPARATIONS.includes(value as DumbirPreparation);
}

function isAddon(value: unknown): value is DumbirAddon {
  return typeof value === 'string' && ADDONS.includes(value as DumbirAddon);
}

function uniqueAddons(addons: DumbirAddon[] | undefined): DumbirAddon[] {
  return Array.from(new Set(addons ?? []));
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DumbirResult {
  return {
    referenceId: referenceId ?? 'n/a',
    goal: 'DIGESTION',
    preparation: 'TEA',
    potencyScore: 0,
    comfortScore: 0,
    goalFitScore: 0,
    balanceScore: 0,
    status: 'LIGHT',
    recommendedServingMl: 0,
    recommendedAddons: [],
    warnings: [warning],
    disclaimer: DUMBIR_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computePotencyScore(input: DumbirInput, addons: DumbirAddon[]): number {
  const servings = input.servings ?? 1;
  const perServingGinger = input.gingerGrams / servings;
  const addonPotency = addons.reduce((sum, addon) => sum + ADDON_POTENCY_BONUS[addon], 0);
  const raw =
    perServingGinger * 8 +
    input.steepMinutes * 1.2 +
    PREPARATION_POTENCY_BONUS[input.preparation] +
    addonPotency;
  return round2(clamp(raw, DUMBIR_MIN_SCORE, DUMBIR_MAX_SCORE));
}

function computeComfortScore(
  input: DumbirInput,
  addons: DumbirAddon[],
  potencyScore: number,
): number {
  const servings = input.servings ?? 1;
  const waterPerServing = input.waterMl / servings;
  const hydrationCredit = clamp(waterPerServing / 25, 0, 20);
  const addonComfort = addons.reduce((sum, addon) => sum + ADDON_COMFORT_BONUS[addon], 0);
  const shotPenalty = input.preparation === 'SHOT' ? 10 : 0;
  const raw =
    100 -
    potencyScore * SENSITIVITY_MULTIPLIER[input.sensitivity] -
    shotPenalty +
    hydrationCredit +
    addonComfort;
  return round2(clamp(raw, DUMBIR_MIN_SCORE, DUMBIR_MAX_SCORE));
}

function computeGoalFitScore(
  input: DumbirInput,
  addons: DumbirAddon[],
  potencyScore: number,
): number {
  const center = GOAL_TARGET_CENTER[input.goal];
  const prepBonus = PREPARATION_GOAL_BONUS[input.goal][input.preparation];
  const addonBonus = addons.reduce(
    (sum, addon) => sum + (GOAL_ADDON_BONUS[input.goal][addon] ?? 0),
    0,
  );
  const raw = 100 - Math.abs(potencyScore - center) * 1.6 + prepBonus + addonBonus;
  return round2(clamp(raw, DUMBIR_MIN_SCORE, DUMBIR_MAX_SCORE));
}

function computeBalanceScore(potencyScore: number, comfortScore: number, goalFitScore: number): number {
  const potencyBalance = 100 - Math.abs(potencyScore - 60);
  const raw = goalFitScore * 0.45 + comfortScore * 0.35 + potencyBalance * 0.2;
  return round2(clamp(raw, DUMBIR_MIN_SCORE, DUMBIR_MAX_SCORE));
}

function computeStatus(
  potencyScore: number,
  comfortScore: number,
  goalFitScore: number,
  balanceScore: number,
): DumbirStatus {
  if (potencyScore >= 85 || comfortScore < 30) return 'INTENSE';
  if (goalFitScore >= 80 && comfortScore >= 55) return 'BOOSTED';
  if (potencyScore < 30 || balanceScore < 45) return 'LIGHT';
  return 'BALANCED';
}

function computeRecommendedServingMl(status: DumbirStatus, waterMl: number, servings: number): number {
  const base = waterMl / servings;
  const multiplier =
    status === 'INTENSE' ? 0.75 :
    status === 'LIGHT' ? 1.1 :
    1;
  return Math.max(0, Math.round(base * multiplier));
}

function buildWarnings(
  input: DumbirInput,
  addons: DumbirAddon[],
  potencyScore: number,
  comfortScore: number,
  goalFitScore: number,
): string[] {
  const warnings: string[] = [];
  const servings = input.servings ?? 1;
  const waterPerServing = input.waterMl / servings;
  const sensitivityLimit = SENSITIVITY_POTENCY_LIMIT[input.sensitivity];

  if (potencyScore > sensitivityLimit) {
    warnings.push(
      `Potency score ${potencyScore} exceeds the ${input.sensitivity.toLowerCase()} sensitivity comfort threshold ${sensitivityLimit}.`,
    );
  }

  if (waterPerServing < 100) {
    warnings.push(`Water per serving (${round2(waterPerServing)}ml) is low for a balanced ginger preparation.`);
  }

  if (input.preparation === 'SHOT' && input.sensitivity === 'HIGH') {
    warnings.push('High sensitivity + SHOT preparation is likely too aggressive for v1 comfort targets.');
  }

  if (goalFitScore < 50) {
    warnings.push(`Current blend does not strongly fit the selected goal ${input.goal}.`);
  }

  if (comfortScore < 40 && !addons.includes('HONEY')) {
    warnings.push('Consider HONEY as a comfort-balancing addon.');
  }

  return warnings;
}

export function evaluateDumbir(input: DumbirInput): DumbirResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isGoal(input.goal)) {
    return invalidResult(input.referenceId, 'goal must be one of: DIGESTION, IMMUNITY, FOCUS, RECOVERY', start);
  }

  if (!isSensitivity(input.sensitivity)) {
    return invalidResult(input.referenceId, 'sensitivity must be one of: LOW, MEDIUM, HIGH', start);
  }

  if (!isPreparation(input.preparation)) {
    return invalidResult(input.referenceId, 'preparation must be one of: TEA, SHOT, TONIC, MEAL', start);
  }

  if (typeof input.gingerGrams !== 'number' || !Number.isFinite(input.gingerGrams)) {
    return invalidResult(input.referenceId, 'gingerGrams must be a finite number', start);
  }

  if (typeof input.waterMl !== 'number' || !Number.isFinite(input.waterMl)) {
    return invalidResult(input.referenceId, 'waterMl must be a finite number', start);
  }

  if (typeof input.steepMinutes !== 'number' || !Number.isFinite(input.steepMinutes)) {
    return invalidResult(input.referenceId, 'steepMinutes must be a finite number', start);
  }

  const servings = input.servings ?? 1;
  if (!Number.isInteger(servings) || servings <= 0 || servings > DUMBIR_MAX_SERVINGS) {
    return invalidResult(input.referenceId, `servings must be an integer between 1 and ${DUMBIR_MAX_SERVINGS}`, start);
  }

  if (input.gingerGrams <= 0 || input.gingerGrams > DUMBIR_MAX_GINGER_GRAMS) {
    return invalidResult(input.referenceId, `gingerGrams must be between 0 and ${DUMBIR_MAX_GINGER_GRAMS}`, start);
  }

  if (input.waterMl <= 0 || input.waterMl > DUMBIR_MAX_WATER_ML) {
    return invalidResult(input.referenceId, `waterMl must be between 0 and ${DUMBIR_MAX_WATER_ML}`, start);
  }

  if (input.steepMinutes < 0 || input.steepMinutes > DUMBIR_MAX_STEEP_MINUTES) {
    return invalidResult(
      input.referenceId,
      `steepMinutes must be between 0 and ${DUMBIR_MAX_STEEP_MINUTES}`,
      start,
    );
  }

  if (input.addons && !Array.isArray(input.addons)) {
    return invalidResult(input.referenceId, 'addons must be an array when provided', start);
  }

  if (input.addons?.some((addon) => !isAddon(addon))) {
    return invalidResult(input.referenceId, 'addons contains unsupported identifiers', start);
  }

  const addons = uniqueAddons(input.addons);
  const potencyScore = computePotencyScore(input, addons);
  const comfortScore = computeComfortScore(input, addons, potencyScore);
  const goalFitScore = computeGoalFitScore(input, addons, potencyScore);
  const balanceScore = computeBalanceScore(potencyScore, comfortScore, goalFitScore);
  const status = computeStatus(potencyScore, comfortScore, goalFitScore, balanceScore);
  const recommendedServingMl = computeRecommendedServingMl(status, input.waterMl, servings);
  const recommendedAddons = GOAL_RECOMMENDED_ADDONS[input.goal].filter((addon) => !addons.includes(addon));
  const warnings = buildWarnings(input, addons, potencyScore, comfortScore, goalFitScore);

  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    goal: input.goal,
    preparation: input.preparation,
    potencyScore,
    comfortScore,
    goalFitScore,
    balanceScore,
    status,
    recommendedServingMl,
    recommendedAddons,
    warnings,
    disclaimer: DUMBIR_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getDumbirHealthReport(): DumbirHealthReport {
  return {
    personaId: DUMBIR_PERSONA_ID,
    displayName: DUMBIR_DISPLAY_NAME,
    slug: DUMBIR_SLUG,
    contractVersion: DUMBIR_CONTRACT_VERSION,
    moduleVersion: DUMBIR_MODULE_VERSION,
    linkedRepoImpact: DUMBIR_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedAddons: [...ADDONS],
    performanceMaxMs: DUMBIR_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DUMBIR_API_RESPONSE_MAX_MS,
  };
}

export function _resetDumbirMetrics(): void {
  evaluations = 0;
  lastStatus = 'LIGHT';
  lastEvaluatedAt = null;
}
