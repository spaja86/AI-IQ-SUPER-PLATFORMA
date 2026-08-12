// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/events
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createEvent, listEvents, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import type { EventStatus, GearCategory } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportId = searchParams.get('sportId') ?? undefined;
    const status  = searchParams.get('status') as EventStatus | null;

    const events = listEvents({ sportId, status: status ?? undefined });
    const response = apiSuccess({ events, count: events.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/events GET', error);
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
    if (typeof b.name     !== 'string') return apiError('BAD_REQUEST', 'name (string) is required', 400);
    if (typeof b.location !== 'string') return apiError('BAD_REQUEST', 'location (string) is required', 400);
    if (typeof b.sportId  !== 'string') return apiError('BAD_REQUEST', 'sportId (string) is required', 400);
    if (typeof b.date     !== 'number') return apiError('BAD_REQUEST', 'date (unix ms) is required', 400);
    if (typeof b.capacity !== 'number') return apiError('BAD_REQUEST', 'capacity (number) is required', 400);

    const event = createEvent({
      name:                   b.name,
      location:               b.location,
      sportId:                b.sportId,
      date:                   b.date,
      capacity:               b.capacity,
      prizePool:              typeof b.prizePool === 'number' ? b.prizePool : 0,
      minExperienceLevel:     typeof b.minExperienceLevel === 'number' ? b.minExperienceLevel : 0,
      minAge:                 typeof b.minAge === 'number' ? b.minAge : 0,
      requiredGearCategories: Array.isArray(b.requiredGearCategories) ? (b.requiredGearCategories as GearCategory[]) : [],
    });

    const response = apiSuccess(event, 201);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/events POST', error);
  }
}
