// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST
// Kompanija SPAJA — Digitalna Industrija

export { evaluateEkzist, getEkzistHealthReport, _resetEkzistMetrics } from './engine';
export { setEkzistHeaders } from './route-utils';
export { upsertEkzistSession, getSessionById, getTotalSessions, _resetRegistry } from './registry';

export type {
  EkzistAgeGroup,
  EkzistDomain,
  EkzistDomainScore,
  EkzistHealthReport,
  EkzistInput,
  EkzistResult,
  EkzistTier,
} from './types';

export {
  EKZIST_API_RESPONSE_MAX_MS,
  EKZIST_ALIASES,
  EKZIST_ALLOWED_AGE_GROUPS,
  EKZIST_ALLOWED_DOMAINS,
  EKZIST_CANONICAL_SLUG,
  EKZIST_CONTRACT_VERSION,
  EKZIST_DISPLAY_NAME,
  EKZIST_HEADERS,
  EKZIST_DISCLAIMER,
  EKZIST_HIPERMREZA_NODE,
  EKZIST_IMBALANCE_HIGH_THRESHOLD,
  EKZIST_IMBALANCE_LOW_THRESHOLD,
  EKZIST_MAX_SCORE,
  EKZIST_MIN_SCORE,
  EKZIST_MODULE_VERSION,
  EKZIST_OCTAVE,
  EKZIST_PERFORMANCE_MAX_MS,
  EKZIST_PERSONA_ID,
  isEkzistAgeGroup,
  isEkzistDomain,
} from './types';
