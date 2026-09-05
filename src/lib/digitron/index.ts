// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON
// Kompanija SPAJA — Digitalna Industrija

export {
  DIGITRON_REGISTRY,
  VALID_DIGITRON_MODES,
  getDigitronDescriptor,
  listDigitronDescriptors,
} from './registry';
export { evaluateDigitron, getDigitronHealthReport, _resetDigitronMetrics } from './engine';
export { setDigitronHeaders } from './route-utils';

export type {
  DigitronAction,
  DigitronDescriptor,
  DigitronDigit,
  DigitronHealthReport,
  DigitronInput,
  DigitronMode,
  DigitronResult,
  DigitronStatus,
} from './types';

export {
  DIGITRON_API_RESPONSE_MAX_MS,
  DIGITRON_CONTRACT_VERSION,
  DIGITRON_DISCLAIMER,
  DIGITRON_DISPLAY_NAME,
  DIGITRON_HIPERMREZA_NODE,
  DIGITRON_LINKED_REPO_IMPACT,
  DIGITRON_LOOKUP_MAX_MS,
  DIGITRON_MAX_LATENCY_MS,
  DIGITRON_MIN_LATENCY_MS,
  DIGITRON_MAX_SCORE,
  DIGITRON_MIN_SCORE,
  DIGITRON_MODULE_VERSION,
  DIGITRON_OCTAVE,
  DIGITRON_PERFORMANCE_MAX_MS,
  DIGITRON_PERSONA_ID,
  DIGITRON_SLUG,
  DIGITRON_SUCCESSOR_OF,
} from './types';
