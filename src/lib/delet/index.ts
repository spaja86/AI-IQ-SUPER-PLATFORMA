// SpajaUltraOmegaCore -∞Ω+∞ — DELET
// Kompanija SPAJA — Digitalna Industrija

export { evaluateDelet, getDeletHealthReport, _resetDeletMetrics } from './engine';
export { setDeletHeaders } from './route-utils';

export type {
  DeletAction,
  DeletHealthReport,
  DeletInput,
  DeletObjective,
  DeletResult,
  DeletScope,
  DeletStatus,
} from './types';

export {
  DELET_API_RESPONSE_MAX_MS,
  DELET_CONTRACT_VERSION,
  DELET_DISCLAIMER,
  DELET_DISPLAY_NAME,
  DELET_HIPERMREZA_NODE,
  DELET_LINKED_REPO_IMPACT,
  DELET_MAX_DEPENDENCY_COUNT,
  DELET_MAX_RECOVERY_WINDOW_HOURS,
  DELET_MAX_RETENTION_AGE_DAYS,
  DELET_MAX_SCORE,
  DELET_MIN_SCORE,
  DELET_MODULE_VERSION,
  DELET_OCTAVE,
  DELET_PERFORMANCE_MAX_MS,
  DELET_PERSONA_ID,
  DELET_SLUG,
} from './types';
