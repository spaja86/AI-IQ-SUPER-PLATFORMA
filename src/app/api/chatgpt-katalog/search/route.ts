// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: POST /api/chatgpt-katalog/search
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { searchKatalog, setKatalogHeaders } from '@/lib/chatgpt-katalog';
import type { EntryType, KatalogSearchQuery, ModelStatus, SortBy } from '@/lib/chatgpt-katalog';

export const dynamic = 'force-dynamic';

const VALID_TYPES: EntryType[] = ['model', 'tool', 'use-case'];
const VALID_STATUSES: ModelStatus[] = ['active', 'deprecated', 'preview', 'legacy'];
const VALID_SORTS: SortBy[] = ['relevance', 'price-asc', 'price-desc', 'context-window-desc', 'name-asc'];

function parseMaybeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return value;
}

function readString(input: Record<string, unknown>, key: string): string | undefined {
  const value = Reflect.get(input, key);
  return typeof value === 'string' ? value : undefined;
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;

    if (candidate.type !== undefined && !VALID_TYPES.includes(candidate.type as EntryType)) {
      return apiError('BAD_REQUEST', `type must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (candidate.status !== undefined && !VALID_STATUSES.includes(candidate.status as ModelStatus)) {
      return apiError('BAD_REQUEST', `status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (candidate.sortBy !== undefined && !VALID_SORTS.includes(candidate.sortBy as SortBy)) {
      return apiError('BAD_REQUEST', `sortBy must be one of: ${VALID_SORTS.join(', ')}`);
    }

    const q: KatalogSearchQuery = {
      query: readString(candidate, 'query'),
      type: candidate.type as KatalogSearchQuery['type'],
      category: typeof candidate.category === 'string' ? candidate.category : undefined,
      domain: typeof candidate.domain === 'string' ? candidate.domain : undefined,
      tags: Array.isArray(candidate.tags) ? (candidate.tags as unknown[]).filter((tag): tag is string => typeof tag === 'string') : undefined,
      capabilities: Array.isArray(candidate.capabilities)
        ? (candidate.capabilities as unknown[]).filter((capability): capability is string => typeof capability === 'string')
        : undefined,
      status: candidate.status as KatalogSearchQuery['status'],
      page: typeof candidate.page === 'number' ? candidate.page : 1,
      pageSize: typeof candidate.pageSize === 'number' ? candidate.pageSize : 20,
      sortBy: candidate.sortBy as KatalogSearchQuery['sortBy'],
      maxInputCostPer1k: parseMaybeNumber(candidate.maxInputCostPer1k),
    };

    const result = searchKatalog(q);
    const response = apiSuccess(result, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/search', error);
  }
}
