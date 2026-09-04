// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR Utils
// Kompanija SPAJA — Digitalna Industrija
//
// Helper functions: input validation, premium/bonus calculations, formatting.

import type { ProcurementRequest, AppliedModifier } from './types';
import {
  MADAGASKAR_RARITY_PREMIUM_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_BONUS_MAX_PERCENT,
  MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD,
  MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT,
  MADAGASKAR_MAX_MODIFIER_CAP_PERCENT,
} from './types';

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates a ProcurementRequest and returns a list of error messages.
 * Returns an empty array if the input is valid.
 */
export function validateProcurementInput(input: ProcurementRequest): string[] {
  const errors: string[] = [];

  if (!input.goodId || typeof input.goodId !== 'string' || input.goodId.trim() === '') {
    errors.push('goodId must be a non-empty string.');
  }

  if (!Number.isFinite(input.quantityUnits) || isNaN(input.quantityUnits)) {
    errors.push('quantityUnits must be a finite number.');
  } else if (input.quantityUnits <= 0) {
    errors.push('quantityUnits must be greater than 0.');
  } else if (!Number.isInteger(input.quantityUnits)) {
    errors.push('quantityUnits must be an integer.');
  }

  if (!input.currency || typeof input.currency !== 'string' || input.currency.trim() === '') {
    errors.push('currency must be a non-empty string.');
  }

  if (input.referenceDate !== undefined) {
    const d = new Date(input.referenceDate);
    if (isNaN(d.getTime())) {
      errors.push('referenceDate must be a valid ISO 8601 date string.');
    }
  }

  return errors;
}

// ─── Rarity premium ───────────────────────────────────────────────────────────

/**
 * Calculates a rarity premium modifier when rarity > MADAGASKAR_RARITY_PREMIUM_THRESHOLD.
 * Returns null if no premium applies.
 *
 * Formula: (rarity - threshold) * 5% per point above threshold.
 * e.g. rarity=8 → +5%, rarity=10 → +15%.
 */
export function applyRarityPremium(rarity: number): AppliedModifier | null {
  if (!Number.isFinite(rarity) || isNaN(rarity)) return null;
  if (rarity <= MADAGASKAR_RARITY_PREMIUM_THRESHOLD) return null;

  const points = rarity - MADAGASKAR_RARITY_PREMIUM_THRESHOLD;
  const valuePercent = points * 5;

  return {
    type: 'rarity-premium',
    description: `Rarity ${rarity}/10 — premium +${valuePercent}%`,
    valuePercent,
  };
}

// ─── Sustainability modifier ──────────────────────────────────────────────────

/**
 * Calculates a sustainability bonus or penalty modifier.
 * Returns null if neither bonus nor penalty applies.
 *
 * Bonus: score > 80 → discount up to -5% (linearly scaled from 80→100).
 * Penalty: score < 30 → surcharge +8%.
 */
export function applySustainabilityModifier(sustainabilityScore: number): AppliedModifier | null {
  if (!Number.isFinite(sustainabilityScore) || isNaN(sustainabilityScore)) return null;

  if (sustainabilityScore > MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD) {
    // Linear scale: 80→0%, 100→5%
    const excess = sustainabilityScore - MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD;
    const range = 100 - MADAGASKAR_SUSTAINABILITY_BONUS_THRESHOLD; // 20
    const valuePercent = -Math.round(
      (excess / range) * MADAGASKAR_SUSTAINABILITY_BONUS_MAX_PERCENT * 10,
    ) / 10;

    return {
      type: 'sustainability-bonus',
      description: `Sustainability score ${sustainabilityScore}/100 — eco-bonus ${valuePercent}%`,
      valuePercent,
    };
  }

  if (sustainabilityScore < MADAGASKAR_SUSTAINABILITY_PENALTY_THRESHOLD) {
    return {
      type: 'sustainability-penalty',
      description: `Sustainability score ${sustainabilityScore}/100 — low-eco penalty +${MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT}%`,
      valuePercent: MADAGASKAR_SUSTAINABILITY_PENALTY_PERCENT,
    };
  }

  return null;
}

// ─── Cap ──────────────────────────────────────────────────────────────────────

/**
 * Applies the modifier cap to a total percent value.
 * Returns the capped value and a warning if capping occurred.
 */
export function applyModifierCap(
  totalPercent: number,
): { cappedPercent: number; warning: string | null } {
  if (totalPercent > MADAGASKAR_MAX_MODIFIER_CAP_PERCENT) {
    return {
      cappedPercent: MADAGASKAR_MAX_MODIFIER_CAP_PERCENT,
      warning: `Total modifier ${totalPercent}% exceeds cap of ${MADAGASKAR_MAX_MODIFIER_CAP_PERCENT}%; capped.`,
    };
  }
  return { cappedPercent: totalPercent, warning: null };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Converts a minor-unit price (cents) to a major-unit value rounded to 2 decimals.
 * Returns 0 for non-finite inputs.
 */
export function formatPriceMajor(cents: number): number {
  if (!Number.isFinite(cents) || isNaN(cents)) return 0;
  return Math.round((cents / 100) * 100) / 100;
}

// ─── ID generation ────────────────────────────────────────────────────────────

/**
 * Generates a unique ID for a procurement transaction.
 */
export function generateProcurementId(): string {
  return `mdg-proc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
