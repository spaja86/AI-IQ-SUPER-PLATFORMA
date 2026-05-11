import { type NextRequest } from 'next/server';
import { apiError, apiSuccess, apiInternalError } from '@/lib/api/response';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/config';
import { extractIdempotencyKey, validateIdempotencyKey } from '@/lib/idempotency';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const candidateKey = extractIdempotencyKey(request.headers);
    if (candidateKey) {
      const validated = validateIdempotencyKey(candidateKey);
      if (!validated.valid) return apiError('BAD_REQUEST', validated.reason ?? 'Neispravan Idempotency-Key.');
    }

    const stripe = getStripe();
    const setupIntent = await stripe.setupIntents.create({
      usage: 'off_session',
      payment_method_types: ['card'],
      metadata: {
        user_id: user.id,
        flow: 'wallet-manual-card-entry',
      },
    }, candidateKey ? { idempotencyKey: `wallet-setup-intent:${user.id}:${candidateKey}`.slice(0, 255) } : undefined);

    return apiSuccess({
      setupIntentId: setupIntent.id,
      clientSecret: setupIntent.client_secret,
      note: 'Kartični podaci se unose kroz PCI-hosted Stripe elemente; backend ne čuva PAN/CVV.',
    });
  } catch (error) {
    return apiInternalError('wallet-setup-intent', error);
  }
}
