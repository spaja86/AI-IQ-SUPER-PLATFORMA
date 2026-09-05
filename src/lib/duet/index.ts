// SpajaUltraOmegaCore -∞Ω+∞ — DUET
// Kompanija SPAJA — Digitalna Industrija

export { evaluateDuet, getDuetHealthReport, _resetDuetMetrics } from './engine';
export { setDuetHeaders } from './route-utils';

export type {
  DuetAction,
  DuetEnergyMatch,
  DuetHealthReport,
  DuetInput,
  DuetMode,
  DuetObjective,
  DuetResult,
  DuetStatus,
} from './types';

export {
  DUET_API_RESPONSE_MAX_MS,
  DUET_CONTRACT_VERSION,
  DUET_DISCLAIMER,
  DUET_DISPLAY_NAME,
  DUET_HIPERMREZA_NODE,
  DUET_LINKED_REPO_IMPACT,
  DUET_MAX_SCORE,
  DUET_MAX_SHARED_WINDOW_HOURS,
  DUET_MIN_SCORE,
  DUET_MODULE_VERSION,
  DUET_OCTAVE,
  DUET_PERFORMANCE_MAX_MS,
  DUET_PERSONA_ID,
  DUET_SLUG,
} from './types';
