import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import {
  createEvent,
  isSocialAudience,
  isSocialVisibility,
  listEvents,
  rsvpEvent,
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
    if (audience !== null && !isSocialAudience(audience)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    }
    if (visibility !== null && !isSocialVisibility(visibility)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'visibility must be one of: internal, network, public');
    }
    const events = listEvents({ audience: audience ?? undefined, visibility: visibility ?? undefined });
    return withSpajaDrustvenaMrezaHeaders(apiSuccess({ events, count: events.length }, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/events GET', error);
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
    if (!['create', 'rsvp'].includes(action)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'action must be one of: create, rsvp');
    }

    const result = action === 'rsvp'
      ? (() => {
          if (typeof candidate.eventId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'eventId is required (string)' };
          if (typeof candidate.profileId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'profileId is required (string)' };
          return rsvpEvent(candidate.eventId, candidate.profileId);
        })()
      : (() => {
          if (typeof candidate.title !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'title is required (string)' };
          if (typeof candidate.description !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'description is required (string)' };
          if (typeof candidate.hostId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'hostId is required (string)' };
          if (!isSocialAudience(candidate.audience)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience must be one of: internal, partner, public' };
          if (!isSocialVisibility(candidate.visibility)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility must be one of: internal, network, public' };
          if (typeof candidate.scheduledAt !== 'number') return { ok: false, code: 'BAD_REQUEST' as const, message: 'scheduledAt is required (number)' };
          if (typeof candidate.capacity !== 'number') return { ok: false, code: 'BAD_REQUEST' as const, message: 'capacity is required (number)' };
          return createEvent({
            title: candidate.title,
            description: candidate.description,
            hostId: candidate.hostId,
            audience: candidate.audience,
            visibility: candidate.visibility,
            scheduledAt: candidate.scheduledAt,
            capacity: candidate.capacity,
          });
        })();

    if (!result.ok) return spajaDrustvenaMrezaApiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    return withSpajaDrustvenaMrezaHeaders(apiSuccess(result.data, action === 'create' ? 201 : 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/events POST', error);
  }
}
