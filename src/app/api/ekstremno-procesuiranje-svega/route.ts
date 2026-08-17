import type { NextRequest } from 'next/server';
import { apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEkstremnoProcesuiranjeSvega,
  buildEkstremnoProcesuiranjeSvegaFallback,
  PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
  PROCESUIRANJE_SVEGA_DEGRADED_MODE,
  PROCESUIRANJE_SVEGA_MODEL_VERSION,
  PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH,
} from '@/lib/procesuiranje-svega';

export const dynamic = 'force-dynamic';
export const EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT = 30;
export const EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS = 60;

function applyEkstremnoContractHeaders(
  response: Response,
  degraded: boolean,
  degradedSourcesCount: number,
  auditSignal: string,
  queueDepth: number,
  fairnessIndex: number,
) {
  response.headers.set('X-Procesuiranje-Contract-Version', PROCESUIRANJE_SVEGA_CONTRACT_VERSION);
  response.headers.set('X-Procesuiranje-Model-Version', PROCESUIRANJE_SVEGA_MODEL_VERSION);
  response.headers.set('X-Procesuiranje-Source-Of-Truth', PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH);
  response.headers.set('X-Procesuiranje-Mode', 'extreme');
  response.headers.set('X-Procesuiranje-Degraded', degraded ? '1' : '0');
  response.headers.set('X-Procesuiranje-Degraded-Mode', PROCESUIRANJE_SVEGA_DEGRADED_MODE);
  response.headers.set('X-Procesuiranje-Degraded-Sources-Count', String(degradedSourcesCount));
  response.headers.set('X-Procesuiranje-Audit-Signal', auditSignal);
  response.headers.set('X-Procesuiranje-Queue-Depth', String(queueDepth));
  response.headers.set('X-Procesuiranje-Fairness-Index', String(fairnessIndex));
}

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
    applyEkstremnoContractHeaders(
      response,
      rezultat.meta.degraded,
      rezultat.meta.degradedSources.length,
      rezultat.meta.auditSignal,
      rezultat.scheduler.queueDepth,
      rezultat.scheduler.fairnessIndex,
    );
    return response;
  } catch (error) {
    console.error('[ekstremno-procesuiranje-svega] degraded fallback', error);
    const fallback = buildEkstremnoProcesuiranjeSvegaFallback('extreme-build-error');
    const response = apiSuccess(fallback, 200);
    applyEkstremnoContractHeaders(
      response,
      true,
      fallback.meta.degradedSources.length,
      fallback.meta.auditSignal,
      fallback.scheduler.queueDepth,
      fallback.scheduler.fairnessIndex,
    );
    return response;
  }
}
