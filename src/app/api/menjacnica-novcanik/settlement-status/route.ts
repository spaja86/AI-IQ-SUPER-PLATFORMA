// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Settlement Status
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/settlement-status
// Zahteva autentikaciju.
// Vraća agregat settlement statusa po svim aktivnim parovima za korisnika.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildSettlementStatusReport } from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-settlement')) {
      return apiError('SERVICE_UNAVAILABLE', 'Settlement status modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/settlement-status'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildSettlementStatusReport(user.id);

    return apiSuccess({ settlement: report });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-settlement-status', error);
  }
}
