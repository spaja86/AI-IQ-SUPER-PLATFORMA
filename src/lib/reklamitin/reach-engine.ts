// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Reach Engine
// Kompanija SPAJA — Digitalna Industrija

import type { AudienceSegment } from './types';
import { SEGMENT_MULTIPLIER, SUPPORTED_SEGMENTS } from './registry';

export { SUPPORTED_SEGMENTS } from './registry';

export function isValidSegment(value: unknown): value is AudienceSegment {
  return typeof value === 'string' && SUPPORTED_SEGMENTS.includes(value as AudienceSegment);
}

export function getAudienceMultiplier(segment: AudienceSegment): number {
  return SEGMENT_MULTIPLIER[segment] ?? 1.0;
}

export function computeReachScore(
  baseReach: number,
  reachMultiplier: number,
  audienceMultiplier: number,
): number {
  if (!Number.isFinite(baseReach) || baseReach < 0) baseReach = 0;
  if (!Number.isFinite(reachMultiplier) || reachMultiplier < 0) reachMultiplier = 0;
  if (!Number.isFinite(audienceMultiplier) || audienceMultiplier < 0) audienceMultiplier = 0;
  const raw = baseReach * reachMultiplier * audienceMultiplier;
  return Math.round(Math.min(1000, Math.max(0, raw)));
}

export function rankAudienceSegments(): Array<{ segment: AudienceSegment; multiplier: number }> {
  return (Object.entries(SEGMENT_MULTIPLIER) as [AudienceSegment, number][])
    .map(([segment, multiplier]) => ({ segment, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
}
