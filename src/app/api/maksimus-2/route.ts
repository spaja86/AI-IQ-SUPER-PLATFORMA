import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMaksimus2,
  MAKSIMUS_2_CONTRACT_VERSION,
  MAKSIMUS_2_MODEL_VERSION,
} from '@/lib/maksimus-2';

export const dynamic = 'force-dynamic';
export const MAKSIMUS_2_RATE_LIMIT = 60;
export const MAKSIMUS_2_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/maksimus-2
 *
 * @returns Maksimus2Svega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/maksimus-2'),
    MAKSIMUS_2_RATE_LIMIT,
    MAKSIMUS_2_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MAKSIMUS_2_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildMaksimus2();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Maksimus2-Contract-Version', MAKSIMUS_2_CONTRACT_VERSION);
    response.headers.set('X-Maksimus2-Model-Version', MAKSIMUS_2_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('maksimus-2', error);
  }
}
