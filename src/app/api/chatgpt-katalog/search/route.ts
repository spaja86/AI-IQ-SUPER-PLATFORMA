// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: POST /api/chatgpt-katalog/search
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { searchKatalog, setKatalogHeaders } from '@/lib/chatgpt-katalog';
import type { KatalogSearchQuery } from '@/lib/chatgpt-katalog';

export const dynamic = 'force-dynamic';

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
    const q: KatalogSearchQuery = {
      query: typeof candidate.query === 'string' ? candidate.query : undefined,
      type: candidate.type as KatalogSearchQuery['type'],
      category: typeof candidate.category === 'string' ? candidate.category : undefined,
      domain: typeof candidate.domain === 'string' ? candidate.domain : undefined,
      tags: Array.isArray(candidate.tags) ? (candidate.tags as string[]).filter((t) => typeof t === 'string') : undefined,
      status: candidate.status as KatalogSearchQuery['status'],
      page: typeof candidate.page === 'number' ? candidate.page : 1,
      pageSize: typeof candidate.pageSize === 'number' ? candidate.pageSize : 20,
      sortBy: candidate.sortBy as KatalogSearchQuery['sortBy'],
    };

    const result = searchKatalog(q);
    const response = apiSuccess(result, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/search', error);
  }
}
