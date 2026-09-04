import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { apiInternalError, apiRateLimited } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildDivezijaEkspesla,
  DIVEEZIJA_EKSPESLA_CONTRACT_VERSION,
  DIVEEZIJA_EKSPESLA_MODEL_VERSION,
  DIVEEZIJA_EKSPESLA_NAZIV,
} from '@/lib/diveezija-ekspesla';

export const dynamic = 'force-dynamic';
// Applies to all callers, including automated agents.
export const DIVEEZIJA_EKSPESLA_RATE_LIMIT = 60;
export const DIVEEZIJA_EKSPESLA_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/diveezija-ekspesla
 *
 * DIVEEZIJA EKSPESLA — cross-domain engine za 6 domena ekspresne logike i automatizacije.
 *
 * @returns DivezijaEkspeslaOutput | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/diveezija-ekspesla'),
    DIVEEZIJA_EKSPESLA_RATE_LIMIT,
    DIVEEZIJA_EKSPESLA_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(DIVEEZIJA_EKSPESLA_RATE_WINDOW_SECONDS);
  }

  try {
    const data = buildDivezijaEkspesla({ persistSnapshot: true });
    const response = NextResponse.json({
      status: 'aktivan',
      modul: DIVEEZIJA_EKSPESLA_NAZIV,
      verzija: APP_VERSION,
      contractVersion: DIVEEZIJA_EKSPESLA_CONTRACT_VERSION,
      modelVersion: DIVEEZIJA_EKSPESLA_MODEL_VERSION,
      data,
      timestamp: new Date().toISOString(),
    });
    response.headers.set('X-Diveezija-Ekspesla-Contract-Version', DIVEEZIJA_EKSPESLA_CONTRACT_VERSION);
    response.headers.set('X-Diveezija-Ekspesla-Model-Version', DIVEEZIJA_EKSPESLA_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('diveezija-ekspesla', error);
  }
}
