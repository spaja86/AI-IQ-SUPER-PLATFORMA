// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN
// Kompanija SPAJA — Digitalna Industrija

export { _resetTacskrinMetrics, evaluateTacskrin, getTacskrinHealthReport } from './engine';
export { mapTacskrinInput, setTacskrinHeaders, validateTacskrinRequestShape } from './route-utils';

export type { TacskrinAction, TacskrinHealthReport, TacskrinInput, TacskrinResult, TacskrinStatus } from './types';

export {
  TACSKRIN_API_RESPONSE_MAX_MS,
  TACSKRIN_CONTRACT_VERSION,
  TACSKRIN_DISCLAIMER,
  TACSKRIN_DISPLAY_NAME,
  TACSKRIN_HIPERMREZA_NODE,
  TACSKRIN_LINKED_REPO_IMPACT,
  TACSKRIN_MAX_SIGNAL_STRENGTH,
  TACSKRIN_MIN_SIGNAL_STRENGTH,
  TACSKRIN_MODULE_VERSION,
  TACSKRIN_OCTAVE,
  TACSKRIN_PERFORMANCE_MAX_MS,
  TACSKRIN_PERSONA_ID,
  TACSKRIN_SLUG,
} from './types';

export {
  ACTION_BY_STATUS,
  OFFICIAL_TACSKRIN_SEQUENCE,
  OFFICIAL_TACSKRIN_SEQUENCE_LENGTH,
  OFFICIAL_TACSKRIN_UNIQUE_LAYERS,
  TACSKRIN_STRICT_ORDER_DEFAULT,
} from './registry';
