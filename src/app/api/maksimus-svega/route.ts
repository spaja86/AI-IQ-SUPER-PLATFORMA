// Autofinish #1399 — GET /api/maksimus-svega
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMaksimusSvega,
  MAKSIMUS_SVEGA_CONTRACT_VERSION,
  MAKSIMUS_SVEGA_MODEL_VERSION,
} from '@/lib/maksimus-svega';

export const dynamic = 'force-dynamic';
export const MAKSIMUS_SVEGA_RATE_LIMIT = 60;
export const MAKSIMUS_SVEGA_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/maksimus-svega
 *
 * @returns MaksimusSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/maksimus-svega'),
    MAKSIMUS_SVEGA_RATE_LIMIT,
    MAKSIMUS_SVEGA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MAKSIMUS_SVEGA_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildMaksimusSvega();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Maksimus-Contract-Version', MAKSIMUS_SVEGA_CONTRACT_VERSION);
    response.headers.set('X-Maksimus-Model-Version', MAKSIMUS_SVEGA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('maksimus-svega', error);
  }
}
