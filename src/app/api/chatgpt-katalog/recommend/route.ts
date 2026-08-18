// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: POST /api/chatgpt-katalog/recommend
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { recommend, setKatalogHeaders } from '@/lib/chatgpt-katalog';
import type { RecommendationRequest } from '@/lib/chatgpt-katalog';

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

    if (typeof candidate.domain !== 'string' || candidate.domain.trim().length === 0) {
      return apiError('BAD_REQUEST', 'domain is required (non-empty string)');
    }

    if (typeof candidate.budget !== 'number') {
      return apiError('BAD_REQUEST', 'budget must be a number (cost per 1M tokens in USD)');
    }

    const input: RecommendationRequest = {
      domain: candidate.domain.trim(),
      budget: candidate.budget as number,
      requiredCapabilities: Array.isArray(candidate.requiredCapabilities)
        ? (candidate.requiredCapabilities as unknown[]).filter((c) => typeof c === 'string') as string[]
        : undefined,
      preferSpeed: typeof candidate.preferSpeed === 'boolean' ? candidate.preferSpeed : false,
    };

    const result = recommend(input);
    const response = apiSuccess(result, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/recommend', error);
  }
}
