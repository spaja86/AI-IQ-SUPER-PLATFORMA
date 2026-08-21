// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateSwiming,
  getSwimingHealthReport,
  _resetSwimingMetrics,
} from './engine';
export { setSwimingHeaders } from './route-utils';

export type {
  SwimingFitnessLevel,
  SwimingHealthReport,
  SwimingInput,
  SwimingIntensity,
  SwimingResult,
  SwimingStrokeType,
} from './types';

export {
  SWIMING_API_RESPONSE_MAX_MS,
  SWIMING_CONTRACT_VERSION,
  SWIMING_DISCLAIMER,
  SWIMING_MAX_DURATION_MIN,
  SWIMING_MODULE_VERSION,
  SWIMING_PERFORMANCE_MAX_MS,
  SWIMING_PERSONA_ID,
} from './types';
