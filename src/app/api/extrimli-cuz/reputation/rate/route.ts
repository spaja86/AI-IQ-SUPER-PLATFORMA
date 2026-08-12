// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/reputation/rate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { submitRating, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

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
    if (typeof b.raterId        !== 'string') return apiError('BAD_REQUEST', 'raterId (string) is required', 400);
    if (typeof b.athleteId      !== 'string') return apiError('BAD_REQUEST', 'athleteId (string) is required', 400);
    if (typeof b.sportsmanship  !== 'number') return apiError('BAD_REQUEST', 'sportsmanship (number 1–5) is required', 400);
    if (typeof b.skill          !== 'number') return apiError('BAD_REQUEST', 'skill (number 1–5) is required', 400);
    if (typeof b.reliability    !== 'number') return apiError('BAD_REQUEST', 'reliability (number 1–5) is required', 400);

    const rating = submitRating({
      raterId:       b.raterId,
      athleteId:     b.athleteId,
      sportsmanship: b.sportsmanship,
      skill:         b.skill,
      reliability:   b.reliability,
    });

    const response = apiSuccess(rating, 201);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/reputation/rate', error);
  }
}
