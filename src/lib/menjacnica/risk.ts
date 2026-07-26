// SpajaUltraOmegaCore -∞Ω+∞ — Risk & AML Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Faza A: simulacioni mode — sve transakcije prolaze, ali se score beleži.
// Faza B+: realni AML matching.

import type { RiskCheckInput, RiskCheckResult } from './types';

// ─── Limiti ───────────────────────────────────────────────────────────────────

export const RISK_LIMITS = {
  /** Maksimalni iznos jednog ordrea u USD ekvivalentu (za basic KYC tier). */
  maxOrderValueUsd: {
    basic: 1_000,
    verified: 50_000,
    enterprise: Number.MAX_SAFE_INTEGER,
  },
  /** Maksimalni dnevni volumen u USD ekvivalentu. */
  maxDailyVolumeUsd: {
    basic: 2_000,
    verified: 100_000,
    enterprise: Number.MAX_SAFE_INTEGER,
  },
  /** AML score prag za automatski blok. */
  blockThreshold: 0.85,
  /** AML score prag za manuelni pregled. */
  reviewThreshold: 0.5,
  /** Maksimalni iznos povlačenja (USD) bez pregleda za verified tier. */
  withdrawalReviewThresholdUsd: 10_000,
};

// ─── AML score heuristike ─────────────────────────────────────────────────────
// Svaka heuristika dodaje bod 0-1 na ukupni score.

function scoreHighValue(totalCostUsd: number): number {
  if (totalCostUsd > 50_000) return 0.6;
  if (totalCostUsd > 10_000) return 0.2;
  if (totalCostUsd > 5_000) return 0.1;
  return 0;
}

function scoreRoundNumber(qty: number): number {
  // Okrugli iznosi (tačno 0 decimalnih mesta u qty) blago sumnjivi
  return qty % 1 === 0 && qty > 100 ? 0.05 : 0;
}

function scoreSpajaPair(pairId: string): number {
  // SPAJA parovi imaju nešto niži risk jer su interni
  return pairId.startsWith('SPAJA') ? -0.05 : 0;
}

// ─── Glavna funkcija ─────────────────────────────────────────────────────────

/**
 * Procenjuje AML/risk score za order/deposit/withdrawal.
 *
 * U Fazi A score se samo beleži — nije blokada.
 * Score 0.0-1.0: viši = sumnjivije.
 */
export function checkRisk(input: RiskCheckInput): RiskCheckResult {
  const flags: string[] = [];
  let score = 0;

  // Heuristike
  const highValueScore = scoreHighValue(input.totalCost);
  if (highValueScore > 0) {
    score += highValueScore;
    flags.push('high_value_order');
  }

  const roundScore = scoreRoundNumber(input.qty);
  if (roundScore > 0) {
    score += roundScore;
    flags.push('round_number_qty');
  }

  score += scoreSpajaPair(input.pairId);

  // Normalizuj na 0-1
  const normalizedScore = Math.max(0, Math.min(1, score));

  let action: RiskCheckResult['action'];
  if (normalizedScore >= RISK_LIMITS.blockThreshold) {
    action = 'block';
  } else if (normalizedScore >= RISK_LIMITS.reviewThreshold) {
    action = 'review';
  } else {
    action = 'allow';
  }

  return {
    allowed: action !== 'block',
    amlScore: normalizedScore,
    flags,
    action,
  };
}

/**
 * Procenjuje risk za withdrawal.
 */
export function checkWithdrawalRisk(
  userId: string,
  assetId: string,
  amountUsd: number,
  kycTier: 'basic' | 'verified' | 'enterprise',
): RiskCheckResult {
  const flags: string[] = [];
  let score = 0;

  if (amountUsd > RISK_LIMITS.withdrawalReviewThresholdUsd && kycTier === 'basic') {
    flags.push('exceeds_basic_tier_limit');
    score += 0.7;
  } else if (amountUsd > RISK_LIMITS.withdrawalReviewThresholdUsd && kycTier === 'verified') {
    flags.push('high_value_withdrawal');
    score += 0.35;
  }

  const normalizedScore = Math.min(1, score);
  const action: RiskCheckResult['action'] =
    normalizedScore >= RISK_LIMITS.blockThreshold
      ? 'block'
      : normalizedScore >= RISK_LIMITS.reviewThreshold
      ? 'review'
      : 'allow';

  return {
    allowed: action !== 'block',
    amlScore: normalizedScore,
    flags,
    action,
  };
}

// ─── Max order value check ────────────────────────────────────────────────────

export interface MaxOrderValueCheckResult {
  allowed: boolean;
  limit: number;
  reason?: string;
}

/**
 * Proverava da li USD vrednost ordrea prelazi limit za dati KYC tier.
 *
 * Koristi `RISK_LIMITS.maxOrderValueUsd` i vraća allowed=false ako je prekoračen.
 */
export function checkMaxOrderValue(
  totalCostUsd: number,
  kycTier: 'basic' | 'verified' | 'enterprise',
): MaxOrderValueCheckResult {
  const limit = RISK_LIMITS.maxOrderValueUsd[kycTier];
  if (totalCostUsd > limit) {
    return {
      allowed: false,
      limit,
      reason: `Order vrednost ${totalCostUsd.toFixed(2)} USD prelazi maksimum ${limit} USD za KYC tier '${kycTier}'.`,
    };
  }
  return { allowed: true, limit };
}

/** Minimalna KYC tier provjera za withdrawal. */
export function kycTierAllowsWithdrawal(
  kycTier: 'basic' | 'verified' | 'enterprise',
): boolean {
  return kycTier === 'verified' || kycTier === 'enterprise';
}
