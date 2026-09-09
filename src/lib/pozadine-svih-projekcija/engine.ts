// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  PozadineSvihProjekcijaDuplicateDelta,
  PozadineSvihProjekcijaHealthReport,
  PozadineSvihProjekcijaInput,
  PozadineSvihProjekcijaResult,
  PozadineSvihProjekcijaStatus,
} from './types';
import {
  POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
  POZADINE_SVIH_PROJEKCIJA_DISCLAIMER,
  POZADINE_SVIH_PROJEKCIJA_DISPLAY_NAME,
  POZADINE_SVIH_PROJEKCIJA_LINKED_REPO_IMPACT,
  POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH,
  POZADINE_SVIH_PROJEKCIJA_MIN_SIGNAL_STRENGTH,
  POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION,
  POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_PERSONA_ID,
  POZADINE_SVIH_PROJEKCIJA_SLUG,
} from './types';
import {
  ACTION_BY_STATUS,
  OFFICIAL_PROJECTION_SEQUENCE,
  OFFICIAL_PROJECTION_UNIQUE_LAYERS,
  OFFICIAL_SEQUENCE_LENGTH,
  STRICT_ORDER_DEFAULT,
} from './registry';

let evaluations = 0;
let lastStatus: PozadineSvihProjekcijaStatus | null = null;
let lastEvaluatedAt: string | null = null;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeLayer(token: string): string {
  return token.trim().toUpperCase();
}

function tokenizeExpression(expression: string): string[] {
  return expression
    .split(/\s+/)
    .map(normalizeLayer)
    .filter((layer) => layer.length > 0);
}

function countLayers(layers: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const layer of layers) {
    counts.set(layer, (counts.get(layer) ?? 0) + 1);
  }
  return counts;
}

function recordEvaluation(status: PozadineSvihProjekcijaStatus): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): PozadineSvihProjekcijaResult {
  const status: PozadineSvihProjekcijaStatus = 'INVALID';
  recordEvaluation(status);

  return {
    referenceId: referenceId ?? 'n/a',
    projectionExpression: null,
    normalizedLayers: [],
    equivalent: false,
    status,
    recommendedAction: ACTION_BY_STATUS[status],
    strictOrderApplied: STRICT_ORDER_DEFAULT,
    orderMatch: false,
    signalStrength: POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH,
    matchRatio: 0,
    missingLayers: [...OFFICIAL_PROJECTION_SEQUENCE],
    extraLayers: [],
    unknownLayers: [],
    duplicateDelta: [],
    warnings: [warning],
    disclaimer: POZADINE_SVIH_PROJEKCIJA_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

export function evaluatePozadineSvihProjekcija(input: PozadineSvihProjekcijaInput): PozadineSvihProjekcijaResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  const strictOrder = input.strictOrder ?? STRICT_ORDER_DEFAULT;

  if (typeof strictOrder !== 'boolean') {
    return invalidResult(input.referenceId, 'strictOrder must be a boolean when provided', start);
  }

  const signalStrength = input.signalStrength ?? POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH;

  if (!Number.isFinite(signalStrength)) {
    return invalidResult(input.referenceId, 'signalStrength must be a finite number', start);
  }

  if (
    signalStrength < POZADINE_SVIH_PROJEKCIJA_MIN_SIGNAL_STRENGTH ||
    signalStrength > POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH
  ) {
    return invalidResult(
      input.referenceId,
      `signalStrength must be within ${POZADINE_SVIH_PROJEKCIJA_MIN_SIGNAL_STRENGTH}..${POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH}`,
      start,
    );
  }

  const expression = typeof input.projectionExpression === 'string' ? input.projectionExpression : null;
  const expressionLayers = expression ? tokenizeExpression(expression) : [];
  const arrayLayers = Array.isArray(input.layers)
    ? input.layers.map((layer) => normalizeLayer(layer)).filter((layer) => layer.length > 0)
    : [];

  const normalizedLayers = arrayLayers.length > 0 ? arrayLayers : expressionLayers;

  if (normalizedLayers.length === 0) {
    return invalidResult(input.referenceId, 'projectionExpression or layers must provide at least one layer', start);
  }

  const officialSet = new Set<string>(OFFICIAL_PROJECTION_UNIQUE_LAYERS);
  const unknownLayers = normalizedLayers.filter((layer) => !officialSet.has(layer));

  const actualCounts = countLayers(normalizedLayers);
  const expectedCounts = countLayers(OFFICIAL_PROJECTION_SEQUENCE);

  const missingLayers: string[] = [];
  const extraLayers: string[] = [];
  const duplicateDelta: PozadineSvihProjekcijaDuplicateDelta[] = [];

  for (const [token, expectedCount] of expectedCounts.entries()) {
    const actualCount = actualCounts.get(token) ?? 0;
    if (actualCount < expectedCount) {
      for (let i = 0; i < expectedCount - actualCount; i += 1) missingLayers.push(token);
    }
    if (actualCount !== expectedCount) {
      duplicateDelta.push({ token, expectedCount, actualCount });
    }
  }

  for (const [token, actualCount] of actualCounts.entries()) {
    if (!expectedCounts.has(token)) {
      for (let i = 0; i < actualCount; i += 1) extraLayers.push(token);
      continue;
    }

    const expectedCount = expectedCounts.get(token) ?? 0;
    if (actualCount > expectedCount) {
      for (let i = 0; i < actualCount - expectedCount; i += 1) extraLayers.push(token);
    }
  }

  const orderMatch =
    normalizedLayers.length === OFFICIAL_SEQUENCE_LENGTH &&
    normalizedLayers.every((layer, index) => layer === OFFICIAL_PROJECTION_SEQUENCE[index]);

  const equivalentByCounts = missingLayers.length === 0 && extraLayers.length === 0 && unknownLayers.length === 0;
  const equivalent = equivalentByCounts && (strictOrder ? orderMatch : true);

  const matchedKnownCount = normalizedLayers.reduce((acc, layer) => acc + (officialSet.has(layer) ? 1 : 0), 0);
  const matchRatio = round2((Math.min(matchedKnownCount, OFFICIAL_SEQUENCE_LENGTH) / OFFICIAL_SEQUENCE_LENGTH) * 100);

  const status: PozadineSvihProjekcijaStatus =
    unknownLayers.length > 0 ? 'NEPOZNATO' : equivalent ? 'EKVIVALENTNA' : 'ODSTUPANJE';

  const warnings: string[] = [];

  if (unknownLayers.length > 0) {
    warnings.push(`Nepoznati slojevi: ${unknownLayers.join(', ')}`);
  }

  if (missingLayers.length > 0) {
    warnings.push(`Nedostajući slojevi: ${missingLayers.join(', ')}`);
  }

  if (extraLayers.length > 0) {
    warnings.push(`Višak slojeva: ${extraLayers.join(', ')}`);
  }

  if (strictOrder && equivalentByCounts && !orderMatch) {
    warnings.push('Svi slojevi postoje, ali redosled nije ekvivalentan zvaničnom nizu.');
  }

  if (duplicateDelta.some((entry) => entry.token === 'NIKOS' && entry.actualCount !== entry.expectedCount)) {
    warnings.push('Token NIKOS mora biti prisutan tačno 2 puta u ekvivalentnoj projekciji.');
  }

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    projectionExpression: expression,
    normalizedLayers,
    equivalent,
    status,
    recommendedAction: ACTION_BY_STATUS[status],
    strictOrderApplied: strictOrder,
    orderMatch,
    signalStrength,
    matchRatio,
    missingLayers,
    extraLayers,
    unknownLayers,
    duplicateDelta,
    warnings,
    disclaimer: POZADINE_SVIH_PROJEKCIJA_DISCLAIMER,
    valid: status !== 'NEPOZNATO',
    durationMs: round2(performance.now() - start),
  };
}

export function getPozadineSvihProjekcijaHealthReport(): PozadineSvihProjekcijaHealthReport {
  return {
    personaId: POZADINE_SVIH_PROJEKCIJA_PERSONA_ID,
    displayName: POZADINE_SVIH_PROJEKCIJA_DISPLAY_NAME,
    slug: POZADINE_SVIH_PROJEKCIJA_SLUG,
    contractVersion: POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
    moduleVersion: POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION,
    linkedRepoImpact: POZADINE_SVIH_PROJEKCIJA_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    officialLayerCount: OFFICIAL_SEQUENCE_LENGTH,
    officialUniqueLayerCount: OFFICIAL_PROJECTION_UNIQUE_LAYERS.length,
    strictOrderDefault: STRICT_ORDER_DEFAULT,
    performanceMaxMs: POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
  };
}

export function _resetPozadineSvihProjekcijaMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
