// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX Types
// Kompanija SPAJA — Digitalna Industrija

export const PILOTRELAX_CONTRACT_VERSION = 'v1';
export const PILOTRELAX_MODULE_VERSION = '1.0.0';
export const PILOTRELAX_PERSONA_ID = 'pilotrelax-calm-core';
export const PILOTRELAX_DISPLAY_NAME = 'PILOTRELAX';
export const PILOTRELAX_SLUG = 'pilotrelax';
export const PILOTRELAX_OCTAVE = 7;
export const PILOTRELAX_HIPERMREZA_NODE = 58;
export const PILOTRELAX_MIN_SCORE = 0;
export const PILOTRELAX_MAX_SCORE = 100;
export const PILOTRELAX_MAX_AVAILABLE_MINUTES = 180;
export const PILOTRELAX_MAX_BREATHING_CYCLES = 60;
export const PILOTRELAX_MAX_NOISE_LEVEL_DB = 120;
export const PILOTRELAX_MAX_SCREEN_MINUTES = 240;
export const PILOTRELAX_PERFORMANCE_MAX_MS = 50;
export const PILOTRELAX_API_RESPONSE_MAX_MS = 200;
export const PILOTRELAX_LINKED_REPO_IMPACT = 'documentation-only';
export const PILOTRELAX_DISCLAIMER =
  'PILOTRELAX provides deterministic relaxation guidance and does not replace aviation, medical, mental-health, or emergency advice.';

export type PilotrelaxObjective = 'RESET' | 'FOCUS' | 'RECOVERY' | 'SLEEP';
export type PilotrelaxEnvironment = 'COCKPIT' | 'HOME' | 'LOUNGE' | 'OUTDOOR';
export type PilotrelaxPhaseOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
export type PilotrelaxStatus = 'GROUNDED' | 'STEADY' | 'CALM' | 'DEEP_RESET';
export type PilotrelaxProtocol = 'BREATH_RESET' | 'SILENT_RESET' | 'WALK_RESET' | 'SLEEP_WINDDOWN';

export interface PilotrelaxInput {
  referenceId?: string;
  objective: PilotrelaxObjective;
  environment: PilotrelaxEnvironment;
  phaseOfDay: PilotrelaxPhaseOfDay;
  stressLoad: number;
  availableMinutes: number;
  breathingCycles: number;
  noiseLevelDb: number;
  screenMinutesBeforeBreak: number;
}

export interface PilotrelaxResult {
  referenceId: string;
  objective: PilotrelaxObjective;
  environment: PilotrelaxEnvironment;
  phaseOfDay: PilotrelaxPhaseOfDay;
  calmScore: number;
  breathingScore: number;
  environmentScore: number;
  focusScore: number;
  overallScore: number;
  status: PilotrelaxStatus;
  recommendedProtocol: PilotrelaxProtocol;
  recommendedMinutes: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface PilotrelaxHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: PilotrelaxStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: PilotrelaxObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
