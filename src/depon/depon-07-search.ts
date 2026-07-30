/**
 * 🔍 DEPON-07 — Search & Discovery
 *
 * Elasticsearch-powered full-text search and content discovery
 * across all state modules and 120M user profiles.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-07';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SearchIndex = 'users' | 'content' | 'regulations' | 'products' | 'transactions';

export type SearchOperator = 'AND' | 'OR' | 'NOT';

export type SortOrder = 'asc' | 'desc';

export type SearchQuery = {
  queryId: string;
  index: SearchIndex;
  q: string;
  stateCode: string | null;
  filters: SearchFilter[];
  sort: { field: string; order: SortOrder } | null;
  pagination: { page: number; pageSize: number };
  userId: string | null;
};

export type SearchFilter = {
  field: string;
  value: unknown;
  operator?: SearchOperator;
};

export type SearchResult<T = Record<string, unknown>> = {
  queryId: string;
  index: SearchIndex;
  total: number;
  page: number;
  pageSize: number;
  hits: SearchHit<T>[];
  tookMs: number;
};

export type SearchHit<T = Record<string, unknown>> = {
  id: string;
  score: number;
  source: T;
  highlights: Record<string, string[]>;
};

export type IndexDocument = {
  docId: string;
  index: SearchIndex;
  stateCode: string | null;
  body: Record<string, unknown>;
  indexedAt: Date;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const SEARCH_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
  maxQueryLength: 1000,
  minQueryLength: 2,
  highlightFragmentSize: 150,
  indices: ['users', 'content', 'regulations', 'products', 'transactions'] as SearchIndex[],
} as const;

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildSearchQuery(params: {
  index: SearchIndex;
  q: string;
  stateCode?: string;
  filters?: SearchFilter[];
  page?: number;
  pageSize?: number;
  sort?: { field: string; order: SortOrder };
  userId?: string;
}): SearchQuery {
  return {
    queryId: `srch_${params.index}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    index: params.index,
    q: params.q.slice(0, SEARCH_CONFIG.maxQueryLength),
    stateCode: params.stateCode ?? null,
    filters: params.filters ?? [],
    sort: params.sort ?? null,
    pagination: {
      page: params.page ?? 1,
      pageSize: Math.min(params.pageSize ?? SEARCH_CONFIG.defaultPageSize, SEARCH_CONFIG.maxPageSize),
    },
    userId: params.userId ?? null,
  };
}

export function validateSearchQuery(query: SearchQuery): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (query.q.length < SEARCH_CONFIG.minQueryLength) {
    errors.push(`Query must be at least ${SEARCH_CONFIG.minQueryLength} characters`);
  }
  if (!SEARCH_CONFIG.indices.includes(query.index)) {
    errors.push(`Unknown index: ${query.index}`);
  }
  if (query.pagination.pageSize > SEARCH_CONFIG.maxPageSize) {
    errors.push(`pageSize exceeds maximum of ${SEARCH_CONFIG.maxPageSize}`);
  }
  return { valid: errors.length === 0, errors };
}

export function buildIndexDocument(params: {
  index: SearchIndex;
  body: Record<string, unknown>;
  stateCode?: string;
}): IndexDocument {
  return {
    docId: `doc_${params.index}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    index: params.index,
    stateCode: params.stateCode ?? null,
    body: params.body,
    indexedAt: new Date(),
  };
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string; indices: string[] } {
  return {
    depon: DEPON_ID,
    status: 'ok',
    version: '1.0.0',
    indices: [...SEARCH_CONFIG.indices],
  };
}
