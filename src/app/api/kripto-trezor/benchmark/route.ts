// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Benchmark
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/benchmark
// Benchmark komparacija vault portfelja vs BTC, ETH i Crypto Market Index.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultBenchmarkReport } from '@/lib/menjacnica/trezor';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-benchmark')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault benchmark modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/benchmark'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const report = buildVaultBenchmarkReport(user.id);
    return apiSuccess({ benchmark: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-benchmark', error);
  }
}
