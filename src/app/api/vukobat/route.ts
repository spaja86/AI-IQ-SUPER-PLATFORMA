import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { apiInternalError, apiRateLimited } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildVukobat,
  VUKOBAT_CONTRACT_VERSION,
  VUKOBAT_MODEL_VERSION,
  VUKOBAT_NAZIV,
} from '@/lib/vukobat';

export const dynamic = 'force-dynamic';
export const VUKOBAT_RATE_LIMIT = 10;
export const VUKOBAT_RATE_WINDOW_SECONDS = 60;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/vukobat'),
    VUKOBAT_RATE_LIMIT,
    VUKOBAT_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(VUKOBAT_RATE_WINDOW_SECONDS);
  }

  try {
    const data = buildVukobat({ persistSnapshot: true });
    const response = NextResponse.json({
      status: 'aktivan',
      modul: VUKOBAT_NAZIV,
      verzija: APP_VERSION,
      contractVersion: VUKOBAT_CONTRACT_VERSION,
      modelVersion: VUKOBAT_MODEL_VERSION,
      data,
      timestamp: new Date().toISOString(),
    });
    response.headers.set('X-Vukobat-Contract-Version', VUKOBAT_CONTRACT_VERSION);
    response.headers.set('X-Vukobat-Model-Version', VUKOBAT_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('vukobat', error);
  }
}
