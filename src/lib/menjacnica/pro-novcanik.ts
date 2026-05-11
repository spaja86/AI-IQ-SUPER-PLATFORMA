// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Profesionalni Novčanik (domain logic)
// Kompanija SPAJA — Digitalna Industrija
//
// Profesionalni novčanik koji se nadovezuje na AI IQ Menjačnicu:
//   - Portfolio ekspozicija po asetu (ukupno, slobodno, rezervisano)
//   - Realizovani / nerealizovani P&L po poziciji
//   - Simulovani orderbook snapshots
//   - Simulovani feed poslednjih trade-ova
//   - Settlement status agregat

import type { OrderSide } from './types';
import { MARKET_PAIRS } from './pairs';
import { getSimulatedQuote } from './simulator';
import { roundLedger } from '../novcanik/ledger';

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface ProPortfolioPosition {
  assetId: string;
  available: number;
  reserved: number;
  total: number;
  avgEntryPriceUsd: number;
  currentPriceUsd: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  realizedPnl: number;
  totalValueUsd: number;
}

export interface ProPortfolioSummary {
  userId: string;
  positions: ProPortfolioPosition[];
  totalValueUsd: number;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
  timestamp: string;
}

/** Izračunava nerealizovani P&L za poziciju. */
export function calcUnrealizedPnl(
  qty: number,
  avgEntryPrice: number,
  currentPrice: number,
): { pnl: number; pnlPct: number } {
  if (avgEntryPrice <= 0) return { pnl: 0, pnlPct: 0 };
  const pnl = roundLedger((currentPrice - avgEntryPrice) * qty);
  const pnlPct = roundLedger(((currentPrice - avgEntryPrice) / avgEntryPrice) * 100);
  return { pnl, pnlPct };
}

/** Gradi simulovani portfolio summary za korisnika. */
export function buildSimulatedPortfolioSummary(userId: string): ProPortfolioSummary {
  const positions: ProPortfolioPosition[] = [];

  // Simulovane pozicije za demo prikaz (u produkciji dolaze iz DB-a)
  const simulatedHoldings: Array<{
    assetId: string;
    available: number;
    reserved: number;
    avgEntryPriceUsd: number;
    realizedPnl: number;
  }> = [
    { assetId: 'SPAJA', available: 2.5,    reserved: 0.5,  avgEntryPriceUsd: 820_000, realizedPnl: 12_500 },
    { assetId: 'BTC',   available: 0.35,   reserved: 0.05, avgEntryPriceUsd:  62_000, realizedPnl:  1_820 },
    { assetId: 'ETH',   available: 4.2,    reserved: 0.8,  avgEntryPriceUsd:   3_200, realizedPnl:    940 },
    { assetId: 'USDT',  available: 5_400,  reserved: 600,  avgEntryPriceUsd:       1, realizedPnl:      0 },
  ];

  let totalValueUsd = 0;
  let totalUnrealizedPnl = 0;
  let totalRealizedPnl = 0;

  for (const h of simulatedHoldings) {
    // Pokušaj uzeti cenu iz simulatora (SPAJA/USDT ili BTC/USDT par)
    const pairId = h.assetId === 'USDT' ? null : `${h.assetId}_USDT`;
    const quote = pairId ? getSimulatedQuote(pairId) : null;
    const currentPriceUsd = quote ? quote.last : h.avgEntryPriceUsd;

    const total = roundLedger(h.available + h.reserved);
    const { pnl: unrealizedPnl, pnlPct: unrealizedPnlPct } = calcUnrealizedPnl(
      total,
      h.avgEntryPriceUsd,
      currentPriceUsd,
    );
    const totalValueUsdPos = roundLedger(total * currentPriceUsd);

    positions.push({
      assetId: h.assetId,
      available: h.available,
      reserved: h.reserved,
      total,
      avgEntryPriceUsd: h.avgEntryPriceUsd,
      currentPriceUsd,
      unrealizedPnl,
      unrealizedPnlPct,
      realizedPnl: h.realizedPnl,
      totalValueUsd: totalValueUsdPos,
    });

    totalValueUsd += totalValueUsdPos;
    totalUnrealizedPnl += unrealizedPnl;
    totalRealizedPnl += h.realizedPnl;
  }

  return {
    userId,
    positions,
    totalValueUsd: roundLedger(totalValueUsd),
    totalUnrealizedPnl: roundLedger(totalUnrealizedPnl),
    totalRealizedPnl: roundLedger(totalRealizedPnl),
    timestamp: new Date().toISOString(),
  };
}

// ─── Orderbook ────────────────────────────────────────────────────────────────

export interface OrderbookLevel {
  price: number;
  qty: number;
  total: number;
}

export interface OrderbookSnapshot {
  pairId: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  spreadAbsolute: number;
  spreadPct: number;
  timestamp: string;
}

/** Generiše simulovani orderbook snapshot za dati par. */
export function buildSimulatedOrderbook(pairId: string, depth = 5): OrderbookSnapshot | null {
  const quote = getSimulatedQuote(pairId);
  if (!quote) return null;

  const mid = quote.last;
  const tickSize = mid * 0.0001; // 0.01% od mid cene

  const bids: OrderbookLevel[] = [];
  const asks: OrderbookLevel[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 1; i <= depth; i++) {
    const bidPrice = roundLedger(mid - tickSize * i);
    const askPrice = roundLedger(mid + tickSize * i);
    // Pseudo-random qty na osnovu nivoa (bez realnog RNG — deterministično)
    const bidQty = roundLedger(((depth + 1 - i) * 0.12 + 0.05));
    const askQty = roundLedger(((depth + 1 - i) * 0.10 + 0.04));

    bidTotal = roundLedger(bidTotal + bidQty);
    askTotal = roundLedger(askTotal + askQty);

    bids.push({ price: bidPrice, qty: bidQty, total: bidTotal });
    asks.push({ price: askPrice, qty: askQty, total: askTotal });
  }

  const spreadAbsolute = roundLedger(asks[0].price - bids[0].price);
  const spreadPct = roundLedger((spreadAbsolute / mid) * 100);

  return {
    pairId,
    bids,
    asks,
    spreadAbsolute,
    spreadPct,
    timestamp: new Date().toISOString(),
  };
}

// ─── Recent Trades ────────────────────────────────────────────────────────────

export interface PublicTrade {
  id: string;
  pairId: string;
  side: OrderSide;
  price: number;
  qty: number;
  valueUsd: number;
  timestamp: string;
}

/** Generiše simulovani feed poslednjih trade-ova za dati par. */
export function buildSimulatedTrades(pairId: string, count = 20): PublicTrade[] {
  const quote = getSimulatedQuote(pairId);
  if (!quote) return [];

  const mid = quote.last;
  const now = Date.now();
  const trades: PublicTrade[] = [];

  for (let i = 0; i < count; i++) {
    // Deterministički pseudo-random baziran na i + pairId hash
    const hash = (pairId.charCodeAt(0) * 31 + i * 17) % 100;
    const side: OrderSide = hash % 2 === 0 ? 'buy' : 'sell';
    const priceDelta = mid * 0.0002 * ((hash % 5) - 2);
    const price = roundLedger(mid + priceDelta);
    const qty = roundLedger(0.01 + (hash % 10) * 0.005);
    const valueUsd = roundLedger(price * qty);
    const tsOffset = i * 3_500; // ~3.5s razmak između trade-ova

    trades.push({
      id: `sim-trade-${pairId}-${now - tsOffset}-${i}`,
      pairId,
      side,
      price,
      qty,
      valueUsd,
      timestamp: new Date(now - tsOffset).toISOString(),
    });
  }

  return trades;
}

// ─── Settlement Status ────────────────────────────────────────────────────────

export type SettlementStatus = 'settled' | 'pending' | 'processing' | 'failed';

export interface PairSettlementStatus {
  pairId: string;
  baseAssetId: string;
  quoteAssetId: string;
  openOrdersCount: number;
  pendingSettlementCount: number;
  lastSettledAt: string;
  status: SettlementStatus;
}

export interface SettlementStatusReport {
  userId: string;
  pairs: PairSettlementStatus[];
  totalOpenOrders: number;
  totalPendingSettlement: number;
  allSettled: boolean;
  timestamp: string;
}

/** Gradi simulovani settlement status report za korisnika. */
export function buildSettlementStatusReport(userId: string): SettlementStatusReport {
  const activePairs = MARKET_PAIRS.filter((p) => p.enabled);

  // Simulovane vrednosti za demo (u produkciji dolaze iz DB-a)
  const simulatedCounts: Record<string, { open: number; pending: number }> = {
    SPAJA_BTC: { open: 1, pending: 0 },
    BTC_USDT:  { open: 2, pending: 1 },
    ETH_USDT:  { open: 0, pending: 0 },
    SOL_USDT:  { open: 0, pending: 0 },
    BTC_EUR:   { open: 1, pending: 0 },
  };

  const pairs: PairSettlementStatus[] = activePairs.map((p) => {
    const counts = simulatedCounts[p.id] ?? { open: 0, pending: 0 };
    const status: SettlementStatus =
      counts.pending > 0 ? 'pending' : counts.open > 0 ? 'processing' : 'settled';
    return {
      pairId: p.id,
      baseAssetId: p.baseAssetId,
      quoteAssetId: p.quoteAssetId,
      openOrdersCount: counts.open,
      pendingSettlementCount: counts.pending,
      lastSettledAt: new Date(Date.now() - 300_000).toISOString(), // ~5 min ago
      status,
    };
  });

  const totalOpenOrders = pairs.reduce((s, p) => s + p.openOrdersCount, 0);
  const totalPendingSettlement = pairs.reduce((s, p) => s + p.pendingSettlementCount, 0);

  return {
    userId,
    pairs,
    totalOpenOrders,
    totalPendingSettlement,
    allSettled: totalPendingSettlement === 0,
    timestamp: new Date().toISOString(),
  };
}
