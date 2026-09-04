import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { apiInternalError, apiRateLimited } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildEkspriting,
  EKSPRITING_CONTRACT_VERSION,
  EKSPRITING_MODEL_VERSION,
  EKSPRITING_NAZIV,
} from '@/lib/ekspriting';

export const dynamic = 'force-dynamic';
// Applies to all callers, including automated agents.
export const EKSPRITING_RATE_LIMIT = 60;
export const EKSPRITING_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/ekspriting
 *
 * EKSPRITING — Ekspresni Skripting i Pisanje Engine sa 5 domena.
 *
 * @returns EkspritingOutput | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ekspriting'),
    EKSPRITING_RATE_LIMIT,
    EKSPRITING_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(EKSPRITING_RATE_WINDOW_SECONDS);
  }

  try {
    const data = buildEkspriting({ persistSnapshot: true });
    const response = NextResponse.json({
      status: 'aktivan',
      modul: EKSPRITING_NAZIV,
      verzija: APP_VERSION,
      contractVersion: EKSPRITING_CONTRACT_VERSION,
      modelVersion: EKSPRITING_MODEL_VERSION,
      data,
      timestamp: new Date().toISOString(),
    });
    response.headers.set('X-Ekspriting-Contract-Version', EKSPRITING_CONTRACT_VERSION);
    response.headers.set('X-Ekspriting-Model-Version', EKSPRITING_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('ekspriting', error);
  }
}
