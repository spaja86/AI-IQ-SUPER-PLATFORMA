// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Stress
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/stress
// Stress test izvještaj: tržišni, likvidnosni i custody incident scenariji.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultStressReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-stress')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault stress modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/stress'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultStressReport(user.id);
    return apiSuccess({ stress: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-stress', error);
  }
}
