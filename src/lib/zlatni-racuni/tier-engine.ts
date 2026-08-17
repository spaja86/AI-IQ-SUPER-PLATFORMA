// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Tier Engine
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniTier, ZlatniTierName, ZlatniTierResult } from './types';
import { ZLATNI_TIER_CATALOG } from './types';

export function getTierForPoints(points: number): ZlatniTier {
  if (isNaN(points) || points < 0) {
    return ZLATNI_TIER_CATALOG[0];
  }

  if (!isFinite(points)) {
    return ZLATNI_TIER_CATALOG[ZLATNI_TIER_CATALOG.length - 1];
  }

  for (let i = ZLATNI_TIER_CATALOG.length - 1; i >= 0; i--) {
    if (points >= ZLATNI_TIER_CATALOG[i].minPoints) {
      return ZLATNI_TIER_CATALOG[i];
    }
  }

  return ZLATNI_TIER_CATALOG[0];
}

export function getTierByName(name: ZlatniTierName): ZlatniTier {
  const tier = ZLATNI_TIER_CATALOG.find((t) => t.name === name);
  if (!tier) return ZLATNI_TIER_CATALOG[0];
  return tier;
}

export function evaluateTierResult(points: number): ZlatniTierResult {
  const current = getTierForPoints(points);
  const currentIndex = ZLATNI_TIER_CATALOG.findIndex((t) => t.name === current.name);
  const next =
    currentIndex < ZLATNI_TIER_CATALOG.length - 1
      ? ZLATNI_TIER_CATALOG[currentIndex + 1]
      : null;

  let pointsToNextTier: number | null = null;
  let progressPercent = 100;

  if (next) {
    const safePoints = isFinite(points) && !isNaN(points) && points >= 0 ? points : 0;
    pointsToNextTier = Math.max(0, next.minPoints - safePoints);
    const rangeSize = next.minPoints - current.minPoints;
    const earned = safePoints - current.minPoints;
    progressPercent = rangeSize > 0 ? Math.min(100, Math.floor((earned / rangeSize) * 100)) : 100;
  }

  return { current, next, pointsToNextTier, progressPercent };
}

export function validateTierCatalog(): boolean {
  for (let i = 0; i < ZLATNI_TIER_CATALOG.length; i++) {
    const tier = ZLATNI_TIER_CATALOG[i];
    if (i > 0 && tier.minPoints !== ZLATNI_TIER_CATALOG[i - 1].maxPoints + 1) {
      return false;
    }
  }
  return true;
}
