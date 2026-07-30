/**
 * 🏆 DEPON-14 — Value Ranking Engine
 *
 * Real-time ranking and leaderboard for 180M apps by DeponValue score.
 * Hot rankings (top 10K) are served from Redis cache.
 * Full rankings use Elasticsearch with the custom `deponValue` field.
 *
 * Kafka topics consumed:
 *   - app.value.updated  → triggers re-rank for affected percentile window
 *   - app.deposited      → instant re-rank for the depositing app
 *   - app.ranking.changed → published when an app moves ≥ 100 rank positions
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';
import type { AppEntry, AppShard } from './depon-13-app-value-registry';

export const DEPON_ID: DeponId = 'DEPON-14';

// ─── Constants ────────────────────────────────────────────────────────────────

export const RANKING_CONFIG = {
  hotCacheSize: 10_000,
  hotCacheTtlSeconds: 60,
  leaderboardTopN: 1_000,
  rankChangedThreshold: 100,
  kafkaTopics: {
    valueUpdated: 'app.value.updated',
    deposited: 'app.deposited',
    rankingChanged: 'app.ranking.changed',
  },
  elasticsearchIndex: 'apps-depon-value',
  elasticsearchShards: 12,
  elasticsearchReplicas: 2,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RankEntry = {
  rank: number;
  appId: string;
  appName: string;
  ownerState: string;
  deponValue: number;
  deponValueNormalized: number;
  shard: AppShard;
  deltaRank: number;       // positive = moved up, negative = moved down
  computedAt: Date;
};

export type Leaderboard = {
  topN: number;
  entries: RankEntry[];
  generatedAt: Date;
  cacheHit: boolean;
};

export type TopNQuery = {
  n: number;
  ownerState?: string;
  category?: string;
  shard?: AppShard;
};

export type RankingSnapshot = {
  snapshotId: string;
  totalApps: number;
  topEntry: RankEntry | null;
  bottomEntry: RankEntry | null;
  averageDeponValue: number;
  medianDeponValue: number;
  p99DeponValue: number;
  generatedAt: Date;
};

export type KafkaRankingEvent = {
  topic: string;
  appId: string;
  previousRank: number | null;
  newRank: number;
  deponValue: number;
  timestamp: Date;
};

export type ElasticsearchQuery = {
  index: string;
  sort: { field: 'deponValue'; order: 'desc' | 'asc' };
  filters: {
    ownerState?: string;
    category?: string;
    shard?: AppShard;
    minDeponValue?: number;
  };
  from: number;
  size: number;
};

// ─── Ranking Algorithms ───────────────────────────────────────────────────────

/**
 * Sort a collection of app entries by DeponValue descending and assign ranks.
 */
export function computeRanks(entries: AppEntry[]): RankEntry[] {
  const sorted = [...entries].sort((a, b) => b.deponValue - a.deponValue);
  return sorted.map((entry, index) => ({
    rank: index + 1,
    appId: entry.appId,
    appName: entry.name,
    ownerState: entry.ownerState,
    deponValue: entry.deponValue,
    deponValueNormalized: entry.deponValueNormalized,
    shard: entry.shard,
    deltaRank: 0,
    computedAt: new Date(),
  }));
}

/**
 * Apply delta ranks by comparing new ranking to a previous snapshot.
 */
export function applyDeltaRanks(
  newRanks: RankEntry[],
  previousRanks: RankEntry[],
): RankEntry[] {
  const prevMap = new Map<string, number>(
    previousRanks.map((r) => [r.appId, r.rank]),
  );
  return newRanks.map((entry) => {
    const prev = prevMap.get(entry.appId);
    const delta = prev !== undefined ? prev - entry.rank : 0;
    return { ...entry, deltaRank: delta };
  });
}

/**
 * Build a leaderboard from ranked entries.
 */
export function buildLeaderboard(
  rankedEntries: RankEntry[],
  topN = RANKING_CONFIG.leaderboardTopN,
  cacheHit = false,
): Leaderboard {
  return {
    topN,
    entries: rankedEntries.slice(0, topN),
    generatedAt: new Date(),
    cacheHit,
  };
}

/**
 * Get the top-N apps by DeponValue from a collection.
 */
export function getTopN(entries: AppEntry[], query: TopNQuery): RankEntry[] {
  let filtered = [...entries];
  if (query.ownerState) {
    filtered = filtered.filter((e) => e.ownerState === query.ownerState);
  }
  if (query.category) {
    filtered = filtered.filter((e) => e.category === query.category);
  }
  if (query.shard) {
    filtered = filtered.filter((e) => e.shard === query.shard);
  }
  return computeRanks(filtered).slice(0, query.n);
}

/**
 * Compute a ranking snapshot with statistical summary.
 */
export function buildRankingSnapshot(rankedEntries: RankEntry[]): RankingSnapshot {
  const values = rankedEntries.map((e) => e.deponValue).sort((a, b) => a - b);
  const avg =
    values.length > 0
      ? values.reduce((s, v) => s + v, 0) / values.length
      : 0;
  const median =
    values.length > 0 ? values[Math.floor(values.length / 2)]! : 0;
  const p99Index = Math.floor(values.length * 0.99);
  const p99 = values.length > 0 ? (values[p99Index] ?? values[values.length - 1] ?? 0) : 0;

  return {
    snapshotId: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    totalApps: rankedEntries.length,
    topEntry: rankedEntries[0] ?? null,
    bottomEntry: rankedEntries[rankedEntries.length - 1] ?? null,
    averageDeponValue: Math.round(avg * 1000) / 1000,
    medianDeponValue: Math.round(median * 1000) / 1000,
    p99DeponValue: Math.round(p99 * 1000) / 1000,
    generatedAt: new Date(),
  };
}

/**
 * Detect apps that moved at least `threshold` positions and emit Kafka events.
 */
export function detectSignificantRankChanges(
  entries: RankEntry[],
  threshold = RANKING_CONFIG.rankChangedThreshold,
): KafkaRankingEvent[] {
  return entries
    .filter((e) => Math.abs(e.deltaRank) >= threshold)
    .map((e) => ({
      topic: RANKING_CONFIG.kafkaTopics.rankingChanged,
      appId: e.appId,
      previousRank: e.rank + e.deltaRank,
      newRank: e.rank,
      deponValue: e.deponValue,
      timestamp: new Date(),
    }));
}

/**
 * Build the Elasticsearch query object for ranked app search.
 */
export function buildElasticsearchQuery(params: {
  filters?: ElasticsearchQuery['filters'];
  from?: number;
  size?: number;
}): ElasticsearchQuery {
  return {
    index: RANKING_CONFIG.elasticsearchIndex,
    sort: { field: 'deponValue', order: 'desc' },
    filters: params.filters ?? {},
    from: params.from ?? 0,
    size: Math.min(params.size ?? 100, 10_000),
  };
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  hotCacheSize: number;
  kafkaTopics: string[];
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    hotCacheSize: RANKING_CONFIG.hotCacheSize,
    kafkaTopics: Object.values(RANKING_CONFIG.kafkaTopics),
  };
}
