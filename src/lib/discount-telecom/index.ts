// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom
// Kompanija SPAJA — Digitalna Industrija

export { calculateDiscount, getDiscountTelecomHealthReport } from './engine';
export { TELECOM_OPERATORS, getOperatorById, isValidTelecomRegion, listOperators } from './operators';
export { DISCOUNT_RULES, getDiscountsByOperator, getDiscountById, listDiscounts } from './discounts';

export type {
  NetworkType,
  TelecomRegion,
  DiscountType,
  UserSegment,
  CurrencyCode,
  TelecomOperator,
  DiscountRule,
  DiscountCalculationInput,
  AppliedDiscount,
  DiscountCalculationResult,
  DiscountTelecomHealthReport,
} from './types';

export {
  DISCOUNT_TELECOM_CONTRACT_VERSION,
  DISCOUNT_TELECOM_MODULE_VERSION,
  DISCOUNT_TELECOM_PERSONA_ID,
  DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT,
  DISCOUNT_TELECOM_PERFORMANCE_MAX_MS,
  DISCOUNT_TELECOM_NETWORK_TYPES,
  DISCOUNT_TELECOM_REGIONS,
  DISCOUNT_TELECOM_USER_SEGMENTS,
} from './types';
