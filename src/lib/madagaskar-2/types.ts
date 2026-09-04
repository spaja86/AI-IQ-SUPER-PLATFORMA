// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2
// Kompanija SPAJA — Digitalna Industrija
//
// TypeScript types za MADAGASKAR 2 — Exotic Market Intelligence v2
// Extends v1 with FX conversion, auction mechanics, supply-chain traceability,
// and portfolio/basket procurement.

// ─── Re-exports from v1 ───────────────────────────────────────────────────────

export type {
  SustainabilityScore,
  BuyerSegment,
  CurrencyCode,
  ExoticGood,
  ProcurementRequest,
  AppliedModifier,
  ProcurementResult,
  GoodFilter,
} from '../madagaskar/types';

export {
  MADAGASKAR_MAX_MODIFIER_CAP_PERCENT,
  MADAGASKAR_RARITY_PREMIUM_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_MAX_PERCENT,
  MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT,
  MADAGASKAR_PERFORMANCE_MAX_MS,
} from '../madagaskar/types';

// ─── v2 category / region extensions ─────────────────────────────────────────

export type ExoticGoodCategory =
  | 'spice'
  | 'mineral'
  | 'botanical'
  | 'textile'
  | 'artisan'
  | 'tech-material'
  | 'fauna-derivative'
  | 'fungal'
  | 'crystal'
  | 'algae';

export type OriginRegion =
  | 'Madagascar'
  | 'Indonesia'
  | 'Amazon'
  | 'Sahel'
  | 'Patagonia'
  | 'Siberia'
  | 'Oceania'
  | 'Central-Africa'
  | 'Himalaya'
  | 'Arctic';

// ─── FX ───────────────────────────────────────────────────────────────────────

/** A foreign-exchange rate pair (direct). */
export interface FxRate {
  from: string; // ISO 4217
  to: string;   // ISO 4217
  rate: number;
  asOf: string; // ISO 8601 datetime
}

// ─── Auction ──────────────────────────────────────────────────────────────────

export type AuctionStatus = 'open' | 'closed' | 'cancelled';

export interface AuctionLot {
  id: string;
  goodId: string;
  /** Minimum bid to activate the lot (minor currency units). */
  reservePriceCents: number;
  /** Current highest bid (minor currency units). 0 if no bids placed yet. */
  currentBidCents: number;
  bidCount: number;
  currency: string; // ISO 4217 for this lot
  /** ISO 8601 datetime when the auction closes. */
  closesAt: string;
  status: AuctionStatus;
}

export interface BidRequest {
  lotId: string;
  bidderSegment: string;
  bidAmountCents: number;
  currency: string;
}

export interface BidResult {
  lotId: string;
  accepted: boolean;
  newCurrentBidCents: number;
  outbid: boolean;
  warnings: string[];
}

// ─── Traceability ─────────────────────────────────────────────────────────────

export interface TraceStep {
  date: string; // ISO 8601
  actor: string;
  action: string;
  location: string;
}

export interface TraceabilityRecord {
  goodId: string;
  harvestDate: string; // ISO 8601
  harvestLocation: string;
  certifications: string[];
  chainOfCustody: TraceStep[];
}

// ─── Basket ───────────────────────────────────────────────────────────────────

export interface BasketItem {
  goodId: string;
  quantityUnits: number;
  buyerSegment: string;
  currency: string;
}

export interface BasketResult {
  items: import('../madagaskar/types').ProcurementResult[];
  /** Aggregated total in the requested output currency. */
  totalNetPriceMajor: number;
  currency: string;
  /** Basket discount applied (%), 0 if none. */
  basketDiscountPercent: number;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

// ─── Health report v2 ─────────────────────────────────────────────────────────

export interface AuctionStats {
  total: number;
  open: number;
  closed: number;
  cancelled: number;
}

export interface Madagaskar2HealthReport {
  totalGoods: number;
  activeGoods: number;
  byCategory: Record<string, number>;
  byRegion: Record<string, number>;
  avgSustainability: number;
  avgRarity: number;
  auctionStats: AuctionStats;
  traceabilityCount: number;
  fxRateCount: number;
  personaId: string;
  contractVersion: string;
}

// ─── v2 GoodFilter (extends v1 with new categories/regions) ──────────────────

export interface GoodFilter2 {
  category?: ExoticGoodCategory;
  region?: OriginRegion;
  rarityMin?: number;
  activeOnly?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MADAGASKAR2_CONTRACT_VERSION = 'v2';
export const MADAGASKAR2_MODULE_VERSION = '2.0.0';
export const MADAGASKAR2_PERSONA_ID = 'madagaskar-exotic-market';

/** Basket discount thresholds. */
export const MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS = 5;
export const MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT = 2;
export const MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS = 10;
export const MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT = 5;
