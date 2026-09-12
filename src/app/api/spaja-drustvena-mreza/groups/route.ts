import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import {
  createGroup,
  isSocialAudience,
  isSocialGroupJoinMode,
  isSocialVisibility,
  joinGroup,
  listGroups,
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
    const viewerId = searchParams.get('viewerId') ?? undefined;
    if (audience !== null && !isSocialAudience(audience)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    }
    if (visibility !== null && !isSocialVisibility(visibility)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'visibility must be one of: internal, network, public');
    }
    const groups = listGroups({ audience: audience ?? undefined, visibility: visibility ?? undefined, viewerId });
    return withSpajaDrustvenaMrezaHeaders(apiSuccess({ groups, count: groups.length }, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/groups GET', error);
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
    if (!['create', 'join'].includes(action)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'action must be one of: create, join');
    }

    const result = action === 'join'
      ? (() => {
        if (typeof candidate.groupId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'groupId is required (string)' };
        if (typeof candidate.profileId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'profileId is required (string)' };
        return joinGroup(candidate.groupId, candidate.profileId);
        })()
      : (() => {
          if (typeof candidate.name !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'name is required (string)' };
          if (typeof candidate.description !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'description is required (string)' };
          if (!isSocialAudience(candidate.audience)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience must be one of: internal, partner, public' };
          if (!isSocialVisibility(candidate.visibility)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility must be one of: internal, network, public' };
          if (typeof candidate.ownerId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'ownerId is required (string)' };
          if (candidate.topicTags !== undefined && !Array.isArray(candidate.topicTags)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'topicTags must be an array when provided' };
          if (candidate.joinMode !== undefined && !isSocialGroupJoinMode(candidate.joinMode)) {
            return { ok: false, code: 'BAD_REQUEST' as const, message: 'joinMode must be one of: open, approval' };
          }
          return createGroup({
            name: candidate.name,
            description: candidate.description,
            audience: candidate.audience,
            visibility: candidate.visibility,
            ownerId: candidate.ownerId,
            topicTags: candidate.topicTags as string[] | undefined,
            joinMode: candidate.joinMode,
          });
        })();

    if (!result.ok) return spajaDrustvenaMrezaApiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    return withSpajaDrustvenaMrezaHeaders(apiSuccess(result.data, action === 'create' ? 201 : 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/groups POST', error);
  }
}
