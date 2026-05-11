// SpajaUltraOmegaCore -∞Ω+∞ — Market Pair Config
// Kompanija SPAJA — Digitalna Industrija

import type { MarketPair } from './types';

export const MARKET_PAIRS: MarketPair[] = [
  { id: 'BTC_USDT',   baseAssetId: 'BTC',   quoteAssetId: 'USDT',  minQty: 0.00001, pricePrecision: 2,  qtyPrecision: 8, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'ETH_USDT',   baseAssetId: 'ETH',   quoteAssetId: 'USDT',  minQty: 0.001,   pricePrecision: 2,  qtyPrecision: 6, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'SOL_USDT',   baseAssetId: 'SOL',   quoteAssetId: 'USDT',  minQty: 0.01,    pricePrecision: 2,  qtyPrecision: 4, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'MATIC_USDT', baseAssetId: 'MATIC', quoteAssetId: 'USDT',  minQty: 1,       pricePrecision: 4,  qtyPrecision: 2, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'BTC_EUR',    baseAssetId: 'BTC',   quoteAssetId: 'EUR',   minQty: 0.00001, pricePrecision: 2,  qtyPrecision: 8, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'ETH_EUR',    baseAssetId: 'ETH',   quoteAssetId: 'EUR',   minQty: 0.001,   pricePrecision: 2,  qtyPrecision: 6, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  { id: 'BTC_RSD',    baseAssetId: 'BTC',   quoteAssetId: 'RSD',   minQty: 0.00001, pricePrecision: 0,  qtyPrecision: 8, takerFeePct: 0.002, makerFeePct: 0.001, isSpajaПair: false, simulationOnly: true, enabled: true },
  // SPAJA BTC parovi — ekskluzivni, niže naknade
  { id: 'SPAJA_BTC',  baseAssetId: 'SPAJA', quoteAssetId: 'BTC',   minQty: 0.00001, pricePrecision: 8,  qtyPrecision: 8, takerFeePct: 0.001, makerFeePct: 0.000, isSpajaПair: true,  simulationOnly: true, enabled: true },
  { id: 'SPAJA_EUR',  baseAssetId: 'SPAJA', quoteAssetId: 'EUR',   minQty: 0.00001, pricePrecision: 2,  qtyPrecision: 8, takerFeePct: 0.001, makerFeePct: 0.000, isSpajaПair: true,  simulationOnly: true, enabled: true },
  { id: 'SPAJA_USDT', baseAssetId: 'SPAJA', quoteAssetId: 'USDT',  minQty: 0.00001, pricePrecision: 2,  qtyPrecision: 8, takerFeePct: 0.001, makerFeePct: 0.000, isSpajaПair: true,  simulationOnly: true, enabled: true },
];

const PAIR_MAP = new Map<string, MarketPair>(MARKET_PAIRS.map((p) => [p.id, p]));

export function getMarketPair(id: string): MarketPair | undefined {
  return PAIR_MAP.get(id.toUpperCase());
}

export function getEnabledPairs(): MarketPair[] {
  return MARKET_PAIRS.filter((p) => p.enabled);
}

export function getSpajaPairs(): MarketPair[] {
  return MARKET_PAIRS.filter((p) => p.isSpajaПair && p.enabled);
}

export function getPairsForAsset(assetId: string): MarketPair[] {
  const upper = assetId.toUpperCase();
  return MARKET_PAIRS.filter(
    (p) => p.enabled && (p.baseAssetId === upper || p.quoteAssetId === upper),
  );
}
