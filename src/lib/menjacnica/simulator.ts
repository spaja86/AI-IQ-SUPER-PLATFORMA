// SpajaUltraOmegaCore -∞Ω+∞ — Simulated Market Feed (Faza A)
// Kompanija SPAJA — Digitalna Industrija
//
// Generiše deterministične simulirane cene za sve parove.
// SPAJA BTC je cenjen 10× više od BTC-a po definiciji.
// Cene se "kreću" na osnovu current unix timestamp (seed) kako bi
// bile konzistentne u jednoj sekundi, ali se menjaju u sledećoj.

import type { QuoteSnapshot, Ticker } from './types';
import { MARKET_PAIRS } from './pairs';

// ─── Bazne cene (USD/USDT) ────────────────────────────────────────────────────

const BASE_PRICES: Record<string, number> = {
  BTC:   67_000,
  ETH:    3_500,
  SOL:      160,
  MATIC:    0.8,
  USDT:     1.0,
  EUR:      1.08,  // EUR/USD
  RSD:    0.0091,  // RSD/USD
  USD:      1.0,
};

// SPAJA BTC se vrednuje 10× više od BTC-a
const SPAJA_MULTIPLIER = 10;

// ─── Noise funkcija (deterministična za datu sekundu) ─────────────────────────

function pseudoRandom(seed: number, salt: number): number {
  // LCG-inspired deterministični generator
  const x = Math.sin(seed * 9301 + salt * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

function getTimeSeed(): number {
  return Math.floor(Date.now() / 1000);
}

/** Vraća cenu za asset u USD, sa malim šumom. */
function getSimulatedPriceUsd(assetId: string, salt = 0): number {
  if (assetId === 'SPAJA') {
    const btcPrice = getSimulatedPriceUsd('BTC', salt);
    return btcPrice * SPAJA_MULTIPLIER;
  }
  const base = BASE_PRICES[assetId] ?? 1;
  const seed = getTimeSeed();
  const noise = (pseudoRandom(seed, salt) - 0.5) * 0.002; // ±0.1% noise
  return base * (1 + noise);
}

/** Vraća bid/ask spread (0.05% po podrazumevanom). */
function getSpread(priceUsd: number, spreadPct = 0.0005): { bid: number; ask: number } {
  const half = priceUsd * spreadPct;
  return {
    bid: priceUsd - half,
    ask: priceUsd + half,
  };
}

/** Konvertuje cenu sa jedne valute na drugu. */
function _convertPrice(fromUsd: number, toAssetId: string): number {
  const toUsd = BASE_PRICES[toAssetId] ?? 1;
  return fromUsd / toUsd;
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Vraća simulirani QuoteSnapshot za pair.
 */
export function getSimulatedQuote(pairId: string): QuoteSnapshot | null {
  const pair = MARKET_PAIRS.find((p) => p.id === pairId);
  if (!pair) return null;

  const baseUsd = getSimulatedPriceUsd(pair.baseAssetId, 1);
  const quoteUsd = BASE_PRICES[pair.quoteAssetId] ?? 1;
  const priceInQuote = baseUsd / quoteUsd;

  const { bid, ask } = getSpread(priceInQuote);
  const volume = 500_000 + pseudoRandom(getTimeSeed(), 42) * 5_000_000;

  // 24h change: ±2%
  const change = (pseudoRandom(getTimeSeed() - 86400, 7) - 0.5) * 4;

  return {
    pairId,
    bid: Number(bid.toFixed(pair.pricePrecision)),
    ask: Number(ask.toFixed(pair.pricePrecision)),
    last: Number(priceInQuote.toFixed(pair.pricePrecision)),
    volume24h: Number(volume.toFixed(2)),
    changePct24h: Number(change.toFixed(4)),
    source: 'simulator',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Vraća simulirani Ticker za pair.
 */
export function getSimulatedTicker(pairId: string): Ticker | null {
  const q = getSimulatedQuote(pairId);
  if (!q) return null;

  const pair = MARKET_PAIRS.find((p) => p.id === pairId)!;
  const highMult = 1 + pseudoRandom(getTimeSeed(), 11) * 0.015;
  const lowMult = 1 - pseudoRandom(getTimeSeed(), 13) * 0.015;

  return {
    pairId,
    bid: q.bid,
    ask: q.ask,
    last: q.last,
    high24h: Number((q.last * highMult).toFixed(pair.pricePrecision)),
    low24h: Number((q.last * lowMult).toFixed(pair.pricePrecision)),
    volume24h: q.volume24h,
    changePct24h: q.changePct24h,
    timestamp: q.timestamp,
  };
}

/**
 * Vraća sve ticker-e za enabled parove.
 */
export function getAllTickers(): Ticker[] {
  return MARKET_PAIRS
    .filter((p) => p.enabled)
    .map((p) => getSimulatedTicker(p.id))
    .filter((t): t is Ticker => t !== null);
}

/**
 * Simulirani market-execution cena (slippage model).
 * Za buy: ask + slippage; za sell: bid - slippage.
 */
export function getExecutionPrice(pairId: string, side: 'buy' | 'sell'): number | null {
  const q = getSimulatedQuote(pairId);
  if (!q) return null;

  const pair = MARKET_PAIRS.find((p) => p.id === pairId);
  const slippagePct = 0.0005; // 0.05% slippage

  if (side === 'buy') {
    return Number((q.ask * (1 + slippagePct)).toFixed(pair?.pricePrecision ?? 8));
  }
  return Number((q.bid * (1 - slippagePct)).toFixed(pair?.pricePrecision ?? 8));
}
