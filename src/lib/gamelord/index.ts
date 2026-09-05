// SpajaUltraOmegaCore -∞Ω+∞ — GAMELORD
// Kompanija SPAJA — Digitalna Industrija

export { evaluateGamelord, getGamelordHealthReport, _resetGamelordMetrics } from './engine';
export { setGamelordHeaders } from './route-utils';

export type {
  GamelordAction,
  GamelordHealthReport,
  GamelordInput,
  GamelordMode,
  GamelordResult,
  GamelordStatus,
} from './types';

export {
  GAMELORD_API_RESPONSE_MAX_MS,
  GAMELORD_CONTRACT_VERSION,
  GAMELORD_DISCLAIMER,
  GAMELORD_DISPLAY_NAME,
  GAMELORD_MAX_ANOMALY_COUNT,
  GAMELORD_MAX_MATCH_DURATION_MS,
  GAMELORD_MAX_PENALTY_POINTS,
  GAMELORD_MAX_SCORE,
  GAMELORD_MIN_SCORE,
  GAMELORD_MODULE_VERSION,
  GAMELORD_PERFORMANCE_MAX_MS,
  GAMELORD_REQUIRED_OUTPUTS,
  GAMELORD_ROLLOUT_GUARDRAILS,
  GAMELORD_SCOPE,
  GAMELORD_SLUG,
} from './types';
