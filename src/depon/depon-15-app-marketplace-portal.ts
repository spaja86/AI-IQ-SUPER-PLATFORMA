/**
 * 🛍️ DEPON-15 — App Marketplace Portal
 *
 * UI/UX layer for the 180M-app marketplace. Provides:
 *   - Leaderboard view with live DeponValue scores
 *   - Category, state, and monetization filters
 *   - DEPON dependency graph data (which DEPON nodes each app uses)
 *   - App detail page data: gauge, compliance badges, AI recommendations
 *   - Edge-served responses (CDN) targeting < 50ms global latency
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';
import type { AppEntry, AppCategory, MonetizationModel, ComplianceCertification } from './depon-13-app-value-registry';
import type { RankEntry, Leaderboard } from './depon-14-value-ranking-engine';

export const DEPON_ID: DeponId = 'DEPON-15';

// ─── Constants ────────────────────────────────────────────────────────────────

export const MARKETPLACE_CONFIG = {
  defaultPageSize: 50,
  maxPageSize: 200,
  featuredAppsCount: 10,
  cdnCacheTtlSeconds: 30,
  gaugeMaxValue: 100,
  spajaProRecommendations: 3,
} as const;

export const COMPLIANCE_BADGE_LABELS: Record<ComplianceCertification, string> = {
  HIPAA:    '🏥 HIPAA Certified',
  GDPR:     '🇪🇺 GDPR Compliant',
  'PCI-DSS':'💳 PCI-DSS Level 1',
  SOC2:     '🔒 SOC 2 Type II',
  CCPA:     '🔏 CCPA Compliant',
  NIST:     '🛡️ NIST Framework',
  ISO27001: '📋 ISO 27001',
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type MarketplaceFilter = {
  category?: AppCategory;
  ownerState?: string;
  monetizationModel?: MonetizationModel;
  certifications?: ComplianceCertification[];
  minDeponValue?: number;
  searchQuery?: string;
};

export type MarketplaceSortOption = 'deponValue' | 'createdAt' | 'monthlyActiveUsers' | 'name';

export type MarketplacePage = {
  items: MarketplaceListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filter: MarketplaceFilter;
  sortBy: MarketplaceSortOption;
  generatedAt: Date;
};

export type MarketplaceListItem = {
  appId: string;
  name: string;
  description: string;
  category: AppCategory;
  ownerState: string;
  monetizationModel: MonetizationModel;
  deponValue: number;
  deponValueNormalized: number;
  rank: number | null;
  certificationCount: number;
  linkedDeponCount: number;
  status: AppEntry['status'];
};

export type AppDetailView = {
  app: AppEntry;
  rank: number | null;
  deponValueGauge: DeponValueGauge;
  deponDependencies: DeponDependencyNode[];
  complianceBadges: ComplianceBadge[];
  spajaProRecommendations: SpajaProRecommendation[];
  revenueShareInfo: RevenueShareInfo;
};

export type DeponValueGauge = {
  rawValue: number;
  normalizedValue: number;   // 0–100
  tier: 'excellent' | 'good' | 'average' | 'low';
  percentile: number | null;
  label: string;
};

export type DeponDependencyNode = {
  deponId: DeponId;
  deponName: string;
  isActive: boolean;
  healthPath: string;
};

export type ComplianceBadge = {
  certification: ComplianceCertification;
  label: string;
  earnedAt: Date | null;
};

export type SpajaProRecommendation = {
  priority: number;
  action: string;
  expectedValueIncrease: number;   // percentage
  effort: 'low' | 'medium' | 'high';
};

export type RevenueShareInfo = {
  tier: 'ultra-premium' | 'premium' | 'standard' | 'free';
  percentile: number | null;
  platformFeePercent: number;
  deponFundContributionPercent: number;
  slaGuarantee: string;
  description: string;
};

// ─── Gauge Helpers ────────────────────────────────────────────────────────────

export function buildDeponValueGauge(
  rawValue: number,
  normalizedValue: number,
  percentile: number | null = null,
): DeponValueGauge {
  let tier: DeponValueGauge['tier'];
  let label: string;

  if (normalizedValue >= 80) {
    tier = 'excellent'; label = 'Excellent — Top Performer';
  } else if (normalizedValue >= 55) {
    tier = 'good'; label = 'Good — Above Average';
  } else if (normalizedValue >= 30) {
    tier = 'average'; label = 'Average';
  } else {
    tier = 'low'; label = 'Low — Needs Improvement';
  }

  return { rawValue, normalizedValue, tier, percentile, label };
}

// ─── Recommendation Engine ────────────────────────────────────────────────────

/**
 * Generate SpajaPro AI recommendations for improving an app's DeponValue.
 * In production this is powered by SpajaPro 8 (Analitik) or SpajaPro 9 (Kreator).
 */
export function buildSpajaProRecommendations(entry: AppEntry): SpajaProRecommendation[] {
  const recs: SpajaProRecommendation[] = [];

  if (entry.valueFactors.financialDeposit < 1_000) {
    recs.push({
      priority: 1,
      action: 'Increase your DEPON financial deposit to at least $1,000 to unlock the Standard shard.',
      expectedValueIncrease: 25,
      effort: 'low',
    });
  }

  if (entry.valueFactors.spajaProVersion < 10) {
    recs.push({
      priority: 2,
      action: `Upgrade from SpajaPro ${entry.valueFactors.spajaProVersion} to SpajaPro 10+ (Orkestrator) for multi-agent capabilities.`,
      expectedValueIncrease: 15,
      effort: 'medium',
    });
  }

  if (entry.certifications.length === 0) {
    recs.push({
      priority: 3,
      action: 'Obtain at least one compliance certification (SOC 2 or HIPAA) to gain the compliance multiplier.',
      expectedValueIncrease: 20,
      effort: 'high',
    });
  }

  if (entry.valueFactors.statesCovered < 5) {
    recs.push({
      priority: 4,
      action: `Expand from ${entry.valueFactors.statesCovered} to 5+ US states to increase geographic coverage score.`,
      expectedValueIncrease: 10,
      effort: 'medium',
    });
  }

  if (entry.valueFactors.uptimeRatio < 0.999) {
    recs.push({
      priority: 5,
      action: 'Improve uptime to ≥ 99.9% to earn the reliability bonus (+15% to DeponValue).',
      expectedValueIncrease: 15,
      effort: 'medium',
    });
  }

  // Return top-N recommendations sorted by priority
  return recs
    .sort((a, b) => a.priority - b.priority)
    .slice(0, MARKETPLACE_CONFIG.spajaProRecommendations);
}

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildMarketplaceListItem(
  entry: AppEntry,
  rank: number | null,
): MarketplaceListItem {
  return {
    appId: entry.appId,
    name: entry.name,
    description: entry.description,
    category: entry.category,
    ownerState: entry.ownerState,
    monetizationModel: entry.monetizationModel,
    deponValue: entry.deponValue,
    deponValueNormalized: entry.deponValueNormalized,
    rank,
    certificationCount: entry.certifications.length,
    linkedDeponCount: entry.linkedDepons.length,
    status: entry.status,
  };
}

export function buildMarketplacePage(params: {
  items: MarketplaceListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  filter: MarketplaceFilter;
  sortBy: MarketplaceSortOption;
}): MarketplacePage {
  const pageSize = Math.min(params.pageSize, MARKETPLACE_CONFIG.maxPageSize);
  return {
    items: params.items,
    totalCount: params.totalCount,
    page: params.page,
    pageSize,
    totalPages: Math.ceil(params.totalCount / pageSize),
    filter: params.filter,
    sortBy: params.sortBy,
    generatedAt: new Date(),
  };
}

export function buildComplianceBadges(
  certifications: ComplianceCertification[],
): ComplianceBadge[] {
  return certifications.map((cert) => ({
    certification: cert,
    label: COMPLIANCE_BADGE_LABELS[cert],
    earnedAt: null,
  }));
}

export function buildDeponDependencyNodes(
  linkedDepons: DeponId[],
  deponNames: Record<DeponId, string>,
  healthPaths: Record<DeponId, string>,
): DeponDependencyNode[] {
  return linkedDepons.map((id) => ({
    deponId: id,
    deponName: deponNames[id] ?? id,
    isActive: true,
    healthPath: healthPaths[id] ?? `/api/depon/${id.replace('DEPON-', '')}/health`,
  }));
}

export function applyFilter(entries: AppEntry[], filter: MarketplaceFilter): AppEntry[] {
  return entries.filter((e) => {
    if (filter.category && e.category !== filter.category) return false;
    if (filter.ownerState && e.ownerState !== filter.ownerState) return false;
    if (filter.monetizationModel && e.monetizationModel !== filter.monetizationModel) return false;
    if (filter.minDeponValue !== undefined && e.deponValue < filter.minDeponValue) return false;
    if (filter.certifications && filter.certifications.length > 0) {
      const hasCert = filter.certifications.some((c) => e.certifications.includes(c));
      if (!hasCert) return false;
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export function sortEntries(
  entries: AppEntry[],
  sortBy: MarketplaceSortOption,
): AppEntry[] {
  return [...entries].sort((a, b) => {
    switch (sortBy) {
      case 'deponValue':
        return b.deponValue - a.deponValue;
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'monthlyActiveUsers':
        return b.valueFactors.monthlyActiveUsers - a.valueFactors.monthlyActiveUsers;
      case 'name':
        return a.name.localeCompare(b.name);
    }
  });
}

export function getFeaturedApps(leaderboard: Leaderboard): RankEntry[] {
  return leaderboard.entries.slice(0, MARKETPLACE_CONFIG.featuredAppsCount);
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  cdnCacheTtlSeconds: number;
} {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    cdnCacheTtlSeconds: MARKETPLACE_CONFIG.cdnCacheTtlSeconds,
  };
}
