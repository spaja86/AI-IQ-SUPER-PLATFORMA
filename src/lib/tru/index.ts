// SpajaUltraOmegaCore -∞Ω+∞ — TRU
// Kompanija SPAJA — Digitalna Industrija

export { evaluateTru, getTruHealthReport, _resetTruMetrics } from './engine';
export { setTruHeaders } from './route-utils';

export type {
  TruAction,
  TruChannel,
  TruEvidenceLevel,
  TruHealthReport,
  TruInput,
  TruObjective,
  TruResult,
  TruStatus,
} from './types';

export {
  TRU_API_RESPONSE_MAX_MS,
  TRU_CONTRACT_VERSION,
  TRU_DISCLAIMER,
  TRU_DISPLAY_NAME,
  TRU_HIPERMREZA_NODE,
  TRU_LINKED_REPO_IMPACT,
  TRU_MAX_ESCALATION_COUNT,
  TRU_MAX_RESPONSE_LATENCY_HOURS,
  TRU_MAX_SCORE,
  TRU_MIN_SCORE,
  TRU_MODULE_VERSION,
  TRU_OCTAVE,
  TRU_PERFORMANCE_MAX_MS,
  TRU_PERSONA_ID,
  TRU_SLUG,
} from './types';
