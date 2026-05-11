// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Transfer API
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/novcanik/transfer
// Interni transfer između dva asset-a korisnika (swap/konverzija).
// Body: { fromAssetId, toAssetId, amount }

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { validateIdempotencyKey, extractIdempotencyKey, generateIdempotencyKey } from '@/lib/idempotency';
import { getAsset } from '@/lib/menjacnica/assets';
import { validateLedgerAmount, buildLedgerEntry } from '@/lib/novcanik/ledger';
import type { TransferRequest } from '@/lib/novcanik/types';

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('novcanik-accounts')) {
      return apiError('SERVICE_UNAVAILABLE', 'Novčanik modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/novcanik/transfer'),
      10,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const rawKey = extractIdempotencyKey(request.headers) ?? generateIdempotencyKey();
    const keyValidation = validateIdempotencyKey(rawKey);
    if (!keyValidation.valid) {
      return apiError('BAD_REQUEST', keyValidation.reason ?? 'Neispravni idempotency ključ.');
    }

    const body = (await request.json()) as TransferRequest;

    if (!body.fromAssetId || !body.toAssetId || !body.amount) {
      return apiError('BAD_REQUEST', 'Polja fromAssetId, toAssetId i amount su obavezna.');
    }

    if (body.fromAssetId.toUpperCase() === body.toAssetId.toUpperCase()) {
      return apiError('BAD_REQUEST', 'fromAssetId i toAssetId moraju biti različiti.');
    }

    const fromAsset = getAsset(body.fromAssetId);
    const toAsset = getAsset(body.toAssetId);

    if (!fromAsset?.enabled) {
      return apiError('NOT_FOUND', `Asset '${body.fromAssetId}' nije podržan.`);
    }
    if (!toAsset?.enabled) {
      return apiError('NOT_FOUND', `Asset '${body.toAssetId}' nije podržan.`);
    }

    if (typeof body.amount !== 'number') {
      return apiError('BAD_REQUEST', 'Polje amount mora biti broj.');
    }

    const amountValidation = validateLedgerAmount(body.amount);
    if (!amountValidation.valid) {
      return apiError('UNPROCESSABLE_ENTITY', amountValidation.reason ?? 'Neispravni iznos.');
    }

    const supabase = getSupabaseServerClient();

    // Idempotency check
    const { data: existingEntry } = await supabase
      .from('novcanik_ledger')
      .select('id, reference_id')
      .eq('idempotency_key', `${rawKey}:debit`)
      .maybeSingle();

    if (existingEntry) {
      return apiSuccess({ transferId: existingEntry.reference_id, fromCache: true }, 200);
    }

    // Dohvati from account
    const { data: fromAccount } = await supabase
      .from('novcanik_accounts')
      .select('id, available')
      .eq('user_id', user.id)
      .eq('asset_id', body.fromAssetId.toUpperCase())
      .maybeSingle();

    if (!fromAccount || fromAccount.available < body.amount) {
      return apiError(
        'UNPROCESSABLE_ENTITY',
        `Nedovoljno sredstava u ${body.fromAssetId}. Raspoloživo: ${fromAccount?.available ?? 0}.`,
      );
    }

    // Dohvati ili kreiraj to account
    let { data: toAccount } = await supabase
      .from('novcanik_accounts')
      .select('id, available')
      .eq('user_id', user.id)
      .eq('asset_id', body.toAssetId.toUpperCase())
      .maybeSingle();

    if (!toAccount) {
      const { data: newAccount, error: createError } = await supabase
        .from('novcanik_accounts')
        .insert({
          user_id: user.id,
          asset_id: body.toAssetId.toUpperCase(),
          available: 0,
          reserved: 0,
          kyc_tier: 'basic',
          enabled: true,
        })
        .select()
        .single();

      if (createError) return apiInternalError('novcanik-transfer-create-account', createError);
      toAccount = newAccount;
    }

    const transferId = rawKey;

    // Generiši debit entry za from account
    const debitEntry = buildLedgerEntry({
      accountId: fromAccount.id,
      userId: user.id,
      assetId: body.fromAssetId.toUpperCase(),
      entryType: 'transfer_out',
      direction: 'debit',
      amount: body.amount,
      currentBalance: fromAccount.available,
      referenceId: transferId,
      referenceType: 'transfer',
      idempotencyKey: `${rawKey}:debit`,
      description: `Transfer ${body.amount} ${body.fromAssetId} → ${body.toAssetId}`,
    });

    // Generiši credit entry za to account (amount je aproksimiran — u produkciji koristiti kurs)
    const creditEntry = buildLedgerEntry({
      accountId: toAccount.id,
      userId: user.id,
      assetId: body.toAssetId.toUpperCase(),
      entryType: 'transfer_in',
      direction: 'credit',
      amount: body.amount, // 1:1 za sada (simulacioni mode)
      currentBalance: toAccount.available,
      referenceId: transferId,
      referenceType: 'transfer',
      idempotencyKey: `${rawKey}:credit`,
      description: `Transfer primljen od ${body.fromAssetId}`,
    });

    // Ažuriraj account balanse i kreiraj ledger zapise
    const [debitLedger, creditLedger, fromUpdate, toUpdate] = await Promise.all([
      supabase.from('novcanik_ledger').insert({
        account_id: debitEntry.accountId,
        user_id: debitEntry.userId,
        asset_id: debitEntry.assetId,
        entry_type: debitEntry.entryType,
        amount: debitEntry.amount,
        direction: debitEntry.direction,
        balance_after: debitEntry.balanceAfter,
        reference_id: debitEntry.referenceId ?? null,
        reference_type: debitEntry.referenceType ?? null,
        idempotency_key: debitEntry.idempotencyKey ?? null,
        description: debitEntry.description ?? null,
        created_at: new Date().toISOString(),
      }).select('id').single(),
      supabase.from('novcanik_ledger').insert({
        account_id: creditEntry.accountId,
        user_id: creditEntry.userId,
        asset_id: creditEntry.assetId,
        entry_type: creditEntry.entryType,
        amount: creditEntry.amount,
        direction: creditEntry.direction,
        balance_after: creditEntry.balanceAfter,
        reference_id: creditEntry.referenceId ?? null,
        reference_type: creditEntry.referenceType ?? null,
        idempotency_key: creditEntry.idempotencyKey ?? null,
        description: creditEntry.description ?? null,
        created_at: new Date().toISOString(),
      }).select('id').single(),
      supabase.from('novcanik_accounts').update({ available: debitEntry.balanceAfter }).eq('id', fromAccount.id),
      supabase.from('novcanik_accounts').update({ available: creditEntry.balanceAfter }).eq('id', toAccount.id),
    ]);

    if (debitLedger.error) return apiInternalError('novcanik-transfer-debit', debitLedger.error);
    if (creditLedger.error) return apiInternalError('novcanik-transfer-credit', creditLedger.error);
    if (fromUpdate.error) return apiInternalError('novcanik-transfer-from-update', fromUpdate.error);
    if (toUpdate.error) return apiInternalError('novcanik-transfer-to-update', toUpdate.error);

    return apiSuccess({
      transferId,
      from: { assetId: body.fromAssetId, amount: body.amount, balanceAfter: debitEntry.balanceAfter },
      to: { assetId: body.toAssetId, amount: body.amount, balanceAfter: creditEntry.balanceAfter },
      napomena: 'Transfer je izvršen u simulacionom modu (1:1 konverzija). U produkciji se koristi stvarni kurs.',
    }, 201);
  } catch (error) {
    return apiInternalError('novcanik-transfer', error);
  }
}
