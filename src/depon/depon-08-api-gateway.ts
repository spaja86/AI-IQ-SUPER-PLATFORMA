/**
 * 🚦 DEPON-08 — API Gateway
 *
 * Central API gateway with rate limiting, routing, auth enforcement,
 * state-based routing, and request/response transformation.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-08';

// ─── Types ───────────────────────────────────────────────────────────────────

export type RateLimitTier = 'free' | 'basic' | 'pro' | 'enterprise' | 'internal';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type GatewayRequestContext = {
  requestId: string;
  userId: string | null;
  stateCode: string | null;
  tier: RateLimitTier;
  ipAddress: string;
  userAgent: string;
  method: RouteMethod;
  path: string;
  startedAt: Date;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterMs: number | null;
};

export type RouteDefinition = {
  pattern: RegExp;
  methods: RouteMethod[];
  targetDepon: string;
  targetPath: string;
  authRequired: boolean;
  rateLimitTier: RateLimitTier;
  stateScoped: boolean;
};

export type GatewayResponse = {
  requestId: string;
  status: number;
  body: unknown;
  durationMs: number;
  targetDepon: string;
  cached: boolean;
};

// ─── Rate Limit Config ────────────────────────────────────────────────────────

export const RATE_LIMITS: Record<RateLimitTier, { requestsPerMinute: number; burstSize: number }> = {
  free:       { requestsPerMinute: 60,    burstSize: 10   },
  basic:      { requestsPerMinute: 300,   burstSize: 50   },
  pro:        { requestsPerMinute: 1000,  burstSize: 200  },
  enterprise: { requestsPerMinute: 10000, burstSize: 2000 },
  internal:   { requestsPerMinute: 100000, burstSize: 10000 },
};

// ─── Route Table ──────────────────────────────────────────────────────────────

export const ROUTE_TABLE: RouteDefinition[] = [
  {
    pattern: /^\/api\/auth\//,
    methods: ['GET', 'POST', 'DELETE'],
    targetDepon: 'DEPON-01',
    targetPath: '/api/depon/01',
    authRequired: false,
    rateLimitTier: 'free',
    stateScoped: true,
  },
  {
    pattern: /^\/api\/dashboard\//,
    methods: ['GET', 'POST', 'PUT'],
    targetDepon: 'DEPON-02',
    targetPath: '/api/depon/02',
    authRequired: true,
    rateLimitTier: 'basic',
    stateScoped: true,
  },
  {
    pattern: /^\/api\/analytics\//,
    methods: ['GET', 'POST'],
    targetDepon: 'DEPON-03',
    targetPath: '/api/depon/03',
    authRequired: true,
    rateLimitTier: 'pro',
    stateScoped: true,
  },
  {
    pattern: /^\/api\/payments\//,
    methods: ['GET', 'POST'],
    targetDepon: 'DEPON-04',
    targetPath: '/api/depon/04',
    authRequired: true,
    rateLimitTier: 'pro',
    stateScoped: true,
  },
  {
    pattern: /^\/api\/notifications\//,
    methods: ['GET', 'POST', 'DELETE'],
    targetDepon: 'DEPON-05',
    targetPath: '/api/depon/05',
    authRequired: true,
    rateLimitTier: 'basic',
    stateScoped: false,
  },
  {
    pattern: /^\/api\/content\//,
    methods: ['GET'],
    targetDepon: 'DEPON-06',
    targetPath: '/api/depon/06',
    authRequired: false,
    rateLimitTier: 'free',
    stateScoped: true,
  },
  {
    pattern: /^\/api\/search\//,
    methods: ['GET', 'POST'],
    targetDepon: 'DEPON-07',
    targetPath: '/api/depon/07',
    authRequired: false,
    rateLimitTier: 'basic',
    stateScoped: true,
  },
];

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildRequestContext(params: {
  userId?: string;
  stateCode?: string;
  tier?: RateLimitTier;
  ipAddress: string;
  userAgent: string;
  method: RouteMethod;
  path: string;
}): GatewayRequestContext {
  return {
    requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: params.userId ?? null,
    stateCode: params.stateCode ?? null,
    tier: params.tier ?? 'free',
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    method: params.method,
    path: params.path,
    startedAt: new Date(),
  };
}

export function matchRoute(path: string, method: RouteMethod): RouteDefinition | null {
  return ROUTE_TABLE.find(
    (r) => r.pattern.test(path) && r.methods.includes(method),
  ) ?? null;
}

export function checkRateLimit(
  tier: RateLimitTier,
  currentCount: number,
): RateLimitResult {
  const config = RATE_LIMITS[tier];
  const allowed = currentCount < config.requestsPerMinute;
  const resetAt = new Date(Date.now() + 60_000);
  return {
    allowed,
    remaining: Math.max(0, config.requestsPerMinute - currentCount),
    resetAt,
    retryAfterMs: allowed ? null : resetAt.getTime() - Date.now(),
  };
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string; routes: number } {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0', routes: ROUTE_TABLE.length };
}
