// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Orders API
// Kompanija SPAJA — Digitalna Industrija
//
// GET  /api/menjacnica/orders          — lista ordersa korisnika
// POST /api/menjacnica/orders          — kreiraj novi order

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { getMarketPair } from '@/lib/menjacnica/pairs';
import { getExecutionPrice } from '@/lib/menjacnica/simulator';
import { calcFee, calcBuyCostWithFee } from '@/lib/menjacnica/fee';
import { checkRisk, checkMaxOrderValue } from '@/lib/menjacnica/risk';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { validateIdempotencyKey, extractIdempotencyKey } from '@/lib/idempotency';
import { buildLedgerEntry, roundLedger } from '@/lib/novcanik/ledger';
import type { CreateOrderRequest } from '@/lib/menjacnica/types';
import type { Database } from '@/lib/supabase/types';

type SupabaseClient = ReturnType<typeof getSupabaseServerClient>;
type AccountRow = Database['public']['Tables']['novcanik_accounts']['Row'];

interface WalletReservation {
  assetId: string;
  amount: number;
}

function buildOrderMetadata(input: {
  pairId: string;
  side: 'buy' | 'sell';
  reservation?: WalletReservation;
  settlementStatus: 'settled' | 'pending' | 'processing' | 'failed';
  mode: 'reserved' | 'instant-settlement';
  settledAt?: string;
  ledgerEntryIds?: string[];
  tradeId?: string;
}) {
  return {
    wallet: {
      pairId: input.pairId,
      side: input.side,
      mode: input.mode,
      reservation: input.reservation,
      settlementStatus: input.settlementStatus,
      settledAt: input.settledAt ?? null,
      ledgerEntryIds: input.ledgerEntryIds ?? [],
      tradeId: input.tradeId ?? null,
    },
  } satisfies Record<string, unknown>;
}

async function ensureAccount(
  supabase: SupabaseClient,
  userId: string,
  assetId: string,
): Promise<AccountRow> {
  const upper = assetId.toUpperCase();
  const { data: existing, error } = await supabase
    .from('novcanik_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('asset_id', upper)
    .maybeSingle();

  if (error) throw error;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from('novcanik_accounts')
    .insert({
      user_id: userId,
      asset_id: upper,
      available: 0,
      reserved: 0,
      kyc_tier: 'basic',
      enabled: true,
    })
    .select('*')
    .single();

  if (createError || !created) throw createError ?? new Error(`Ne mogu kreirati nalog za ${upper}.`);
  return created;
}

async function persistAccountBalances(
  supabase: SupabaseClient,
  accountId: string,
  available: number,
  reserved: number,
) {
  const { error } = await supabase
    .from('novcanik_accounts')
    .update({
      available: roundLedger(available),
      reserved: roundLedger(reserved),
      updated_at: new Date().toISOString(),
    })
    .eq('id', accountId);

  if (error) throw error;
}

async function insertLedgerRecord(
  supabase: SupabaseClient,
  input: Parameters<typeof buildLedgerEntry>[0],
  metadata: Record<string, unknown>,
): Promise<string> {
  const entry = buildLedgerEntry(input);
  const { data, error } = await supabase
    .from('novcanik_ledger')
    .insert({
      account_id: entry.accountId,
      user_id: entry.userId,
      asset_id: entry.assetId,
      entry_type: entry.entryType,
      amount: entry.amount,
      direction: entry.direction,
      balance_after: entry.balanceAfter,
      reference_id: entry.referenceId ?? null,
      reference_type: entry.referenceType ?? null,
      idempotency_key: entry.idempotencyKey ?? null,
      description: entry.description ?? null,
      metadata,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('Kreiranje ledger unosa nije uspelo.');
  return data.id;
}

async function reserveOrderFunds(
  supabase: SupabaseClient,
  userId: string,
  pair: NonNullable<ReturnType<typeof getMarketPair>>,
  side: 'buy' | 'sell',
  qty: number,
  totalQuoteCost: number,
): Promise<WalletReservation> {
  const reservationAssetId = side === 'buy' ? pair.quoteAssetId : pair.baseAssetId;
  const reservationAmount = side === 'buy' ? totalQuoteCost : qty;
  const account = await ensureAccount(supabase, userId, reservationAssetId);

  if (account.available < reservationAmount) {
    throw new Error(
      `Nedovoljno sredstava za rezervaciju ${reservationAmount} ${reservationAssetId}. Raspoloživo: ${account.available}.`,
    );
  }

  await persistAccountBalances(
    supabase,
    account.id,
    account.available - reservationAmount,
    account.reserved + reservationAmount,
  );

  return {
    assetId: reservationAssetId,
    amount: roundLedger(reservationAmount),
  };
}

async function settleMarketOrder(
  supabase: SupabaseClient,
  userId: string,
  orderId: string,
  rawKey: string | null,
  pair: NonNullable<ReturnType<typeof getMarketPair>>,
  side: 'buy' | 'sell',
  qty: number,
  execPrice: number,
  grossAmount: number,
  feeAmount: number,
) {
  const referenceType = 'exchange_order';
  const idempotencyRoot = rawKey ?? orderId;
  const ledgerMetaBase = { pairId: pair.id, orderId, side, execPrice } satisfies Record<string, unknown>;

  if (side === 'buy') {
    const quoteAccount = await ensureAccount(supabase, userId, pair.quoteAssetId);
    const baseAccount = await ensureAccount(supabase, userId, pair.baseAssetId);
    const totalQuoteDebit = roundLedger(grossAmount + feeAmount);

    if (quoteAccount.available < totalQuoteDebit) {
      throw new Error(
        `Nedovoljno sredstava u ${pair.quoteAssetId}. Potrebno ${totalQuoteDebit}, raspoloživo ${quoteAccount.available}.`,
      );
    }

    const quoteTradeDebit = buildLedgerEntry({
      accountId: quoteAccount.id,
      userId,
      assetId: pair.quoteAssetId,
      entryType: 'trade_debit',
      direction: 'debit',
      amount: grossAmount,
      currentBalance: quoteAccount.available,
      referenceId: orderId,
      referenceType,
      idempotencyKey: `${idempotencyRoot}:trade-debit`,
      description: `Kupovina ${qty} ${pair.baseAssetId} po ${execPrice} ${pair.quoteAssetId}`,
    });

    const quoteFeeDebit = buildLedgerEntry({
      accountId: quoteAccount.id,
      userId,
      assetId: pair.quoteAssetId,
      entryType: 'fee',
      direction: 'debit',
      amount: feeAmount,
      currentBalance: quoteTradeDebit.balanceAfter,
      referenceId: orderId,
      referenceType,
      idempotencyKey: `${idempotencyRoot}:fee`,
      description: `Naknada za order ${orderId}`,
    });

    const baseCredit = buildLedgerEntry({
      accountId: baseAccount.id,
      userId,
      assetId: pair.baseAssetId,
      entryType: 'trade_credit',
      direction: 'credit',
      amount: qty,
      currentBalance: baseAccount.available,
      referenceId: orderId,
      referenceType,
      idempotencyKey: `${idempotencyRoot}:trade-credit`,
      description: `Primljeno ${qty} ${pair.baseAssetId} za order ${orderId}`,
    });

    const tradeLedgerId = await insertLedgerRecord(supabase, {
      accountId: quoteTradeDebit.accountId,
      userId: quoteTradeDebit.userId,
      assetId: quoteTradeDebit.assetId,
      entryType: quoteTradeDebit.entryType,
      direction: quoteTradeDebit.direction,
      amount: quoteTradeDebit.amount,
      currentBalance: quoteAccount.available,
      referenceId: quoteTradeDebit.referenceId,
      referenceType: quoteTradeDebit.referenceType,
      idempotencyKey: quoteTradeDebit.idempotencyKey,
      description: quoteTradeDebit.description,
    }, { ...ledgerMetaBase, movement: 'quote-debit' });

    const feeLedgerId = await insertLedgerRecord(supabase, {
      accountId: quoteFeeDebit.accountId,
      userId: quoteFeeDebit.userId,
      assetId: quoteFeeDebit.assetId,
      entryType: quoteFeeDebit.entryType,
      direction: quoteFeeDebit.direction,
      amount: quoteFeeDebit.amount,
      currentBalance: quoteTradeDebit.balanceAfter,
      referenceId: quoteFeeDebit.referenceId,
      referenceType: quoteFeeDebit.referenceType,
      idempotencyKey: quoteFeeDebit.idempotencyKey,
      description: quoteFeeDebit.description,
    }, { ...ledgerMetaBase, movement: 'fee-debit' });

    const baseLedgerId = await insertLedgerRecord(supabase, {
      accountId: baseCredit.accountId,
      userId: baseCredit.userId,
      assetId: baseCredit.assetId,
      entryType: baseCredit.entryType,
      direction: baseCredit.direction,
      amount: baseCredit.amount,
      currentBalance: baseAccount.available,
      referenceId: baseCredit.referenceId,
      referenceType: baseCredit.referenceType,
      idempotencyKey: baseCredit.idempotencyKey,
      description: baseCredit.description,
    }, { ...ledgerMetaBase, movement: 'base-credit' });

    await persistAccountBalances(supabase, quoteAccount.id, quoteFeeDebit.balanceAfter, quoteAccount.reserved);
    await persistAccountBalances(supabase, baseAccount.id, baseCredit.balanceAfter, baseAccount.reserved);

    return [tradeLedgerId, feeLedgerId, baseLedgerId];
  }

  const baseAccount = await ensureAccount(supabase, userId, pair.baseAssetId);
  const quoteAccount = await ensureAccount(supabase, userId, pair.quoteAssetId);

  if (baseAccount.available < qty) {
    throw new Error(
      `Nedovoljno sredstava u ${pair.baseAssetId}. Potrebno ${qty}, raspoloživo ${baseAccount.available}.`,
    );
  }

  const baseDebit = buildLedgerEntry({
    accountId: baseAccount.id,
    userId,
    assetId: pair.baseAssetId,
    entryType: 'trade_debit',
    direction: 'debit',
    amount: qty,
    currentBalance: baseAccount.available,
    referenceId: orderId,
    referenceType,
    idempotencyKey: `${idempotencyRoot}:trade-debit`,
    description: `Prodaja ${qty} ${pair.baseAssetId} po ${execPrice} ${pair.quoteAssetId}`,
  });

  const quoteCredit = buildLedgerEntry({
    accountId: quoteAccount.id,
    userId,
    assetId: pair.quoteAssetId,
    entryType: 'trade_credit',
    direction: 'credit',
    amount: grossAmount,
    currentBalance: quoteAccount.available,
    referenceId: orderId,
    referenceType,
    idempotencyKey: `${idempotencyRoot}:trade-credit`,
    description: `Prihod od prodaje za order ${orderId}`,
  });

  const quoteFeeDebit = buildLedgerEntry({
    accountId: quoteAccount.id,
    userId,
    assetId: pair.quoteAssetId,
    entryType: 'fee',
    direction: 'debit',
    amount: feeAmount,
    currentBalance: quoteCredit.balanceAfter,
    referenceId: orderId,
    referenceType,
    idempotencyKey: `${idempotencyRoot}:fee`,
    description: `Naknada za order ${orderId}`,
  });

  const baseLedgerId = await insertLedgerRecord(supabase, {
    accountId: baseDebit.accountId,
    userId: baseDebit.userId,
    assetId: baseDebit.assetId,
    entryType: baseDebit.entryType,
    direction: baseDebit.direction,
    amount: baseDebit.amount,
    currentBalance: baseAccount.available,
    referenceId: baseDebit.referenceId,
    referenceType: baseDebit.referenceType,
    idempotencyKey: baseDebit.idempotencyKey,
    description: baseDebit.description,
  }, { ...ledgerMetaBase, movement: 'base-debit' });

  const quoteLedgerId = await insertLedgerRecord(supabase, {
    accountId: quoteCredit.accountId,
    userId: quoteCredit.userId,
    assetId: quoteCredit.assetId,
    entryType: quoteCredit.entryType,
    direction: quoteCredit.direction,
    amount: quoteCredit.amount,
    currentBalance: quoteAccount.available,
    referenceId: quoteCredit.referenceId,
    referenceType: quoteCredit.referenceType,
    idempotencyKey: quoteCredit.idempotencyKey,
    description: quoteCredit.description,
  }, { ...ledgerMetaBase, movement: 'quote-credit' });

  const feeLedgerId = await insertLedgerRecord(supabase, {
    accountId: quoteFeeDebit.accountId,
    userId: quoteFeeDebit.userId,
    assetId: quoteFeeDebit.assetId,
    entryType: quoteFeeDebit.entryType,
    direction: quoteFeeDebit.direction,
    amount: quoteFeeDebit.amount,
    currentBalance: quoteCredit.balanceAfter,
    referenceId: quoteFeeDebit.referenceId,
    referenceType: quoteFeeDebit.referenceType,
    idempotencyKey: quoteFeeDebit.idempotencyKey,
    description: quoteFeeDebit.description,
  }, { ...ledgerMetaBase, movement: 'fee-debit' });

  await persistAccountBalances(supabase, baseAccount.id, baseDebit.balanceAfter, baseAccount.reserved);
  await persistAccountBalances(supabase, quoteAccount.id, quoteFeeDebit.balanceAfter, quoteAccount.reserved);

  return [baseLedgerId, quoteLedgerId, feeLedgerId];
}

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

    if (isExchangeFlagEnabled('exchange-max-order-value')) {
      const supabaseForKyc = getSupabaseServerClient();
      const { data: account } = await supabaseForKyc
        .from('novcanik_accounts')
        .select('kyc_tier')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      const rawTier = account?.kyc_tier ?? null;
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

    const totalQuoteCost = calcBuyCostWithFee(body.qty, execPrice, feeResult.feePct);
    let reservation: WalletReservation | undefined;

    if (body.tip === 'limit') {
      try {
        reservation = await reserveOrderFunds(supabase, user.id, pair, body.side, body.qty, totalQuoteCost);
      } catch (error) {
        return apiError(
          'UNPROCESSABLE_ENTITY',
          error instanceof Error ? error.message : 'Rezervacija sredstava nije uspela.',
        );
      }
    }

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
      metadata: buildOrderMetadata({
        pairId: pair.id,
        side: body.side,
        reservation,
        settlementStatus: body.tip === 'market' ? 'pending' : 'processing',
        mode: body.tip === 'market' ? 'instant-settlement' : 'reserved',
      }),
    };

    const { data: order, error: insertError } = await supabase
      .from('exchange_orders')
      .insert(orderData)
      .select()
      .single();

    if (insertError || !order) return apiInternalError('menjacnica-orders-insert', insertError ?? new Error('Order insert nije uspeo.'));

    let tradeRecord: { id: string } | null = null;
    let ledgerEntryIds: string[] = [];

    if (body.tip === 'market') {
      try {
        const { data: trade, error: tradeError } = await supabase
          .from('exchange_trades')
          .insert({
            order_id: order.id,
            pair_id: pair.id,
            user_id: user.id,
            side: body.side,
            qty: body.qty,
            price: execPrice,
            fee: feeResult.feeAmount,
            fee_asset_id: feeResult.feeAssetId,
            simulation_mode: pair.simulationOnly,
          })
          .select('id')
          .single();

        if (tradeError || !trade) {
          return apiInternalError('menjacnica-orders-trade-insert', tradeError ?? new Error('Trade insert nije uspeo.'));
        }

        tradeRecord = trade;
        ledgerEntryIds = await settleMarketOrder(
          supabase,
          user.id,
          order.id,
          iKey,
          pair,
          body.side,
          body.qty,
          execPrice,
          feeResult.grossAmount,
          feeResult.feeAmount,
        );

        const metadata = buildOrderMetadata({
          pairId: pair.id,
          side: body.side,
          settlementStatus: 'settled',
          mode: 'instant-settlement',
          settledAt: new Date().toISOString(),
          ledgerEntryIds,
          tradeId: trade.id,
        });

        const { data: updatedOrder, error: updateError } = await supabase
          .from('exchange_orders')
          .update({ metadata, updated_at: new Date().toISOString() })
          .eq('id', order.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError || !updatedOrder) {
          return apiInternalError('menjacnica-orders-metadata-update', updateError ?? new Error('Order metadata update nije uspeo.'));
        }

        return apiSuccess({
          order: updatedOrder,
          tradeId: trade.id,
          feeBreakdown: feeResult,
          riskInfo: { amlScore: riskResult.amlScore, action: riskResult.action },
          wallet: { ledgerEntryIds, settlementStatus: 'settled' },
        }, 201);
      } catch (error) {
        return apiInternalError('menjacnica-orders-settlement', error);
      }
    }

    return apiSuccess({
      order,
      feeBreakdown: feeResult,
      riskInfo: { amlScore: riskResult.amlScore, action: riskResult.action },
      wallet: { reservation, settlementStatus: 'processing', tradeId: tradeRecord?.id ?? null },
    }, 201);
  } catch (error) {
    return apiInternalError('menjacnica-orders-post', error);
  }
}
