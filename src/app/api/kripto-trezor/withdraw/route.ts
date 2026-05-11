// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Vault Isplata
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/kripto-trezor/withdraw
// Body: { assetId, amount, destinationAddress, destinationTier?, idempotencyKey? }
// Zahteva autentikaciju.
// Inicira vault isplatu — time-lock + multi-sig protokol.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import {
  buildVaultWithdrawalRecord,
  validateVaultDepositAmount,
  requiresTimeLock,
  requiresMultiSig,
  VAULT_MULTISIG_THRESHOLD,
  VAULT_TIME_LOCK_DAYS,
  type VaultTier,
  type VaultWithdrawRequest,
} from '@/lib/menjacnica/trezor';

const SUPPORTED_ASSETS = ['BTC', 'ETH', 'SOL', 'USDT', 'SPAJA'];
const VALID_TIERS: VaultTier[] = ['hot', 'warm', 'cold', 'deep-cold'];

export async function POST(request: NextRequest) {
  try {
    if (!isExchangeFlagEnabled('kripto-trezor-withdraw')) {
      return apiError('SERVICE_UNAVAILABLE', 'Vault isplata modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    // Lower rate limit for withdrawals — more sensitive operation
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/kripto-trezor/withdraw'),
      5,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva za isplatu. Pokušajte za 60 sekundi.');
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
    const destinationAddress = typeof b.destinationAddress === 'string'
      ? b.destinationAddress.trim()
      : null;
    const sourceTier = typeof b.sourceTier === 'string' ? b.sourceTier as VaultTier : 'cold';
    const destinationTier = typeof b.destinationTier === 'string'
      ? b.destinationTier as 'exchange' | 'novcanik' | 'external'
      : 'novcanik';
    const idempotencyKey = typeof b.idempotencyKey === 'string' ? b.idempotencyKey : undefined;

    if (!assetId || !SUPPORTED_ASSETS.includes(assetId)) {
      return apiError('BAD_REQUEST', `assetId mora biti jedan od: ${SUPPORTED_ASSETS.join(', ')}.`);
    }
    if (amount === null || !Number.isFinite(amount)) {
      return apiError('BAD_REQUEST', 'amount mora biti validan broj.');
    }
    if (!destinationAddress || destinationAddress.length < 10) {
      return apiError('BAD_REQUEST', 'destinationAddress je obavezan (min 10 znakova).');
    }
    if (!VALID_TIERS.includes(sourceTier)) {
      return apiError('BAD_REQUEST', `sourceTier mora biti jedan od: ${VALID_TIERS.join(', ')}.`);
    }

    const validation = validateVaultDepositAmount(amount, sourceTier);
    if (!validation.valid) {
      return apiError('UNPROCESSABLE_ENTITY', validation.reason ?? 'Neispravan iznos.');
    }

    const req: VaultWithdrawRequest = {
      assetId,
      amount,
      destinationAddress,
      destinationTier,
      idempotencyKey,
    };

    const withdrawal = buildVaultWithdrawalRecord(user.id, req, sourceTier);

    const timeLockRequired = requiresTimeLock(sourceTier);
    const multiSigRequired = requiresMultiSig(sourceTier);

    const signaturesNeeded = VAULT_MULTISIG_THRESHOLD[sourceTier];
    const timeLockDays = VAULT_TIME_LOCK_DAYS[sourceTier];

    let poruka = `Isplata ${amount} ${assetId} iz ${sourceTier} tier-a je inicirana.`;
    if (timeLockRequired) {
      poruka += ` Time-lock: ${timeLockDays} ${timeLockDays === 1 ? 'dan' : 'dana'}.`;
    }
    if (multiSigRequired) {
      poruka += ` Potrebno ${signaturesNeeded} potpisa (multi-sig).`;
    }

    return apiSuccess(
      {
        withdrawal,
        sigurnosniZahtevi: {
          timeLockRequired,
          timeLockDays,
          multiSigRequired,
          signaturesNeeded,
          timeLockExpiresAt: withdrawal.timeLockExpiresAt ?? null,
        },
        poruka,
        simulationMode: true,
      },
      201,
    );
  } catch (error) {
    return apiInternalError('kripto-trezor-withdraw', error);
  }
}
