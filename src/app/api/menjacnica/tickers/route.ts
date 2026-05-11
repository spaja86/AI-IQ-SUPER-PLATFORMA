// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Tickers API
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/menjacnica/tickers
// GET /api/menjacnica/tickers?pairId=BTC_USDT
//
// Javno dostupno — ne zahteva autentikaciju (read-only market data).

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { getAllTickers, getSimulatedTicker } from '@/lib/menjacnica/simulator';
import { getEnabledPairs } from '@/lib/menjacnica/pairs';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('exchange-market-data')) {
      return apiError('SERVICE_UNAVAILABLE', 'Market data modul je trenutno nedostupan.');
    }

    // Rate limit: 120 zahteva/min po IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica/tickers'),
      120,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const pairId = url.searchParams.get('pairId');

    if (pairId) {
      const ticker = getSimulatedTicker(pairId.toUpperCase());
      if (!ticker) {
        return apiError('NOT_FOUND', `Par '${pairId}' nije pronađen.`);
      }
      return apiSuccess({ ticker, simulationMode: true });
    }

    const tickers = getAllTickers();
    const pairs = getEnabledPairs();

    return apiSuccess({
      tickers,
      ukupnoParova: pairs.length,
      simulationMode: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('menjacnica-tickers', error);
  }
}
