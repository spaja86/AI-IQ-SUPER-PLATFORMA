// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/performance
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logSession, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import type { AthleteSession } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
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
    if (typeof b.sessionId !== 'string' || !b.sessionId) return apiError('BAD_REQUEST', 'sessionId (string) is required', 400);
    if (typeof b.athleteId !== 'string' || !b.athleteId) return apiError('BAD_REQUEST', 'athleteId (string) is required', 400);
    if (typeof b.sportId   !== 'string' || !b.sportId)   return apiError('BAD_REQUEST', 'sportId (string) is required', 400);
    if (typeof b.timestamp !== 'number')                  return apiError('BAD_REQUEST', 'timestamp (number) is required', 400);

    const session: AthleteSession = {
      sessionId:     b.sessionId,
      athleteId:     b.athleteId,
      sportId:       b.sportId,
      timestamp:     b.timestamp,
      speedKph:      typeof b.speedKph     === 'number' ? b.speedKph     : undefined,
      altitudeM:     typeof b.altitudeM    === 'number' ? b.altitudeM    : undefined,
      distanceKm:    typeof b.distanceKm   === 'number' ? b.distanceKm   : undefined,
      gForce:        typeof b.gForce       === 'number' ? b.gForce       : undefined,
      heartRateBpm:  typeof b.heartRateBpm === 'number' ? b.heartRateBpm : undefined,
    };

    logSession(session);
    const response = apiSuccess({ logged: true, sessionId: session.sessionId }, 201);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/performance', error);
  }
}
