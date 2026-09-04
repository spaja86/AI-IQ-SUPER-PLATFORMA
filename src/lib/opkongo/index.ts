// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO
// Kompanija SPAJA — Digitalna Industrija

export { evaluateOpkongo, getOpkongoHealthReport, _resetOpkongoMetrics } from './engine';
export { setOpkongoHeaders } from './route-utils';

export type {
  OpkongoAction,
  OpkongoChannel,
  OpkongoHealthReport,
  OpkongoInput,
  OpkongoObjective,
  OpkongoRelationshipTemperature,
  OpkongoResult,
  OpkongoStatus,
} from './types';

export {
  OPKONGO_API_RESPONSE_MAX_MS,
  OPKONGO_CONTRACT_VERSION,
  OPKONGO_DISCLAIMER,
  OPKONGO_DISPLAY_NAME,
  OPKONGO_HIPERMREZA_NODE,
  OPKONGO_LINKED_REPO_IMPACT,
  OPKONGO_MAX_FOLLOW_UP_COUNT,
  OPKONGO_MAX_SCORE,
  OPKONGO_MAX_TIME_WINDOW_HOURS,
  OPKONGO_MIN_SCORE,
  OPKONGO_MODULE_VERSION,
  OPKONGO_OCTAVE,
  OPKONGO_PERFORMANCE_MAX_MS,
  OPKONGO_PERSONA_ID,
  OPKONGO_SLUG,
} from './types';
