// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Withdrawal API
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/novcanik/withdraw
// Body: { assetId, amount, destinationAddress, network? }

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { validateIdempotencyKey, extractIdempotencyKey, generateIdempotencyKey } from '@/lib/idempotency';
import { getAsset } from '@/lib/menjacnica/assets';
import { validateLedgerAmount } from '@/lib/novcanik/ledger';
import { checkWithdrawalRisk, kycTierAllowsWithdrawal } from '@/lib/menjacnica/risk';
import type { WithdrawalRequest } from '@/lib/novcanik/types';

// Withdrawal fee (flat 0.5% min $1 equivalent)
const WITHDRAWAL_FEE_PCT = 0.005;
const WITHDRAWAL_MIN_FEE = 0.00001;

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('novcanik-withdraw')) {
      return apiError('SERVICE_UNAVAILABLE', 'Withdrawal modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/novcanik/withdraw'),
      5,
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

    const body = (await request.json()) as WithdrawalRequest;

    if (!body.assetId || !body.amount || !body.destinationAddress) {
      return apiError('BAD_REQUEST', 'Polja assetId, amount i destinationAddress su obavezna.');
    }

    const asset = getAsset(body.assetId);
    if (!asset || !asset.enabled) {
      return apiError('NOT_FOUND', `Asset '${body.assetId}' nije podržan.`);
    }

    if (typeof body.amount !== 'number') {
      return apiError('BAD_REQUEST', 'Polje amount mora biti broj.');
    }

    const amountValidation = validateLedgerAmount(body.amount);
    if (!amountValidation.valid) {
      return apiError('UNPROCESSABLE_ENTITY', amountValidation.reason ?? 'Neispravni iznos.');
    }

    const supabase = getSupabaseServerClient();

    // Dohvati KYC tier korisnika
    const { data: account } = await supabase
      .from('novcanik_accounts')
      .select('kyc_tier, available')
      .eq('user_id', user.id)
      .eq('asset_id', body.assetId.toUpperCase())
      .maybeSingle();

    const kycTier = (account?.kyc_tier ?? 'basic') as 'basic' | 'verified' | 'enterprise';

    // KYC provjera za withdrawal
    if (!kycTierAllowsWithdrawal(kycTier)) {
      return apiError(
        'FORBIDDEN',
        'Povlačenje zahteva verifikovani KYC nivo. Molimo završite KYC verifikaciju.',
      );
    }

    // Provjera stanja
    if (account && account.available < body.amount) {
      return apiError(
        'UNPROCESSABLE_ENTITY',
        `Nedovoljno sredstava. Raspoloživo: ${account.available}, zahtevano: ${body.amount}.`,
      );
    }

    // Risk check
    const amountUsd = body.amount; // Aproksimacija — u produkciji koristiti stvarni kurs
    const riskResult = checkWithdrawalRisk(user.id, body.assetId, amountUsd, kycTier);
    if (!riskResult.allowed) {
      return apiError(
        'FORBIDDEN',
        'Povlačenje je blokirano zbog AML/risk provere. Kontaktirajte podršku.',
        { amlScore: riskResult.amlScore, flags: riskResult.flags },
      );
    }

    // Idempotency check
    const { data: existing } = await supabase
      .from('novcanik_withdrawals')
      .select('id, status')
      .eq('idempotency_key', rawKey)
      .maybeSingle();

    if (existing) {
      return apiSuccess({ withdrawal: existing, fromCache: true }, 200);
    }

    const fee = Math.max(body.amount * WITHDRAWAL_FEE_PCT, WITHDRAWAL_MIN_FEE);
    const initialStatus = riskResult.action === 'review' ? 'review' : 'pending';

    const { data: withdrawal, error } = await supabase
      .from('novcanik_withdrawals')
      .insert({
        idempotency_key: rawKey,
        user_id: user.id,
        asset_id: body.assetId.toUpperCase(),
        amount: body.amount,
        fee,
        status: initialStatus,
        network: body.network ?? (asset.mreza ?? null),
        destination_address: body.destinationAddress,
        kyc_tier_required: 'verified',
        aml_score: riskResult.amlScore,
        aml_flags: riskResult.flags,
        review_reason: riskResult.action === 'review' ? 'high_value_withdrawal' : null,
      })
      .select()
      .single();

    if (error) return apiInternalError('novcanik-withdraw-insert', error);

    return apiSuccess({
      withdrawal,
      feeInfo: { fee, feePct: WITHDRAWAL_FEE_PCT },
      napomena:
        initialStatus === 'review'
          ? 'Zahtev je u procesu manuelnog pregleda zbog visokog iznosa.'
          : 'Zahtev za povlačenje je kreiran i obradiće se uskoro.',
    }, 201);
  } catch (error) {
    return apiInternalError('novcanik-withdraw', error);
  }
}
