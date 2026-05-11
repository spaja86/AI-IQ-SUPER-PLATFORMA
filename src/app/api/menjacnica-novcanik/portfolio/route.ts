// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Portfolio + P&L
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/portfolio
// Zahteva autentikaciju.
// Vraća portfolio ekspoziciju i P&L za autentikovanog korisnika.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildSimulatedPortfolioSummary } from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-portfolio')) {
      return apiError('SERVICE_UNAVAILABLE', 'Portfolio modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/portfolio'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const portfolio = buildSimulatedPortfolioSummary(user.id);

    return apiSuccess({ portfolio });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-portfolio', error);
  }
}
