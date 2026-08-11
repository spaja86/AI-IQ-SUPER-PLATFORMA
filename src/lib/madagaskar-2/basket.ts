// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: Basket Procurement
// Kompanija SPAJA — Digitalna Industrija
//
// Multi-item basket procurement engine with basket discount tiers and FX conversion.

import type { BasketItem, BasketResult } from './types';
import type { ProcurementResult } from '../madagaskar/types';
import {
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS,
  MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT,
} from './types';
import { calculateProcurement } from '../madagaskar/engine';
import { convertCents } from './fx';

// ─── Basket discount ──────────────────────────────────────────────────────────

/**
 * Returns the basket discount percent for a given number of items.
 * > TIER2_ITEMS → TIER2%, > TIER1_ITEMS → TIER1%, else 0.
 */
export function getBasketDiscountPercent(itemCount: number): number {
  if (itemCount > MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS) return MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT;
  if (itemCount > MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS) return MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT;
  return 0;
}

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculates a basket of procurement requests.
 *
 * - Each item is priced via v1 calculateProcurement.
 * - A basket discount is applied to the total if item count exceeds thresholds.
 * - All prices are converted to `outputCurrency` via the FX engine for the total.
 * - Returns per-item results (in each item's native currency) + aggregated total.
 */
export function calculateBasket(items: BasketItem[], outputCurrency: string = 'EUR'): BasketResult {
  const start = Date.now();
  const warnings: string[] = [];

  if (!Array.isArray(items) || items.length === 0) {
    return {
      items: [],
      totalNetPriceMajor: 0,
      currency: outputCurrency,
      basketDiscountPercent: 0,
      valid: false,
      warnings: ['Basket must contain at least one item.'],
      durationMs: Date.now() - start,
    };
  }

  // Process each item
  const results: ProcurementResult[] = items.map((item) =>
    calculateProcurement({
      goodId: item.goodId,
      quantityUnits: item.quantityUnits,
      buyerSegment: item.buyerSegment as import('../madagaskar/types').BuyerSegment,
      currency: item.currency,
    }),
  );

  const validResults = results.filter((r) => r.valid);
  const invalidCount = results.length - validResults.length;
  if (invalidCount > 0) {
    warnings.push(`${invalidCount} item(s) in the basket are invalid and excluded from the total.`);
  }

  // Basket discount based on total item count (all items, not just valid)
  const basketDiscountPercent = getBasketDiscountPercent(items.length);

  // Aggregate total in outputCurrency
  let totalNetCentsInOutputCurrency = 0;
  for (const r of validResults) {
    const converted = convertCents(r.totalNetPriceCents, r.currency, outputCurrency);
    if (converted === 0 && r.currency !== outputCurrency) {
      warnings.push(`Could not convert currency '${r.currency}' to '${outputCurrency}' for good '${r.goodId}'. Item excluded from total.`);
    } else {
      totalNetCentsInOutputCurrency += converted;
    }
  }

  // Apply basket discount
  if (basketDiscountPercent > 0) {
    const discountCents = Math.round((totalNetCentsInOutputCurrency * basketDiscountPercent) / 100);
    totalNetCentsInOutputCurrency -= discountCents;
    warnings.push(`Basket discount of ${basketDiscountPercent}% applied.`);
  }

  const totalNetPriceMajor = Math.round((totalNetCentsInOutputCurrency / 100) * 100) / 100;

  return {
    items: results,
    totalNetPriceMajor,
    currency: outputCurrency,
    basketDiscountPercent,
    valid: validResults.length > 0,
    warnings,
    durationMs: Date.now() - start,
  };
}
