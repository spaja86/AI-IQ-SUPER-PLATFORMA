// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST Types
// Kompanija SPAJA — Digitalna Industrija

export const DNEVNA_SVETLOST_CONTRACT_VERSION = 'v1';
export const DNEVNA_SVETLOST_MODULE_VERSION = '1.0.0';
export const DNEVNA_SVETLOST_PERSONA_ID = 'dnevna-svetlost-core';
export const DNEVNA_SVETLOST_DISPLAY_NAME = 'DNEVNA SVETLOST';
export const DNEVNA_SVETLOST_SLUG = 'dnevna-svetlost';
export const DNEVNA_SVETLOST_OCTAVE = 11;
export const DNEVNA_SVETLOST_HIPERMREZA_NODE = 90;
export const DNEVNA_SVETLOST_MAX_AMBIENT_LUX = 100000;
export const DNEVNA_SVETLOST_MAX_UV_INDEX = 11;
export const DNEVNA_SVETLOST_MAX_EXPOSURE_MINUTES = 480;
export const DNEVNA_SVETLOST_MAX_FOCUS_LEVEL = 100;
export const DNEVNA_SVETLOST_MAX_SLEEP_HOURS = 24;
export const DNEVNA_SVETLOST_MIN_SCORE = 0;
export const DNEVNA_SVETLOST_MAX_SCORE = 100;
export const DNEVNA_SVETLOST_PERFORMANCE_MAX_MS = 50;
export const DNEVNA_SVETLOST_API_RESPONSE_MAX_MS = 200;
export const DNEVNA_SVETLOST_LINKED_REPO_IMPACT = 'documentation-only';
export const DNEVNA_SVETLOST_DISCLAIMER =
  'DNEVNA SVETLOST provides deterministic daylight-exposure readiness guidance and does not replace medical advice, dermatological recommendations, or UV-protection protocols.';

export type DnevnaSvetlostMode = 'MORNING' | 'MIDDAY' | 'AFTERNOON' | 'EVENING';
export type DnevnaSvetlostUVProtection = 'NONE' | 'SPF_15' | 'SPF_30' | 'SPF_50' | 'FULL_SHADE';
export type DnevnaSvetlostStatus = 'OPTIMAL' | 'MODERATE' | 'CAUTION' | 'OVEREXPOSURE';
export type DnevnaSvetlostSupportTool = 'SUNGLASSES' | 'HAT' | 'SUNSCREEN' | 'SHADE_UMBRELLA';

export interface DnevnaSvetlostInput {
  referenceId?: string;
  mode: DnevnaSvetlostMode;
  uvProtection: DnevnaSvetlostUVProtection;
  ambientLightLux: number;
  uvIndex: number;
  focusLevel: number;
  sleepHours: number;
  exposureMinutes: number;
  supportTools?: DnevnaSvetlostSupportTool[];
}

export interface DnevnaSvetlostResult {
  referenceId: string;
  mode: DnevnaSvetlostMode;
  uvProtection: DnevnaSvetlostUVProtection;
  brightnessScore: number;
  comfortScore: number;
  productivityScore: number;
  wellbeingScore: number;
  status: DnevnaSvetlostStatus;
  recommendedToolset: DnevnaSvetlostSupportTool[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DnevnaSvetlostHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: DnevnaSvetlostStatus;
  lastEvaluatedAt: string | null;
  supportedModes: DnevnaSvetlostMode[];
  supportedTools: DnevnaSvetlostSupportTool[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
