// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Gravity Engine
// Kompanija SPAJA — Digitalna Industrija

import type { CelestialAsset, GravityResult } from './types';
import { getCelestialDescriptor } from './registry';

// ─── Sanitize numeric inputs ─────────────────────────────────────────────────

function sanitize(value: number, fieldName: string): { value: number; warning?: string } {
  if (!Number.isFinite(value) || isNaN(value)) {
    return { value: 0, warning: `Asset field "${fieldName}" is NaN/Infinity — sanitized to 0` };
  }
  if (value < 0) {
    return { value: 0, warning: `Asset field "${fieldName}" is negative — sanitized to 0` };
  }
  return { value };
}

// ─── Gravity calculation ─────────────────────────────────────────────────────
//
// gravitationalPull = value × mass × gravityMultiplier
// orbitalDistance   = 1 / (riskFactor × gravityMultiplier)   (higher risk → closer orbit)

const RISK_FACTOR: Record<string, number> = {
  VERY_LOW: 0.2,
  LOW: 0.4,
  MEDIUM: 0.6,
  HIGH: 0.8,
  VERY_HIGH: 1.0,
  EXTREME: 1.2,
};

export function computeAssetGravity(asset: CelestialAsset): GravityResult {
  const warnings: string[] = [];

  const sanitizedValue = sanitize(asset.value, 'value');
  if (sanitizedValue.warning) warnings.push(sanitizedValue.warning);

  const sanitizedMass = sanitize(asset.mass, 'mass');
  if (sanitizedMass.warning) warnings.push(sanitizedMass.warning);

  const descriptor = getCelestialDescriptor(asset.class);
  const pull = sanitizedValue.value * sanitizedMass.value * descriptor.gravityMultiplier;

  const riskFactor = RISK_FACTOR[descriptor.risk] ?? 0.6;
  const orbitalDistance =
    pull === 0
      ? 0
      : Math.round((1 / (riskFactor * descriptor.gravityMultiplier)) * 10000) / 10000;

  return {
    assetId: asset.id,
    pull: Math.round(pull * 100) / 100,
    orbitalDistance,
    warning: warnings.length > 0 ? warnings.join('; ') : undefined,
  };
}

export function computeAllGravity(assets: CelestialAsset[]): GravityResult[] {
  return assets.map((a) => computeAssetGravity(a));
}

export function totalGravity(results: GravityResult[]): number {
  return Math.round(results.reduce((sum, r) => sum + r.pull, 0) * 100) / 100;
}
