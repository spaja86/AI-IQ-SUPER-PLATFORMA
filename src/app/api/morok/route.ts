import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMorok,
  MOROK_CONTRACT_VERSION,
  MOROK_MODEL_VERSION,
} from '@/lib/morok';

export const dynamic = 'force-dynamic';
export const MOROK_RATE_LIMIT = 60;
export const MOROK_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/morok
 *
 * Modularna Orkestracija Ritmova i Operativnog Kapaciteta —
 * cross-domain operativno-ritmički kapacitetni engine za 6 domena.
 *
 * @returns MorokRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/morok'),
    MOROK_RATE_LIMIT,
    MOROK_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MOROK_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildMorok();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Morok-Contract-Version', MOROK_CONTRACT_VERSION);
    response.headers.set('X-Morok-Model-Version', MOROK_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('morok', error);
  }
}
