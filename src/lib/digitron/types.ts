// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON Types
// Kompanija SPAJA — Digitalna Industrija

export const DIGITRON_CONTRACT_VERSION = 'v1';
export const DIGITRON_MODULE_VERSION = '1.0.0';
export const DIGITRON_SUCCESSOR_OF = 'digit-engine';
export const DIGITRON_PERSONA_ID = 'digitron-core';
export const DIGITRON_DISPLAY_NAME = 'DIGITRON';
export const DIGITRON_SLUG = 'digitron';
export const DIGITRON_OCTAVE = 10;
export const DIGITRON_HIPERMREZA_NODE = 81;
export const DIGITRON_MIN_SCORE = 0;
export const DIGITRON_MAX_SCORE = 100;
export const DIGITRON_MIN_LATENCY_MS = 0;
export const DIGITRON_MAX_LATENCY_MS = 200;
export const DIGITRON_LOOKUP_MAX_MS = 10;
export const DIGITRON_PERFORMANCE_MAX_MS = 50;
export const DIGITRON_API_RESPONSE_MAX_MS = 200;
export const DIGITRON_LINKED_REPO_IMPACT = 'digitron-registry-sync';
export const DIGITRON_DISCLAIMER =
  'DIGITRON delivers deterministic symbolic readiness guidance and does not replace legal, medical, financial, or emergency judgment.';

export type DigitronDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DigitronMode = 'LEGACY' | 'NATIVE' | 'HYBRID';
export type DigitronStatus = 'LEGACY_FALLBACK' | 'TRANSITIONAL' | 'SYNCHRONIZED' | 'STELLAR';
export type DigitronAction = 'FALLBACK_COMPAT' | 'RECALIBRATE' | 'LOCK_SYNC' | 'SCALE_NATIVE';

export interface DigitronDescriptor {
  id: DigitronDigit;
  name: string;
  legacyName: string;
  role: string;
  octave: number;
  hipermrezaNode: number;
  linkedAgents: string[];
}

export interface DigitronInput {
  referenceId?: string;
  digit: number;
  mode: DigitronMode;
  signalStrength: number;
  syncScore: number;
  resilienceScore: number;
  latencyMs: number;
}

export interface DigitronResult {
  referenceId: string;
  digit: number | null;
  mode: DigitronMode | null;
  descriptor: DigitronDescriptor | null;
  coherenceScore: number;
  stabilityScore: number;
  latencyScore: number;
  overallScore: number;
  status: DigitronStatus;
  recommendedAction: DigitronAction;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DigitronHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  successorOf: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: DigitronStatus | null;
  lastEvaluatedAt: string | null;
  supportedModes: DigitronMode[];
  lookupMaxMs: number;
  evaluationMaxMs: number;
  apiResponseMaxMs: number;
}
