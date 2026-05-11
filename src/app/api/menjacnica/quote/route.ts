// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Quote API
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/menjacnica/quote
// Zahteva autentikaciju.
// Body: { pairId, side, qty }

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { getSimulatedQuote, getExecutionPrice } from '@/lib/menjacnica/simulator';
import { calcFee, getEffectiveFeePct } from '@/lib/menjacnica/fee';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import type { CreateOrderRequest } from '@/lib/menjacnica/types';

type QuoteBody = Pick<CreateOrderRequest, 'pairId' | 'side' | 'qty'> & { orderType?: 'market' | 'limit'; limitPrice?: number };

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('exchange-market-data')) {
      return apiError('SERVICE_UNAVAILABLE', 'Market data modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica/quote'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const body = (await request.json()) as QuoteBody;

    if (!body.pairId || !body.side || !body.qty) {
      return apiError('BAD_REQUEST', 'Polja pairId, side i qty su obavezna.');
    }

    if (!['buy', 'sell'].includes(body.side)) {
      return apiError('BAD_REQUEST', "Polje side mora biti 'buy' ili 'sell'.");
    }

    if (typeof body.qty !== 'number' || body.qty <= 0) {
      return apiError('BAD_REQUEST', 'Polje qty mora biti pozitivan broj.');
    }

    const pair = getMarketPair(body.pairId);
    if (!pair || !pair.enabled) {
      return apiError('NOT_FOUND', `Par '${body.pairId}' nije aktivan.`);
    }

    if (body.qty < pair.minQty) {
      return apiError(
        'UNPROCESSABLE_ENTITY',
        `Minimalna količina za ${pair.id} je ${pair.minQty}.`,
      );
    }

    if (pair.maxQty !== undefined && body.qty > pair.maxQty) {
      return apiError(
        'UNPROCESSABLE_ENTITY',
        `Maksimalna količina za ${pair.id} je ${pair.maxQty}.`,
      );
    }

    const orderType = body.orderType ?? 'market';
    let price: number;

    if (orderType === 'limit') {
      if (!body.limitPrice || body.limitPrice <= 0) {
        return apiError('BAD_REQUEST', 'Limit order zahteva pozitivnu limitPrice.');
      }
      price = body.limitPrice;
    } else {
      const execPrice = getExecutionPrice(pair.id, body.side);
      if (!execPrice) {
        return apiError('SERVICE_UNAVAILABLE', `Cena za ${pair.id} nije dostupna.`);
      }
      price = execPrice;
    }

    const feeResult = calcFee(
      {
        qty: body.qty,
        price,
        side: body.side,
        orderType,
        takerFeePct: pair.takerFeePct,
        makerFeePct: pair.makerFeePct,
      },
      pair,
    );

    const quoteSnapshot = getSimulatedQuote(pair.id);
    const expiresAt = new Date(Date.now() + 30_000).toISOString(); // 30s

    return apiSuccess({
      quote: {
        pairId: pair.id,
        side: body.side,
        qty: body.qty,
        price,
        orderType,
        totalCost: feeResult.grossAmount,
        feeAmount: feeResult.feeAmount,
        feePct: getEffectiveFeePct(orderType, pair),
        feeAssetId: feeResult.feeAssetId,
        netAmount: feeResult.netAmount,
        expiresAt,
        simulationMode: pair.simulationOnly,
        marketSnapshot: quoteSnapshot
          ? { bid: quoteSnapshot.bid, ask: quoteSnapshot.ask, last: quoteSnapshot.last }
          : null,
      },
    });
  } catch (error) {
    return apiInternalError('menjacnica-quote', error);
  }
}
