// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateReklamitin,
  getReklamitiнHealthReport,
  _resetReklamitiнMetrics,
} from './reklamitin-engine';
export { setReklamitiнHeaders } from './route-utils';

export type {
  AudienceSegment,
  BroadcastResult,
  BroadcastTarget,
  LevelConfig,
  RadicalLevel,
  ReproductionAd,
  ReklamitiнHealthReport,
  ReklamitiнRequest,
  ReklamitiнResult,
} from './types';

export {
  REKLAMITIN_API_RESPONSE_MAX_MS,
  REKLAMITIN_BROADCAST_DISPATCH_MAX_MS,
  REKLAMITIN_CONTRACT_VERSION,
  REKLAMITIN_DISCLAIMER,
  REKLAMITIN_DISPLAY_NAME,
  REKLAMITIN_HIPERMREZA_NODE,
  REKLAMITIN_MAX_INTENSITY_SCORE,
  REKLAMITIN_MIN_INTENSITY_SCORE,
  REKLAMITIN_MODULE_VERSION,
  REKLAMITIN_NOTE,
  REKLAMITIN_OCTAVE,
  REKLAMITIN_OKRID,
  REKLAMITIN_PERFORMANCE_MAX_MS,
  REKLAMITIN_PERSONA_ID,
  REKLAMITIN_SLUG,
} from './types';
