import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createGroup, joinGroup, listGroups, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';
import type { SocialAudience, SocialGroup, SocialVisibility } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience') as SocialAudience | null;
    const visibility = searchParams.get('visibility') as SocialVisibility | null;
    const groups = listGroups({ audience: audience ?? undefined, visibility: visibility ?? undefined });
    const response = apiSuccess({ groups, count: groups.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/groups GET', error);
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

    const result = action === 'join'
      ? joinGroup(String(candidate.groupId ?? ''), String(candidate.profileId ?? ''))
      : (() => {
          if (typeof candidate.name !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'name is required (string)' };
          if (typeof candidate.description !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'description is required (string)' };
          if (typeof candidate.audience !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience is required (string)' };
          if (typeof candidate.visibility !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility is required (string)' };
          if (typeof candidate.ownerId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'ownerId is required (string)' };
          if (candidate.topicTags !== undefined && !Array.isArray(candidate.topicTags)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'topicTags must be an array when provided' };
          return createGroup({
            name: candidate.name,
            description: candidate.description,
            audience: candidate.audience as SocialAudience,
            visibility: candidate.visibility as SocialVisibility,
            ownerId: candidate.ownerId,
            topicTags: candidate.topicTags as string[] | undefined,
            joinMode: typeof candidate.joinMode === 'string' ? candidate.joinMode as SocialGroup['joinMode'] : undefined,
          });
        })();

    if (!result.ok) return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    const response = apiSuccess(result.data, action === 'create' ? 201 : 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/groups POST', error);
  }
}
