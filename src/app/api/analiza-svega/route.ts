// Autofinish #1360 — GET /api/analiza-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za celokupnu analizu ekosistema:
// ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish, protokoli.

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
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
    return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
  }

  try {
    const analiza = buildAnalizaSvega();
    return apiSuccess(analiza, 200);
  } catch (error) {
    return apiInternalError('analiza-svega', error);
  }
}
