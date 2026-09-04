import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEktond,
  EKTOND_CONTRACT_VERSION,
  EKTOND_MODEL_VERSION,
} from '@/lib/ektond';

export const dynamic = 'force-dynamic';
export const EKTOND_RATE_LIMIT = 60;
export const EKTOND_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ektond
 *
 * Ekstremni Kondenzator Tokova Nadzora Digitalnog —
 * cross-domain kondenzacija platformskih tokova za 6 domena.
 *
 * @returns EktondRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ektond'),
    EKTOND_RATE_LIMIT,
    EKTOND_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKTOND_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildEktond();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Ektond-Contract-Version', EKTOND_CONTRACT_VERSION);
    response.headers.set('X-Ektond-Model-Version', EKTOND_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('ektond', error);
  }
}
