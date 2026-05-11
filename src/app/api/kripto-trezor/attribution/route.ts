// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Attribution
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/attribution
// Attribution analiza: doprinos prinosa po asetu i tieru.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultAttributionReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-attribution')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault attribution modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/attribution'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultAttributionReport(user.id);
    return apiSuccess({ attribution: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-attribution', error);
  }
}
