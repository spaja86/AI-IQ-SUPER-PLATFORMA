import type { NextRequest } from 'next/server';
import { apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEkstremnoProcesuiranjeSvega,
  buildEkstremnoProcesuiranjeSvegaFallback,
  PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
  PROCESUIRANJE_SVEGA_MODEL_VERSION,
} from '@/lib/procesuiranje-svega';

export const dynamic = 'force-dynamic';
export const EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT = 30;
export const EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ekstremno-procesuiranje-svega
 *
 * Ekstremni režim vraća prošireni signal-driven snapshot.
 * U slučaju degradacije vraća partial payload umesto totalnog 500.
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ekstremno-procesuiranje-svega'),
    EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT,
    EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildEkstremnoProcesuiranjeSvega();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Procesuiranje-Contract-Version', PROCESUIRANJE_SVEGA_CONTRACT_VERSION);
    response.headers.set('X-Procesuiranje-Model-Version', PROCESUIRANJE_SVEGA_MODEL_VERSION);
    response.headers.set('X-Procesuiranje-Mode', 'extreme');
    response.headers.set('X-Procesuiranje-Degraded', rezultat.meta.degraded ? '1' : '0');
    return response;
  } catch (error) {
    const fallback = buildEkstremnoProcesuiranjeSvegaFallback(
      error instanceof Error ? error.message : 'extreme-build-error',
    );
    const response = apiSuccess(fallback, 200);
    response.headers.set('X-Procesuiranje-Contract-Version', PROCESUIRANJE_SVEGA_CONTRACT_VERSION);
    response.headers.set('X-Procesuiranje-Model-Version', PROCESUIRANJE_SVEGA_MODEL_VERSION);
    response.headers.set('X-Procesuiranje-Mode', 'extreme');
    response.headers.set('X-Procesuiranje-Degraded', '1');
    return response;
  }
}
