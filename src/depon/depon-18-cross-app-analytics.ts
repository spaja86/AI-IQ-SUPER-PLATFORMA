/**
 * 📊 DEPON-18 — Cross-App Analytics
 *
 * Inter-app analytics engine for the 180M-app marketplace.
 * Provides DeponValue correlation analysis, category trend insights,
 * and SpajaPro 8 (Analitik) powered forecasting.
 *
 * Key capabilities:
 *   - Cross-app DeponValue correlation matrix
 *   - Category and state trend aggregation
 *   - Cohort analysis (apps grouped by creation date / tier)
 *   - Value history timeseries per app
 *   - Platform-wide health metrics
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';
import type { AppEntry, AppCategory, AppShard } from './depon-13-app-value-registry';

export const DEPON_ID: DeponId = 'DEPON-18';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CROSS_ANALYTICS_CONFIG = {
  trendWindowDays: 30,
  correlationMinSampleSize: 10,
  forecastHorizonDays: 90,
  valueHistoryRetentionDays: 365,
  spajaProAnalytikVersion: 8,
  kafkaTopicsConsumed: [
    'app.value.updated',
    'app.deposited',
    'app.ranking.changed',
    'app.deployed',
  ] as const,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ValueHistoryPoint = {
  timestamp: Date;
  deponValue: number;
  deponValueNormalized: number;
  reason: string;
};

export type AppValueHistory = {
  appId: string;
  history: ValueHistoryPoint[];
  firstRecordedAt: Date;
  lastRecordedAt: Date;
};

export type CategoryMetrics = {
  category: AppCategory;
  appCount: number;
  averageDeponValue: number;
  medianDeponValue: number;
  topDeponValue: number;
  totalMonthlyActiveUsers: number;
  totalTransactionVolumeUsd: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercent: number;
};

export type StateMetrics = {
  stateCode: string;
  appCount: number;
  averageDeponValue: number;
  topApp: { appId: string; name: string; deponValue: number } | null;
  categoryBreakdown: Record<AppCategory, number>;
};

export type CorrelationResult = {
  factorA: string;
  factorB: string;
  pearsonR: number;        // -1 to +1
  sampleSize: number;
  isSignificant: boolean;  // |r| > 0.3 and sampleSize >= min
};

export type CohortAnalysis = {
  cohortLabel: string;
  appCount: number;
  averageDeponValue: number;
  averageGrowthPercent: number;
  shardDistribution: Record<AppShard, number>;
};

export type PlatformHealthMetrics = {
  totalApps: number;
  activeApps: number;
  totalDeponFundUsd: number;
  averageDeponValue: number;
  p50DeponValue: number;
  p90DeponValue: number;
  p99DeponValue: number;
  topCategory: AppCategory | null;
  topState: string | null;
  computedAt: Date;
};

export type ValueForecast = {
  appId: string;
  forecastHorizonDays: number;
  currentDeponValue: number;
  forecastedDeponValue: number;
  confidenceInterval: { low: number; high: number };
  trend: 'growing' | 'declining' | 'stable';
  forecastedAt: Date;
};

// ─── Aggregation Functions ────────────────────────────────────────────────────

export function aggregateByCategory(entries: AppEntry[]): CategoryMetrics[] {
  const groups = new Map<AppCategory, AppEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.category) ?? [];
    list.push(e);
    groups.set(e.category, list);
  }

  const results: CategoryMetrics[] = [];
  for (const [category, apps] of groups) {
    const values = apps.map((a) => a.deponValue).sort((a, b) => a - b);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const median = values[Math.floor(values.length / 2)] ?? 0;
    const top = values[values.length - 1] ?? 0;
    const totalMAU = apps.reduce((s, a) => s + a.valueFactors.monthlyActiveUsers, 0);
    const totalVol = apps.reduce((s, a) => s + a.valueFactors.transactionVolumeUsd, 0);

    results.push({
      category,
      appCount: apps.length,
      averageDeponValue: Math.round(avg * 1000) / 1000,
      medianDeponValue: Math.round(median * 1000) / 1000,
      topDeponValue: Math.round(top * 1000) / 1000,
      totalMonthlyActiveUsers: totalMAU,
      totalTransactionVolumeUsd: totalVol,
      trendDirection: 'stable',
      trendPercent: 0,
    });
  }
  return results.sort((a, b) => b.averageDeponValue - a.averageDeponValue);
}

export function aggregateByState(entries: AppEntry[]): StateMetrics[] {
  const groups = new Map<string, AppEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.ownerState) ?? [];
    list.push(e);
    groups.set(e.ownerState, list);
  }

  const results: StateMetrics[] = [];
  for (const [stateCode, apps] of groups) {
    const values = apps.map((a) => a.deponValue);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const topApp = apps.reduce<AppEntry | null>(
      (best, a) => (!best || a.deponValue > best.deponValue ? a : best),
      null,
    );
    const catBreakdown = {} as Record<AppCategory, number>;
    for (const a of apps) {
      catBreakdown[a.category] = (catBreakdown[a.category] ?? 0) + 1;
    }
    results.push({
      stateCode,
      appCount: apps.length,
      averageDeponValue: Math.round(avg * 1000) / 1000,
      topApp: topApp
        ? { appId: topApp.appId, name: topApp.name, deponValue: topApp.deponValue }
        : null,
      categoryBreakdown: catBreakdown,
    });
  }
  return results.sort((a, b) => b.averageDeponValue - a.averageDeponValue);
}

// ─── Correlation ──────────────────────────────────────────────────────────────

/**
 * Compute Pearson correlation between two numeric series of equal length.
 */
export function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const meanX = xs.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanY = ys.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i]! - meanX;
    const dy = ys[i]! - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : Math.round((num / den) * 1000) / 1000;
}

export function computeCorrelations(entries: AppEntry[]): CorrelationResult[] {
  const min = CROSS_ANALYTICS_CONFIG.correlationMinSampleSize;
  if (entries.length < min) return [];

  const deposit    = entries.map((e) => e.valueFactors.financialDeposit);
  const mau        = entries.map((e) => e.valueFactors.monthlyActiveUsers);
  const uptime     = entries.map((e) => e.valueFactors.uptimeRatio);
  const states     = entries.map((e) => e.valueFactors.statesCovered);
  const deponValue = entries.map((e) => e.deponValue);

  const pairs: Array<[string, number[], string, number[]]> = [
    ['financialDeposit', deposit,  'deponValue', deponValue],
    ['monthlyActiveUsers', mau,    'deponValue', deponValue],
    ['uptimeRatio', uptime,        'deponValue', deponValue],
    ['statesCovered', states,      'deponValue', deponValue],
    ['financialDeposit', deposit,  'monthlyActiveUsers', mau],
  ];

  return pairs.map(([labelA, xs, labelB, ys]) => {
    const r = pearsonCorrelation(xs, ys);
    return {
      factorA: labelA,
      factorB: labelB,
      pearsonR: r,
      sampleSize: entries.length,
      isSignificant: Math.abs(r) > 0.3 && entries.length >= min,
    };
  });
}

// ─── Cohort Analysis ──────────────────────────────────────────────────────────

export function buildCohortAnalysis(entries: AppEntry[]): CohortAnalysis[] {
  // Group by shard as cohort proxy
  const shards: AppShard[] = ['premium', 'standard', 'longtail'];
  return shards.map((shard) => {
    const group = entries.filter((e) => e.shard === shard);
    const values = group.map((e) => e.deponValue);
    const avg = values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    const shardDist: Record<AppShard, number> = { premium: 0, standard: 0, longtail: 0 };
    for (const e of group) shardDist[e.shard]++;
    return {
      cohortLabel: `Shard: ${shard}`,
      appCount: group.length,
      averageDeponValue: Math.round(avg * 1000) / 1000,
      averageGrowthPercent: 0,   // requires historical data
      shardDistribution: shardDist,
    };
  });
}

// ─── Platform Health ──────────────────────────────────────────────────────────

export function buildPlatformHealthMetrics(
  entries: AppEntry[],
  totalDeponFundUsd = 0,
): PlatformHealthMetrics {
  const active = entries.filter((e) => e.status === 'active');
  const values = entries.map((e) => e.deponValue).sort((a, b) => a - b);
  const avg = values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0;
  const p50 = values[Math.floor(values.length * 0.50)] ?? 0;
  const p90 = values[Math.floor(values.length * 0.90)] ?? 0;
  const p99 = values[Math.floor(values.length * 0.99)] ?? 0;

  // Top category by app count
  const catCount = new Map<AppCategory, number>();
  const stateCount = new Map<string, number>();
  for (const e of entries) {
    catCount.set(e.category, (catCount.get(e.category) ?? 0) + 1);
    stateCount.set(e.ownerState, (stateCount.get(e.ownerState) ?? 0) + 1);
  }
  const topCat = [...catCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topState = [...stateCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalApps: entries.length,
    activeApps: active.length,
    totalDeponFundUsd,
    averageDeponValue: Math.round(avg * 1000) / 1000,
    p50DeponValue: Math.round(p50 * 1000) / 1000,
    p90DeponValue: Math.round(p90 * 1000) / 1000,
    p99DeponValue: Math.round(p99 * 1000) / 1000,
    topCategory: topCat,
    topState,
    computedAt: new Date(),
  };
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

/**
 * Simple linear extrapolation forecast for a single app.
 * In production, powered by SpajaPro 8 (Analitik) ML models.
 */
export function buildValueForecast(params: {
  appId: string;
  currentDeponValue: number;
  weeklyGrowthRate?: number;  // fraction, e.g. 0.02 = 2% per week
}): ValueForecast {
  const growthRate = params.weeklyGrowthRate ?? 0.01;
  const weeks = CROSS_ANALYTICS_CONFIG.forecastHorizonDays / 7;
  const forecasted = params.currentDeponValue * Math.pow(1 + growthRate, weeks);
  const margin = forecasted * 0.15;   // ±15% confidence interval
  const trend: ValueForecast['trend'] =
    growthRate > 0.005 ? 'growing' : growthRate < -0.005 ? 'declining' : 'stable';

  return {
    appId: params.appId,
    forecastHorizonDays: CROSS_ANALYTICS_CONFIG.forecastHorizonDays,
    currentDeponValue: params.currentDeponValue,
    forecastedDeponValue: Math.round(forecasted * 1000) / 1000,
    confidenceInterval: {
      low:  Math.round((forecasted - margin) * 1000) / 1000,
      high: Math.round((forecasted + margin) * 1000) / 1000,
    },
    trend,
    forecastedAt: new Date(),
  };
}

export function buildValueHistoryPoint(params: {
  deponValue: number;
  deponValueNormalized: number;
  reason: string;
}): ValueHistoryPoint {
  return {
    timestamp: new Date(),
    deponValue: params.deponValue,
    deponValueNormalized: params.deponValueNormalized,
    reason: params.reason,
  };
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  kafkaTopicsConsumed: number;
  forecastHorizonDays: number;
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    kafkaTopicsConsumed: CROSS_ANALYTICS_CONFIG.kafkaTopicsConsumed.length,
    forecastHorizonDays: CROSS_ANALYTICS_CONFIG.forecastHorizonDays,
  };
}
