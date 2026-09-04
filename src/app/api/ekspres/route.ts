import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { apiInternalError, apiRateLimited } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEkspres,
  EKSPRES_CONTRACT_VERSION,
  EKSPRES_MODEL_VERSION,
  EKSPRES_NAZIV,
} from '@/lib/ekspres';

export const dynamic = 'force-dynamic';
export const EKSPRES_RATE_LIMIT = 60;
export const EKSPRES_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ekspres
 *
 * EKSPRES — Ekspresni Operativni Readiness Engine sa 4 domena.
 *
 * @returns EkspresOutput | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ekspres'),
    EKSPRES_RATE_LIMIT,
    EKSPRES_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKSPRES_RATE_WINDOW_SECONDS);
  }

  try {
    const data = buildEkspres({ persistSnapshot: true });
    const response = NextResponse.json({
      status: 'aktivan',
      modul: EKSPRES_NAZIV,
      verzija: APP_VERSION,
      contractVersion: EKSPRES_CONTRACT_VERSION,
      modelVersion: EKSPRES_MODEL_VERSION,
      data,
      timestamp: new Date().toISOString(),
    });
    response.headers.set('X-Ekspres-Contract-Version', EKSPRES_CONTRACT_VERSION);
    response.headers.set('X-Ekspres-Model-Version', EKSPRES_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('ekspres', error);
  }
}
