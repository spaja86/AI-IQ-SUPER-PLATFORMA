// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Analytics
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/analytics
// Analytics i yield izvještaj: performance po asetu, tier APR i portfolio ukupni APR.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultAnalyticsReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-analytics')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault analytics modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/analytics'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultAnalyticsReport(user.id);
    return apiSuccess({ analytics: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-analytics', error);
  }
}
