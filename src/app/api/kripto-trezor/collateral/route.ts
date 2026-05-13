// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Collateral
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/collateral
// Collateral izvještaj: pozicije, LTV, margin call status i preporuke za upravljanje kolateralom.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultCollateralReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-collateral')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault collateral modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/collateral'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultCollateralReport(user.id);
    return apiSuccess({ collateral: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-collateral', error);
  }
}
