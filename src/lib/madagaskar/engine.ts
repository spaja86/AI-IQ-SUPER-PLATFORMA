// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Procurement calculation engine: rarity premium, sustainability modifier, cap, edge cases.

import type {
  ProcurementRequest,
  ProcurementResult,
  AppliedModifier,
  MadagaskarHealthReport,
  ExoticGoodCategory,
  OriginRegion,
} from './types';
import {
  MADAGASKAR_PERSONA_ID,
  MADAGASKAR_CONTRACT_VERSION,
} from './types';
import { getGoodById, listGoods } from './registry';
import {
  validateProcurementInput,
  applyRarityPremium,
  applySustainabilityModifier,
  applyModifierCap,
  formatPriceMajor,
} from './utils';

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculates the procurement cost for a given exotic good and quantity.
 *
 * Modifiers applied in order:
 *   1. Rarity premium (rarity > 7: +5% per point above threshold)
 *   2. Sustainability bonus (score > 80: up to -5% discount)
 *   3. Sustainability penalty (score < 30: +8% surcharge)
 *   4. Cap: total net modifier capped at +40%
 */
export function calculateProcurement(input: ProcurementRequest): ProcurementResult {
  const start = Date.now();
  const warnings: string[] = [];

  // ── Input validation ──────────────────────────────────────────────────────
  const validationErrors = validateProcurementInput(input);
  if (validationErrors.length > 0) {
    return buildErrorResult(input, validationErrors.join(' '), start);
  }

  // ── Good lookup ───────────────────────────────────────────────────────────
  const good = getGoodById(input.goodId);
  if (!good) {
    return buildErrorResult(input, `Unknown good id: ${input.goodId}`, start);
  }
  if (!good.active) {
    return buildErrorResult(input, `Good ${input.goodId} is not active.`, start);
  }

  // ── Currency check ────────────────────────────────────────────────────────
  if (input.currency !== good.currency) {
    warnings.push(
      `Requested currency '${input.currency}' differs from good's native currency '${good.currency}'. Pricing in ${good.currency}.`,
    );
  }

  // ── Base price ────────────────────────────────────────────────────────────
  const basePriceCents = good.pricePerUnitCents;

  if (!Number.isFinite(basePriceCents) || isNaN(basePriceCents) || basePriceCents < 0) {
    return buildErrorResult(input, `Good ${input.goodId} has an invalid pricePerUnitCents.`, start);
  }

  // ── Modifiers ─────────────────────────────────────────────────────────────
  const appliedModifiers: AppliedModifier[] = [];

  const rarityMod = applyRarityPremium(good.rarity);
  if (rarityMod) appliedModifiers.push(rarityMod);

  const sustainMod = applySustainabilityModifier(good.sustainabilityScore);
  if (sustainMod) appliedModifiers.push(sustainMod);

  // Sum of all modifier percents (premiums positive, bonuses negative)
  const rawTotalPercent = appliedModifiers.reduce((sum, m) => sum + m.valuePercent, 0);

  // Apply cap only to the positive (cost-increasing) part
  const { cappedPercent, warning: capWarning } = applyModifierCap(rawTotalPercent);
  if (capWarning) warnings.push(capWarning);

  const effectiveModifierPercent = capWarning ? cappedPercent : rawTotalPercent;

  // ── Net price calculation ─────────────────────────────────────────────────
  const modifierAmount = Math.round((basePriceCents * effectiveModifierPercent) / 100);
  const netPricePerUnitCents = basePriceCents + modifierAmount;
  const totalNetPriceCents = netPricePerUnitCents * input.quantityUnits;
  const totalNetPriceMajor = formatPriceMajor(totalNetPriceCents);

  // ── Stock warning ─────────────────────────────────────────────────────────
  if (input.quantityUnits > good.stock) {
    warnings.push(
      `Requested quantity ${input.quantityUnits} exceeds available stock ${good.stock} for good '${good.name}'.`,
    );
  }

  return {
    goodId: good.id,
    goodName: good.name,
    quantityUnits: input.quantityUnits,
    basePriceCents,
    currency: good.currency,
    appliedModifiers,
    totalModifierPercent: effectiveModifierPercent,
    netPricePerUnitCents,
    totalNetPriceCents,
    totalNetPriceMajor,
    valid: true,
    warnings,
    durationMs: Date.now() - start,
  };
}

function buildErrorResult(input: ProcurementRequest, message: string, start: number): ProcurementResult {
  return {
    goodId: input.goodId ?? '',
    goodName: '',
    quantityUnits: input.quantityUnits ?? 0,
    basePriceCents: 0,
    currency: input.currency ?? '',
    appliedModifiers: [],
    totalModifierPercent: 0,
    netPricePerUnitCents: 0,
    totalNetPriceCents: 0,
    totalNetPriceMajor: 0,
    valid: false,
    warnings: [message],
    durationMs: Date.now() - start,
  };
}

// ─── Health report ────────────────────────────────────────────────────────────

export function getMadagaskarHealthReport(): MadagaskarHealthReport {
  const all = listGoods({ activeOnly: false });
  const active = all.filter((g) => g.active);

  const byCategory = {} as Record<ExoticGoodCategory, number>;
  const byRegion = {} as Record<OriginRegion, number>;

  for (const g of active) {
    byCategory[g.category] = (byCategory[g.category] ?? 0) + 1;
    byRegion[g.originRegion] = (byRegion[g.originRegion] ?? 0) + 1;
  }

  const avgSustainability =
    active.length > 0
      ? Math.round(active.reduce((s, g) => s + g.sustainabilityScore, 0) / active.length)
      : 0;

  const avgRarity =
    active.length > 0
      ? Math.round((active.reduce((s, g) => s + g.rarity, 0) / active.length) * 10) / 10
      : 0;

  return {
    totalGoods: all.length,
    activeGoods: active.length,
    byCategory,
    byRegion,
    avgSustainability,
    avgRarity,
    personaId: MADAGASKAR_PERSONA_ID,
    contractVersion: MADAGASKAR_CONTRACT_VERSION,
  };
}
