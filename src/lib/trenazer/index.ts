// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateTrenazer,
  getTrenazerHealthReport,
  _resetTrenazerMetrics,
} from './engine';
export { setTrenazerHeaders } from './route-utils';

export type {
  TrenazerExperienceLevel,
  TrenazerGoal,
  TrenazerHealthReport,
  TrenazerInput,
  TrenazerMetricsInput,
  TrenazerProfileInput,
  TrenazerReadiness,
  TrenazerRecommendedIntensity,
  TrenazerResult,
} from './types';

export {
  TRENAZER_API_RESPONSE_MAX_MS,
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MAX_AVAILABLE_MINUTES,
  TRENAZER_MODULE_VERSION,
  TRENAZER_PERFORMANCE_MAX_MS,
  TRENAZER_PERSONA_ID,
} from './types';
