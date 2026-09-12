import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createEvent, listEvents, rsvpEvent, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';
import type { SocialAudience, SocialVisibility } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience') as SocialAudience | null;
    const visibility = searchParams.get('visibility') as SocialVisibility | null;
    const events = listEvents({ audience: audience ?? undefined, visibility: visibility ?? undefined });
    const response = apiSuccess({ events, count: events.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/events GET', error);
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

    const result = action === 'rsvp'
      ? rsvpEvent(String(candidate.eventId ?? ''), String(candidate.profileId ?? ''))
      : (() => {
          if (typeof candidate.title !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'title is required (string)' };
          if (typeof candidate.description !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'description is required (string)' };
          if (typeof candidate.hostId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'hostId is required (string)' };
          if (typeof candidate.audience !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience is required (string)' };
          if (typeof candidate.visibility !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility is required (string)' };
          if (typeof candidate.scheduledAt !== 'number') return { ok: false, code: 'BAD_REQUEST' as const, message: 'scheduledAt is required (number)' };
          if (typeof candidate.capacity !== 'number') return { ok: false, code: 'BAD_REQUEST' as const, message: 'capacity is required (number)' };
          return createEvent({
            title: candidate.title,
            description: candidate.description,
            hostId: candidate.hostId,
            audience: candidate.audience as SocialAudience,
            visibility: candidate.visibility as SocialVisibility,
            scheduledAt: candidate.scheduledAt,
            capacity: candidate.capacity,
          });
        })();

    if (!result.ok) return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    const response = apiSuccess(result.data, action === 'create' ? 201 : 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/events POST', error);
  }
}
