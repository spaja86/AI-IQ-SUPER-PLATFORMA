export const SPAJA_BIOSKOP_SLUG = 'spaja-bioskop';
export const SPAJA_BIOSKOP_CONTRACT_VERSION = 'v1-spaja-bioskop';
export const SPAJA_BIOSKOP_MODULE_VERSION = '1.0.0';
export const SPAJA_BIOSKOP_PERSONA_ID = 'spaja-bioskop-core';
export const SPAJA_BIOSKOP_API_RESPONSE_MAX_MS = 200;
export const SPAJA_BIOSKOP_EVALUATION_MAX_MS = 50;
export const SPAJA_BIOSKOP_LINKED_REPO_IMPACT = 'none' as const;
export const SPAJA_BIOSKOP_VISUAL_REFERENCE =
  'https://github.com/user-attachments/assets/1ba7c168-66d8-4aaf-ad2f-ecb779a20409';

export const SPAJA_BIOSKOP_KANONSKA_SEKVENCA = [
  'KAGON',
  'ERAGON',
  'SIROKE',
  'DJUKAR',
  'EPAR',
  'DOPER',
  'OKTAN',
  'DUKAT',
] as const;

export type SpajaBioskopToken = (typeof SPAJA_BIOSKOP_KANONSKA_SEKVENCA)[number];
export type SpajaBioskopStatus = 'NORMAL' | 'WARNING' | 'BLOCKED';

export interface SpajaBioskopInput {
  sequence: string | string[];
  signalStrength?: number;
  strictOrder?: boolean;
}

export interface SpajaBioskopResult {
  valid: boolean;
  status: SpajaBioskopStatus;
  readinessScore: number;
  goNoGo: 'go' | 'no-go';
  strictOrder: boolean;
  normalizedSequence: string[];
  canonicalSequence: readonly SpajaBioskopToken[];
  mismatchedPositions: number[];
  unknownTokens: string[];
  duplicateTokens: string[];
  warnings: string[];
  errors: string[];
  governance: {
    auditRequired: true;
    humanReviewRequired: true;
    releaseCriteria: readonly string[];
    securityBoundary: 'no-secrets-in-git';
    linkedRepoImpact: 'none';
  };
  visualReference: string;
  durationMs: number;
}

export interface SpajaBioskopHealthReport {
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  personaId: string;
  canonicalTokenCount: number;
  evaluations: number;
  lastStatus: SpajaBioskopStatus | null;
  lastEvaluatedAt: string | null;
  averageDurationMs: number;
  maxDurationMs: number;
  degraded: boolean;
}

const GOVERNANCE_RELEASE_CRITERIA = [
  'audit-log',
  'human-review',
  'security-scan',
  'performance-kpi',
  'deploy-gate',
] as const;

let evaluations = 0;
let totalDuration = 0;
let maxDuration = 0;
let lastStatus: SpajaBioskopStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeSequence(sequence: string | string[]): string[] {
  const raw = Array.isArray(sequence) ? sequence.join(' ') : sequence;
  return raw
    .trim()
    .split(/\s+/)
    .map((token) => token.trim().toUpperCase())
    .filter(Boolean);
}

function computeDuplicateTokens(tokens: string[]): string[] {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([token]) => token);
}

function computeMismatches(tokens: string[]): number[] {
  const positions: number[] = [];
  for (let i = 0; i < SPAJA_BIOSKOP_KANONSKA_SEKVENCA.length; i += 1) {
    if (tokens[i] !== SPAJA_BIOSKOP_KANONSKA_SEKVENCA[i]) positions.push(i);
  }
  return positions;
}

export function evaluateSpajaBioskop(input: SpajaBioskopInput): SpajaBioskopResult {
  const startedAt = performance.now();
  const strictOrder = input.strictOrder ?? true;
  const normalizedSequence = normalizeSequence(input.sequence);

  const unknownTokens = normalizedSequence.filter(
    (token) => !SPAJA_BIOSKOP_KANONSKA_SEKVENCA.includes(token as SpajaBioskopToken),
  );
  const duplicateTokens = computeDuplicateTokens(normalizedSequence);
  const mismatchedPositions = computeMismatches(normalizedSequence);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (normalizedSequence.length === 0) errors.push('Prazna sekvenca nije dozvoljena.');
  if (normalizedSequence.length !== SPAJA_BIOSKOP_KANONSKA_SEKVENCA.length) {
    errors.push('Sekvenca mora imati tačno 8 tokena.');
  }
  if (unknownTokens.length > 0) {
    errors.push(`Nepoznati tokeni: ${unknownTokens.join(', ')}`);
  }
  if (duplicateTokens.length > 0) {
    errors.push(`Duplikati nisu dozvoljeni: ${duplicateTokens.join(', ')}`);
  }
  if (strictOrder && mismatchedPositions.length > 0) {
    errors.push(`Pogrešan redosled tokena na pozicijama: ${mismatchedPositions.join(', ')}`);
  } else if (!strictOrder && mismatchedPositions.length > 0) {
    warnings.push('Sekvenca nije u kanonskom redosledu.');
  }

  const rawSignalStrength = typeof input.signalStrength === 'number' ? input.signalStrength : 100;
  const signalStrength = Number.isFinite(rawSignalStrength) ? clamp(rawSignalStrength, 0, 100) : 0;
  if (!Number.isFinite(rawSignalStrength)) warnings.push('signalStrength nije konačan broj; primenjen fallback na 0.');

  const uniqueKnownTokens = new Set(
    normalizedSequence.filter((token) => SPAJA_BIOSKOP_KANONSKA_SEKVENCA.includes(token as SpajaBioskopToken)),
  );
  const canonicalTokenCount = [...SPAJA_BIOSKOP_KANONSKA_SEKVENCA].length;
  const coverage = canonicalTokenCount === 0
    ? 0
    : clamp(uniqueKnownTokens.size / canonicalTokenCount, 0, 1);
  const orderAccuracy = canonicalTokenCount === 0
    ? 0
    : clamp(
      (canonicalTokenCount - mismatchedPositions.length) / canonicalTokenCount,
      0,
      1,
    );
  let readinessScore = Math.round(
    clamp(coverage * 60 + orderAccuracy * 30 + (signalStrength / 100) * 10, 0, 100),
  );
  if (errors.length > 0) {
    readinessScore = Math.min(readinessScore, 49);
  }

  let status: SpajaBioskopStatus = 'NORMAL';
  if (errors.length > 0 || readinessScore < 60) status = 'BLOCKED';
  else if (warnings.length > 0 || readinessScore < 85) status = 'WARNING';

  const endedAt = performance.now();
  const durationMs = Math.max(0, Number((endedAt - startedAt).toFixed(3)));

  evaluations += 1;
  totalDuration += durationMs;
  maxDuration = Math.max(maxDuration, durationMs);
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    valid: errors.length === 0,
    status,
    readinessScore,
    goNoGo: status === 'NORMAL' ? 'go' : 'no-go',
    strictOrder,
    normalizedSequence,
    canonicalSequence: SPAJA_BIOSKOP_KANONSKA_SEKVENCA,
    mismatchedPositions,
    unknownTokens,
    duplicateTokens,
    warnings,
    errors,
    governance: {
      auditRequired: true,
      humanReviewRequired: true,
      releaseCriteria: GOVERNANCE_RELEASE_CRITERIA,
      securityBoundary: 'no-secrets-in-git',
      linkedRepoImpact: 'none',
    },
    visualReference: SPAJA_BIOSKOP_VISUAL_REFERENCE,
    durationMs,
  };
}

export function getSpajaBioskopHealthReport(): SpajaBioskopHealthReport {
  return {
    slug: SPAJA_BIOSKOP_SLUG,
    contractVersion: SPAJA_BIOSKOP_CONTRACT_VERSION,
    moduleVersion: SPAJA_BIOSKOP_MODULE_VERSION,
    personaId: SPAJA_BIOSKOP_PERSONA_ID,
    canonicalTokenCount: SPAJA_BIOSKOP_KANONSKA_SEKVENCA.length,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    averageDurationMs: evaluations === 0 ? 0 : Number((totalDuration / evaluations).toFixed(3)),
    maxDurationMs: Number(maxDuration.toFixed(3)),
    degraded: false,
  };
}

export function _resetSpajaBioskopMetrics(): void {
  evaluations = 0;
  totalDuration = 0;
  maxDuration = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
