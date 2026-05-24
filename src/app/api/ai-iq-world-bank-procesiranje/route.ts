// Autofinish #1361 — GET /api/ai-iq-world-bank-procesiranje
// Kompanija SPAJA — Digitalna Industrija
//
// Kanonski endpoint za aktivni sloj procesiranja AI IQ World Bank:
// transakcije u obradi, kamatna obrada, AI fraud detekcija, SWIFT/blockchain rutiranje.

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildAiIqWorldBankProcesiranje } from '@/lib/ai-iq-world-bank-procesiranje';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ai-iq-world-bank-procesiranje
 *
 * @returns AiIqWorldBankProcesiranjeRezultat | 429 | 500
 */
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/ai-iq-world-bank-procesiranje'),
    60,
    60,
  );

  if (!allowed) {
    return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
  }

  try {
    const rezultat = buildAiIqWorldBankProcesiranje();
    return apiSuccess(rezultat, 200);
  } catch (error) {
    return apiInternalError('ai-iq-world-bank-procesiranje', error);
  }
}

