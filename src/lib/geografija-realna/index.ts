// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluateGeografijaRealna,
  getGeografijaRealnaHealthReport,
  _resetGeografijaRealnaMetrics,
} from './engine';
export { setGeografijaRealnaHeaders } from './route-utils';

export type {
  GeografijaRealnaAction,
  GeografijaRealnaHealthReport,
  GeografijaRealnaInput,
  GeografijaRealnaObjective,
  GeografijaRealnaRegionScale,
  GeografijaRealnaResult,
  GeografijaRealnaStatus,
  GeografijaRealnaTerrainComplexity,
} from './types';

export {
  GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
  GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  GEOGRAFIJA_REALNA_MODULE_VERSION,
  GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS,
  GEOGRAFIJA_REALNA_PERSONA_ID,
  GEOGRAFIJA_REALNA_SLUG,
} from './types';
