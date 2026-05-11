// SpajaUltraOmegaCore -∞Ω+∞ — Novčanik Deposit API
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/novcanik/deposit
// Body: { assetId, amount, network?, sourceAddress?, destinationAddress? }

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { validateIdempotencyKey, extractIdempotencyKey, generateIdempotencyKey } from '@/lib/idempotency';
import { getAsset } from '@/lib/menjacnica/assets';
import { validateLedgerAmount } from '@/lib/novcanik/ledger';
import type { DepositRequest } from '@/lib/novcanik/types';

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('novcanik-deposit')) {
      return apiError('SERVICE_UNAVAILABLE', 'Deposit modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/novcanik/deposit'),
      10,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    // Idempotency key — generiši ako nije prosleđen
    const rawKey = extractIdempotencyKey(request.headers) ?? generateIdempotencyKey();
    const keyValidation = validateIdempotencyKey(rawKey);
    if (!keyValidation.valid) {
      return apiError('BAD_REQUEST', keyValidation.reason ?? 'Neispravni idempotency ključ.');
    }

    const body = (await request.json()) as DepositRequest;

    if (!body.assetId || !body.amount) {
      return apiError('BAD_REQUEST', 'Polja assetId i amount su obavezna.');
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

    // Idempotency check
    const { data: existing } = await supabase
      .from('novcanik_deposits')
      .select('id, status')
      .eq('idempotency_key', rawKey)
      .maybeSingle();

    if (existing) {
      return apiSuccess({ deposit: existing, fromCache: true }, 200);
    }

    const { data: deposit, error } = await supabase
      .from('novcanik_deposits')
      .insert({
        idempotency_key: rawKey,
        user_id: user.id,
        asset_id: body.assetId.toUpperCase(),
        amount: body.amount,
        status: 'pending',
        network: body.network ?? (asset.mreza ?? null),
        source_address: body.sourceAddress ?? null,
        destination_address: body.destinationAddress ?? null,
        kyc_tier_required: 'basic',
        aml_flags: [],
      })
      .select()
      .single();

    if (error) return apiInternalError('novcanik-deposit-insert', error);

    return apiSuccess({ deposit, instrukcije: 'Depozit je kreiran sa statusom pending. Bićete obavešteni kada se potvrdi.' }, 201);
  } catch (error) {
    return apiInternalError('novcanik-deposit', error);
  }
}
