import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildSilja,
  SILJA_CONTRACT_VERSION,
  SILJA_MODEL_VERSION,
} from '@/lib/silja';

export const dynamic = 'force-dynamic';
export const SILJA_RATE_LIMIT = 60;
export const SILJA_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/silja'),
    SILJA_RATE_LIMIT,
    SILJA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(SILJA_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildSilja();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Silja-Contract-Version', SILJA_CONTRACT_VERSION);
    response.headers.set('X-Silja-Model-Version', SILJA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('silja', error);
  }
}
