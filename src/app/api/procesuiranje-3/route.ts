import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildProcesuiranje3,
  PROCESUIRANJE_3_CONTRACT_VERSION,
  PROCESUIRANJE_3_MODEL_VERSION,
} from '@/lib/procesuiranje-3';

export const dynamic = 'force-dynamic';
export const PROCESUIRANJE_3_RATE_LIMIT = 60;
export const PROCESUIRANJE_3_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/procesuiranje-3
 *
 * @returns Procesuiranje3Rezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/procesuiranje-3'),
    PROCESUIRANJE_3_RATE_LIMIT,
    PROCESUIRANJE_3_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(PROCESUIRANJE_3_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildProcesuiranje3();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Procesuiranje3-Contract-Version', PROCESUIRANJE_3_CONTRACT_VERSION);
    response.headers.set('X-Procesuiranje3-Model-Version', PROCESUIRANJE_3_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('procesuiranje-3', error);
  }
}
