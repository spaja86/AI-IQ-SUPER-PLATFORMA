import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEkstrendend,
  EKSTRENDEND_CONTRACT_VERSION,
  EKSTRENDEND_MODEL_VERSION,
} from '@/lib/ekstrendend';

export const dynamic = 'force-dynamic';
export const EKSTRENDEND_RATE_LIMIT = 60;
export const EKSTRENDEND_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ekstrendend
 *
 * Ekstremni Trend Endzin — cross-domain trend velocity i momentum za 8 domena.
 *
 * @returns EkstrendendRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ekstrendend'),
    EKSTRENDEND_RATE_LIMIT,
    EKSTRENDEND_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKSTRENDEND_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildEkstrendend();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Ekstrendend-Contract-Version', EKSTRENDEND_CONTRACT_VERSION);
    response.headers.set('X-Ekstrendend-Model-Version', EKSTRENDEND_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('ekstrendend', error);
  }
}
