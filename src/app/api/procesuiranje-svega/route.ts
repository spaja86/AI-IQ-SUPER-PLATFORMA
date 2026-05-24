// Autofinish #1362 — GET /api/procesuiranje-svega
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za aktivni pipeline procesiranja svih domena:
// bankarski, AI, finansijski, licencni, ekosistem, autofinish, bezbednosni, analitički.

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildProcesuiranjeSvega } from '@/lib/procesuiranje-svega';

export const dynamic = 'force-dynamic';

/**
 * GET /api/procesuiranje-svega
 *
 * @returns ProcesuiranjeSvegaRezultat | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/procesuiranje-svega'),
    60,
    60,
  );

  if (!allowed) {
    return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
  }

  try {
    const rezultat = buildProcesuiranjeSvega();
    return apiSuccess(rezultat, 200);
  } catch (error) {
    return apiInternalError('procesuiranje-svega', error);
  }
}
