// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: POST /api/chatgpt-katalog/compare
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { compareModels, setKatalogHeaders, CHATGPT_KATALOG_MAX_COMPARE_ENTRIES } from '@/lib/chatgpt-katalog';

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
    const { modelIds } = candidate;

    if (!Array.isArray(modelIds)) {
      return apiError('BAD_REQUEST', 'modelIds must be an array of model IDs');
    }
    if (modelIds.length < 2) {
      return apiError('BAD_REQUEST', 'At least 2 model IDs are required');
    }
    if (modelIds.length > CHATGPT_KATALOG_MAX_COMPARE_ENTRIES) {
      return apiError('BAD_REQUEST', `Cannot compare more than ${CHATGPT_KATALOG_MAX_COMPARE_ENTRIES} models`);
    }
    if (modelIds.some((id) => typeof id !== 'string')) {
      return apiError('BAD_REQUEST', 'All modelIds must be strings');
    }

    const { result, error } = compareModels(modelIds as string[]);
    if (error || !result) {
      return apiError('NOT_FOUND', error ?? 'Compare failed');
    }

    const response = apiSuccess(result, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/compare', error);
  }
}
