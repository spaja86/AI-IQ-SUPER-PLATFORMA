// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

// ─── Sport Registry ───────────────────────────────────────────────────────────

export type RiskClass = 'I' | 'II' | 'III' | 'IV' | 'V';
export type SportCategory =
  | 'snow'
  | 'air'
  | 'water'
  | 'mountain'
  | 'urban'
  | 'motor'
  | 'board';

export interface Sport {
  id: string;
  name: string;
  category: SportCategory;
  riskClass: RiskClass;
  requiredGear: string[];
  weatherSensitive: boolean;
}

// ─── Risk Engine ─────────────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface RiskInput {
  sportId: string;
  athleteExperience: number;  // 0–10
  weatherScore: number;       // 0–10 (10 = worst)
  terrainDifficulty: number;  // 0–10
  gearQualityIndex: number;   // 0–10 (10 = best)
  referenceId?: string;
}

export interface RiskResult {
  referenceId: string;
  sportId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: string;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

// ─── Performance Tracker ──────────────────────────────────────────────────────

export interface AthleteSession {
  sessionId: string;
  athleteId: string;
  sportId: string;
  timestamp: number;
  speedKph?: number;
  altitudeM?: number;
  distanceKm?: number;
  gForce?: number;
  heartRateBpm?: number;
}

export interface PersonalBest {
  metric: string;
  value: number;
  sessionId: string;
  timestamp: number;
}

export interface PerformanceReport {
  athleteId: string;
  sessions: AthleteSession[];
  personalBests: PersonalBest[];
  improvementRate: number;
  valid: boolean;
  warnings: string[];
}

// ─── Gear Catalog ────────────────────────────────────────────────────────────

export type GearCategory =
  | 'helmet'
  | 'harness'
  | 'board'
  | 'bike'
  | 'chute'
  | 'wing'
  | 'wetsuit'
  | 'pads'
  | 'boots'
  | 'goggles'
  | 'other';

export interface GearItem {
  sku: string;
  brand: string;
  name: string;
  category: GearCategory;
  safetyRating: number; // 1–5
  price: number;        // EUR, must be >= 0
  stock: number;
  affiliateCommissionPct: number; // 0–100
  sportIds: string[];
}

export interface GearCatalogEntry extends GearItem {
  affiliateCommission: number; // calculated: price * affiliateCommissionPct / 100
}

// ─── Event Engine ────────────────────────────────────────────────────────────

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface ExtrimliEvent {
  id: string;
  name: string;
  location: string;
  sportId: string;
  date: number; // unix ms
  capacity: number;
  registrations: string[]; // athleteIds
  waitlist: string[];
  prizePool: number; // EUR
  minExperienceLevel: number; // 0–10
  minAge: number;
  requiredGearCategories: GearCategory[];
  status: EventStatus;
}

export interface EventRegistrationResult {
  eventId: string;
  athleteId: string;
  registered: boolean;
  waitlisted: boolean;
  message: string;
}

// ─── Weather Adapter ─────────────────────────────────────────────────────────

export interface RawWeatherData {
  windSpeedKph?: number;
  precipitationMm?: number;
  temperatureC?: number;
  visibilityKm?: number;
}

export interface WeatherRiskFactors {
  windRiskModifier: number;       // 0–10
  terrainRiskModifier: number;    // 0–10
  gearRecommendation: string;
  overallWeatherScore: number;    // 0–10 (10 = worst)
  valid: boolean;
  warnings: string[];
}

// ─── DESTRUKCIJA ────────────────────────────────────────────────────────────────

export type DimensionBand = '360D' | '720D' | '1440D' | '2880D' | '5760D';
export type DestructibleMaterial = 'concrete' | 'steel' | 'glass' | 'wood' | 'composite';
export type DestructibleAssetType = 'wall' | 'tower' | 'bridge' | 'arena' | 'vehicle' | 'obstacle';
export type DestructionSeverityLevel = 'MINOR' | 'MAJOR' | 'CATASTROPHIC';

export interface DimensionPhysicsProfile {
  dimension: DimensionBand;
  fragmentationBias: number;
  shockwaveBias: number;
  stabilityModifier: number;
  energyRetention: number;
}

export interface DestructibleAsset {
  id: string;
  name: string;
  type: DestructibleAssetType;
  material: DestructibleMaterial;
  structuralIntegrity: number; // 0–10
  maxFragments: number;
  maxSafeFragments: number;
  safetyRadiusM: number;
  destructibleDimensions: DimensionBand[];
  shockwaveSensitivity: number; // 0–10
  sportIds: string[];
}

export interface DestructionInput {
  assetId: string;
  dimension: DimensionBand;
  impactForce: number;       // 0–1000
  resonanceIndex: number;    // 0–10
  containmentLevel: number;  // 0–10
  athleteExperience?: number; // 0–10
  sportId?: string;
  referenceId?: string;
}

export interface DestructionResult {
  referenceId: string;
  assetId: string;
  dimension: DimensionBand;
  severityScore: number;
  severityLevel: DestructionSeverityLevel;
  fragmentCount: number;
  shockwaveRadiusM: number;
  rollbackRecommended: boolean;
  degraded: boolean;
  degradedMode: string | null;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface DestructionPreview extends DestructionResult {
  activationRequired: false;
}

export interface ExtrimliDestructionHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  destructionContractVersion: string;
  destructionEvaluations: number;
  previewEvaluations: number;
  registrySize: number;
  lastSeverityScore: number;
  lastSeverityLevel: DestructionSeverityLevel;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Health Report ────────────────────────────────────────────────────────────

export interface ExtrimliHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  riskEvaluations: number;
  lastRiskScore: number;
  lastRiskLevel: RiskLevel;
  destructionEvaluations: number;
  previewEvaluations: number;
  lastDestructionSeverityScore: number;
  lastDestructionSeverityLevel: DestructionSeverityLevel;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Instrukcija ─────────────────────────────────────────────────────────────

export interface InstrukcijaEntry {
  id: string;
  naziv: string;
  opis: string;
  inputType: string;
  outputType: string;
  endpointPath: string;
  methods: string[];
  primerInput: unknown;
  primerOutput: unknown;
  edgeCases: string[];
}

// ─── Export Bundle ────────────────────────────────────────────────────────────

export interface ExtrimliExportBundle {
  bundleVersion: string;
  contractVersion: string;
  moduleVersion: string;
  personaId: string;
  generatedAt: string;
  sportRegistry: Sport[];
  gearListing: GearItem[];
  instrukcije: Omit<InstrukcijaEntry, 'primerInput' | 'primerOutput'>[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EXTRIMLI_CONTRACT_VERSION = 'v1';
export const EXTRIMLI_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_PERSONA_ID = 'extrimli-core';
export const EXTRIMLI_PERFORMANCE_MAX_MS = 50;
export const EXTRIMLI_API_RESPONSE_MAX_MS = 200;
export const EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION = 'v1-destrukcija';
export const EXTRIMLI_DESTRUKCIJA_MODULE_VERSION = '1.0.0';
