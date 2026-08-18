// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT
// Kompanija SPAJA — Digitalna Industrija

export type DirektStatus = 'VAGUE' | 'PARTIAL' | 'DIRECT' | 'PRECISE';

export interface DirektSignalInput {
  id: string;
  label: string;
  score: number;
  weight: number;
  required?: boolean;
  exampleCount?: number;
}

export interface DirektInput {
  signals: DirektSignalInput[];
  referenceId?: string;
  minimumScore?: number;
  targetScore?: number;
}

export interface DirektSignalResult {
  id: string;
  label: string;
  score: number;
  weight: number;
  required: boolean;
  exampleCount: number;
  contribution: number;
  meetsMinimumScore: boolean;
  hasExample: boolean;
}

export interface DirektResult {
  referenceId: string;
  overallScore: number;
  status: DirektStatus;
  valid: boolean;
  warnings: string[];
  durationMs: number;
  coveragePct: number;
  minimumScore: number;
  targetScore: number;
  targetDelta: number;
  requiredSatisfied: boolean;
  signals: DirektSignalResult[];
}

export interface DirektHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastStatus: DirektStatus;
  lastEvaluatedAt: string | null;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  defaultMinimumScore: number;
  defaultTargetScore: number;
}

export const DIREKT_CONTRACT_VERSION = 'v1';
export const DIREKT_MODULE_VERSION = '1.0.0';
export const DIREKT_PERSONA_ID = 'direkt-communication-core';
export const DIREKT_PERFORMANCE_MAX_MS = 50;
export const DIREKT_API_RESPONSE_MAX_MS = 200;
export const DIREKT_DEFAULT_MINIMUM_SCORE = 65;
export const DIREKT_DEFAULT_TARGET_SCORE = 78;
