// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Orders API
// Kompanija SPAJA — Digitalna Industrija
//
// GET  /api/menjacnica/orders          — lista ordersa korisnika
// POST /api/menjacnica/orders          — kreiraj novi order

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { getExecutionPrice } from '@/lib/menjacnica/simulator';
import { calcFee } from '@/lib/menjacnica/fee';
import { checkRisk, checkMaxOrderValue } from '@/lib/menjacnica/risk';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { validateIdempotencyKey, extractIdempotencyKey } from '@/lib/idempotency';
import type { CreateOrderRequest } from '@/lib/menjacnica/types';

// ─── GET — lista ordersa ──────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('exchange-orders')) {
      return apiError('SERVICE_UNAVAILABLE', 'Orders modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica/orders'),
      60,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const pairId = url.searchParams.get('pairId');
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from('exchange_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status as 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected' | 'expired');
    if (pairId) query = query.eq('pair_id', pairId.toUpperCase());

    const { data, error } = await query;
    if (error) return apiInternalError('menjacnica-orders-list', error);

    return apiSuccess({ orders: data ?? [], ukupno: (data ?? []).length });
  } catch (error) {
    return apiInternalError('menjacnica-orders-get', error);
  }
}

// ─── POST — kreiraj order ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('exchange-orders')) {
      return apiError('SERVICE_UNAVAILABLE', 'Orders modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/menjacnica/orders'),
      20,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    // Idempotency key
    const iKey = extractIdempotencyKey(request.headers);
    if (iKey) {
      const keyValidation = validateIdempotencyKey(iKey);
      if (!keyValidation.valid) {
        return apiError('BAD_REQUEST', keyValidation.reason ?? 'Neispravni idempotency ključ.');
      }
    }

    const body = (await request.json()) as CreateOrderRequest;

    if (!body.pairId || !body.side || !body.tip || !body.qty) {
      return apiError('BAD_REQUEST', 'Polja pairId, side, tip i qty su obavezna.');
    }

    if (!['buy', 'sell'].includes(body.side)) {
      return apiError('BAD_REQUEST', "Polje side mora biti 'buy' ili 'sell'.");
    }

    if (!['market', 'limit'].includes(body.tip)) {
      return apiError('BAD_REQUEST', "Polje tip mora biti 'market' ili 'limit'.");
    }

    if (typeof body.qty !== 'number' || body.qty <= 0) {
      return apiError('BAD_REQUEST', 'Polje qty mora biti pozitivan broj.');
    }

    if (body.tip === 'limit' && (!body.price || body.price <= 0)) {
      return apiError('BAD_REQUEST', 'Limit order zahteva pozitivnu price.');
    }

    const pair = getMarketPair(body.pairId);
    if (!pair || !pair.enabled) {
      return apiError('NOT_FOUND', `Par '${body.pairId}' nije aktivan.`);
    }

    if (body.qty < pair.minQty) {
      return apiError('UNPROCESSABLE_ENTITY', `Minimalna količina je ${pair.minQty}.`);
    }

    if (pair.maxQty !== undefined && body.qty > pair.maxQty) {
      return apiError('UNPROCESSABLE_ENTITY', `Maksimalna količina za ${pair.id} je ${pair.maxQty}.`);
    }

    // Odredi izvršnu cenu
    let execPrice: number;
    if (body.tip === 'limit' && body.price) {
      execPrice = body.price;
    } else {
      const simPrice = getExecutionPrice(pair.id, body.side);
      if (!simPrice) {
        return apiError('SERVICE_UNAVAILABLE', `Cena za ${pair.id} nije dostupna.`);
      }
      execPrice = simPrice;
    }

    // Fee kalkulacija
    const feeResult = calcFee(
      {
        qty: body.qty,
        price: execPrice,
        side: body.side,
        orderType: body.tip,
        takerFeePct: pair.takerFeePct,
        makerFeePct: pair.makerFeePct,
      },
      pair,
    );

    // Risk check
    const riskResult = checkRisk({
      userId: user.id,
      pairId: pair.id,
      side: body.side,
      qty: body.qty,
      price: execPrice,
      totalCost: feeResult.grossAmount,
    });

    if (!riskResult.allowed) {
      return apiError(
        'FORBIDDEN',
        'Order je blokiran zbog AML/risk provere. Kontaktirajte podršku.',
        { amlScore: riskResult.amlScore, flags: riskResult.flags },
      );
    }

    // Max order value check (KYC tier) — aktivan samo ako je flag uključen
    if (isExchangeFlagEnabled('exchange-max-order-value')) {
      const supabaseForKyc = getSupabaseServerClient();
      // Uzimamo kyc_tier iz prvog novcanik_accounts zapisa za korisnika
      // (svi nalozi istog korisnika dele isti tier).
      const { data: account } = await supabaseForKyc
        .from('novcanik_accounts')
        .select('kyc_tier')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      const rawTier = account?.kyc_tier;
      const kycTier: 'basic' | 'verified' | 'enterprise' =
        rawTier === 'verified' || rawTier === 'enterprise' ? rawTier : 'basic';
      const maxValueResult = checkMaxOrderValue(feeResult.grossAmount, kycTier);
      if (!maxValueResult.allowed) {
        return apiError(
          'FORBIDDEN',
          maxValueResult.reason ?? 'Order vrednost prelazi dozvoljeni maksimum za vaš KYC tier.',
          { kycTier, maxOrderValueUsd: maxValueResult.limit },
        );
      }
    }

    const supabase = getSupabaseServerClient();

    // Provjeri idempotency key u bazi
    if (iKey) {
      const { data: existing } = await supabase
        .from('exchange_orders')
        .select('id, status')
        .eq('idempotency_key', iKey)
        .maybeSingle();

      if (existing) {
        return apiSuccess({ order: existing, fromCache: true }, 200);
      }
    }

    // Kreiranje ordrea
    const initialStatus: 'filled' | 'open' = body.tip === 'market' ? 'filled' : 'open';
    const orderData = {
      idempotency_key: iKey ?? null,
      user_id: user.id,
      pair_id: pair.id,
      side: body.side,
      tip: body.tip,
      qty: body.qty,
      price: body.tip === 'limit' ? body.price : null,
      filled_qty: body.tip === 'market' ? body.qty : 0,
      avg_fill_price: body.tip === 'market' ? execPrice : null,
      fee_asset_id: feeResult.feeAssetId,
      fee_total: feeResult.feeAmount,
      status: initialStatus,
      simulation_mode: pair.simulationOnly,
      aml_score: riskResult.amlScore,
      risk_flags: riskResult.flags,
    };

    const { data: order, error: insertError } = await supabase
      .from('exchange_orders')
      .insert(orderData)
      .select()
      .single();

    if (insertError) return apiInternalError('menjacnica-orders-insert', insertError);

    // Za market order, kreiraj i trade zapis
    if (body.tip === 'market' && order) {
      await supabase.from('exchange_trades').insert({
        order_id: order.id,
        pair_id: pair.id,
        user_id: user.id,
        side: body.side,
        qty: body.qty,
        price: execPrice,
        fee: feeResult.feeAmount,
        fee_asset_id: feeResult.feeAssetId,
        simulation_mode: pair.simulationOnly,
      });
    }

    return apiSuccess({ order, feeBreakdown: feeResult, riskInfo: { amlScore: riskResult.amlScore, action: riskResult.action } }, 201);
  } catch (error) {
    return apiInternalError('menjacnica-orders-post', error);
  }
}
