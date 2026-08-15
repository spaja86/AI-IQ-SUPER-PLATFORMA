// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY
// Kompanija SPAJA — Digitalna Industrija

export type CelestialClass =
  | 'STAR'
  | 'PLANET'
  | 'MOON'
  | 'ASTEROID'
  | 'BLACK_HOLE'
  | 'NEBULA'
  | 'COMET'
  | 'PULSAR';

export type OrbitalRiskLevel = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'EXTREME';

export type LiquidityLevel = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';

export type CosmicEventType =
  | 'SUPERNOVA'
  | 'SOLAR_FLARE'
  | 'ECLIPSE'
  | 'METEOR_SHOWER'
  | 'BLACK_HOLE_PROXIMITY';

export type AstronomikTier = 'VOID' | 'COMET_DRIFT' | 'ORBITAL' | 'SOLAR' | 'STELLAR';

export interface CelestialClassDescriptor {
  class: CelestialClass;
  risk: OrbitalRiskLevel;
  liquidity: LiquidityLevel;
  returnProfile: string;
  example: string;
  gravityMultiplier: number;
  darkMatterFactor: number;
}

export interface CelestialAsset {
  id: string;
  name: string;
  class: CelestialClass;
  value: number;
  mass: number;
}

export interface CosmicEvent {
  type: CosmicEventType;
  severity: number;
  description?: string;
}

export interface GalacticPortfolio {
  referenceId?: string;
  assets: CelestialAsset[];
  activeEvents?: CosmicEvent[];
}

export interface GravityResult {
  assetId: string;
  pull: number;
  orbitalDistance: number;
  warning?: string;
}

export interface PortfolioComposition {
  totalGravity: number;
  diversificationIndex: number;
  dominantClass: CelestialClass;
  darkMatterRatio: number;
  classCoverage: Partial<Record<CelestialClass, number>>;
  warnings: string[];
}

export interface AstronomikScoreBreakdown {
  gravityScore: number;
  orbitStability: number;
  diversificationScore: number;
  cosmicResilience: number;
  total: number;
}

export interface AstronomikResult {
  referenceId: string;
  tier: AstronomikTier;
  tierLabel: string;
  score: AstronomikScoreBreakdown;
  composition: PortfolioComposition;
  gravityResults: GravityResult[];
  activeEvents: CosmicEvent[];
  insights: string[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface AstronomikHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastTier: AstronomikTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const ASTRONOMIK_CONTRACT_VERSION = 'v1';
export const ASTRONOMIK_MODULE_VERSION = '1.0.0';
export const ASTRONOMIK_PERSONA_ID = 'astronomik-money-core';
export const ASTRONOMIK_OCTAVE = 13;
export const ASTRONOMIK_HIPERMREZA_NODE = 104;
export const ASTRONOMIK_PERFORMANCE_MAX_MS = 50;
export const ASTRONOMIK_API_RESPONSE_MAX_MS = 200;
export const ASTRONOMIK_MAX_SCORE = 1000;
export const ASTRONOMIK_MIN_SCORE = 0;
export const ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD = 0.20;
export const ASTRONOMIK_DISCLAIMER =
  'Astronomik Money is a simulation engine. This is not financial advice.';
