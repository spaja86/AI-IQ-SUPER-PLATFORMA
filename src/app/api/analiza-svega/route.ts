// Autofinish #1360 — GET /api/analiza-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za celokupnu analizu ekosistema:
// ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish, protokoli.

import type { NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildAnalizaSvega } from '@/lib/analiza-svega';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analiza-svega
 *
 * @returns AnalizaSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/analiza-svega'),
    60,
    60,
  );

  if (!allowed) {
    return apiRateLimited(60);
  }

  try {
    const analiza = buildAnalizaSvega();
    const response = apiSuccess(analiza, 200);
    response.headers.set('X-Analiza-Contract-Version', analiza.meta.contractVersion);
    response.headers.set('X-Analiza-Model-Version', analiza.meta.modelVersion);
    return response;
  } catch (error) {
    return apiInternalError('analiza-svega', error);
  }
}
