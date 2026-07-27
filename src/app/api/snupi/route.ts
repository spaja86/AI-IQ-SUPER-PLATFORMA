import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildSnupi,
  SNUPI_CONTRACT_VERSION,
  SNUPI_MODEL_VERSION,
} from '@/lib/snupi';

export const dynamic = 'force-dynamic';
export const SNUPI_RATE_LIMIT = 60;
export const SNUPI_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/snupi'),
    SNUPI_RATE_LIMIT,
    SNUPI_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(SNUPI_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildSnupi();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Snupi-Contract-Version', SNUPI_CONTRACT_VERSION);
    response.headers.set('X-Snupi-Model-Version', SNUPI_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('snupi', error);
  }
}
