import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import {
  appendMessage,
  createConversation,
  getSpajaDrustvenaMrezaActorId,
  getProfile,
  isSocialAudience,
  isSocialVisibility,
  listConversations,
  spajaDrustvenaMrezaApiError,
  spajaDrustvenaMrezaApiInternalError,
  withSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get('participantId');
    const audience = searchParams.get('audience');
    const actorProfileId = getSpajaDrustvenaMrezaActorId(req);
    if (!actorProfileId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'x-spaja-profile-id header is required');
    }
    if (!participantId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'participantId query param is required');
    }
    if (participantId !== actorProfileId) {
      return spajaDrustvenaMrezaApiError('CONFLICT', 'participantId must match x-spaja-profile-id');
    }
    const participant = getProfile(participantId);
    if (!participant.ok) {
      return spajaDrustvenaMrezaApiError(participant.code ?? 'NOT_FOUND', participant.message);
    }
    if (audience !== null && !isSocialAudience(audience)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    }
    const threads = listConversations({
      participantId,
      actor: { id: actorProfileId, audience: participant.data!.audience },
      audience: audience ?? undefined,
    });
    return withSpajaDrustvenaMrezaHeaders(apiSuccess({ threads, count: threads.length }, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/messages GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actorProfileId = getSpajaDrustvenaMrezaActorId(req);
    if (!actorProfileId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'x-spaja-profile-id header is required');
    }
    const actor = getProfile(actorProfileId);
    if (!actor.ok) {
      return spajaDrustvenaMrezaApiError(actor.code ?? 'NOT_FOUND', actor.message);
    }
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
    if (!['create', 'reply'].includes(action)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'action must be one of: create, reply');
    }

    const result = action === 'reply'
      ? (() => {
          if (typeof candidate.threadId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'threadId is required (string)' };
          if (candidate.authorId !== undefined && candidate.authorId !== actorProfileId) {
            return { ok: false, code: 'CONFLICT' as const, message: 'authorId must match x-spaja-profile-id when provided' };
          }
          if (typeof candidate.content !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'content is required (string)' };
          return appendMessage(candidate.threadId, actorProfileId, candidate.content);
        })()
      : (() => {
          if (!Array.isArray(candidate.participantIds)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'participantIds is required (array)' };
          if (!isSocialAudience(candidate.audience)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience must be one of: internal, partner, public' };
          if (!isSocialVisibility(candidate.visibility)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility must be one of: internal, network, public' };
          if (typeof candidate.subject !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'subject is required (string)' };
          if (typeof candidate.content !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'content is required (string)' };
          if (candidate.authorId !== undefined && candidate.authorId !== actorProfileId) {
            return { ok: false, code: 'CONFLICT' as const, message: 'authorId must match x-spaja-profile-id when provided' };
          }
          return createConversation({
            participantIds: candidate.participantIds as string[],
            audience: candidate.audience,
            visibility: candidate.visibility,
            subject: candidate.subject,
            content: candidate.content,
            authorId: actorProfileId,
          });
        })();

    if (!result.ok) return spajaDrustvenaMrezaApiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    return withSpajaDrustvenaMrezaHeaders(apiSuccess(result.data, action === 'create' ? 201 : 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/messages POST', error);
  }
}
