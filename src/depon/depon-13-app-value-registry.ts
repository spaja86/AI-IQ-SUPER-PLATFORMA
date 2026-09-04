/**
 * 🗂️ DEPON-13 — App Value Registry
 *
 * Master registry for all 180M applications on the AI IQ SUPER PLATFORMA.
 * Each app entry carries a DeponValue score — a weighted composite metric
 * that drives visibility, routing priority, and monetization tier.
 *
 * Sharding strategy:
 *   - Top 1%  (1.8M)  → shard-premium  (dedicated PostgreSQL + TimescaleDB)
 *   - Mid 49% (88.2M) → shard-standard (shared cluster, 6 replicas)
 *   - Long 50%(90M)   → shard-longtail (cold storage, S3-backed)
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-13';

// ─── Constants ────────────────────────────────────────────────────────────────

export const APP_REGISTRY_CONFIG = {
  totalAppsTarget: 180_000_000,
  shards: {
    premium:  { minPercentile: 99, label: 'Top 1%',   count: 1_800_000 },
    standard: { minPercentile: 51, label: 'Mid 49%',  count: 88_200_000 },
    longtail: { minPercentile: 0,  label: 'Long 50%', count: 90_000_000 },
  },
  valueDecayIntervalDays: 30,
  valueDecayRate: 0.10,
  inactivityThresholdDays: 30,
  breachPenaltyRate: 0.25,
  refreshIntervalHours: 24,
  complianceMultiplier: 1.5,
  uptimeBonusThreshold: 0.999,
  uptimeBonusRate: 0.15,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type AppCategory =
  | 'fintech'
  | 'healthtech'
  | 'edtech'
  | 'gaming'
  | 'ecommerce'
  | 'logistics'
  | 'govtech'
  | 'socialtech'
  | 'iot'
  | 'ai-ml'
  | 'cybersecurity'
  | 'media'
  | 'real-estate'
  | 'legaltech'
  | 'other';

export type MonetizationModel = 'freemium' | 'subscription' | 'pay-per-use' | 'one-time' | 'revenue-share';

export type AppShard = 'premium' | 'standard' | 'longtail';

export type AppStatus = 'active' | 'inactive' | 'suspended' | 'pending' | 'deprecated';

export type ComplianceCertification =
  | 'HIPAA'
  | 'GDPR'
  | 'PCI-DSS'
  | 'SOC2'
  | 'CCPA'
  | 'NIST'
  | 'ISO27001';

export type DeponValueFactors = {
  /** Financial stake deposited in the DEPON fund (USD) */
  financialDeposit: number;
  /** Monthly active users */
  monthlyActiveUsers: number;
  /** Monthly transaction volume (USD) */
  transactionVolumeUsd: number;
  /** Uptime ratio (0–1) */
  uptimeRatio: number;
  /** SpajaPro engine version in use (6–15); higher = more points */
  spajaProVersion: number;
  /** Number of US states covered (1–50) */
  statesCovered: number;
  /** Compliance certifications held */
  certifications: ComplianceCertification[];
  /** Days since last active deployment */
  daysSinceLastDeploy: number;
  /** Number of active DEPON modules linked */
  linkedDeponCount: number;
};

export type AppEntry = {
  appId: string;
  name: string;
  description: string;
  ownerUserId: string;
  ownerState: string;
  category: AppCategory;
  monetizationModel: MonetizationModel;
  linkedDepons: DeponId[];
  status: AppStatus;
  certifications: ComplianceCertification[];
  deponValue: number;
  deponValueNormalized: number;   // 0–100 normalized score for UI
  shard: AppShard;
  valueFactors: DeponValueFactors;
  lastValueUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AppRegistryQuery = {
  category?: AppCategory;
  ownerState?: string;
  monetizationModel?: MonetizationModel;
  minDeponValue?: number;
  maxDeponValue?: number;
  shard?: AppShard;
  status?: AppStatus;
  orderBy?: 'deponValue' | 'createdAt' | 'monthlyActiveUsers';
  direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

export type DepositEvent = {
  eventId: string;
  appId: string;
  amountUsd: number;
  previousDeponValue: number;
  newDeponValue: number;
  timestamp: Date;
};

export type ValueUpdateEvent = {
  eventId: string;
  appId: string;
  reason: 'scheduled-refresh' | 'deposit' | 'decay' | 'breach-penalty' | 'uptime-bonus' | 'compliance-change';
  delta: number;
  previousValue: number;
  newValue: number;
  timestamp: Date;
};

// ─── DeponValue Score Computation ────────────────────────────────────────────

/**
 * Weights for the composite DeponValue score.
 * All weights sum to 1.0 (before multipliers).
 */
export const DEPON_VALUE_WEIGHTS = {
  financialDeposit:     0.30,
  activityScore:        0.25,   // MAU × transaction volume (log-scaled)
  reliability:          0.20,   // uptime ratio
  aiIntegration:        0.10,   // SpajaPro version factor
  geographicCoverage:   0.10,   // states covered ratio
  deponIntegration:     0.05,   // linked DEPON modules ratio
} as const;

/**
 * Compute the raw DeponValue score from a set of factors.
 * Returns a non-negative number (0–∞, typically 0–10000).
 */
export function computeDeponValue(factors: DeponValueFactors): number {
  // Financial deposit component (log-scaled, capped at 1M USD → 100 pts)
  const depositPts = Math.min(
    (Math.log1p(factors.financialDeposit) / Math.log1p(1_000_000)) * 100,
    100,
  );

  // Activity score: MAU × volume, log-scaled
  const activityRaw = factors.monthlyActiveUsers * Math.log1p(factors.transactionVolumeUsd + 1);
  const activityPts = Math.min(
    (Math.log1p(activityRaw) / Math.log1p(1e12)) * 100,
    100,
  );

  // Reliability component
  const reliabilityPts = factors.uptimeRatio * 100;

  // AI integration: SpajaPro 6–15 → 0–100 pts
  const aiPts = Math.max(0, Math.min(((factors.spajaProVersion - 6) / 9) * 100, 100));

  // Geographic coverage: 1–50 states → 0–100 pts
  const geoPts = Math.min((factors.statesCovered / 50) * 100, 100);

  // DEPON integration: linked DEPONs out of 18
  const deponPts = Math.min((factors.linkedDeponCount / 18) * 100, 100);

  // Weighted base score (0–100)
  const baseScore =
    depositPts    * DEPON_VALUE_WEIGHTS.financialDeposit +
    activityPts   * DEPON_VALUE_WEIGHTS.activityScore +
    reliabilityPts * DEPON_VALUE_WEIGHTS.reliability +
    aiPts         * DEPON_VALUE_WEIGHTS.aiIntegration +
    geoPts        * DEPON_VALUE_WEIGHTS.geographicCoverage +
    deponPts      * DEPON_VALUE_WEIGHTS.deponIntegration;

  // Compliance multiplier: each certification adds weight
  const hasCompliance = factors.certifications.length > 0;
  const complianceBonus = hasCompliance
    ? 1 + (factors.certifications.length * 0.05)   // +5% per cert, stacks
    : 1.0;
  const afterCompliance = baseScore * Math.min(complianceBonus, APP_REGISTRY_CONFIG.complianceMultiplier);

  // Uptime bonus
  const afterUptime =
    factors.uptimeRatio >= APP_REGISTRY_CONFIG.uptimeBonusThreshold
      ? afterCompliance * (1 + APP_REGISTRY_CONFIG.uptimeBonusRate)
      : afterCompliance;

  // Inactivity decay — reduce by configured rate per 30-day period
  const inactivityPeriods = Math.floor(
    factors.daysSinceLastDeploy / APP_REGISTRY_CONFIG.inactivityThresholdDays,
  );
  const decayFactor = Math.pow(1 - APP_REGISTRY_CONFIG.valueDecayRate, inactivityPeriods);

  return Math.max(0, afterUptime * decayFactor);
}

/**
 * Normalize a raw DeponValue into a 0–100 gauge-friendly value.
 * Uses a log scale so that high-value outliers don't dominate.
 */
export function normalizeDeponValue(rawValue: number, maxObservedValue = 200): number {
  if (rawValue <= 0) return 0;
  const normalized = (Math.log1p(rawValue) / Math.log1p(maxObservedValue)) * 100;
  return Math.min(Math.round(normalized * 100) / 100, 100);
}

/**
 * Determine the storage shard for an app based on its score percentile.
 */
export function resolveAppShard(deponValue: number, maxObservedValue = 200): AppShard {
  const normalized = normalizeDeponValue(deponValue, maxObservedValue);
  if (normalized >= 99) return 'premium';
  if (normalized >= 51) return 'standard';
  return 'longtail';
}

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildAppEntry(params: {
  name: string;
  description: string;
  ownerUserId: string;
  ownerState: string;
  category: AppCategory;
  monetizationModel: MonetizationModel;
  linkedDepons?: DeponId[];
  certifications?: ComplianceCertification[];
  valueFactors?: Partial<DeponValueFactors>;
}): AppEntry {
  const defaultFactors: DeponValueFactors = {
    financialDeposit: 0,
    monthlyActiveUsers: 0,
    transactionVolumeUsd: 0,
    uptimeRatio: 1.0,
    spajaProVersion: 6,
    statesCovered: 1,
    certifications: params.certifications ?? [],
    daysSinceLastDeploy: 0,
    linkedDeponCount: params.linkedDepons?.length ?? 0,
  };
  const factors: DeponValueFactors = { ...defaultFactors, ...params.valueFactors };
  const deponValue = computeDeponValue(factors);
  const deponValueNormalized = normalizeDeponValue(deponValue);
  const now = new Date();
  return {
    appId: `app_${params.ownerState}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: params.name,
    description: params.description,
    ownerUserId: params.ownerUserId,
    ownerState: params.ownerState,
    category: params.category,
    monetizationModel: params.monetizationModel,
    linkedDepons: params.linkedDepons ?? [],
    status: 'active',
    certifications: params.certifications ?? [],
    deponValue,
    deponValueNormalized,
    shard: resolveAppShard(deponValue),
    valueFactors: factors,
    lastValueUpdate: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyBreachPenalty(entry: AppEntry): AppEntry {
  const newValue = Math.max(
    0,
    entry.deponValue * (1 - APP_REGISTRY_CONFIG.breachPenaltyRate),
  );
  return {
    ...entry,
    deponValue: newValue,
    deponValueNormalized: normalizeDeponValue(newValue),
    shard: resolveAppShard(newValue),
    lastValueUpdate: new Date(),
    updatedAt: new Date(),
  };
}

export function applyDeposit(entry: AppEntry, additionalDepositUsd: number): {
  updatedEntry: AppEntry;
  event: DepositEvent;
} {
  const previousDeponValue = entry.deponValue;
  const updatedFactors: DeponValueFactors = {
    ...entry.valueFactors,
    financialDeposit: entry.valueFactors.financialDeposit + additionalDepositUsd,
  };
  const newValue = computeDeponValue(updatedFactors);
  const updatedEntry: AppEntry = {
    ...entry,
    valueFactors: updatedFactors,
    deponValue: newValue,
    deponValueNormalized: normalizeDeponValue(newValue),
    shard: resolveAppShard(newValue),
    lastValueUpdate: new Date(),
    updatedAt: new Date(),
  };
  const event: DepositEvent = {
    eventId: `dep_${entry.appId}_${Date.now()}`,
    appId: entry.appId,
    amountUsd: additionalDepositUsd,
    previousDeponValue,
    newDeponValue: newValue,
    timestamp: new Date(),
  };
  return { updatedEntry, event };
}

export function buildValueUpdateEvent(params: {
  appId: string;
  reason: ValueUpdateEvent['reason'];
  previousValue: number;
  newValue: number;
}): ValueUpdateEvent {
  return {
    eventId: `vup_${params.appId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    appId: params.appId,
    reason: params.reason,
    delta: params.newValue - params.previousValue,
    previousValue: params.previousValue,
    newValue: params.newValue,
    timestamp: new Date(),
  };
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  totalAppsTarget: number;
  shards: number;
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    totalAppsTarget: APP_REGISTRY_CONFIG.totalAppsTarget,
    shards: Object.keys(APP_REGISTRY_CONFIG.shards).length,
  };
}
