import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMaksimus3,
  MAKSIMUS_3_CONTRACT_VERSION,
  MAKSIMUS_3_MODEL_VERSION,
} from '@/lib/maksimus-3';

export const dynamic = 'force-dynamic';
export const MAKSIMUS_3_RATE_LIMIT = 60;
export const MAKSIMUS_3_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/maksimus-3
 *
 * @returns Maksimus3Svega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/maksimus-3'),
    MAKSIMUS_3_RATE_LIMIT,
    MAKSIMUS_3_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MAKSIMUS_3_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildMaksimus3();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Maksimus3-Contract-Version', MAKSIMUS_3_CONTRACT_VERSION);
    response.headers.set('X-Maksimus3-Model-Version', MAKSIMUS_3_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('maksimus-3', error);
  }
}
