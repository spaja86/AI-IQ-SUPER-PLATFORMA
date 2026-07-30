/**
 * 🏛️ DEPON Registry — Deployment Operational Nodes
 *
 * Central registry for all 18 DEPON modules of the multi-state mega-platform
 * (AI IQ SUPER PLATFORMA — US States Edition).
 *
 * Architecture: Each DEPON is an independent deployable unit (1 DEPON = 1 node).
 * Scale target: 120,000,000 users × 180,000,000 apps across all 50 US states.
 *
 * DEPON-01–12: Core platform services (120M users)
 * DEPON-13–18: App Marketplace & Value Engine (180M apps)
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type DeponId =
  | 'DEPON-01'
  | 'DEPON-02'
  | 'DEPON-03'
  | 'DEPON-04'
  | 'DEPON-05'
  | 'DEPON-06'
  | 'DEPON-07'
  | 'DEPON-08'
  | 'DEPON-09'
  | 'DEPON-10'
  | 'DEPON-11'
  | 'DEPON-12'
  | 'DEPON-13'
  | 'DEPON-14'
  | 'DEPON-15'
  | 'DEPON-16'
  | 'DEPON-17'
  | 'DEPON-18';

export type DeponStatus = 'active' | 'planned' | 'degraded' | 'offline';

export type DeponPhase = 1 | 2 | 3;

export type ScalingPhase = {
  phase: DeponPhase;
  label: string;
  userRange: string;
  regions: number;
  pattern: string;
};

export type DeponModule = {
  id: DeponId;
  name: string;
  description: string;
  scope: string;
  status: DeponStatus;
  phase: DeponPhase;
  port: number;
  healthPath: string;
  tags: string[];
};

// ─── US States ───────────────────────────────────────────────────────────────

export const US_STATES: readonly string[] = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const;

export const STATE_COMPLIANCE_LAWS: Record<string, string[]> = {
  CA: ['CCPA', 'CPRA'],
  NY: ['SHIELD Act', 'NYDFS Cybersecurity'],
  TX: ['TDPSA'],
  VA: ['VCDPA'],
  CO: ['CPA'],
  CT: ['CTDPA'],
  UT: ['UCPA'],
  FL: ['FDBR'],
};

// ─── Scaling Phases ──────────────────────────────────────────────────────────

export const SCALING_PHASES: ScalingPhase[] = [
  {
    phase: 1,
    label: 'Monolith Bootstrap',
    userRange: '0–10M apps',
    regions: 3,
    pattern: 'Monorepo + basic Kubernetes (18 DEPON nodes)',
  },
  {
    phase: 2,
    label: 'Microservices Expansion',
    userRange: '10–80M apps',
    regions: 6,
    pattern: 'Microservices split + Kafka + Elasticsearch (36 DEPON nodes)',
  },
  {
    phase: 3,
    label: 'Full Multi-Region',
    userRange: '80–180M apps',
    regions: 12,
    pattern: 'Event-driven (Kafka) + CQRS + distributed sharding (72 DEPON nodes)',
  },
];

// ─── DEPON Module Definitions ────────────────────────────────────────────────

export const DEPON_MODULES: DeponModule[] = [
  {
    id: 'DEPON-01',
    name: 'User Identity & Auth',
    description: 'Authentication, authorization, SSO, MFA, and session management for all 50 states.',
    scope: 'All 50 states',
    status: 'active',
    phase: 1,
    port: 3001,
    healthPath: '/api/depon/01/health',
    tags: ['auth', 'identity', 'sso', 'mfa'],
  },
  {
    id: 'DEPON-02',
    name: 'State Dashboard Portal',
    description: 'Per-state customizable dashboard with state-specific branding and data views.',
    scope: 'Per-state customization',
    status: 'active',
    phase: 1,
    port: 3002,
    healthPath: '/api/depon/02/health',
    tags: ['dashboard', 'portal', 'state', 'ui'],
  },
  {
    id: 'DEPON-03',
    name: 'Analytics Engine',
    description: 'Real-time analytics processing 120M events per day with state-level aggregation.',
    scope: 'Real-time, 120M events/day',
    status: 'active',
    phase: 1,
    port: 3003,
    healthPath: '/api/depon/03/health',
    tags: ['analytics', 'real-time', 'events', 'kafka'],
  },
  {
    id: 'DEPON-04',
    name: 'Payment & Billing',
    description: 'PCI-DSS compliant payment processing, subscriptions, invoicing, and multi-currency support.',
    scope: 'PCI-DSS compliant',
    status: 'active',
    phase: 1,
    port: 3004,
    healthPath: '/api/depon/04/health',
    tags: ['payments', 'billing', 'stripe', 'pci-dss'],
  },
  {
    id: 'DEPON-05',
    name: 'Notification Service',
    description: 'Multi-channel notification delivery: Push, Email, SMS with per-state opt-in rules.',
    scope: 'Push, Email, SMS',
    status: 'planned',
    phase: 2,
    port: 3005,
    healthPath: '/api/depon/05/health',
    tags: ['notifications', 'push', 'email', 'sms'],
  },
  {
    id: 'DEPON-06',
    name: 'Content Management',
    description: 'Multi-language, multi-state CMS for managing platform content and regulations.',
    scope: 'Multi-language, multi-state',
    status: 'planned',
    phase: 2,
    port: 3006,
    healthPath: '/api/depon/06/health',
    tags: ['cms', 'content', 'i18n', 'l10n'],
  },
  {
    id: 'DEPON-07',
    name: 'Search & Discovery',
    description: 'Elasticsearch-powered full-text search and content discovery across all state modules.',
    scope: 'Elasticsearch cluster',
    status: 'planned',
    phase: 2,
    port: 3007,
    healthPath: '/api/depon/07/health',
    tags: ['search', 'elasticsearch', 'discovery', 'indexing'],
  },
  {
    id: 'DEPON-08',
    name: 'API Gateway',
    description: 'Central API gateway with rate limiting, routing, auth enforcement, and state routing.',
    scope: 'Rate limiting, routing',
    status: 'planned',
    phase: 2,
    port: 3008,
    healthPath: '/api/depon/08/health',
    tags: ['api-gateway', 'rate-limiting', 'routing', 'middleware'],
  },
  {
    id: 'DEPON-09',
    name: 'AI/ML Service',
    description: 'Recommendations engine, predictions, and personalization using ML models per state.',
    scope: 'Recommendations, predictions',
    status: 'planned',
    phase: 3,
    port: 3009,
    healthPath: '/api/depon/09/health',
    tags: ['ai', 'ml', 'recommendations', 'predictions'],
  },
  {
    id: 'DEPON-10',
    name: 'Admin & Compliance',
    description: 'HIPAA/GDPR/State law compliance engine, admin tools, and audit trails.',
    scope: 'HIPAA/GDPR/State laws',
    status: 'planned',
    phase: 3,
    port: 3010,
    healthPath: '/api/depon/10/health',
    tags: ['admin', 'compliance', 'hipaa', 'gdpr', 'audit'],
  },
  {
    id: 'DEPON-11',
    name: 'Mobile Backend (BFF)',
    description: 'Backend-For-Frontend optimized API layer for iOS and Android mobile clients.',
    scope: 'iOS + Android',
    status: 'planned',
    phase: 3,
    port: 3011,
    healthPath: '/api/depon/11/health',
    tags: ['mobile', 'bff', 'ios', 'android', 'react-native'],
  },
  {
    id: 'DEPON-12',
    name: 'Reporting & Exports',
    description: 'CSV, PDF, and BI tool exports with scheduled reporting and state-level aggregation.',
    scope: 'CSV, PDF, BI tools',
    status: 'planned',
    phase: 3,
    port: 3012,
    healthPath: '/api/depon/12/health',
    tags: ['reporting', 'exports', 'csv', 'pdf', 'bi'],
  },
  // ─── App Marketplace & Value Engine (DEPON-13–18) ───────────────────────────
  {
    id: 'DEPON-13',
    name: 'App Value Registry',
    description: 'Master registry for all 180M apps with DeponValue score storage and sharded PostgreSQL storage.',
    scope: '180M apps, sharded by value tier',
    status: 'planned',
    phase: 1,
    port: 3013,
    healthPath: '/api/depon/13/health',
    tags: ['app-registry', 'depon-value', 'marketplace', 'sharding'],
  },
  {
    id: 'DEPON-14',
    name: 'Value Ranking Engine',
    description: 'Real-time ranking and leaderboard for 180M apps using Redis hot cache and Elasticsearch.',
    scope: 'Real-time top-N ranking, Redis cache',
    status: 'planned',
    phase: 1,
    port: 3014,
    healthPath: '/api/depon/14/health',
    tags: ['ranking', 'leaderboard', 'redis', 'elasticsearch', 'depon-value'],
  },
  {
    id: 'DEPON-15',
    name: 'App Marketplace Portal',
    description: 'UI/UX portal for browsing, filtering and ranking apps by DeponValue with DEPON dependency graph.',
    scope: 'Marketplace frontend, category + state filters',
    status: 'planned',
    phase: 1,
    port: 3015,
    healthPath: '/api/depon/15/health',
    tags: ['marketplace', 'portal', 'ui', 'depon-graph', 'search'],
  },
  {
    id: 'DEPON-16',
    name: 'App Deployment Pipeline',
    description: 'CI/CD factory that can build, test, and deploy any of the 180M apps on demand.',
    scope: 'CI/CD factory, 180M app deployments',
    status: 'planned',
    phase: 2,
    port: 3016,
    healthPath: '/api/depon/16/health',
    tags: ['ci-cd', 'deployment', 'pipeline', 'factory'],
  },
  {
    id: 'DEPON-17',
    name: 'Value Monetization',
    description: 'Revenue share, royalties, and tiered billing based on DeponValue score. DEPON fund management.',
    scope: 'Revenue share, DEPON fund, tier billing',
    status: 'planned',
    phase: 2,
    port: 3017,
    healthPath: '/api/depon/17/health',
    tags: ['monetization', 'revenue-share', 'billing', 'depon-fund'],
  },
  {
    id: 'DEPON-18',
    name: 'Cross-App Analytics',
    description: 'Inter-app analytics, DeponValue correlation analysis, and SpajaPro-powered trend insights.',
    scope: 'Cross-app metrics, correlation, trends',
    status: 'planned',
    phase: 3,
    port: 3018,
    healthPath: '/api/depon/18/health',
    tags: ['analytics', 'cross-app', 'correlation', 'spajapro', 'trends'],
  },
];

// ─── Registry Functions ───────────────────────────────────────────────────────

export function getDepon(id: DeponId): DeponModule | undefined {
  return DEPON_MODULES.find((m) => m.id === id);
}

export function getDeponsByPhase(phase: DeponPhase): DeponModule[] {
  return DEPON_MODULES.filter((m) => m.phase === phase);
}

export function getActiveDepons(): DeponModule[] {
  return DEPON_MODULES.filter((m) => m.status === 'active');
}

export function getDeponsByTag(tag: string): DeponModule[] {
  return DEPON_MODULES.filter((m) => m.tags.includes(tag));
}

export function getStateCompliance(stateCode: string): string[] {
  return STATE_COMPLIANCE_LAWS[stateCode.toUpperCase()] ?? [];
}

export function getDeponSummary(): {
  total: number;
  active: number;
  planned: number;
  byPhase: Record<DeponPhase, number>;
} {
  const byPhase = { 1: 0, 2: 0, 3: 0 } as Record<DeponPhase, number>;
  for (const m of DEPON_MODULES) byPhase[m.phase]++;
  return {
    total: DEPON_MODULES.length,
    active: DEPON_MODULES.filter((m) => m.status === 'active').length,
    planned: DEPON_MODULES.filter((m) => m.status === 'planned').length,
    byPhase,
  };
}

export function getScalingPhase(phase: DeponPhase): ScalingPhase | undefined {
  return SCALING_PHASES.find((p) => p.phase === phase);
}
