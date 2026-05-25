// Autofinish #1362 — GET /api/procesuiranje-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za aktivni pipeline procesiranja svih domena:
// bankarski, AI, finansijski, licencni, ekosistem, autofinish, bezbednosni, analitički.

import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildProcesuiranjeSvega,
  PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
  PROCESUIRANJE_SVEGA_MODEL_VERSION,
} from '@/lib/procesuiranje-svega';

export const dynamic = 'force-dynamic';
export const PROCESUIRANJE_SVEGA_RATE_LIMIT = 60;
export const PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/procesuiranje-svega
 *
 * @returns ProcesuiranjeSvegaRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/procesuiranje-svega'),
    PROCESUIRANJE_SVEGA_RATE_LIMIT,
    PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(PROCESUIRANJE_SVEGA_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = buildProcesuiranjeSvega();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Procesuiranje-Contract-Version', PROCESUIRANJE_SVEGA_CONTRACT_VERSION);
    response.headers.set('X-Procesuiranje-Model-Version', PROCESUIRANJE_SVEGA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('procesuiranje-svega', error);
  }
}
