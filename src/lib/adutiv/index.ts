// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV
// Kompanija SPAJA — Digitalna Industrija

export { evaluateAdutiv, getAdutivHealthReport, _resetAdutivMetrics } from './engine';
export { setAdutivHeaders } from './route-utils';
export { upsertAdutivSession, getSessionById, getTotalSessions, _resetRegistry } from './registry';

export type {
  AdutivDomain,
  AdutivHealthReport,
  AdutivInput,
  AdutivResult,
  AdutivStrength,
  AdutivTier,
} from './types';

export {
  ADUTIV_API_RESPONSE_MAX_MS,
  ADUTIV_BLIND_SPOT_THRESHOLD,
  ADUTIV_CONTRACT_VERSION,
  ADUTIV_DISCLAIMER,
  ADUTIV_HIPERMREZA_NODE,
  ADUTIV_MAX_SCORE,
  ADUTIV_MIN_SCORE,
  ADUTIV_MODULE_VERSION,
  ADUTIV_OCTAVE,
  ADUTIV_PERFORMANCE_MAX_MS,
  ADUTIV_PERSONA_ID,
  ADUTIV_VALID_DOMAINS,
} from './types';
