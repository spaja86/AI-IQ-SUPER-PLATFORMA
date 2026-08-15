// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV
// Kompanija SPAJA — Digitalna Industrija

export type AdutivDomain =
  | 'SKILL'
  | 'KNOWLEDGE'
  | 'NETWORK'
  | 'RESOURCE'
  | 'REPUTATION'
  | 'CREATIVITY'
  | 'RESILIENCE'
  | 'TIMING';

export type AdutivTier = 'LATENT' | 'EMERGING' | 'ACTIVE' | 'DOMINANT' | 'APEX';

export interface AdutivStrength {
  domain: AdutivDomain;
  score: number;
  evidenceTags?: string[];
}

export interface AdutivInput {
  referenceId?: string;
  advantages: AdutivStrength[];
  context?: string;
  competitiveField?: string;
}

export interface AdutivResult {
  referenceId: string;
  apexAdut: AdutivDomain;
  tier: AdutivTier;
  portfolioScore: number;
  strengthMap: AdutivStrength[];
  activationPlan: string[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface AdutivHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastTier: AdutivTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const ADUTIV_CONTRACT_VERSION = 'v1';
export const ADUTIV_MODULE_VERSION = '1.0.0';
export const ADUTIV_PERSONA_ID = 'adutiv-core';
export const ADUTIV_OCTAVE = 14;
export const ADUTIV_HIPERMREZA_NODE = 112;
export const ADUTIV_PERFORMANCE_MAX_MS = 50;
export const ADUTIV_API_RESPONSE_MAX_MS = 200;
export const ADUTIV_MIN_SCORE = 0;
export const ADUTIV_MAX_SCORE = 100;
export const ADUTIV_BLIND_SPOT_THRESHOLD = 15;
export const ADUTIV_DISCLAIMER =
  'Ovo je automatska procena konkurentskih prednosti, a NE profesionalni karijerni ili poslovni savet. Konsultujte stručnjaka za strategijsko planiranje i razvoj.';
