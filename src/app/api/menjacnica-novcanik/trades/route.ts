// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Recent Trades Feed
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/trades?pairId=BTC_USDT&count=20
// Zahteva autentikaciju.
// Vraća simulovani feed poslednjih trade-ova za dati par.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { buildSimulatedTrades } from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-trades')) {
      return apiError('SERVICE_UNAVAILABLE', 'Trade feed je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/trades'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const pairId = url.searchParams.get('pairId')?.toUpperCase();
    const countParam = url.searchParams.get('count');
    const count = countParam ? Math.min(Math.max(parseInt(countParam, 10), 1), 100) : 20;

    if (!pairId) {
      return apiError('BAD_REQUEST', 'Parametar pairId je obavezan (npr. ?pairId=BTC_USDT).');
    }

    const pair = getMarketPair(pairId);
    if (!pair || !pair.enabled) {
      return apiError('NOT_FOUND', `Par '${pairId}' nije aktivan.`);
    }

    const trades = buildSimulatedTrades(pairId, count);

    return apiSuccess({
      pairId,
      trades,
      count: trades.length,
      simulationMode: pair.simulationOnly,
    });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-trades', error);
  }
}
