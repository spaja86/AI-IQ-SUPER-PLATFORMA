// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/mentors
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { listMentors, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';
import type { MentorAvailability } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportId              = searchParams.get('sportId')              ?? undefined;
    const availability         = searchParams.get('availability')         as MentorAvailability | null;
    const minExperienceLevel   = searchParams.has('minExperienceLevel')
      ? Number(searchParams.get('minExperienceLevel'))
      : undefined;

    const mentors = listMentors({
      sportId,
      availability: availability ?? undefined,
      minExperienceLevel,
    });

    const response = apiSuccess({ mentors, count: mentors.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/mentors GET', error);
  }
}
