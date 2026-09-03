// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  PilotrelaxEnvironment,
  PilotrelaxObjective,
  PilotrelaxPhaseOfDay,
  PilotrelaxProtocol,
} from './types';

export const VALID_PILOTRELAX_OBJECTIVES: PilotrelaxObjective[] = ['RESET', 'FOCUS', 'RECOVERY', 'SLEEP'];
export const VALID_PILOTRELAX_ENVIRONMENTS: PilotrelaxEnvironment[] = ['COCKPIT', 'HOME', 'LOUNGE', 'OUTDOOR'];
export const VALID_PILOTRELAX_PHASES: PilotrelaxPhaseOfDay[] = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];

export const OBJECTIVE_BASE_BOOST: Record<PilotrelaxObjective, number> = {
  RESET: 8,
  FOCUS: 6,
  RECOVERY: 10,
  SLEEP: 12,
};

export const ENVIRONMENT_BASE_SCORE: Record<PilotrelaxEnvironment, number> = {
  COCKPIT: 44,
  HOME: 88,
  LOUNGE: 76,
  OUTDOOR: 82,
};

export const PHASE_RECOVERY_BONUS: Record<PilotrelaxPhaseOfDay, number> = {
  MORNING: 4,
  AFTERNOON: 0,
  EVENING: 8,
  NIGHT: 12,
};

export const PROTOCOL_TARGET_MINUTES: Record<PilotrelaxProtocol, number> = {
  BREATH_RESET: 12,
  SILENT_RESET: 15,
  WALK_RESET: 20,
  SLEEP_WINDDOWN: 30,
};
