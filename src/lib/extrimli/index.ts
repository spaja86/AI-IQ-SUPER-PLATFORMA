// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { ExtrimliHealthReport } from './types';
import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  EXTRIMLI_PERSONA_ID,
} from './types';
import { getRiskMetrics } from './risk-engine';
import { getDestructionMetrics } from './destruction-engine';

export function getExtrimliHealthReport(): ExtrimliHealthReport {
  const { riskEvaluations, lastRiskScore, lastRiskLevel } = getRiskMetrics();
  const {
    destructionEvaluations,
    previewEvaluations,
    lastSeverityScore,
    lastSeverityLevel,
  } = getDestructionMetrics();
  return {
    personaId:          EXTRIMLI_PERSONA_ID,
    contractVersion:    EXTRIMLI_CONTRACT_VERSION,
    moduleVersion:      EXTRIMLI_MODULE_VERSION,
    riskEvaluations,
    lastRiskScore,
    lastRiskLevel,
    destructionEvaluations,
    previewEvaluations,
    lastDestructionSeverityScore: lastSeverityScore,
    lastDestructionSeverityLevel: lastSeverityLevel,
    performanceMaxMs:   EXTRIMLI_PERFORMANCE_MAX_MS,
    apiResponseMaxMs:   EXTRIMLI_API_RESPONSE_MAX_MS,
  };
}

// ─── Library ──────────────────────────────────────────────────────────────────

export { SPORT_REGISTRY, getSportById, getSportsByCategory, getSportsByRiskClass } from './registry';

export { calculateRisk, getRiskMetrics, _resetRiskMetrics } from './risk-engine';

export {
  DESTRUCTIBLE_ASSET_REGISTRY,
  DIMENSION_PHYSICS_PROFILES,
  getDestructibleAssetById,
  getDimensionPhysicsProfile,
  listDestructibleAssets,
} from './destruction-registry';

export {
  evaluateDestruction,
  previewDestruction,
  getDestructionMetrics,
  getExtrimliDestructionHealthReport,
  _resetDestructionMetrics,
} from './destruction-engine';

export {
  logSession,
  getPerformanceReport,
  _resetSessionStore,
} from './performance-tracker';

export {
  addGearItem,
  getGearItem,
  listGearItems,
  updateStock,
  _resetGearCatalog,
} from './gear-catalog';

export {
  createEvent,
  getEvent,
  listEvents,
  registerForEvent,
  cancelEvent,
  _resetEventStore,
} from './event-engine';

export { adaptWeather } from './weather-adapter';

export { prepareReadVoice } from './read-voice-engine';

export { clamp, round, mphToKph, kphToMph, ftToM, mToFt, isValidNonNegative, isInRange, isValidSku } from './utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  Sport,
  SportCategory,
  RiskClass,
  RiskLevel,
  RiskInput,
  RiskResult,
  AthleteSession,
  PersonalBest,
  PerformanceReport,
  GearItem,
  GearCatalogEntry,
  GearCategory,
  ExtrimliEvent,
  EventRegistrationResult,
  EventStatus,
  RawWeatherData,
  WeatherRiskFactors,
  OpenAiVoice,
  ExtrimliReadVoiceModifier,
  ExtrimliReadVoiceLocale,
  ReadVoiceInput,
  ReadVoicePreview,
  DimensionBand,
  DimensionPhysicsProfile,
  DestructibleAsset,
  DestructibleAssetType,
  DestructibleMaterial,
  DestructionInput,
  DestructionPreview,
  DestructionResult,
  DestructionSeverityLevel,
  ExtrimliDestructionHealthReport,
  ExtrimliHealthReport,
} from './types';

export {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  EXTRIMLI_MODULE_VERSION,
  EXTRIMLI_PERSONA_ID,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  EXTRIMLI_API_RESPONSE_MAX_MS,
} from './types';

export { INSTRUKCIJA_REGISTRY, getInstrukcija, listInstrukcije } from './instrukcija';

export { EXTRIMLI_EXPORT_BUNDLE_VERSION, buildExtrimliExportBundle } from './export-bundle';

export type { InstrukcijaEntry, ExtrimliExportBundle } from './types';
