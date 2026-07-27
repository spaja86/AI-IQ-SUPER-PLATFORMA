import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMiror,
  MIROR_CONTRACT_VERSION,
  MIROR_MODEL_VERSION,
} from '@/lib/miror';

export const dynamic = 'force-dynamic';
export const MIROR_RATE_LIMIT = 60;
export const MIROR_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/miror
 *
 * Modularna Inteligentna Refleksija Operativnih Ritmova —
 * cross-domain refleksioni engine za 6 operativnih domena.
 *
 * @returns MirorRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/miror'),
    MIROR_RATE_LIMIT,
    MIROR_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MIROR_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildMiror();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Miror-Contract-Version', MIROR_CONTRACT_VERSION);
    response.headers.set('X-Miror-Model-Version', MIROR_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('miror', error);
  }
}
