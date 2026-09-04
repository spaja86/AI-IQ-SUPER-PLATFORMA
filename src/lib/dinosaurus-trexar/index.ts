// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateDinosaurusTrexar,
  getDinosaurusTrexarHealthReport,
  _resetDinosaurusTrexarMetrics,
} from './engine';
export { setDinosaurusTrexarHeaders } from './route-utils';

export type {
  TrexarAgeCategory,
  TrexarHealthReport,
  TrexarInput,
  TrexarResult,
  TrexarStatus,
  TrexarTier,
} from './types';

export {
  DINOSAURUS_TREXAR_API_RESPONSE_MAX_MS,
  DINOSAURUS_TREXAR_CONTRACT_VERSION,
  DINOSAURUS_TREXAR_MAX_MASS_KG,
  DINOSAURUS_TREXAR_MAX_REACTION_MS,
  DINOSAURUS_TREXAR_MODULE_VERSION,
  DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS,
  DINOSAURUS_TREXAR_PERSONA_ID,
  DINOSAURUS_TREXAR_SIGNAL_MAX,
  DINOSAURUS_TREXAR_SIGNAL_MIN,
} from './types';

export { AGE_CATEGORY_LABELS, VALID_AGE_CATEGORIES } from './registry';
