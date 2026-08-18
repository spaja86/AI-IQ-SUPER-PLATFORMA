// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateDirekt,
  getDirektHealthReport,
  _resetDirektMetrics,
} from './engine';

export { setDirektHeaders } from './route-utils';

export type {
  DirektHealthReport,
  DirektInput,
  DirektResult,
  DirektSignalInput,
  DirektSignalResult,
  DirektStatus,
} from './types';

export {
  DIREKT_API_RESPONSE_MAX_MS,
  DIREKT_CONTRACT_VERSION,
  DIREKT_DEFAULT_MINIMUM_SCORE,
  DIREKT_DEFAULT_TARGET_SCORE,
  DIREKT_MODULE_VERSION,
  DIREKT_PERFORMANCE_MAX_MS,
  DIREKT_PERSONA_ID,
} from './types';
