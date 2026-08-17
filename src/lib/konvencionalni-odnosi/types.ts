// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI
// Kompanija SPAJA — Digitalna Industrija

export type KonvencionalniOdnosiDimension =
  | 'POVERENJE'
  | 'KOMUNIKACIJA'
  | 'POSTOVANJE'
  | 'RECIPROCITET'
  | 'STABILNOST'
  | 'GRANICE';

export type KonvencionalniOdnosiRelationType =
  | 'PARTNERSKI'
  | 'PORODICNI'
  | 'PRIJATELJSKI'
  | 'POSLOVNI'
  | 'TIMSKI';

export type KonvencionalniOdnosiTier = 'KRHKO' | 'NAPETO' | 'STABILNO' | 'SKLADNO' | 'UZORNO';

export interface KonvencionalniOdnosiDimensionScore {
  dimension: KonvencionalniOdnosiDimension;
  score: number;
}

export interface KonvencionalniOdnosiInput {
  referenceId?: string;
  relationType?: KonvencionalniOdnosiRelationType;
  dimensions: KonvencionalniOdnosiDimensionScore[];
}

export interface KonvencionalniOdnosiResult {
  referenceId: string;
  relationType: KonvencionalniOdnosiRelationType;
  score: number;
  balanceScore: number;
  tier: KonvencionalniOdnosiTier;
  dominantStrength: KonvencionalniOdnosiDimension;
  focusArea: KonvencionalniOdnosiDimension;
  dimensions: KonvencionalniOdnosiDimensionScore[];
  recommendations: string[];
  warnings: string[];
  valid: boolean;
  durationMs: number;
}

export interface KonvencionalniOdnosiHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastTier: KonvencionalniOdnosiTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const KONVENCIONALNI_ODNOSI_CONTRACT_VERSION = 'v1';
export const KONVENCIONALNI_ODNOSI_MODULE_VERSION = '1.0.0';
export const KONVENCIONALNI_ODNOSI_PERSONA_ID = 'konvencionalni-odnosi-core';
export const KONVENCIONALNI_ODNOSI_OCTAVE = 14;
export const KONVENCIONALNI_ODNOSI_HIPERMREZA_NODE = 112;
export const KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS = 50;
export const KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS = 200;
export const KONVENCIONALNI_ODNOSI_MIN_SCORE = 0;
export const KONVENCIONALNI_ODNOSI_MAX_SCORE = 100;
export const KONVENCIONALNI_ODNOSI_DEFAULT_RELATION_TYPE: KonvencionalniOdnosiRelationType = 'PARTNERSKI';
