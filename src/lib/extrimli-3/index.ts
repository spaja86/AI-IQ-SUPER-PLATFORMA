// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3
// Kompanija SPAJA — Digitalna Industrija

export { calculateRiskV3, getExtrimli3HealthReport, _resetExtrimli3Metrics } from './risk-engine';
export { getSportRiskProfile, listSportRiskProfiles, validateSportRiskProfiles } from './profiles';

export type {
  AthleteProgressSnapshot,
  Extrimli3HealthReport,
  Extrimli3RiskBreakdown,
  Extrimli3RiskInput,
  Extrimli3RiskResult,
  SportRiskProfile,
} from './types';

export {
  EXTRIMLI3_API_RESPONSE_MAX_MS,
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  EXTRIMLI3_PERFORMANCE_MAX_MS,
  EXTRIMLI3_PERSONA_ID,
} from './types';
