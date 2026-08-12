// SpajaUltraOmegaCore -∞Ω+∞ — GREAT SUMBION
// Kompanija SPAJA — Digitalna Industrija

export type GreatSumbionTier = 'FOUNDATION' | 'GROWTH' | 'APEX';

export interface GreatSumbionSignalInput {
  id: string;
  value: number;
  weight: number;
}

export interface GreatSumbionInput {
  signals: GreatSumbionSignalInput[];
  referenceId?: string;
}

export interface GreatSumbionSignalResult {
  id: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface GreatSumbionResult {
  referenceId: string;
  score: number;
  tier: GreatSumbionTier;
  valid: boolean;
  warnings: string[];
  durationMs: number;
  signals: GreatSumbionSignalResult[];
}

export interface GreatSumbionHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastTier: GreatSumbionTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const GREAT_SUMBION_CONTRACT_VERSION = 'v1';
export const GREAT_SUMBION_MODULE_VERSION = '1.0.0';
export const GREAT_SUMBION_PERSONA_ID = 'great-sumbion-core';
export const GREAT_SUMBION_PERFORMANCE_MAX_MS = 50;
export const GREAT_SUMBION_API_RESPONSE_MAX_MS = 200;
