// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: Engine
// Kompanija SPAJA — Digitalna Industrija
//
// v2 procurement engine: uses v2 registry (all v1 + v2 goods) with optional FX
// conversion and provides the v2 health report.

import type { ProcurementRequest, ProcurementResult } from '../madagaskar/types';
import type { Madagaskar2HealthReport } from './types';
import {
  MADAGASKAR2_CONTRACT_VERSION,
  MADAGASKAR2_PERSONA_ID,
} from './types';
import { calculateProcurement as calculateProcurementV1 } from '../madagaskar/engine';
import {
  validateProcurementInput,
  applyRarityPremium,
  applySustainabilityModifier,
  applyModifierCap,
  formatPriceMajor,
} from '../madagaskar/utils';
import { convertCents, getFxRateCount } from './fx';
import { getAuctionStats } from './auction';
import { getTraceabilityCount } from './traceability';
import { listGoodsV2, getGoodByIdV2 } from './registry';

// ─── v2 Procurement ───────────────────────────────────────────────────────────

export interface ProcurementResultV2 extends ProcurementResult {
  /** Present when targetCurrency differs from the good's native currency. */
  convertedTotalNetPriceMajor?: number;
  targetCurrency?: string;
}

function buildErrorResultV2(
  input: ProcurementRequest,
  message: string,
  start: number,
): ProcurementResultV2 {
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

function addFxConversion(
  base: ProcurementResult,
  targetCurrency: string | undefined,
): ProcurementResultV2 {
  if (!targetCurrency || targetCurrency === base.currency) {
    return base;
  }

  const convertedCents = convertCents(base.totalNetPriceCents, base.currency, targetCurrency);
  const convertedMajor = Math.round((convertedCents / 100) * 100) / 100;

  const result: ProcurementResultV2 = {
    ...base,
    convertedTotalNetPriceMajor: convertedMajor,
    targetCurrency,
  };

  if (convertedCents === 0 && base.currency !== targetCurrency && base.valid) {
    result.warnings = [
      ...base.warnings,
      `Could not convert '${base.currency}' to '${targetCurrency}'; FX pair not available.`,
    ];
  }

  return result;
}

/**
 * Calculates the procurement cost (v2): looks up goods from the v2 registry
 * (which includes all v1 + v2 goods) and optionally converts the total to
 * `targetCurrency` via the FX engine.
 */
export function calculateProcurementV2(
  input: ProcurementRequest,
  targetCurrency?: string,
): ProcurementResultV2 {
  const start = Date.now();
  const warnings: string[] = [];

  // ── Input validation ──────────────────────────────────────────────────────
  const validationErrors = validateProcurementInput(input);
  if (validationErrors.length > 0) {
    return buildErrorResultV2(input, validationErrors.join(' '), start);
  }

  // ── Good lookup (v2 registry: all v1 + v2 goods) ─────────────────────────
  const good = getGoodByIdV2(input.goodId);
  if (!good) {
    return buildErrorResultV2(input, `Unknown good id: ${input.goodId}`, start);
  }
  if (!good.active) {
    return buildErrorResultV2(input, `Good ${input.goodId} is not active.`, start);
  }

  // ── Currency check ────────────────────────────────────────────────────────
  if (input.currency !== good.currency) {
    warnings.push(
      `Requested currency '${input.currency}' differs from good's native currency '${good.currency}'. Pricing in ${good.currency}.`,
    );
  }

  // ── Base price ────────────────────────────────────────────────────────────
  const basePriceCents = good.pricePerUnitCents;
  if (!Number.isFinite(basePriceCents) || basePriceCents < 0) {
    return buildErrorResultV2(input, `Good ${input.goodId} has an invalid pricePerUnitCents.`, start);
  }

  // ── Modifiers ─────────────────────────────────────────────────────────────
  const appliedModifiers = [];

  const rarityMod = applyRarityPremium(good.rarity);
  if (rarityMod) appliedModifiers.push(rarityMod);

  const sustainMod = applySustainabilityModifier(good.sustainabilityScore);
  if (sustainMod) appliedModifiers.push(sustainMod);

  const rawTotalPercent = appliedModifiers.reduce((sum, m) => sum + m.valuePercent, 0);
  const { cappedPercent, warning: capWarning } = applyModifierCap(rawTotalPercent);
  if (capWarning) warnings.push(capWarning);

  const effectiveModifierPercent = capWarning ? cappedPercent : rawTotalPercent;

  // ── Net price ─────────────────────────────────────────────────────────────
  const modifierAmount = Math.round((basePriceCents * effectiveModifierPercent) / 100);
  const netPricePerUnitCents = basePriceCents + modifierAmount;
  const totalNetPriceCents = netPricePerUnitCents * input.quantityUnits;
  const totalNetPriceMajor = formatPriceMajor(totalNetPriceCents);

  if (input.quantityUnits > good.stock) {
    warnings.push(
      `Requested quantity ${input.quantityUnits} exceeds available stock ${good.stock} for good '${good.name}'.`,
    );
  }

  const base: ProcurementResult = {
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

  return addFxConversion(base, targetCurrency);
}

// Re-export v1 calculateProcurement for backward compatibility
export { calculateProcurementV1 as calculateProcurement };

// ─── v2 Health report ─────────────────────────────────────────────────────────

export function getMadagaskar2HealthReport(): Madagaskar2HealthReport {
  const all = listGoodsV2({ activeOnly: false });
  const active = all.filter((g) => g.active);

  const byCategory: Record<string, number> = {};
  const byRegion: Record<string, number> = {};

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
    auctionStats: getAuctionStats(),
    traceabilityCount: getTraceabilityCount(),
    fxRateCount: getFxRateCount(),
    personaId: MADAGASKAR2_PERSONA_ID,
    contractVersion: MADAGASKAR2_CONTRACT_VERSION,
  };
}
