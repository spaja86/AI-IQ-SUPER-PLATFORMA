// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR
// Kompanija SPAJA — Digitalna Industrija

export { calculateProcurement, getMadagaskarHealthReport } from './engine';

export { getGoodById, listGoods, upsertGood, removeGood } from './registry';

export {
  validateProcurementInput,
  applyRarityPremium,
  applySustainabilityModifier,
  applyModifierCap,
  formatPriceMajor,
  generateProcurementId,
} from './utils';

export type {
  ExoticGoodCategory,
  OriginRegion,
  SustainabilityScore,
  BuyerSegment,
  CurrencyCode,
  ExoticGood,
  ProcurementRequest,
  AppliedModifier,
  ProcurementResult,
  GoodFilter,
  MadagaskarHealthReport,
} from './types';

export {
  MADAGASKAR_CONTRACT_VERSION,
  MADAGASKAR_MODULE_VERSION,
  MADAGASKAR_PERSONA_ID,
  MADAGASKAR_MAX_MODIFIER_CAP_PERCENT,
  MADAGASKAR_RARITY_PREMIUM_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_MAX_PERCENT,
  MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT,
  MADAGASKAR_PERFORMANCE_MAX_MS,
} from './types';
