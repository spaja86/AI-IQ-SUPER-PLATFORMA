// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateParaksil,
  getParaksilHealthReport,
  _resetParaksilMetrics,
} from './engine';
export { setParaksilHeaders } from './route-utils';

export type {
  ParaksilHealthReport,
  ParaksilInput,
  ParaksilMetricsInput,
  ParaksilResult,
  ParaksilStatus,
  ParaksilSuite,
  ParaksilTargetInput,
} from './types';

export {
  PARAKSIL_API_RESPONSE_MAX_MS,
  PARAKSIL_CONTRACT_VERSION,
  PARAKSIL_COVERAGE_TARGET_PCT,
  PARAKSIL_ERROR_RATE_BLOCK_PCT,
  PARAKSIL_ERROR_RATE_WARN_PCT,
  PARAKSIL_LATENCY_BUDGET_MS,
  PARAKSIL_MODULE_VERSION,
  PARAKSIL_PERFORMANCE_MAX_MS,
  PARAKSIL_PERSONA_ID,
} from './types';
