// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Domain Types
// Kompanija SPAJA — Digitalna Industrija

// ─── Asset ────────────────────────────────────────────────────────────────────

export type AssetTip = 'crypto' | 'fiat' | 'stablecoin';

export interface Asset {
  id: string;
  naziv: string;
  tip: AssetTip;
  decimals: number;
  minOrderQty: number;
  maxOrderQty?: number;
  mreza?: string;
  ugovorAdresa?: string;
  isSpajabtc: boolean;
  enabled: boolean;
}

// ─── Market Pair ─────────────────────────────────────────────────────────────

export interface MarketPair {
  id: string;
  baseAssetId: string;
  quoteAssetId: string;
  minQty: number;
  maxQty?: number;
  pricePrecision: number;
  qtyPrecision: number;
  takerFeePct: number;
  makerFeePct: number;
  isSpajaПair: boolean;
  simulationOnly: boolean;
  enabled: boolean;
}

// ─── Quote ───────────────────────────────────────────────────────────────────

export interface QuoteSnapshot {
  pairId: string;
  bid: number;
  ask: number;
  last: number;
  volume24h: number;
  changePct24h: number;
  source: 'simulator' | 'coingecko' | 'binance';
  timestamp: string;
}

export interface QuoteRequest {
  pairId: string;
  side: OrderSide;
  qty: number;
}

export interface QuoteResponse {
  pairId: string;
  side: OrderSide;
  qty: number;
  price: number;
  totalCost: number;
  feeAmount: number;
  feePct: number;
  feeAssetId: string;
  netAmount: number;
  expiresAt: string;
  simulationMode: boolean;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type OrderStatus =
  | 'pending'
  | 'open'
  | 'partially_filled'
  | 'filled'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export interface CreateOrderRequest {
  pairId: string;
  side: OrderSide;
  tip: OrderType;
  qty: number;
  price?: number;
  idempotencyKey?: string;
}

export interface Order {
  id: string;
  idempotencyKey?: string;
  userId: string;
  pairId: string;
  side: OrderSide;
  tip: OrderType;
  qty: number;
  price?: number;
  filledQty: number;
  avgFillPrice?: number;
  feeAssetId?: string;
  feeTotal: number;
  status: OrderStatus;
  simulationMode: boolean;
  rejectReason?: string;
  amlScore?: number;
  riskFlags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Trade ───────────────────────────────────────────────────────────────────

export interface Trade {
  id: string;
  orderId: string;
  pairId: string;
  userId: string;
  side: OrderSide;
  qty: number;
  price: number;
  fee: number;
  feeAssetId?: string;
  simulationMode: boolean;
  createdAt: string;
}

// ─── Ticker ──────────────────────────────────────────────────────────────────

export interface Ticker {
  pairId: string;
  bid: number;
  ask: number;
  last: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  changePct24h: number;
  timestamp: string;
}

// ─── Fee calc ─────────────────────────────────────────────────────────────────

export interface FeeCalcInput {
  qty: number;
  price: number;
  side: OrderSide;
  orderType: OrderType;
  takerFeePct: number;
  makerFeePct: number;
}

export interface FeeCalcResult {
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  feePct: number;
  feeAssetId: string;
}

// ─── Risk ─────────────────────────────────────────────────────────────────────

export interface RiskCheckInput {
  userId: string;
  pairId: string;
  side: OrderSide;
  qty: number;
  price: number;
  totalCost: number;
}

export interface RiskCheckResult {
  allowed: boolean;
  amlScore: number;
  flags: string[];
  action: 'allow' | 'review' | 'block';
}
