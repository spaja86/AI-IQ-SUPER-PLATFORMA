// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Audit Log
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/audit-log
// Vraća simulovani audit trag događaja po korisniku.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultAuditLog } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-audit-log')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault audit-log modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/audit-log'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const rawLimit = request.nextUrl.searchParams.get('limit');
    const parsed = rawLimit ? Number.parseInt(rawLimit, 10) : 20;
    const limit = Number.isFinite(parsed) ? parsed : 20;
    const events = buildVaultAuditLog(user.id, limit);

    return apiSuccess({
      audit: {
        userId: user.id,
        limit: Math.min(Math.max(Math.trunc(limit), 1), 100),
        total: events.length,
        events,
      },
    });
  } catch (error) {
    return apiInternalError('kripto-trezor-audit-log', error);
  }
}
