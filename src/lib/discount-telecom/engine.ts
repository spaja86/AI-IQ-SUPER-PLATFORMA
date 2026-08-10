// SpajaUltraOmegaCore -∞Ω+∞ — Discount Telecom
// Kompanija SPAJA — Digitalna Industrija
//
// Discount calculation engine: eligibility, stacking, cap, net price, edge cases.

import type {
  DiscountCalculationInput,
  DiscountCalculationResult,
  AppliedDiscount,
  DiscountRule,
  DiscountTelecomHealthReport,
  NetworkType,
  TelecomRegion,
} from './types';
import {
  DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT,
  DISCOUNT_TELECOM_PERSONA_ID,
  DISCOUNT_TELECOM_CONTRACT_VERSION,
} from './types';
import { getDiscountsByOperator, DISCOUNT_RULES } from './discounts';
import { TELECOM_OPERATORS, getOperatorById } from './operators';

// ─── Eligibility ─────────────────────────────────────────────────────────────

function isDiscountEligible(rule: DiscountRule, input: DiscountCalculationInput, referenceDate: Date): boolean {
  // Validity window
  const from = new Date(rule.validFrom);
  const until = new Date(rule.validUntil);
  if (referenceDate < from || referenceDate > until) return false;

  // User segment
  if (!rule.eligibleSegments.includes('all') && !rule.eligibleSegments.includes(input.userSegment)) return false;

  // Network type
  if (rule.applicableNetworks.length > 0 && !rule.applicableNetworks.includes(input.networkType)) return false;

  return true;
}

// ─── Stacking logic ───────────────────────────────────────────────────────────

/**
 * Select eligible discounts applying stacking rules:
 * - Exclusive discounts cannot be combined; the exclusive discount with highest value wins.
 * - Non-exclusive discounts are stacked additively, capped at DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT.
 */
function selectDiscounts(eligible: DiscountRule[]): DiscountRule[] {
  const exclusives = eligible.filter((d) => d.exclusive);
  const nonExclusives = eligible.filter((d) => !d.exclusive);

  if (exclusives.length > 0) {
    // Highest-value exclusive wins, no stacking with others
    const best = exclusives.reduce((a, b) => (a.valuePercent >= b.valuePercent ? a : b));
    return [best];
  }

  return nonExclusives;
}

// ─── Core calculation ────────────────────────────────────────────────────────

export function calculateDiscount(input: DiscountCalculationInput): DiscountCalculationResult {
  const start = Date.now();
  const warnings: string[] = [];

  // Edge: invalid base price
  if (!Number.isFinite(input.basePriceCents) || isNaN(input.basePriceCents)) {
    return buildErrorResult(input, 'basePriceCents is not a finite number', start);
  }
  if (input.basePriceCents < 0) {
    return buildErrorResult(input, 'basePriceCents must be >= 0', start);
  }
  if (input.basePriceCents === 0) {
    warnings.push('basePriceCents is 0; net price will be 0 regardless of discounts');
    return {
      operatorId: input.operatorId,
      basePriceCents: 0,
      currency: input.currency,
      appliedDiscounts: [],
      totalDiscountPercent: 0,
      netPriceCents: 0,
      netPriceMajor: 0,
      valid: true,
      warnings,
      durationMs: Date.now() - start,
    };
  }

  // Edge: unknown operator
  const operator = getOperatorById(input.operatorId);
  if (!operator) {
    return buildErrorResult(input, `Unknown operator id: ${input.operatorId}`, start);
  }

  const referenceDate = input.referenceDate ? new Date(input.referenceDate) : new Date();
  if (isNaN(referenceDate.getTime())) {
    return buildErrorResult(input, 'referenceDate is not a valid ISO date', start);
  }

  const allRules = getDiscountsByOperator(input.operatorId);
  const eligible = allRules.filter((r) => isDiscountEligible(r, input, referenceDate));
  const selected = selectDiscounts(eligible);

  // Additive stack with cap
  let totalPercent = selected.reduce((acc, r) => acc + r.valuePercent, 0);
  if (totalPercent > DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT) {
    warnings.push(
      `Total discount ${totalPercent}% exceeds cap of ${DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT}%; capped.`
    );
    totalPercent = DISCOUNT_TELECOM_MAX_DISCOUNT_CAP_PERCENT;
  }

  const appliedDiscounts: AppliedDiscount[] = selected.map((r) => ({
    discountId: r.id,
    type: r.type,
    description: r.description,
    valuePercent: r.valuePercent,
  }));

  const discountAmount = Math.round((input.basePriceCents * totalPercent) / 100);
  const netPriceCents = input.basePriceCents - discountAmount;
  const netPriceMajor = Math.round((netPriceCents / 100) * 100) / 100;

  return {
    operatorId: input.operatorId,
    basePriceCents: input.basePriceCents,
    currency: input.currency,
    appliedDiscounts,
    totalDiscountPercent: totalPercent,
    netPriceCents,
    netPriceMajor,
    valid: true,
    warnings,
    durationMs: Date.now() - start,
  };
}

function buildErrorResult(
  input: DiscountCalculationInput,
  message: string,
  start: number
): DiscountCalculationResult {
  return {
    operatorId: input.operatorId,
    basePriceCents: input.basePriceCents,
    currency: input.currency,
    appliedDiscounts: [],
    totalDiscountPercent: 0,
    netPriceCents: input.basePriceCents,
    netPriceMajor: input.basePriceCents / 100,
    valid: false,
    warnings: [message],
    durationMs: Date.now() - start,
  };
}

// ─── Health report ────────────────────────────────────────────────────────────

export function getDiscountTelecomHealthReport(): DiscountTelecomHealthReport {
  const now = new Date();

  const activeOperators = TELECOM_OPERATORS.filter((o) => o.active);

  const activeDiscounts = DISCOUNT_RULES.filter((d) => {
    const until = new Date(d.validUntil);
    const from = new Date(d.validFrom);
    return now >= from && now <= until;
  });

  const byRegion: Record<TelecomRegion, number> = {
    EU: 0, US: 0, APAC: 0, LATAM: 0, Africa: 0, ME: 0,
  };
  for (const op of activeOperators) {
    byRegion[op.region] = (byRegion[op.region] ?? 0) + 1;
  }

  const byNetworkType: Record<NetworkType, number> = { '2G': 0, '3G': 0, '4G': 0, '5G': 0 };
  for (const op of activeOperators) {
    for (const nt of op.networkTypes) {
      byNetworkType[nt] = (byNetworkType[nt] ?? 0) + 1;
    }
  }

  return {
    totalOperators: TELECOM_OPERATORS.length,
    activeOperators: activeOperators.length,
    totalDiscounts: DISCOUNT_RULES.length,
    activeDiscounts: activeDiscounts.length,
    byRegion,
    byNetworkType,
    personaId: DISCOUNT_TELECOM_PERSONA_ID,
    contractVersion: DISCOUNT_TELECOM_CONTRACT_VERSION,
  };
}
