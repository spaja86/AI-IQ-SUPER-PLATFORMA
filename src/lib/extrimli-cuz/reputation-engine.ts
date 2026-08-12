// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

import type { AthleteRating, ReputationScore, ReputationTier } from './types';
import { isNonEmptyString, isInRange, round } from './utils';

const RATING_STORE: Map<string, AthleteRating[]> = new Map(); // keyed by athleteId (the rated athlete)

// ─── Tier mapping ─────────────────────────────────────────────────────────────

const TIER_THRESHOLDS: { tier: ReputationTier; min: number }[] = [
  { tier: 'Diamond',  min: 85 },
  { tier: 'Platinum', min: 70 },
  { tier: 'Gold',     min: 55 },
  { tier: 'Silver',   min: 40 },
  { tier: 'Bronze',   min: 0  },
];

function resolveTier(overallScore: number): ReputationTier {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (overallScore >= min) return tier;
  }
  return 'Bronze';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submits a peer rating for an athlete.
 *
 * Guards:
 *   - rater cannot rate themselves
 *   - each rater can only submit one rating per athlete (duplicate rejected)
 *   - all score dimensions must be in [1, 5]
 */
export function submitRating(rating: Omit<AthleteRating, 'submittedAt'>): AthleteRating {
  if (!isNonEmptyString(rating.raterId))  throw new Error('raterId is required');
  if (!isNonEmptyString(rating.athleteId)) throw new Error('athleteId is required');
  if (rating.raterId === rating.athleteId) throw new Error('athletes cannot rate themselves');
  if (!isInRange(rating.sportsmanship, 1, 5)) throw new Error('sportsmanship must be in [1, 5]');
  if (!isInRange(rating.skill, 1, 5))         throw new Error('skill must be in [1, 5]');
  if (!isInRange(rating.reliability, 1, 5))   throw new Error('reliability must be in [1, 5]');

  const list = RATING_STORE.get(rating.athleteId) ?? [];
  const duplicate = list.find((r) => r.raterId === rating.raterId);
  if (duplicate) throw new Error(`${rating.raterId} has already rated ${rating.athleteId}`);

  const record: AthleteRating = { ...rating, submittedAt: Date.now() };
  list.push(record);
  RATING_STORE.set(rating.athleteId, list);
  return { ...record };
}

/**
 * Returns the aggregated ReputationScore for an athlete.
 *
 * overallScore (0–100):
 *   ( avgSportsmanship + avgSkill + avgReliability ) / 3  mapped from [1–5] → [0–100]
 */
export function getReputationScore(athleteId: string): ReputationScore {
  if (!isNonEmptyString(athleteId)) {
    return {
      athleteId: '',
      avgSportsmanship: 0,
      avgSkill: 0,
      avgReliability: 0,
      overallScore: 0,
      tier: 'Bronze',
      totalRatings: 0,
    };
  }

  const ratings = RATING_STORE.get(athleteId) ?? [];

  if (ratings.length === 0) {
    return {
      athleteId,
      avgSportsmanship: 0,
      avgSkill: 0,
      avgReliability: 0,
      overallScore: 0,
      tier: 'Bronze',
      totalRatings: 0,
    };
  }

  const n = ratings.length;
  const avgSportsmanship = round(ratings.reduce((s, r) => s + r.sportsmanship, 0) / n, 2);
  const avgSkill         = round(ratings.reduce((s, r) => s + r.skill, 0) / n, 2);
  const avgReliability   = round(ratings.reduce((s, r) => s + r.reliability, 0) / n, 2);

  // Map average [1–5] → [0–100]: (avg - 1) / 4 * 100
  const toScore = (avg: number) => round(((avg - 1) / 4) * 100, 2);
  const overallScore = round(
    (toScore(avgSportsmanship) + toScore(avgSkill) + toScore(avgReliability)) / 3,
    2
  );

  return {
    athleteId,
    avgSportsmanship,
    avgSkill,
    avgReliability,
    overallScore,
    tier: resolveTier(overallScore),
    totalRatings: n,
  };
}

export function _resetRatingStore(): void {
  RATING_STORE.clear();
}
