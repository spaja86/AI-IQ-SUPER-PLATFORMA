/**
 * 💰 DEPON-17 — Value Monetization
 *
 * Revenue share, royalties, and tiered billing system for 180M apps
 * based on DeponValue score. Manages the shared DEPON Fund that
 * finances platform evolution (30% of all platform revenue).
 *
 * Tiers (by DeponValue percentile):
 *   - Ultra-Premium  (Top 0.1% = ~180K apps):  SLA 99.99%, dedicated nodes
 *   - Premium        (Top 1%   = ~1.8M apps):  SLA 99.95%, priority routing
 *   - Standard       (Top 10%  = ~18M apps):   SLA 99.9%,  standard tier
 *   - Free           (Rest     = ~162M apps):  Best-effort, shared nodes
 *
 * DEPON Fund allocation:
 *   30% of all platform fees → DEPON Fund → SpajaPro evolution & infrastructure
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-17';

// ─── Constants ────────────────────────────────────────────────────────────────

export const MONETIZATION_CONFIG = {
  deponFundSharePercent: 30,
  tiers: {
    'ultra-premium': {
      label:              'Ultra-Premium',
      minPercentile:      99.9,
      platformFeePercent: 5,
      sla:                '99.99%',
      description:        'Dedicated DEPON nodes, priority support, white-glove onboarding',
      maxApps:            180_000,
    },
    premium: {
      label:              'Premium',
      minPercentile:      99,
      platformFeePercent: 10,
      sla:                '99.95%',
      description:        'Priority routing, enhanced analytics, enhanced support',
      maxApps:            1_800_000,
    },
    standard: {
      label:              'Standard',
      minPercentile:      90,
      platformFeePercent: 15,
      sla:                '99.9%',
      description:        'Standard shared DEPON nodes, standard support',
      maxApps:            18_000_000,
    },
    free: {
      label:              'Free',
      minPercentile:      0,
      platformFeePercent: 20,
      sla:                'Best-effort',
      description:        'Shared DEPON nodes, community support',
      maxApps:            160_020_000,
    },
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type MonetizationTier = keyof typeof MONETIZATION_CONFIG.tiers;

export type RevenueSplit = {
  grossRevenueUsd: number;
  platformFeeUsd: number;
  platformFeePercent: number;
  deponFundContributionUsd: number;
  netRevenueToAppUsd: number;
  tier: MonetizationTier;
};

export type RoyaltyRecord = {
  royaltyId: string;
  appId: string;
  periodStart: Date;
  periodEnd: Date;
  grossRevenueUsd: number;
  platformFeeUsd: number;
  deponFundContributionUsd: number;
  netPayoutUsd: number;
  tier: MonetizationTier;
  paidAt: Date | null;
  status: 'pending' | 'processing' | 'paid' | 'failed';
};

export type DeponFundAllocation = {
  allocationId: string;
  periodStart: Date;
  periodEnd: Date;
  totalCollectedUsd: number;
  allocations: {
    spajaProEvolution:   number;
    infrastructure:      number;
    securityAndCompliance: number;
    communityGrants:     number;
  };
  createdAt: Date;
};

export type TierBenefits = {
  tier: MonetizationTier;
  label: string;
  platformFeePercent: number;
  slaGuarantee: string;
  description: string;
  maxApps: number;
  minPercentile: number;
};

export type AppBillingStatement = {
  statementId: string;
  appId: string;
  tier: MonetizationTier;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  grossRevenueUsd: number;
  platformFeeUsd: number;
  deponFundUsd: number;
  netPayoutUsd: number;
  adjustments: BillingAdjustment[];
  issuedAt: Date;
};

export type BillingAdjustment = {
  type: 'uptime-credit' | 'compliance-bonus' | 'deposit-bonus' | 'penalty';
  amountUsd: number;
  reason: string;
};

// ─── Tier Resolution ──────────────────────────────────────────────────────────

export function resolveMonetizationTier(deponValuePercentile: number): MonetizationTier {
  if (deponValuePercentile >= MONETIZATION_CONFIG.tiers['ultra-premium'].minPercentile) {
    return 'ultra-premium';
  }
  if (deponValuePercentile >= MONETIZATION_CONFIG.tiers.premium.minPercentile) {
    return 'premium';
  }
  if (deponValuePercentile >= MONETIZATION_CONFIG.tiers.standard.minPercentile) {
    return 'standard';
  }
  return 'free';
}

export function getTierBenefits(tier: MonetizationTier): TierBenefits {
  const config = MONETIZATION_CONFIG.tiers[tier];
  return {
    tier,
    label:              config.label,
    platformFeePercent: config.platformFeePercent,
    slaGuarantee:       config.sla,
    description:        config.description,
    maxApps:            config.maxApps,
    minPercentile:      config.minPercentile,
  };
}

// ─── Revenue Split Calculation ────────────────────────────────────────────────

export function computeRevenueSplit(
  grossRevenueUsd: number,
  tier: MonetizationTier,
): RevenueSplit {
  const feePercent = MONETIZATION_CONFIG.tiers[tier].platformFeePercent;
  const platformFeeUsd = Math.round(grossRevenueUsd * (feePercent / 100) * 100) / 100;
  const deponFundUsd = Math.round(platformFeeUsd * (MONETIZATION_CONFIG.deponFundSharePercent / 100) * 100) / 100;
  const netRevenue = Math.round((grossRevenueUsd - platformFeeUsd) * 100) / 100;
  return {
    grossRevenueUsd,
    platformFeeUsd,
    platformFeePercent: feePercent,
    deponFundContributionUsd: deponFundUsd,
    netRevenueToAppUsd: netRevenue,
    tier,
  };
}

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildRoyaltyRecord(params: {
  appId: string;
  grossRevenueUsd: number;
  tier: MonetizationTier;
  periodStart: Date;
  periodEnd: Date;
}): RoyaltyRecord {
  const split = computeRevenueSplit(params.grossRevenueUsd, params.tier);
  return {
    royaltyId: `roy_${params.appId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    appId: params.appId,
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    grossRevenueUsd: params.grossRevenueUsd,
    platformFeeUsd: split.platformFeeUsd,
    deponFundContributionUsd: split.deponFundContributionUsd,
    netPayoutUsd: split.netRevenueToAppUsd,
    tier: params.tier,
    paidAt: null,
    status: 'pending',
  };
}

export function buildDeponFundAllocation(params: {
  totalCollectedUsd: number;
  periodStart: Date;
  periodEnd: Date;
}): DeponFundAllocation {
  const total = params.totalCollectedUsd;
  return {
    allocationId: `fund_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    totalCollectedUsd: total,
    allocations: {
      spajaProEvolution:      Math.round(total * 0.40 * 100) / 100,  // 40%
      infrastructure:         Math.round(total * 0.35 * 100) / 100,  // 35%
      securityAndCompliance:  Math.round(total * 0.15 * 100) / 100,  // 15%
      communityGrants:        Math.round(total * 0.10 * 100) / 100,  // 10%
    },
    createdAt: new Date(),
  };
}

export function buildBillingStatement(params: {
  appId: string;
  tier: MonetizationTier;
  grossRevenueUsd: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  adjustments?: BillingAdjustment[];
}): AppBillingStatement {
  const split = computeRevenueSplit(params.grossRevenueUsd, params.tier);
  const adjs = params.adjustments ?? [];
  const adjustmentTotal = adjs.reduce((sum, a) => sum + a.amountUsd, 0);
  return {
    statementId: `stmt_${params.appId}_${Date.now()}`,
    appId: params.appId,
    tier: params.tier,
    billingPeriodStart: params.billingPeriodStart,
    billingPeriodEnd: params.billingPeriodEnd,
    grossRevenueUsd: params.grossRevenueUsd,
    platformFeeUsd: split.platformFeeUsd,
    deponFundUsd: split.deponFundContributionUsd,
    netPayoutUsd: Math.max(0, split.netRevenueToAppUsd + adjustmentTotal),
    adjustments: adjs,
    issuedAt: new Date(),
  };
}

export function getAllTierBenefits(): TierBenefits[] {
  return (Object.keys(MONETIZATION_CONFIG.tiers) as MonetizationTier[]).map(getTierBenefits);
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  tiers: number;
  deponFundSharePercent: number;
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    tiers: Object.keys(MONETIZATION_CONFIG.tiers).length,
    deponFundSharePercent: MONETIZATION_CONFIG.deponFundSharePercent,
  };
}
