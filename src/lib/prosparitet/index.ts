// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET
// Kompanija SPAJA — Digitalna Industrija

export { evaluateProsparitet, getProsparitetHealthReport } from './engine';
export { setProsparitetHeaders } from './route-utils';

export type {
  ProsparitetAction,
  ProsparitetHealthReport,
  ProsparitetHorizon,
  ProsparitetInput,
  ProsparitetObjective,
  ProsparitetResult,
  ProsparitetRiskAppetite,
  ProsparitetStatus,
} from './types';

export {
  PROSPARITET_API_RESPONSE_MAX_MS,
  PROSPARITET_CONTRACT_VERSION,
  PROSPARITET_DISCLAIMER,
  PROSPARITET_DISPLAY_NAME,
  PROSPARITET_HIPERMREZA_NODE,
  PROSPARITET_LINKED_REPO_IMPACT,
  PROSPARITET_MAX_HORIZON_MONTHS,
  PROSPARITET_MAX_SCORE,
  PROSPARITET_MIN_SCORE,
  PROSPARITET_MODULE_VERSION,
  PROSPARITET_OCTAVE,
  PROSPARITET_PERFORMANCE_MAX_MS,
  PROSPARITET_PERSONA_ID,
  PROSPARITET_SLUG,
} from './types';
