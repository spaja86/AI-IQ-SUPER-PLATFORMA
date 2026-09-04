// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/feed
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createPost, listPosts, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';
import type { FeedPostType } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const athleteId = searchParams.get('athleteId') ?? undefined;
    const sportId   = searchParams.get('sportId')   ?? undefined;
    const type      = searchParams.get('type')      as FeedPostType | null;

    const posts = listPosts({ athleteId, sportId, type: type ?? undefined });
    const response = apiSuccess({ posts, count: posts.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/feed GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object', 400);
    }

    const b = body as Record<string, unknown>;
    if (typeof b.athleteId !== 'string') return apiError('BAD_REQUEST', 'athleteId (string) is required', 400);
    if (typeof b.sportId   !== 'string') return apiError('BAD_REQUEST', 'sportId (string) is required', 400);
    if (typeof b.content   !== 'string') return apiError('BAD_REQUEST', 'content (string) is required', 400);

    const result = createPost({
      athleteId: b.athleteId,
      sportId:   b.sportId,
      type:      (typeof b.type === 'string' ? b.type : 'general') as FeedPostType,
      content:   b.content,
      sessionId: typeof b.sessionId === 'string' ? b.sessionId : undefined,
      eventId:   typeof b.eventId   === 'string' ? b.eventId   : undefined,
      gearSku:   typeof b.gearSku   === 'string' ? b.gearSku   : undefined,
    });

    const response = apiSuccess(result, result.valid ? 201 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/feed POST', error);
  }
}
