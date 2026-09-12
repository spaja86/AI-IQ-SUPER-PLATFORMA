import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createPost, flagPost, listPosts, reactToPost, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';
import type { SocialAudience, SocialVisibility } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience') as SocialAudience | null;
    const visibility = searchParams.get('visibility') as SocialVisibility | null;
    const authorId = searchParams.get('authorId') ?? undefined;
    const posts = listPosts({ audience: audience ?? undefined, visibility: visibility ?? undefined, authorId });
    const response = apiSuccess({ posts, count: posts.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/feed GET', error);
  }
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
    const action = typeof candidate.action === 'string' ? candidate.action : 'create';

    const result = action === 'react'
      ? reactToPost(String(candidate.postId ?? ''), String(candidate.actorId ?? ''))
      : action === 'flag'
        ? flagPost(String(candidate.postId ?? ''), String(candidate.actorId ?? ''))
        : (() => {
            if (typeof candidate.authorId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'authorId is required (string)' };
            if (typeof candidate.audience !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience is required (string)' };
            if (typeof candidate.visibility !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility is required (string)' };
            if (typeof candidate.content !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'content is required (string)' };
            if (candidate.tags !== undefined && !Array.isArray(candidate.tags)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'tags must be an array when provided' };
            return createPost({
              authorId: candidate.authorId,
              audience: candidate.audience as SocialAudience,
              visibility: candidate.visibility as SocialVisibility,
              content: candidate.content,
              tags: candidate.tags as string[] | undefined,
            });
          })();

    if (!result.ok) return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    const response = apiSuccess(result.data, action === 'create' ? 201 : 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/feed POST', error);
  }
}
