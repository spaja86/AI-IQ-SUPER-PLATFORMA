// SVE OD SVEGA — GET /api/sve-od-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Ultimativni agregirani signal svih "svega" domena Digitalne Industrije.

import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildSveOdSvega,
  SVE_OD_SVEGA_CONTRACT_VERSION,
  SVE_OD_SVEGA_MODEL_VERSION,
} from '@/lib/sve-od-svega';
import { getSveOdSvegaHistory } from '@/lib/sve-od-svega-store';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = 60;
const RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/sve-od-svega
 *
 * Vraca SVE OD SVEGA — ultimativni agregirani signal koji unifikuje:
 *   - Analiza Svega
 *   - Potencijal Svega Ovoga Do Sada
 *   - Procesuiranje Svega
 *   - Autofinish Orkestracija
 *   - Gaming Industrija
 *   - Issuer Licensing
 *
 * Response ukljucuje `history` niz poslednjih snapshots iz KV store-a.
 *
 * @returns SveOdSvega & { history } | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/sve-od-svega'),
    RATE_LIMIT,
    RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(RATE_WINDOW_SECONDS);
  }

  try {
    const [rezultat, history] = await Promise.all([
      buildSveOdSvega(),
      getSveOdSvegaHistory(),
    ]);

    const response = apiSuccess({ ...rezultat, history }, 200);
    response.headers.set('X-Sve-Od-Svega-Contract-Version', SVE_OD_SVEGA_CONTRACT_VERSION);
    response.headers.set('X-Sve-Od-Svega-Model-Version', SVE_OD_SVEGA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('sve-od-svega', error);
  }
}

