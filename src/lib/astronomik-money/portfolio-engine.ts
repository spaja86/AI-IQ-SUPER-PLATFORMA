// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Portfolio Engine
// Kompanija SPAJA — Digitalna Industrija

import type { CelestialAsset, CelestialClass, GravityResult, PortfolioComposition } from './types';
import { ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD } from './types';
import { getCelestialDescriptor } from './registry';
import { totalGravity } from './gravity-engine';

// ─── Portfolio analysis ───────────────────────────────────────────────────────

export function analyzePortfolio(
  assets: CelestialAsset[],
  gravityResults: GravityResult[],
): PortfolioComposition {
  const warnings: string[] = [];

  const gravityTotal = totalGravity(gravityResults);

  // Class coverage: gravity share per class
  const classCoverage: Partial<Record<CelestialClass, number>> = {};
  const classDarkMatter: Partial<Record<CelestialClass, number>> = {};

  for (const asset of assets) {
    const gr = gravityResults.find((r) => r.assetId === asset.id);
    const pull = gr?.pull ?? 0;
    const desc = getCelestialDescriptor(asset.class);

    classCoverage[asset.class] = (classCoverage[asset.class] ?? 0) + pull;
    classDarkMatter[asset.class] =
      (classDarkMatter[asset.class] ?? 0) + pull * desc.darkMatterFactor;
  }

  // Dominant class (highest gravity share)
  let dominantClass: CelestialClass = 'PLANET';
  let maxPull = -1;
  for (const [cls, pull] of Object.entries(classCoverage) as [CelestialClass, number][]) {
    if (pull > maxPull) {
      maxPull = pull;
      dominantClass = cls;
    }
  }

  // Diversification index: fraction of all 8 classes present
  const totalClasses = 8;
  const presentClasses = Object.keys(classCoverage).length;
  const diversificationIndex = Math.round((presentClasses / totalClasses) * 100) / 100;

  // Dark matter ratio: dark matter gravity / total gravity
  const totalDarkMatter = Object.values(classDarkMatter).reduce((a, b) => a + b, 0);
  const darkMatterRatio =
    gravityTotal === 0 ? 0 : Math.round((totalDarkMatter / gravityTotal) * 1000) / 1000;

  // Black hole proximity check
  const blackHolePull = classCoverage['BLACK_HOLE'] ?? 0;
  const blackHoleRatio = gravityTotal === 0 ? 0 : blackHolePull / gravityTotal;
  if (blackHoleRatio > ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD) {
    warnings.push(
      `BLACK_HOLE allocation exceeds ${Math.round(ASTRONOMIK_BLACK_HOLE_WARNING_THRESHOLD * 100)}% of portfolio — cosmic event BLACK_HOLE_PROXIMITY auto-triggered`,
    );
  }

  // Single asset diversification warning
  if (assets.length === 1) {
    warnings.push('Single-asset portfolio — LOW diversification');
  }

  // Normalize classCoverage to ratios
  const classCoverageRatios: Partial<Record<CelestialClass, number>> = {};
  for (const [cls, pull] of Object.entries(classCoverage) as [CelestialClass, number][]) {
    classCoverageRatios[cls] =
      gravityTotal === 0 ? 0 : Math.round((pull / gravityTotal) * 1000) / 1000;
  }

  return {
    totalGravity: gravityTotal,
    diversificationIndex,
    dominantClass,
    darkMatterRatio,
    classCoverage: classCoverageRatios,
    warnings,
  };
}
