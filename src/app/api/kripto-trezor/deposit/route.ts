// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Depozit
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/kripto-trezor/deposit
// Body: { assetId, amount, targetTier?, sourceTier?, idempotencyKey? }
// Zahteva autentikaciju.
// Zaključava sredstva u vault (simulovano).

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import {
  buildVaultDepositRecord,
  validateVaultDepositAmount,
  type VaultDepositRequest,
  type VaultTier,
} from '@/lib/menjacnica/trezor';

const SUPPORTED_ASSETS = ['BTC', 'ETH', 'SOL', 'USDT', 'SPAJA'];
const VALID_TIERS: VaultTier[] = ['hot', 'warm', 'cold', 'deep-cold'];
const VALID_SOURCES = ['exchange', 'novcanik', 'external'];

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-deposit')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault depozit modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/deposit'),
      10,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('BAD_REQUEST', 'Neispravan JSON body.');
    }

    if (typeof body !== 'object' || body === null) {
      return apiError('BAD_REQUEST', 'Body mora biti JSON objekat.');
    }

    const b = body as Record<string, unknown>;
    const assetId = typeof b.assetId === 'string' ? b.assetId.toUpperCase() : null;
    const amount = typeof b.amount === 'number' ? b.amount : null;
    const targetTier = typeof b.targetTier === 'string' ? b.targetTier as VaultTier : 'cold';
    const sourceTier = typeof b.sourceTier === 'string' ? b.sourceTier : 'novcanik';
    const idempotencyKey = typeof b.idempotencyKey === 'string' ? b.idempotencyKey : undefined;

    if (!assetId || !SUPPORTED_ASSETS.includes(assetId)) {
      return apiError('BAD_REQUEST', `assetId mora biti jedan od: ${SUPPORTED_ASSETS.join(', ')}.`);
    }
    if (amount === null || !Number.isFinite(amount)) {
      return apiError('BAD_REQUEST', 'amount mora biti validan broj.');
    }
    if (!VALID_TIERS.includes(targetTier)) {
      return apiError('BAD_REQUEST', `targetTier mora biti jedan od: ${VALID_TIERS.join(', ')}.`);
    }
    if (!VALID_SOURCES.includes(sourceTier)) {
      return apiError('BAD_REQUEST', `sourceTier mora biti jedan od: ${VALID_SOURCES.join(', ')}.`);
    }

    const validation = validateVaultDepositAmount(amount, targetTier);
    if (!validation.valid) {
      return apiError('UNPROCESSABLE_ENTITY', validation.reason ?? 'Neispravan iznos.');
    }

    const req: VaultDepositRequest = {
      assetId,
      amount,
      targetTier,
      sourceTier: sourceTier as 'exchange' | 'novcanik' | 'external',
      idempotencyKey,
    };

    const deposit = buildVaultDepositRecord(user.id, req);

    return apiSuccess(
      {
        deposit,
        poruka: `Depozit ${amount} ${assetId} u ${targetTier} tier je iniciran. Čeka se ${deposit.requiredConfirmations} potvrda.`,
        simulationMode: true,
      },
      201,
    );
  } catch (error) {
    return apiInternalError('kripto-trezor-deposit', error);
  }
}
