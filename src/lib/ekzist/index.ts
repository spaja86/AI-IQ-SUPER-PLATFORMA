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
  EKZIST_CONTRACT_VERSION,
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
} from './types';
