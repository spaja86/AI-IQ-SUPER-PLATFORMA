// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Points Engine
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniRacun, ZlatniPointsInput } from './types';
import { ZLATNI_POINTS_EARN_RATES } from './types';
import { getRacunById, updateRacun } from './registry';
import { appendTransaction } from './transaction-engine';
import { getTierForPoints } from './tier-engine';

// ─── Public API ──────────────────────────────────────────────────────────────

export interface PointsResult {
  racun: ZlatniRacun;
  delta: number;
  earnedRaw: number;
  earnRate: number;
}

export function applyPoints(input: ZlatniPointsInput): PointsResult {
  const racun = getRacunById(input.racunId);
  if (!racun) throw new Error(`ZlatniRacun not found: ${input.racunId}`);
  if (racun.status === 'archived') throw new Error(`ZlatniRacun is archived: ${input.racunId}`);

  const rawAmount = input.amount;
  if (!isFinite(rawAmount) || isNaN(rawAmount)) {
    throw new Error(`Invalid amount: ${rawAmount}`);
  }
  if (rawAmount < 0) throw new Error(`Amount must be non-negative: ${rawAmount}`);

  const earnRate = ZLATNI_POINTS_EARN_RATES[input.source] ?? 1.0;
  const earned =
    input.type === 'credit' || input.type === 'bonus'
      ? Math.round(rawAmount * earnRate)
      : Math.round(rawAmount);

  const delta =
    input.type === 'credit' || input.type === 'bonus' ? earned : -earned;

  const newBalance = Math.max(0, racun.balance + delta);
  const newPointsAccrued =
    input.type === 'credit' || input.type === 'bonus'
      ? racun.pointsAccrued + earned
      : racun.pointsAccrued;

  const newTier = getTierForPoints(newPointsAccrued);

  appendTransaction(input);

  const updated: ZlatniRacun = {
    ...racun,
    balance: newBalance,
    pointsAccrued: newPointsAccrued,
    tier: newTier.name,
  };

  updateRacun(updated);

  return { racun: updated, delta, earnedRaw: rawAmount, earnRate };
}
