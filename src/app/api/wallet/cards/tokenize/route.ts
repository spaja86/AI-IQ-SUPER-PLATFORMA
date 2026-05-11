import { type NextRequest } from 'next/server';
import { apiError, apiSuccess, apiInternalError } from '@/lib/api/response';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/config';
import { routePayment } from '@/lib/wallet/payment-orchestration';

type WalletCardNetwork = 'visa' | 'mastercard' | 'amex' | 'diners' | 'discover' | 'jcb' | 'unionpay' | 'unknown';

function mapStripeBrand(brand: string | null | undefined): WalletCardNetwork {
  switch ((brand ?? '').toLowerCase()) {
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'mastercard';
    case 'amex':
      return 'amex';
    case 'diners':
      return 'diners';
    case 'discover':
      return 'discover';
    case 'jcb':
      return 'jcb';
    case 'unionpay':
      return 'unionpay';
    default:
      return 'unknown';
  }
}

interface TokenizeRequestBody {
  paymentMethodId?: string;
  region?: 'RS' | 'EU' | 'US' | 'GLOBAL';
  currency?: string;
  amountMinor?: number;
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const body = (await request.json()) as TokenizeRequestBody;
    if (!body.paymentMethodId || typeof body.paymentMethodId !== 'string') {
      return apiError('BAD_REQUEST', 'paymentMethodId je obavezan.');
    }

    const stripe = getStripe();
    const paymentMethod = await stripe.paymentMethods.retrieve(body.paymentMethodId);

    if (paymentMethod.type !== 'card' || !paymentMethod.card) {
      return apiError('UNPROCESSABLE_ENTITY', 'Podržane su samo kartice.');
    }

    const region = body.region ?? 'GLOBAL';
    const currency = (body.currency ?? 'EUR').toUpperCase();
    const amountMinor = body.amountMinor ?? 1_000;

    const decision = routePayment({
      region,
      currency,
      cardNetwork: mapStripeBrand(paymentMethod.card.brand),
      amountMinor,
    });

    return apiSuccess({
      tokenizedCard: {
        paymentMethodId: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        fingerprint: paymentMethod.card.fingerprint ?? null,
        country: paymentMethod.card.country ?? null,
      },
      routingDecision: decision,
      security: {
        storesPanCvv: false,
        pcieScope: 'tokenized-only',
      },
      actor: user.id,
    });
  } catch (error) {
    return apiInternalError('wallet-tokenize-card', error);
  }
}
