// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Forecast
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor/forecast
// Vault performance forecast: bull/base/bear scenariji po odabranom horizontu.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { buildVaultForecastReport, type ForecastHorizon } from '@/lib/menjacnica/trezor';

const VALID_HORIZONS: ForecastHorizon[] = ['30d', '90d', '180d', '365d'];

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-forecast')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault forecast modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/forecast'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const rawHorizon = request.nextUrl.searchParams.get('horizon') ?? '90d';
    const horizon = VALID_HORIZONS.includes(rawHorizon as ForecastHorizon)
      ? (rawHorizon as ForecastHorizon)
      : '90d';

    const report = buildVaultForecastReport(user.id, horizon);
    return apiSuccess({ forecast: report });
  } catch (error) {
    return apiInternalError('kripto-trezor-forecast', error);
  }
}
