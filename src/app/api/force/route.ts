import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildForce,
  FORCE_CONTRACT_VERSION,
  FORCE_MODEL_VERSION,
} from '@/lib/force';

export const dynamic = 'force-dynamic';
export const FORCE_RATE_LIMIT = 60;
export const FORCE_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/force'),
    FORCE_RATE_LIMIT,
    FORCE_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(FORCE_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildForce();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Force-Contract-Version', FORCE_CONTRACT_VERSION);
    response.headers.set('X-Force-Model-Version', FORCE_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('force', error);
  }
}
