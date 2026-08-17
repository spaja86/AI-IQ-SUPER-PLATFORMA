// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Score Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  AstronomikHealthReport,
  AstronomikResult,
  AstronomikScoreBreakdown,
  AstronomikTier,
  CosmicEvent,
  GalacticPortfolio,
  PortfolioComposition,
} from './types';
import {
  ASTRONOMIK_API_RESPONSE_MAX_MS,
  ASTRONOMIK_CONTRACT_VERSION,
  ASTRONOMIK_DISCLAIMER,
  ASTRONOMIK_MODULE_VERSION,
  ASTRONOMIK_PERFORMANCE_MAX_MS,
  ASTRONOMIK_PERSONA_ID,
} from './types';
import { computeAllGravity } from './gravity-engine';
import { analyzePortfolio } from './portfolio-engine';
import { computeCosmicResilience, detectAutoEvents, enrichEventsWithDescriptions } from './cosmic-event-engine';

// ─── In-memory metrics ────────────────────────────────────────────────────────

let evaluations = 0;
let lastTier: AstronomikTier = 'VOID';

// ─── Tier mapping ─────────────────────────────────────────────────────────────

const TIER_RANGES: Array<{ min: number; tier: AstronomikTier; label: string }> = [
  { min: 850, tier: 'STELLAR', label: 'Galactic Apex' },
  { min: 650, tier: 'SOLAR', label: 'Stellar Portfolio' },
  { min: 400, tier: 'ORBITAL', label: 'Stable Orbit' },
  { min: 200, tier: 'COMET_DRIFT', label: 'Drifting' },
  { min: 0, tier: 'VOID', label: 'Cosmic Risk Alert' },
];

function resolveTier(total: number): { tier: AstronomikTier; label: string } {
  for (const range of TIER_RANGES) {
    if (total >= range.min) return { tier: range.tier, label: range.label };
  }
  return { tier: 'VOID', label: 'Cosmic Risk Alert' };
}

// ─── Score components ─────────────────────────────────────────────────────────

function computeGravityScore(composition: PortfolioComposition): number {
  // Normalize totalGravity to 0–300 using a soft cap at 10_000_000
  const softCap = 10_000_000;
  const ratio = Math.min(1, composition.totalGravity / softCap);
  return Math.round(ratio * 300);
}

function computeOrbitStability(composition: PortfolioComposition): number {
  // 0–250: penalize if any single class > 40% of portfolio
  const CONCENTRATION_CAP = 0.4;
  let penalty = 0;
  for (const ratio of Object.values(composition.classCoverage)) {
    if (typeof ratio === 'number' && ratio > CONCENTRATION_CAP) {
      penalty += (ratio - CONCENTRATION_CAP) * 500;
    }
  }
  return Math.round(Math.max(0, 250 - penalty));
}

function computeDiversificationScore(composition: PortfolioComposition): number {
  // 0–250: linear scale from diversificationIndex (0–1)
  return Math.round(composition.diversificationIndex * 250);
}

// ─── Insights ─────────────────────────────────────────────────────────────────

const TIER_INSIGHTS: Record<AstronomikTier, string[]> = {
  STELLAR: [
    'Your galactic portfolio has achieved apex gravity — a rare alignment of celestial forces.',
    'Maintain orbital balance to avoid collapse under your own mass.',
  ],
  SOLAR: [
    'Stellar energy flows through your portfolio — strong diversification and gravity.',
    'Watch for incoming solar flares — hedging is advised.',
  ],
  ORBITAL: [
    'Stable orbit achieved — your portfolio holds its trajectory.',
    'Consider adding PULSAR or PLANET assets to increase stability.',
  ],
  COMET_DRIFT: [
    'Your portfolio is drifting — gravity is insufficient for a stable orbit.',
    'Reduce ASTEROID and BLACK_HOLE exposure to regain orbital control.',
  ],
  VOID: [
    'Cosmic Risk Alert — portfolio gravity approaches zero or is heavily distorted.',
    'Immediate restructuring recommended: add PLANET and PULSAR assets.',
  ],
};

function buildInsights(tier: AstronomikTier, composition: PortfolioComposition): string[] {
  const insights = [...TIER_INSIGHTS[tier]];
  if (composition.darkMatterRatio > 0.3) {
    insights.push(
      `Dark matter ratio is ${(composition.darkMatterRatio * 100).toFixed(1)}% — significant unknown risk exposure.`,
    );
  }
  return insights;
}

// ─── Invalid result helper ────────────────────────────────────────────────────

function invalidResult(referenceId: string | undefined, warning: string, start: number): AstronomikResult {
  return {
    referenceId: referenceId ?? 'n/a',
    tier: 'VOID',
    tierLabel: 'Cosmic Risk Alert',
    score: { gravityScore: 0, orbitStability: 0, diversificationScore: 0, cosmicResilience: 0, total: 0 },
    composition: {
      totalGravity: 0,
      diversificationIndex: 0,
      dominantClass: 'PLANET',
      darkMatterRatio: 0,
      classCoverage: {},
      warnings: [],
    },
    gravityResults: [],
    activeEvents: [],
    insights: [],
    warnings: [warning],
    disclaimer: ASTRONOMIK_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function evaluateAstronomikMoney(portfolio: GalacticPortfolio): AstronomikResult {
  const start = performance.now();

  if (!portfolio || typeof portfolio !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!Array.isArray(portfolio.assets) || portfolio.assets.length === 0) {
    return invalidResult(portfolio.referenceId, 'VOID_PORTFOLIO', start);
  }

  // Validate each asset entry
  for (const asset of portfolio.assets) {
    if (!asset || typeof asset !== 'object') {
      return invalidResult(portfolio.referenceId, 'each asset must be a non-null object', start);
    }
    if (typeof asset.id !== 'string' || typeof asset.class !== 'string') {
      return invalidResult(portfolio.referenceId, 'each asset must have id and class strings', start);
    }
  }

  // Compute gravity for all assets
  const gravityResults = computeAllGravity(portfolio.assets);

  // Collect gravity warnings
  const allWarnings: string[] = gravityResults
    .filter((r) => r.warning)
    .map((r) => r.warning as string);

  // Portfolio composition analysis
  const composition = analyzePortfolio(portfolio.assets, gravityResults);
  allWarnings.push(...composition.warnings);

  // Merge auto-detected events + user-provided events
  const autoEvents = detectAutoEvents(composition);
  const userEvents = portfolio.activeEvents ?? [];
  const mergedEvents = enrichEventsWithDescriptions([...userEvents, ...autoEvents]);

  // Score components
  const gravityScore = composition.totalGravity === 0 ? 0 : computeGravityScore(composition);
  const orbitStability = composition.totalGravity === 0 ? 0 : computeOrbitStability(composition);
  const diversificationScore = composition.totalGravity === 0 ? 0 : computeDiversificationScore(composition);
  const cosmicResilience = computeCosmicResilience(mergedEvents);

  const total = Math.min(
    1000,
    gravityScore + orbitStability + diversificationScore + cosmicResilience,
  );

  const scoreBreakdown: AstronomikScoreBreakdown = {
    gravityScore,
    orbitStability,
    diversificationScore,
    cosmicResilience,
    total,
  };

  const { tier, label: tierLabel } = resolveTier(total);
  const insights = buildInsights(tier, composition);

  evaluations += 1;
  lastTier = tier;

  return {
    referenceId: portfolio.referenceId ?? 'n/a',
    tier,
    tierLabel,
    score: scoreBreakdown,
    composition,
    gravityResults,
    activeEvents: mergedEvents,
    insights,
    warnings: allWarnings,
    disclaimer: ASTRONOMIK_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getAstronomikHealthReport(): AstronomikHealthReport {
  return {
    personaId: ASTRONOMIK_PERSONA_ID,
    contractVersion: ASTRONOMIK_CONTRACT_VERSION,
    moduleVersion: ASTRONOMIK_MODULE_VERSION,
    evaluations,
    lastTier,
    performanceMaxMs: ASTRONOMIK_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: ASTRONOMIK_API_RESPONSE_MAX_MS,
  };
}

export function _resetAstronomikMetrics(): void {
  evaluations = 0;
  lastTier = 'VOID';
}
