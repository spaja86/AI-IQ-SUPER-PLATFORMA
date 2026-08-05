// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL
// Kompanija SPAJA — Digitalna Industrija

export {
  analyzeDecibels,
  getDecibelHistory,
  getDecibelHealthReport,
  getSilenceMeasurement,
  _resetDecibelHistory,
} from './core';

export {
  calculateRms,
  calculatePeak,
  rmsToDbfs,
  dbfsToLinear,
  getDecibelStatus,
  normalizeSamples,
  mergeThresholds,
  validateSamples,
  generateMeasurementId,
} from './utils';

export type {
  DecibelStatus,
  DecibelInputSource,
  DecibelThresholds,
  DecibelMeasurement,
  DecibelAnalysisInput,
  DecibelAnalysisResult,
  DecibelHistoryEntry,
  DecibelHealthReport,
} from './types';

export {
  DECIBIL_CONTRACT_VERSION,
  DECIBIL_MODULE_VERSION,
  DECIBIL_SOURCE_OF_TRUTH,
  DECIBIL_DEFAULT_THRESHOLDS,
  DECIBIL_MAX_HISTORY,
  DECIBIL_PERFORMANCE_MAX_MS,
} from './types';
