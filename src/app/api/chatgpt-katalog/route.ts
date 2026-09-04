// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: GET /api/chatgpt-katalog
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { searchKatalog, setKatalogHeaders } from '@/lib/chatgpt-katalog';
import type { EntryType, KatalogSearchQuery, ModelStatus, SortBy } from '@/lib/chatgpt-katalog';

export const dynamic = 'force-dynamic';

const VALID_TYPES: EntryType[] = ['model', 'tool', 'use-case'];
const VALID_STATUSES: ModelStatus[] = ['active', 'deprecated', 'preview', 'legacy'];
const VALID_SORTS: SortBy[] = ['relevance', 'price-asc', 'price-desc', 'context-window-desc', 'name-asc'];

function parseNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') as EntryType | null;
    if (type && !VALID_TYPES.includes(type)) {
      return apiError('BAD_REQUEST', `type must be one of: ${VALID_TYPES.join(', ')}`);
    }

    const status = searchParams.get('status') as ModelStatus | null;
    if (status && !VALID_STATUSES.includes(status)) {
      return apiError('BAD_REQUEST', `status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const sortBy = searchParams.get('sortBy') as SortBy | null;
    if (sortBy && !VALID_SORTS.includes(sortBy)) {
      return apiError('BAD_REQUEST', `sortBy must be one of: ${VALID_SORTS.join(', ')}`);
    }

    const pageRaw = parseInt(searchParams.get('page') ?? '1', 10);
    const pageSizeRaw = parseInt(searchParams.get('pageSize') ?? '20', 10);
    const page = Number.isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw;
    const pageSize = Number.isNaN(pageSizeRaw) || pageSizeRaw < 1 ? 20 : Math.min(pageSizeRaw, 100);

    const tagsParam = searchParams.get('tags');
    const capabilitiesParam = searchParams.get('capabilities');

    const q: KatalogSearchQuery = {
      query: searchParams.get('query') ?? undefined,
      type: type ?? undefined,
      category: searchParams.get('category') ?? undefined,
      domain: searchParams.get('domain') ?? undefined,
      tags: tagsParam ? tagsParam.split(',').map((tag) => tag.trim()).filter(Boolean) : undefined,
      capabilities: capabilitiesParam ? capabilitiesParam.split(',').map((capability) => capability.trim()).filter(Boolean) : undefined,
      status: status ?? undefined,
      page,
      pageSize,
      sortBy: sortBy ?? undefined,
      maxInputCostPer1k: parseNumber(searchParams.get('maxInputCostPer1k')),
    };

    const result = searchKatalog(q);
    const response = apiSuccess(result, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/list', error);
  }
}
