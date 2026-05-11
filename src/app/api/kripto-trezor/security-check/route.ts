// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Security Check
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/security-check
// Vraća sigurnosni pregled trezora po korisniku.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultSecurityCheckReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-security-check')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault security-check modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/security-check'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultSecurityCheckReport(user.id);
    return apiSuccess({ security: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-security-check', error);
  }
}
