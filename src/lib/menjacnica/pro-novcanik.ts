// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Profesionalni Novčanik (domain logic)
// Kompanija SPAJA — Digitalna Industrija
//
// Profesionalni novčanik koji se nadovezuje na AI IQ Menjačnicu:
//   - Portfolio ekspozicija po asetu (ukupno, slobodno, rezervisano)
//   - Realizovani / nerealizovani P&L po poziciji
//   - Simulovani ili realni orderbook snapshots
//   - Feed poslednjih trade-ova
//   - Settlement status agregat

import type { Database } from '../supabase/types';
import type { OrderSide } from './types';
import { MARKET_PAIRS, getMarketPair } from './pairs';
import { getSimulatedQuote } from './simulator';
import { roundLedger } from '../novcanik/ledger';

type WalletAccountRow = Database['public']['Tables']['novcanik_accounts']['Row'];
type WalletLedgerRow = Database['public']['Tables']['novcanik_ledger']['Row'];
type ExchangeTradeRow = Database['public']['Tables']['exchange_trades']['Row'];
type ExchangeOrderRow = Database['public']['Tables']['exchange_orders']['Row'];

const FX_TO_USD: Record<string, number> = {
  USD: 1,
  USDT: 1,
  EUR: 1.08,
  RSD: 0.0093,
};

interface WalletOrderMetadata {
  wallet?: {
    mode?: 'reserved' | 'instant-settlement';
    reservation?: {
      assetId: string;
      amount: number;
    };
    settlementStatus?: 'settled' | 'pending' | 'processing' | 'failed';
    settledAt?: string;
    ledgerEntryIds?: string[];
  };
}

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
  dataSource?: 'simulation' | 'database' | 'database-empty';
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

function getAssetUsdPrice(assetId: string, visited = new Set<string>()): number | null {
  const upper = assetId.toUpperCase();
  if (visited.has(upper)) return null;
  if (upper in FX_TO_USD) return FX_TO_USD[upper];

  visited.add(upper);

  const directUsdt = getSimulatedQuote(`${upper}_USDT`);
  if (directUsdt) return directUsdt.last;

  const directEur = getSimulatedQuote(`${upper}_EUR`);
  if (directEur) return roundLedger(directEur.last * FX_TO_USD.EUR);

  const directRsd = getSimulatedQuote(`${upper}_RSD`);
  if (directRsd) return roundLedger(directRsd.last * FX_TO_USD.RSD);

  for (const pair of MARKET_PAIRS) {
    if (!pair.enabled || pair.baseAssetId !== upper) continue;
    const quote = getSimulatedQuote(pair.id);
    if (!quote) continue;
    const quoteToUsd = getAssetUsdPrice(pair.quoteAssetId, visited);
    if (quoteToUsd !== null) return roundLedger(quote.last * quoteToUsd);
  }

  return null;
}

function getTradeQuoteToUsd(pairId: string): number {
  const pair = getMarketPair(pairId);
  if (!pair) return 1;
  return getAssetUsdPrice(pair.quoteAssetId) ?? 1;
}

function buildCostBasisByAsset(trades: ExchangeTradeRow[]): Map<string, { avgEntryPriceUsd: number; realizedPnl: number }> {
  const state = new Map<string, { qty: number; costBasisUsd: number; realizedPnl: number }>();

  const ordered = [...trades].sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

  for (const trade of ordered) {
    const pair = getMarketPair(trade.pair_id);
    if (!pair) continue;

    const assetId = pair.baseAssetId;
    const quoteToUsd = getTradeQuoteToUsd(trade.pair_id);
    const grossUsd = roundLedger(trade.qty * trade.price * quoteToUsd);
    const feeUsd = roundLedger(trade.fee * (getAssetUsdPrice(trade.fee_asset_id ?? pair.quoteAssetId) ?? quoteToUsd));
    const current = state.get(assetId) ?? { qty: 0, costBasisUsd: 0, realizedPnl: 0 };

    if (trade.side === 'buy') {
      current.qty = roundLedger(current.qty + trade.qty);
      current.costBasisUsd = roundLedger(current.costBasisUsd + grossUsd + feeUsd);
    } else {
      const avgCostUsd = current.qty > 0 ? current.costBasisUsd / current.qty : 0;
      const qtyClosed = Math.min(current.qty, trade.qty);
      const costReleasedUsd = roundLedger(avgCostUsd * qtyClosed);
      const proceedsUsd = roundLedger(grossUsd - feeUsd);
      current.realizedPnl = roundLedger(current.realizedPnl + (proceedsUsd - costReleasedUsd));
      current.qty = roundLedger(Math.max(0, current.qty - trade.qty));
      current.costBasisUsd = roundLedger(Math.max(0, current.costBasisUsd - costReleasedUsd));
    }

    state.set(assetId, current);
  }

  return new Map(
    Array.from(state.entries()).map(([assetId, entry]) => {
      const avgEntryPriceUsd = entry.qty > 0 ? roundLedger(entry.costBasisUsd / entry.qty) : 0;
      return [assetId, { avgEntryPriceUsd, realizedPnl: roundLedger(entry.realizedPnl) }];
    }),
  );
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
    { assetId: 'SPAJA', available: 2.5, reserved: 0.5, avgEntryPriceUsd: 820_000, realizedPnl: 12_500 },
    { assetId: 'BTC', available: 0.35, reserved: 0.05, avgEntryPriceUsd: 62_000, realizedPnl: 1_820 },
    { assetId: 'ETH', available: 4.2, reserved: 0.8, avgEntryPriceUsd: 3_200, realizedPnl: 940 },
    { assetId: 'USDT', available: 5_400, reserved: 600, avgEntryPriceUsd: 1, realizedPnl: 0 },
  ];

  let totalValueUsd = 0;
  let totalUnrealizedPnl = 0;
  let totalRealizedPnl = 0;

  for (const h of simulatedHoldings) {
    const currentPriceUsd = getAssetUsdPrice(h.assetId) ?? h.avgEntryPriceUsd;

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
    dataSource: 'simulation',
  };
}

export function buildPortfolioSummaryFromRecords(
  userId: string,
  accounts: WalletAccountRow[],
  trades: ExchangeTradeRow[],
): ProPortfolioSummary {
  if (accounts.length === 0) {
    return {
      userId,
      positions: [],
      totalValueUsd: 0,
      totalUnrealizedPnl: 0,
      totalRealizedPnl: 0,
      timestamp: new Date().toISOString(),
      dataSource: 'database-empty',
    };
  }

  const costBasis = buildCostBasisByAsset(trades);
  const positions: ProPortfolioPosition[] = [];

  let totalValueUsd = 0;
  let totalUnrealizedPnl = 0;
  let totalRealizedPnl = 0;

  for (const account of [...accounts].sort((a, b) => a.asset_id.localeCompare(b.asset_id))) {
    const total = roundLedger(account.total ?? account.available + account.reserved);
    const assetPriceUsd = getAssetUsdPrice(account.asset_id) ?? 0;
    const basis = costBasis.get(account.asset_id);
    const avgEntryPriceUsd = basis?.avgEntryPriceUsd ?? (account.asset_id in FX_TO_USD ? FX_TO_USD[account.asset_id] : assetPriceUsd);
    const realizedPnl = basis?.realizedPnl ?? 0;
    const { pnl: unrealizedPnl, pnlPct: unrealizedPnlPct } = calcUnrealizedPnl(total, avgEntryPriceUsd, assetPriceUsd || avgEntryPriceUsd);
    const totalValueUsdPos = roundLedger(total * (assetPriceUsd || avgEntryPriceUsd));

    positions.push({
      assetId: account.asset_id,
      available: account.available,
      reserved: account.reserved,
      total,
      avgEntryPriceUsd,
      currentPriceUsd: assetPriceUsd || avgEntryPriceUsd,
      unrealizedPnl,
      unrealizedPnlPct,
      realizedPnl,
      totalValueUsd: totalValueUsdPos,
    });

    totalValueUsd += totalValueUsdPos;
    totalUnrealizedPnl += unrealizedPnl;
    totalRealizedPnl += realizedPnl;
  }

  return {
    userId,
    positions,
    totalValueUsd: roundLedger(totalValueUsd),
    totalUnrealizedPnl: roundLedger(totalUnrealizedPnl),
    totalRealizedPnl: roundLedger(totalRealizedPnl),
    timestamp: new Date().toISOString(),
    dataSource: 'database',
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
    const bidQty = roundLedger((depth + 1 - i) * 0.12 + 0.05);
    const askQty = roundLedger((depth + 1 - i) * 0.1 + 0.04);

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
  fee?: number;
  feeAssetId?: string | null;
  simulationMode?: boolean;
}

/** Generiše simulovani feed poslednjih trade-ova za dati par. */
export function buildSimulatedTrades(pairId: string, count = 20): PublicTrade[] {
  const quote = getSimulatedQuote(pairId);
  if (!quote) return [];

  const mid = quote.last;
  const now = Date.now();
  const trades: PublicTrade[] = [];

  for (let i = 0; i < count; i++) {
    const hash = (pairId.charCodeAt(0) * 31 + i * 17) % 100;
    const side: OrderSide = hash % 2 === 0 ? 'buy' : 'sell';
    const priceDelta = mid * 0.0002 * ((hash % 5) - 2);
    const price = roundLedger(mid + priceDelta);
    const qty = roundLedger(0.01 + (hash % 10) * 0.005);
    const valueUsd = roundLedger(price * qty * getTradeQuoteToUsd(pairId));
    const tsOffset = i * 3_500;

    trades.push({
      id: `sim-trade-${pairId}-${now - tsOffset}-${i}`,
      pairId,
      side,
      price,
      qty,
      valueUsd,
      timestamp: new Date(now - tsOffset).toISOString(),
      simulationMode: true,
    });
  }

  return trades;
}

export function buildTradeFeedFromRecords(trades: ExchangeTradeRow[]): PublicTrade[] {
  return trades
    .map((trade) => ({
      id: trade.id,
      pairId: trade.pair_id,
      side: trade.side,
      price: trade.price,
      qty: trade.qty,
      valueUsd: roundLedger(trade.qty * trade.price * getTradeQuoteToUsd(trade.pair_id)),
      timestamp: trade.created_at,
      fee: trade.fee,
      feeAssetId: trade.fee_asset_id,
      simulationMode: trade.simulation_mode,
    }))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
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
  dataSource?: 'simulation' | 'database';
}

function getWalletMetadata(metadata: Record<string, unknown> | null): WalletOrderMetadata | null {
  if (!metadata || typeof metadata !== 'object') return null;
  return metadata as WalletOrderMetadata;
}

function getOrderSettlementState(order: ExchangeOrderRow): SettlementStatus {
  const wallet = getWalletMetadata(order.metadata)?.wallet;

  if (order.status === 'rejected') return 'failed';
  if (order.status === 'pending' || order.status === 'open' || order.status === 'partially_filled') return 'processing';
  if (wallet?.settlementStatus === 'failed') return 'failed';
  if (wallet?.settlementStatus === 'settled') return 'settled';
  if (order.status === 'filled') return 'pending';
  return 'settled';
}

/** Gradi simulovani settlement status report za korisnika. */
export function buildSettlementStatusReport(userId: string): SettlementStatusReport {
  const activePairs = MARKET_PAIRS.filter((p) => p.enabled);

  const simulatedCounts: Record<string, { open: number; pending: number }> = {
    SPAJA_BTC: { open: 1, pending: 0 },
    BTC_USDT: { open: 2, pending: 1 },
    ETH_USDT: { open: 0, pending: 0 },
    SOL_USDT: { open: 0, pending: 0 },
    BTC_EUR: { open: 1, pending: 0 },
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
      lastSettledAt: new Date(Date.now() - 300_000).toISOString(),
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
    dataSource: 'simulation',
  };
}

export function buildSettlementStatusReportFromOrders(
  userId: string,
  orders: ExchangeOrderRow[],
): SettlementStatusReport {
  const activePairs = MARKET_PAIRS.filter((p) => p.enabled);

  const pairs: PairSettlementStatus[] = activePairs.map((pair) => {
    const pairOrders = orders.filter((order) => order.pair_id === pair.id);
    const openOrdersCount = pairOrders.filter((order) =>
      ['pending', 'open', 'partially_filled'].includes(order.status),
    ).length;
    const pendingSettlementCount = pairOrders.filter((order) => getOrderSettlementState(order) === 'pending').length;
    const hasFailed = pairOrders.some((order) => getOrderSettlementState(order) === 'failed');
    const settledOrders = pairOrders
      .filter((order) => getOrderSettlementState(order) === 'settled')
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
    const lastSettledAt = settledOrders[0]?.updated_at ?? new Date(0).toISOString();

    const status: SettlementStatus =
      pendingSettlementCount > 0
        ? 'pending'
        : openOrdersCount > 0
          ? 'processing'
          : hasFailed
            ? 'failed'
            : 'settled';

    return {
      pairId: pair.id,
      baseAssetId: pair.baseAssetId,
      quoteAssetId: pair.quoteAssetId,
      openOrdersCount,
      pendingSettlementCount,
      lastSettledAt,
      status,
    };
  });

  const totalOpenOrders = pairs.reduce((sum, pair) => sum + pair.openOrdersCount, 0);
  const totalPendingSettlement = pairs.reduce((sum, pair) => sum + pair.pendingSettlementCount, 0);

  return {
    userId,
    pairs,
    totalOpenOrders,
    totalPendingSettlement,
    allSettled: totalPendingSettlement === 0 && totalOpenOrders === 0,
    timestamp: new Date().toISOString(),
    dataSource: 'database',
  };
}

export function calcReservedFromLedger(entries: WalletLedgerRow[], assetId: string): number {
  return roundLedger(
    entries
      .filter((entry) => entry.asset_id === assetId)
      .reduce((sum, entry) => sum + (entry.direction === 'credit' ? entry.amount : -entry.amount), 0),
  );
}
