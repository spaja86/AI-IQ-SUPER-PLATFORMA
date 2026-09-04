// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2
// Kompanija SPAJA — Digitalna Industrija
//
// Public API surface for MADAGASKAR 2 module.

// ─── Engine ───────────────────────────────────────────────────────────────────

export { calculateProcurement, calculateProcurementV2, getMadagaskar2HealthReport } from './engine';
export type { ProcurementResultV2 } from './engine';

// ─── FX ───────────────────────────────────────────────────────────────────────

export { getFxRate, convertCents, listFxRates, upsertFxRate, getFxRateCount } from './fx';

// ─── Auction ──────────────────────────────────────────────────────────────────

export { getLot, listLots, placeBid, closeLot, getAuctionStats } from './auction';

// ─── Traceability ─────────────────────────────────────────────────────────────

export { getTrace, listTraces, upsertTrace, validateTrace, getTraceabilityCount } from './traceability';

// ─── Basket ───────────────────────────────────────────────────────────────────

export { calculateBasket, getBasketDiscountPercent } from './basket';

// ─── Registry ─────────────────────────────────────────────────────────────────

export { getGoodByIdV2, listGoodsV2, upsertGoodV2, removeGoodV2, SEED_GOODS_V2 } from './registry';

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  ExoticGoodCategory,
  OriginRegion,
  FxRate,
  AuctionLot,
  AuctionStatus,
  BidRequest,
  BidResult,
  TraceStep,
  TraceabilityRecord,
  BasketItem,
  BasketResult,
  Madagaskar2HealthReport,
  AuctionStats,
  GoodFilter2,
} from './types';

export {
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_MODULE_VERSION,
  MADAGASKAR2_PERSONA_ID,
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT,
} from './types';
