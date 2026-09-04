// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST
// Kompanija SPAJA — Digitalna Industrija

export type EkzistDomain =
  | 'MEANING'
  | 'PURPOSE'
  | 'IDENTITY'
  | 'CONNECTION'
  | 'AUTONOMY'
  | 'LEGACY'
  | 'TRANSCENDENCE'
  | 'DURBULE'
  | 'GROWTH';

export type EkzistTier = 'GROUNDED' | 'SEARCHING' | 'AWAKENING' | 'ALIGNED' | 'PEAK';

export type EkzistAgeGroup = 'YOUTH' | 'YOUNG_ADULT' | 'ADULT' | 'MIDLIFE' | 'SENIOR';

export interface EkzistDomainScore {
  domain: EkzistDomain;
  score: number;
}

export interface EkzistInput {
  referenceId?: string;
  domains: EkzistDomainScore[];
  lifePressures?: string[];
  ageGroup?: EkzistAgeGroup;
  sessionNotes?: string;
}

export interface EkzistResult {
  referenceId: string;
  dominantVector: EkzistDomain;
  tier: EkzistTier;
  balanceScore: number;
  dimensionScores: EkzistDomainScore[];
  recommendations: string[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface EkzistHealthReport {
  personaId: string;
  displayName: string;
  canonicalSlug: string;
  aliases: string[];
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastTier: EkzistTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const EKZIST_DISPLAY_NAME = 'EKZIST';
export const EKZIST_CANONICAL_SLUG = 'ekzist';
export const EKZIST_ALIASES = ['exist'] as const;
export const EKZIST_ALLOWED_DOMAINS: EkzistDomain[] = [
  'MEANING',
  'PURPOSE',
  'IDENTITY',
  'CONNECTION',
  'AUTONOMY',
  'LEGACY',
  'TRANSCENDENCE',
  'DURBULE',
  'GROWTH',
];
export const EKZIST_ALLOWED_AGE_GROUPS: EkzistAgeGroup[] = [
  'YOUTH',
  'YOUNG_ADULT',
  'ADULT',
  'MIDLIFE',
  'SENIOR',
];

export const EKZIST_CONTRACT_VERSION = 'v1';
export const EKZIST_MODULE_VERSION = '1.0.0';
export const EKZIST_PERSONA_ID = 'ekzist-core';
export const EKZIST_OCTAVE = 2;
export const EKZIST_HIPERMREZA_NODE = 16;
export const EKZIST_PERFORMANCE_MAX_MS = 50;
export const EKZIST_API_RESPONSE_MAX_MS = 200;
export const EKZIST_MIN_SCORE = 0;
export const EKZIST_MAX_SCORE = 100;
export const EKZIST_IMBALANCE_LOW_THRESHOLD = 10;
export const EKZIST_IMBALANCE_HIGH_THRESHOLD = 95;
export const EKZIST_DISCLAIMER =
  'Ovo je automatska egzistencijalna procena, a NE psihološki ili psihoterapeutski savet. Konsultujte stručnjaka za podršku u ličnom razvoju i smislu.';

export const EKZIST_HEADERS = {
  CONTRACT_VERSION: 'X-Ekzist-Contract-Version',
  MODULE_VERSION: 'X-Ekzist-Module-Version',
  DISPLAY_NAME: 'X-Ekzist-Display-Name',
  CANONICAL_SLUG: 'X-Ekzist-Canonical-Slug',
  PERSONA_ID: 'X-Ekzist-Persona-Id',
  EVAL_KPI_MS: 'X-Ekzist-Eval-KPI-Ms',
  API_KPI_MS: 'X-Ekzist-Api-KPI-Ms',
  TIER: 'X-Ekzist-Tier',
  DOMAIN: 'X-Ekzist-Domain',
  VALID: 'X-Ekzist-Valid',
} as const;

export function isEkzistDomain(value: unknown): value is EkzistDomain {
  return typeof value === 'string' && EKZIST_ALLOWED_DOMAINS.includes(value as EkzistDomain);
}

export function isEkzistAgeGroup(value: unknown): value is EkzistAgeGroup {
  return typeof value === 'string' && EKZIST_ALLOWED_AGE_GROUPS.includes(value as EkzistAgeGroup);
}
