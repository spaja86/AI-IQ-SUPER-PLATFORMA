// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/mentors/register
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { registerMentor, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';
import type { MentorAvailability } from '@/lib/extrimli-cuz';

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
    if (typeof b.athleteId      !== 'string') return apiError('BAD_REQUEST', 'athleteId (string) is required', 400);
    if (!Array.isArray(b.sportIds))            return apiError('BAD_REQUEST', 'sportIds (array) is required', 400);
    if (typeof b.experienceLevel !== 'number') return apiError('BAD_REQUEST', 'experienceLevel (number) is required', 400);
    if (typeof b.bio             !== 'string') return apiError('BAD_REQUEST', 'bio (string) is required', 400);

    const mentor = registerMentor({
      athleteId:       b.athleteId,
      sportIds:        b.sportIds as string[],
      experienceLevel: b.experienceLevel,
      availability:    (typeof b.availability === 'string' ? b.availability : 'available') as MentorAvailability,
      bio:             b.bio,
    });

    const response = apiSuccess(mentor, 201);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/mentors/register', error);
  }
}
