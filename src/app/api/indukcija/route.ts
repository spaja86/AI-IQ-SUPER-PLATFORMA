import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildIndukcija,
  INDUKCIJA_CONTRACT_VERSION,
  INDUKCIJA_MODEL_VERSION,
} from '@/lib/indukcija';

export const dynamic = 'force-dynamic';
export const INDUKCIJA_RATE_LIMIT = 60;
export const INDUKCIJA_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/indukcija'),
    INDUKCIJA_RATE_LIMIT,
    INDUKCIJA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(INDUKCIJA_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildIndukcija();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Indukcija-Contract-Version', INDUKCIJA_CONTRACT_VERSION);
    response.headers.set('X-Indukcija-Model-Version', INDUKCIJA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('indukcija', error);
  }
}
