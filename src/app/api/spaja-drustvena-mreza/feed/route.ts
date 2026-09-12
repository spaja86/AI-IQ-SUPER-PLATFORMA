import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import {
  createPost,
  flagPost,
  isSocialAudience,
  isSocialVisibility,
  listPosts,
  reactToPost,
  spajaDrustvenaMrezaApiError,
  spajaDrustvenaMrezaApiInternalError,
  withSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience');
    const visibility = searchParams.get('visibility');
    const authorId = searchParams.get('authorId') ?? undefined;
    if (audience !== null && !isSocialAudience(audience)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    }
    if (visibility !== null && !isSocialVisibility(visibility)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'visibility must be one of: internal, network, public');
    }
    const posts = listPosts({ audience: audience ?? undefined, visibility: visibility ?? undefined, authorId });
    return withSpajaDrustvenaMrezaHeaders(apiSuccess({ posts, count: posts.length }, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/feed GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const action = typeof candidate.action === 'string' ? candidate.action : 'create';
    if (!['create', 'react', 'flag'].includes(action)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'action must be one of: create, react, flag');
    }

    const result = action === 'react'
      ? (() => {
            if (typeof candidate.postId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'postId is required (string)' };
            if (typeof candidate.actorId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'actorId is required (string)' };
            return reactToPost(candidate.postId, candidate.actorId);
        })()
      : action === 'flag'
        ? (() => {
              if (typeof candidate.postId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'postId is required (string)' };
              if (typeof candidate.actorId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'actorId is required (string)' };
              return flagPost(candidate.postId, candidate.actorId);
            })()
        : (() => {
            if (typeof candidate.authorId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'authorId is required (string)' };
              if (!isSocialAudience(candidate.audience)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience must be one of: internal, partner, public' };
              if (!isSocialVisibility(candidate.visibility)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility must be one of: internal, network, public' };
              if (typeof candidate.content !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'content is required (string)' };
              if (candidate.tags !== undefined && !Array.isArray(candidate.tags)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'tags must be an array when provided' };
              return createPost({
                authorId: candidate.authorId,
                audience: candidate.audience,
                visibility: candidate.visibility,
                content: candidate.content,
                tags: candidate.tags as string[] | undefined,
              });
          })();

    if (!result.ok) return spajaDrustvenaMrezaApiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    return withSpajaDrustvenaMrezaHeaders(apiSuccess(result.data, action === 'create' ? 201 : 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/feed POST', error);
  }
}
