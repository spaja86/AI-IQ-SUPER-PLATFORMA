// Autofinish #1373 — GET /api/potencijal-svega-ovoga-do-sada

import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildPotencijalSvegaOvogaDoSada } from '@/lib/potencijal-svega-ovoga-do-sada';

export const dynamic = 'force-dynamic';
export const POTENCIJAL_SVEGA_RATE_LIMIT = 60;
export const POTENCIJAL_SVEGA_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/potencijal-svega-ovoga-do-sada
 *
 * @returns PotencijalSvegaOvogaDoSada | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/potencijal-svega-ovoga-do-sada'),
    POTENCIJAL_SVEGA_RATE_LIMIT,
    POTENCIJAL_SVEGA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(POTENCIJAL_SVEGA_RATE_WINDOW_SECONDS);
  }

  try {
    const potencijal = buildPotencijalSvegaOvogaDoSada();
    const response = apiSuccess(potencijal, 200);
    response.headers.set('X-Potencijal-Contract-Version', potencijal.meta.contractVersion);
    response.headers.set('X-Potencijal-Model-Version', potencijal.meta.modelVersion);
    return response;
  } catch (error) {
    return apiInternalError('potencijal-svega-ovoga-do-sada', error);
  }
}
