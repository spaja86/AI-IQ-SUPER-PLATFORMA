// SpajaUltraOmegaCore -∞Ω+∞ — Fee Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Pravila:
//   - Taker fee (market orderi i limit orderi koji odmah prođu)
//   - Maker fee (limit orderi koji ostaju u knjizi)
//   - Fee se naplaćuje u quote asset-u (za buy) ili base asset-u (za sell)
//   - SPAJA parovi: 0% maker fee, 0.1% taker fee
//   - Standardni parovi: 0.1% maker, 0.2% taker

import type { FeeCalcInput, FeeCalcResult, OrderSide, OrderType } from './types';
import type { MarketPair } from './types';

// ─── Round half-even (bankarsko zaokruživanje) ────────────────────────────────

export function roundHalfEven(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const floor = Math.floor(shifted);
  const decimal = shifted - floor;

  if (decimal === 0.5) {
    // zaokruži ka pari
    return (floor % 2 === 0 ? floor : floor + 1) / factor;
  }
  return Math.round(shifted) / factor;
}

// ─── Fee calc ─────────────────────────────────────────────────────────────────

/**
 * Izračunava naknadu i neto iznos za order.
 *
 * @param input  - Parametri ordrea (qty, price, side, orderType, feePct)
 * @param pair   - Market pair za koji se fee računa (koristi se za feeAsset)
 */
export function calcFee(input: FeeCalcInput, pair: MarketPair): FeeCalcResult {
  const { qty, price, side, orderType, takerFeePct, makerFeePct } = input;

  const feePct = orderType === 'market' ? takerFeePct : makerFeePct;
  const grossAmount = roundHalfEven(qty * price, 8);

  // Fee se naplaćuje u quote asset-u (npr. USDT, EUR, RSD)
  // — uvek, bez obzira na stranu
  const feeAmount = roundHalfEven(grossAmount * feePct, 8);

  let netAmount: number;
  let feeAssetId: string;

  if (side === 'buy') {
    // Kupovina: plaća se grossAmount + fee u quote valuti
    netAmount = qty; // prima se qty base asset-a
    feeAssetId = pair.quoteAssetId;
  } else {
    // Prodaja: prima se grossAmount - fee u quote valuti
    netAmount = roundHalfEven(grossAmount - feeAmount, 8);
    feeAssetId = pair.quoteAssetId;
  }

  return {
    grossAmount,
    feeAmount,
    netAmount,
    feePct,
    feeAssetId,
  };
}

/**
 * Vraća efektivnu fee stopu za order (u procentima 0-1).
 */
export function getEffectiveFeePct(
  orderType: OrderType,
  pair: MarketPair,
): number {
  return orderType === 'market' ? pair.takerFeePct : pair.makerFeePct;
}

/**
 * Izračunava ukupan cost za buy order (uključujući fee).
 */
export function calcBuyCostWithFee(qty: number, price: number, feePct: number): number {
  const gross = qty * price;
  const fee = roundHalfEven(gross * feePct, 8);
  return roundHalfEven(gross + fee, 8);
}

/**
 * Izračunava neto prihod za sell order (posle odbitka fee-a).
 */
export function calcSellNetAmount(qty: number, price: number, feePct: number): number {
  const gross = qty * price;
  const fee = roundHalfEven(gross * feePct, 8);
  return roundHalfEven(gross - fee, 8);
}

// ─── Fee tier provera ─────────────────────────────────────────────────────────

/** Provera da li je fee u prihvatljivim granicama (0% - 5%). */
export function isValidFeePct(pct: number): boolean {
  return pct >= 0 && pct <= 0.05;
}

/** Provera konzistentnosti: maker fee <= taker fee. */
export function isFeeConsistent(makerPct: number, takerPct: number): boolean {
  return makerPct <= takerPct;
}
