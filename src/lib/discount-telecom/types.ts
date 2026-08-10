// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom
// Kompanija SPAJA — Digitalna Industrija
//
// TypeScript types za Discount Telecom — global telecom operator discount aggregation module.

export type NetworkType = '2G' | '3G' | '4G' | '5G';
export type TelecomRegion = 'EU' | 'US' | 'APAC' | 'LATAM' | 'Africa' | 'ME';
export type DiscountType = 'loyalty' | 'volume' | 'bundle' | 'seasonal' | 'event' | 'roaming';
export type UserSegment = 'consumer' | 'business' | 'student' | 'senior' | 'all';
export type CurrencyCode = string; // ISO 4217

// ─── Operator ─────────────────────────────────────────────────────────────────

export interface TelecomOperator {
  id: string;
  name: string;
  region: TelecomRegion;
  countries: string[]; // ISO 3166-1 alpha-2
  networkTypes: NetworkType[];
  currency: CurrencyCode;
  active: boolean;
}

// ─── Discount / Promo ─────────────────────────────────────────────────────────

export interface DiscountRule {
  id: string;
  operatorId: string;
  type: DiscountType;
  /** Percentage discount, e.g. 15 = 15% off */
  valuePercent: number;
  /** ISO 8601 start date */
  validFrom: string;
  /** ISO 8601 end date */
  validUntil: string;
  eligibleSegments: UserSegment[];
  /** If true, cannot be stacked with other discounts */
  exclusive: boolean;
  /** Networks this discount applies to (empty = all) */
  applicableNetworks: NetworkType[];
  description: string;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export interface DiscountCalculationInput {
  operatorId: string;
  basePriceCents: number;       // price in minor currency unit (e.g. cents)
  currency: CurrencyCode;
  networkType: NetworkType;
  userSegment: UserSegment;
  /** ISO 8601 date for validity check; defaults to now */
  referenceDate?: string;
}

export interface AppliedDiscount {
  discountId: string;
  type: DiscountType;
  description: string;
  valuePercent: number;
}

export interface DiscountCalculationResult {
  operatorId: string;
  basePriceCents: number;
  currency: CurrencyCode;
  appliedDiscounts: AppliedDiscount[];
  totalDiscountPercent: number;
  netPriceCents: number;
  /** Net price rounded to 2 decimals in major currency unit */
  netPriceMajor: number;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface DiscountTelecomHealthReport {
  totalOperators: number;
  activeOperators: number;
  totalDiscounts: number;
  activeDiscounts: number;
  byRegion: Record<TelecomRegion, number>;
  byNetworkType: Record<NetworkType, number>;
  personaId: string;
  contractVersion: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DISCOUNT_TELECOM_CONTRACT_VERSION = 'v1';
export const DISCOUNT_TELECOM_MODULE_VERSION = '1.0.0';
export const DISCOUNT_TELECOM_PERSONA_ID = 'discount-telecom-global';
export const DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT = 60;
export const DISCOUNT_TELECOM_PERFORMANCE_MAX_MS = 50;
