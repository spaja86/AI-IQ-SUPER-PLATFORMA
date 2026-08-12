// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/mentors/match
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { matchMentor, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
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
    if (typeof b.menteeAthleteId      !== 'string') return apiError('BAD_REQUEST', 'menteeAthleteId (string) is required', 400);
    if (typeof b.sportId              !== 'string') return apiError('BAD_REQUEST', 'sportId (string) is required', 400);
    if (typeof b.menteeExperienceLevel !== 'number') return apiError('BAD_REQUEST', 'menteeExperienceLevel (number) is required', 400);

    const match = matchMentor({
      menteeAthleteId:       b.menteeAthleteId,
      sportId:               b.sportId,
      menteeExperienceLevel: b.menteeExperienceLevel,
    });

    if (!match) {
      return apiError('NOT_FOUND', 'No available mentor found for the given criteria', 404);
    }

    const response = apiSuccess(match, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/mentors/match', error);
  }
}
