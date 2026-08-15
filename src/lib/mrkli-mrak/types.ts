// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK Types
// Kompanija SPAJA — Digitalna Industrija

export const MRKLI_MRAK_CONTRACT_VERSION = 'v1';
export const MRKLI_MRAK_MODULE_VERSION = '1.0.0';
export const MRKLI_MRAK_PERSONA_ID = 'mrkli-mrak-core';
export const MRKLI_MRAK_DISPLAY_NAME = 'MRKLI MRAK';
export const MRKLI_MRAK_SLUG = 'mrkli-mrak';
export const MRKLI_MRAK_OCTAVE = 11;
export const MRKLI_MRAK_HIPERMREZA_NODE = 89;
export const MRKLI_MRAK_MIN_SCORE = 0;
export const MRKLI_MRAK_MAX_SCORE = 100;
export const MRKLI_MRAK_MAX_AMBIENT_LUX = 500;
export const MRKLI_MRAK_MAX_SESSION_MINUTES = 300;
export const MRKLI_MRAK_MAX_SLEEP_HOURS = 24;
export const MRKLI_MRAK_MAX_FOCUS_LEVEL = 100;
export const MRKLI_MRAK_PERFORMANCE_MAX_MS = 50;
export const MRKLI_MRAK_API_RESPONSE_MAX_MS = 200;
export const MRKLI_MRAK_LINKED_REPO_IMPACT = 'documentation-only';
export const MRKLI_MRAK_DISCLAIMER =
  'MRKLI MRAK provides deterministic darkness-navigation readiness guidance and does not replace safety protocols, operator supervision, or emergency procedures.';

export type MrkliMrakMode = 'EXPLORATION' | 'STEALTH' | 'RECOVERY';
export type MrkliMrakRiskTolerance = 'LOW' | 'MEDIUM' | 'HIGH';
export type MrkliMrakSupportTool = 'FLASHLIGHT' | 'NIGHT_VISION' | 'AUDIO_CUES' | 'MAP';
export type MrkliMrakStatus = 'CLEAR' | 'CAUTION' | 'DENSE' | 'BLACKOUT';

export interface MrkliMrakInput {
  referenceId?: string;
  mode: MrkliMrakMode;
  riskTolerance: MrkliMrakRiskTolerance;
  ambientLightLux: number;
  focusLevel: number;
  sleepHours: number;
  sessionMinutes: number;
  supportTools?: MrkliMrakSupportTool[];
}

export interface MrkliMrakResult {
  referenceId: string;
  mode: MrkliMrakMode;
  riskTolerance: MrkliMrakRiskTolerance;
  darknessScore: number;
  clarityScore: number;
  stabilityScore: number;
  confidenceScore: number;
  status: MrkliMrakStatus;
  recommendedToolset: MrkliMrakSupportTool[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface MrkliMrakHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: MrkliMrakStatus;
  lastEvaluatedAt: string | null;
  supportedModes: MrkliMrakMode[];
  supportedTools: MrkliMrakSupportTool[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
