import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEktrimliEkstrem,
  EKSTRIMLI_EKSTREM_CONTRACT_VERSION,
  EKSTRIMLI_EKSTREM_MODEL_VERSION,
} from '@/lib/ekstrimli-ekstrem';

export const dynamic = 'force-dynamic';
export const EKSTRIMLI_EKSTREM_RATE_LIMIT = 60;
export const EKSTRIMLI_EKSTREM_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ekstrimli-ekstrem
 *
 * V4 apsolutni master signal — MOŽE SVE.
 *
 * @returns EktrimliEkstremRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ekstrimli-ekstrem'),
    EKSTRIMLI_EKSTREM_RATE_LIMIT,
    EKSTRIMLI_EKSTREM_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKSTRIMLI_EKSTREM_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildEktrimliEkstrem();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-EktrimliEkstrem-Contract-Version', EKSTRIMLI_EKSTREM_CONTRACT_VERSION);
    response.headers.set('X-EktrimliEkstrem-Model-Version', EKSTRIMLI_EKSTREM_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('ekstrimli-ekstrem', error);
  }
}
