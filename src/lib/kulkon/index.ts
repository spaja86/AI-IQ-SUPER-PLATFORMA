// SpajaUltraOmegaCore -∞Ω+∞ — KULKON
// Kompanija SPAJA — Digitalna Industrija

export { evaluateKulkon, getKulkonHealthReport, _resetKulkonMetrics } from './engine';
export { setKulkonHeaders } from './route-utils';

export type {
  KulkonAction,
  KulkonEnvironment,
  KulkonHealthReport,
  KulkonInput,
  KulkonObjective,
  KulkonResult,
  KulkonRhythm,
  KulkonStatus,
} from './types';

export {
  KULKON_API_RESPONSE_MAX_MS,
  KULKON_CONTRACT_VERSION,
  KULKON_DISCLAIMER,
  KULKON_DISPLAY_NAME,
  KULKON_HIPERMREZA_NODE,
  KULKON_LINKED_REPO_IMPACT,
  KULKON_MAX_PARTICIPANTS,
  KULKON_MAX_SCORE,
  KULKON_MAX_WINDOW_DAYS,
  KULKON_MIN_SCORE,
  KULKON_MODULE_VERSION,
  KULKON_OCTAVE,
  KULKON_PERFORMANCE_MAX_MS,
  KULKON_PERSONA_ID,
  KULKON_SLUG,
} from './types';
