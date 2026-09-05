// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT
// Kompanija SPAJA — Digitalna Industrija

export { evaluateTrikot, getTrikotHealthReport, _resetTrikotMetrics } from './engine';
export { setTrikotHeaders } from './route-utils';

export type {
  TrikotAction,
  TrikotDressCode,
  TrikotHealthReport,
  TrikotInput,
  TrikotObjective,
  TrikotResult,
  TrikotSeason,
  TrikotStatus,
} from './types';

export {
  TRIKOT_API_RESPONSE_MAX_MS,
  TRIKOT_CONTRACT_VERSION,
  TRIKOT_DISCLAIMER,
  TRIKOT_DISPLAY_NAME,
  TRIKOT_HIPERMREZA_NODE,
  TRIKOT_LINKED_REPO_IMPACT,
  TRIKOT_MAX_ACCESSORY_COMPLEXITY,
  TRIKOT_MAX_PREP_TIME_HOURS,
  TRIKOT_MAX_SCORE,
  TRIKOT_MIN_SCORE,
  TRIKOT_MODULE_VERSION,
  TRIKOT_OCTAVE,
  TRIKOT_PERFORMANCE_MAX_MS,
  TRIKOT_PERSONA_ID,
  TRIKOT_SLUG,
} from './types';
