// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Broadcast Engine
// Kompanija SPAJA — Digitalna Industrija

import type { BroadcastResult, BroadcastTarget, RadicalLevel } from './types';
import { TARGET_REACH_BASE } from './registry';

export const SUPPORTED_TARGETS: BroadcastTarget[] = [
  'WEB',
  'MOBILE',
  'EMAIL',
  'SOCIAL',
  'TV',
  'RADIO',
  'PUSH_NOTIFICATION',
  'IN_APP',
];

export function isValidTarget(value: unknown): value is BroadcastTarget {
  return typeof value === 'string' && SUPPORTED_TARGETS.includes(value as BroadcastTarget);
}

export function deduplicateTargets(targets: BroadcastTarget[]): BroadcastTarget[] {
  return Array.from(new Set(targets));
}

export function dispatchBroadcast(
  target: BroadcastTarget,
  level: RadicalLevel,
  reachMultiplier: number,
  audienceMultiplier: number,
): BroadcastResult {
  const start = performance.now();

  void level; // level-specific zero-cap enforcement is handled in reklamitin-engine

  const baseReach = TARGET_REACH_BASE[target];
  const rawReach = baseReach * reachMultiplier * audienceMultiplier;
  const reachScore = Math.round(Math.min(1000, Math.max(0, rawReach)));
  const dispatched = reachScore > 0;

  const dispatchMs = Math.round((performance.now() - start) * 1000) / 1000;

  return {
    target,
    dispatched,
    dispatchMs,
    reachScore,
  };
}

export function broadcastAll(
  targets: BroadcastTarget[],
  level: RadicalLevel,
  reachMultiplier: number,
  audienceMultiplier: number,
): BroadcastResult[] {
  const unique = deduplicateTargets(targets);
  return unique.map((target) =>
    dispatchBroadcast(target, level, reachMultiplier, audienceMultiplier),
  );
}

export function computeTotalReachScore(results: BroadcastResult[]): number {
  if (results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + r.reachScore, 0);
  return Math.round(sum / results.length);
}
