// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY
// Kompanija SPAJA — Digitalna Industrija

export { evaluateAstronomikMoney, getAstronomikHealthReport, _resetAstronomikMetrics } from './score-engine';
export { setAstronomikHeaders } from './route-utils';
export { getCelestialDescriptor, listAllClasses, isValidCelestialClass } from './registry';
export { computeAssetGravity, computeAllGravity, totalGravity } from './gravity-engine';
export { analyzePortfolio } from './portfolio-engine';
export { computeCosmicResilience, detectAutoEvents, enrichEventsWithDescriptions } from './cosmic-event-engine';

export type {
  AstronomikHealthReport,
  AstronomikResult,
  AstronomikScoreBreakdown,
  AstronomikTier,
  CelestialAsset,
  CelestialClass,
  CelestialClassDescriptor,
  CosmicEvent,
  CosmicEventType,
  GalacticPortfolio,
  GravityResult,
  LiquidityLevel,
  OrbitalRiskLevel,
  PortfolioComposition,
} from './types';

export {
  ASTRONOMIK_API_RESPONSE_MAX_MS,
  ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD,
  ASTRONOMIK_CONTRACT_VERSION,
  ASTRONOMIK_DISCLAIMER,
  ASTRONOMIK_HIPERMREZA_NODE,
  ASTRONOMIK_MAX_SCORE,
  ASTRONOMIK_MIN_SCORE,
  ASTRONOMIK_MODULE_VERSION,
  ASTRONOMIK_OCTAVE,
  ASTRONOMIK_PERFORMANCE_MAX_MS,
  ASTRONOMIK_PERSONA_ID,
} from './types';
