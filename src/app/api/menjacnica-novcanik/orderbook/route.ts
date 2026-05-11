// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalni Novčanik — Orderbook Snapshot
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica-novcanik/orderbook?pairId=BTC_USDT&depth=5
// Zahteva autentikaciju.
// Vraća simulovani orderbook snapshot za dati par.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { buildSimulatedOrderbook } from '@/lib/menjacnica/pro-novcanik';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('pro-novcanik-orderbook')) {
      return apiError('SERVICE_UNAVAILABLE', 'Orderbook modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica-novcanik/orderbook'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const pairId = url.searchParams.get('pairId')?.toUpperCase();
    const depthParam = url.searchParams.get('depth');
    const depth = depthParam ? Math.min(Math.max(parseInt(depthParam, 10), 1), 20) : 5;

    if (!pairId) {
      return apiError('BAD_REQUEST', 'Parametar pairId je obavezan (npr. ?pairId=BTC_USDT).');
    }

    const pair = getMarketPair(pairId);
    if (!pair || !pair.enabled) {
      return apiError('NOT_FOUND', `Par '${pairId}' nije aktivan.`);
    }

    const orderbook = buildSimulatedOrderbook(pairId, depth);
    if (!orderbook) {
      return apiError('SERVICE_UNAVAILABLE', `Orderbook za '${pairId}' nije dostupan.`);
    }

    return apiSuccess({
      orderbook,
      simulationMode: pair.simulationOnly,
    });
  } catch (error) {
    return apiInternalError('menjacnica-novcanik-orderbook', error);
  }
}
