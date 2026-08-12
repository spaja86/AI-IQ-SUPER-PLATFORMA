// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/events/[id]/register
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { registerForEvent, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    if (!eventId) return apiError('BAD_REQUEST', 'eventId param is required', 400);

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

    const result = registerForEvent({
      eventId,
      athleteId:              b.athleteId,
      athleteExperienceLevel: typeof b.athleteExperienceLevel === 'number' ? b.athleteExperienceLevel : 0,
      athleteAge:             typeof b.athleteAge === 'number' ? b.athleteAge : 0,
      ownedGearCategories:    Array.isArray(b.ownedGearCategories) ? (b.ownedGearCategories as string[]) : [],
    });

    const statusCode = result.registered ? 200 : result.waitlisted ? 202 : 422;
    const response   = apiSuccess(result, statusCode);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/events/[id]/register', error);
  }
}
