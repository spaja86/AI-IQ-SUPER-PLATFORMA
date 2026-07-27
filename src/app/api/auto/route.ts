import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildAuto,
  AUTO_CONTRACT_VERSION,
  AUTO_MODEL_VERSION,
} from '@/lib/auto';

export const dynamic = 'force-dynamic';
export const AUTO_RATE_LIMIT = 60;
export const AUTO_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/auto'),
    AUTO_RATE_LIMIT,
    AUTO_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(AUTO_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildAuto();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Auto-Contract-Version', AUTO_CONTRACT_VERSION);
    response.headers.set('X-Auto-Model-Version', AUTO_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('auto', error);
  }
}
