// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR
// Kompanija SPAJA — Digitalna Industrija
//
// TypeScript types za MADAGASKAR — Exotic Market Intelligence & Rare Resource Procurement Engine.

export type ExoticGoodCategory =
  | 'spice'
  | 'mineral'
  | 'botanical'
  | 'textile'
  | 'artisan'
  | 'tech-material'
  | 'fauna-derivative';

export type OriginRegion =
  | 'Madagascar'
  | 'Indonesia'
  | 'Amazon'
  | 'Sahel'
  | 'Patagonia'
  | 'Siberia'
  | 'Oceania';

/** Ecological impact score 0–100 (higher = more sustainable). */
export type SustainabilityScore = number;

export type BuyerSegment = 'consumer' | 'business' | 'industrial' | 'research' | 'all';

export type CurrencyCode = string; // ISO 4217

// ─── Goods ────────────────────────────────────────────────────────────────────

export interface ExoticGood {
  id: string;
  name: string;
  category: ExoticGoodCategory;
  originRegion: OriginRegion;
  /** Rarity score 1 (common) – 10 (extremely rare). */
  rarity: number;
  /** Ecological sustainability score 0–100. */
  sustainabilityScore: SustainabilityScore;
  /** Base price in minor currency units (e.g. cents). */
  pricePerUnitCents: number;
  currency: CurrencyCode;
  /** Available units in stock. */
  stock: number;
  tags: string[];
  active: boolean;
}

// ─── Procurement ──────────────────────────────────────────────────────────────

export interface ProcurementRequest {
  goodId: string;
  quantityUnits: number;
  buyerSegment: BuyerSegment;
  currency: CurrencyCode;
  /** ISO 8601 date for reference; defaults to now if omitted. */
  referenceDate?: string;
}

export interface AppliedModifier {
  type: 'rarity-premium' | 'sustainability-bonus' | 'sustainability-penalty';
  description: string;
  valuePercent: number;
}

export interface ProcurementResult {
  goodId: string;
  goodName: string;
  quantityUnits: number;
  basePriceCents: number;
  currency: CurrencyCode;
  appliedModifiers: AppliedModifier[];
  totalModifierPercent: number;
  netPricePerUnitCents: number;
  totalNetPriceCents: number;
  /** Total net price in major currency unit (rounded to 2 decimals). */
  totalNetPriceMajor: number;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface GoodFilter {
  category?: ExoticGoodCategory;
  region?: OriginRegion;
  rarityMin?: number;
  activeOnly?: boolean;
}

// ─── Health Report ────────────────────────────────────────────────────────────

export interface MadagaskarHealthReport {
  totalGoods: number;
  activeGoods: number;
  byCategory: Record<ExoticGoodCategory, number>;
  byRegion: Record<OriginRegion, number>;
  avgSustainability: number;
  avgRarity: number;
  personaId: string;
  contractVersion: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MADAGASKAR_CONTRACT_VERSION = 'v1';
export const MADAGASKAR_MODULE_VERSION = '1.0.0';
export const MADAGASKAR_PERSONA_ID = 'madagaskar-exotic-market';

/** Maximum combined modifier cap (%) applied to base price. */
export const MADAGASKAR_MAX_MODIFIER_CAP_PERCENT = 40;

/** Rarity threshold above which a premium is applied. */
export const MADAGASKAR_RARITY_PREMIUM_THRESHOLD = 7;

/** Sustainability score above which a bonus discount is applied. */
export const MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD = 80;

/** Maximum sustainability bonus (%). */
export const MADAGASKAR_SUSTAINABILITY_BONUS_MAX_PERCENT = 5;

/** Sustainability score below which a penalty surcharge is applied. */
export const MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD = 30;

/** Sustainability penalty surcharge (%). */
export const MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT = 8;

export const MADAGASKAR_PERFORMANCE_MAX_MS = 50;
