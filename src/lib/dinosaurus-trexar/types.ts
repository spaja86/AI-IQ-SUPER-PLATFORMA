// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar
// Kompanija SPAJA — Digitalna Industrija

export type TrexarAgeCategory = 'JUVENILE' | 'ADULT' | 'ELDER';

export type TrexarStatus =
  | 'APEX'
  | 'HUNT_READY'
  | 'ADAPTIVE'
  | 'STRESSED'
  | 'CRITICAL';

export type TrexarTier = 'S' | 'A' | 'B' | 'C';

export interface TrexarInput {
  referenceId?: string;
  profile: {
    specimenId?: string;
    ageCategory: TrexarAgeCategory;
    massKg: number;
  };
  signals: {
    stamina: number;
    aggression: number;
    focus: number;
    threatLevel: number;
    terrainFriction: number;
    packSupport: number;
    reactionMs: number;
  };
}

export interface TrexarResult {
  referenceId: string;
  specimenId: string;
  trexarScore: number;
  status: TrexarStatus;
  tier: TrexarTier;
  recommendation: string;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface TrexarHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastStatus: TrexarStatus;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const DINOSAURUS_TREXAR_CONTRACT_VERSION = 'v1';
export const DINOSAURUS_TREXAR_MODULE_VERSION = '1.0.0';
export const DINOSAURUS_TREXAR_PERSONA_ID = 'dinosaurus-trexar-core';
export const DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS = 50;
export const DINOSAURUS_TREXAR_API_RESPONSE_MAX_MS = 200;

export const DINOSAURUS_TREXAR_SIGNAL_MIN = 0;
export const DINOSAURUS_TREXAR_SIGNAL_MAX = 100;
export const DINOSAURUS_TREXAR_MAX_REACTION_MS = 600;
export const DINOSAURUS_TREXAR_MAX_MASS_KG = 15000;
