// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI DESTRUKCIJA Engine
// Kompanija SPAJA — Digitalna Industrija

import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  EXTRIMLI_PERSONA_ID,
} from './types';
import type {
  DestructibleMaterial,
  DestructionInput,
  DestructionPreview,
  DestructionResult,
  DestructionSeverityLevel,
  ExtrimliDestructionHealthReport,
} from './types';
import {
  DESTRUCTIBLE_ASSET_REGISTRY,
  getDestructibleAssetById,
  getDimensionPhysicsProfile,
} from './destruction-registry';
import { clamp, round } from './utils';

const MATERIAL_FACTORS: Record<DestructibleMaterial, { severity: number; fragmentBias: number; shockwaveBias: number }> = {
  concrete:  { severity: 0.96, fragmentBias: 0.95, shockwaveBias: 0.82 },
  steel:     { severity: 0.88, fragmentBias: 0.58, shockwaveBias: 1.16 },
  glass:     { severity: 1.12, fragmentBias: 1.18, shockwaveBias: 0.72 },
  wood:      { severity: 1.02, fragmentBias: 0.84, shockwaveBias: 0.78 },
  composite: { severity: 0.94, fragmentBias: 0.76, shockwaveBias: 1.02 },
};

const SEVERITY_THRESHOLDS: { level: DestructionSeverityLevel; min: number }[] = [
  { level: 'CATASTROPHIC', min: 80 },
  { level: 'MAJOR', min: 45 },
  { level: 'MINOR', min: 0 },
];

let destructionEvaluations = 0;
let previewEvaluations = 0;
let lastSeverityScore = 0;
let lastSeverityLevel: DestructionSeverityLevel = 'MINOR';

function resolveSeverityLevel(score: number): DestructionSeverityLevel {
  for (const { level, min } of SEVERITY_THRESHOLDS) {
    if (score >= min) return level;
  }
  return 'MINOR';
}

function invalidResult(input: DestructionInput, warning: string, start: number): DestructionResult {
  return {
    referenceId: input.referenceId ?? 'n/a',
    assetId: input.assetId,
    dimension: input.dimension,
    severityScore: 0,
    severityLevel: 'MINOR',
    fragmentCount: 0,
    shockwaveRadiusM: 0,
    rollbackRecommended: false,
    degraded: false,
    degradedMode: null,
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
  };
}

function validateFiniteRange(name: string, value: number | undefined, min: number, max: number): string | null {
  if (!Number.isFinite(value) || (value as number) < min || (value as number) > max) {
    return `${name} must be a finite number in [${min}, ${max}]`;
  }
  return null;
}

function computeResult(input: DestructionInput, preview: boolean): DestructionResult {
  const start = Date.now();

  if (!input.assetId || typeof input.assetId !== 'string') {
    return invalidResult(input, 'assetId must be a non-empty string', start);
  }

  const asset = getDestructibleAssetById(input.assetId);
  if (!asset) {
    return invalidResult(input, `unsupported assetId: ${input.assetId}`, start);
  }

  const dimensionProfile = getDimensionPhysicsProfile(input.dimension);
  if (!dimensionProfile) {
    return invalidResult(input, `unsupported dimension: ${input.dimension}`, start);
  }

  if (!asset.destructibleDimensions.includes(input.dimension)) {
    return invalidResult(input, `${asset.id} does not support dimension ${input.dimension}`, start);
  }

  const rangeErrors = [
    validateFiniteRange('impactForce', input.impactForce, 0, 1000),
    validateFiniteRange('resonanceIndex', input.resonanceIndex, 0, 10),
    validateFiniteRange('containmentLevel', input.containmentLevel, 0, 10),
    input.athleteExperience === undefined
      ? null
      : validateFiniteRange('athleteExperience', input.athleteExperience, 0, 10),
  ].filter((value): value is string => value !== null);

  if (rangeErrors.length > 0) {
    return invalidResult(input, rangeErrors[0], start);
  }

  const materialFactors = MATERIAL_FACTORS[asset.material];
  const impactScore = clamp(input.impactForce / 10, 0, 100);
  const resonanceScore = clamp(input.resonanceIndex * 8, 0, 80);
  const containmentPenalty = clamp((10 - input.containmentLevel) * 6, 0, 60);
  const structuralWeakness = clamp((10 - asset.structuralIntegrity) * 4, 0, 40);
  const athletePenalty = clamp((10 - (input.athleteExperience ?? 5)) * 2.5, 0, 25);
  const dimensionInstability = clamp((1 - dimensionProfile.stabilityModifier) * 100, 0, 40);

  const baseSeverity = (
    impactScore * 0.42 +
    resonanceScore * 0.18 +
    containmentPenalty * 0.15 +
    structuralWeakness * 0.12 +
    athletePenalty * 0.05 +
    dimensionInstability * 0.08
  );

  const severityScore = round(
    clamp(
      baseSeverity *
        materialFactors.severity *
        dimensionProfile.fragmentationBias *
        dimensionProfile.energyRetention,
      0,
      100,
    ),
    2,
  );

  const severityLevel = resolveSeverityLevel(severityScore);
  const rawFragmentCount = Math.round(
    asset.maxFragments *
      (severityScore / 100) *
      materialFactors.fragmentBias *
      dimensionProfile.fragmentationBias,
  );
  const rawShockwaveRadius = round(
    clamp(
      ((input.impactForce / 35) + input.resonanceIndex * 1.4 + asset.shockwaveSensitivity) *
        materialFactors.shockwaveBias *
        dimensionProfile.shockwaveBias *
        (1 + ((10 - input.containmentLevel) / 20)),
      0,
      asset.safetyRadiusM * 2,
    ),
    2,
  );

  const warnings: string[] = [];
  let degraded = false;
  let degradedMode: string | null = null;
  let fragmentCount = rawFragmentCount;
  let shockwaveRadiusM = rawShockwaveRadius;

  if (fragmentCount > asset.maxSafeFragments) {
    fragmentCount = asset.maxSafeFragments;
    degraded = true;
    degradedMode = 'safety-clamped-output';
    warnings.push(`fragment output exceeded safe limit for ${asset.id} and was clamped`);
  }

  if (shockwaveRadiusM > asset.safetyRadiusM) {
    shockwaveRadiusM = asset.safetyRadiusM;
    degraded = true;
    degradedMode = 'safety-clamped-output';
    warnings.push(`shockwave radius exceeded safe limit for ${asset.id} and was clamped`);
  }

  if (!preview) {
    destructionEvaluations += 1;
    lastSeverityScore = severityScore;
    lastSeverityLevel = severityLevel;
  } else {
    previewEvaluations += 1;
  }

  return {
    referenceId: input.referenceId ?? 'n/a',
    assetId: input.assetId,
    dimension: input.dimension,
    severityScore,
    severityLevel,
    fragmentCount,
    shockwaveRadiusM,
    rollbackRecommended: severityLevel === 'CATASTROPHIC' || degraded,
    degraded,
    degradedMode,
    valid: true,
    warnings,
    durationMs: Date.now() - start,
  };
}

export function evaluateDestruction(input: DestructionInput): DestructionResult {
  return computeResult(input, false);
}

export function previewDestruction(input: DestructionInput): DestructionPreview {
  return {
    ...computeResult(input, true),
    activationRequired: false,
  };
}

export function getDestructionMetrics() {
  return {
    destructionEvaluations,
    previewEvaluations,
    lastSeverityScore,
    lastSeverityLevel,
  };
}

export function getExtrimliDestructionHealthReport(): ExtrimliDestructionHealthReport {
  return {
    personaId: EXTRIMLI_PERSONA_ID,
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
    destructionContractVersion: EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
    destructionEvaluations,
    previewEvaluations,
    registrySize: DESTRUCTIBLE_ASSET_REGISTRY.length,
    lastSeverityScore,
    lastSeverityLevel,
    performanceMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
  };
}

export function _resetDestructionMetrics(): void {
  destructionEvaluations = 0;
  previewEvaluations = 0;
  lastSeverityScore = 0;
  lastSeverityLevel = 'MINOR';
}
