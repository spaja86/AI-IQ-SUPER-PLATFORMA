// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Performance
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/performance
// Performance izvještaj: PnL, ukupni return, annualized return i period returns po assetu.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultPerformanceReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-performance')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault performance modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/performance'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultPerformanceReport(user.id);
    return apiSuccess({ performance: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-performance', error);
  }
}
