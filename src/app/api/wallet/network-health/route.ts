import { type NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import { getWalletNetworkHealth, defaultWalletRetryPolicy } from '@/lib/wallet/network';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region') ?? 'GLOBAL';
  return apiSuccess({
    health: getWalletNetworkHealth(region),
    retryPolicy: defaultWalletRetryPolicy,
    note: 'Offline/poor-network tok koristi idempotency + retry/backoff uz fallback na ručni unos.',
  });
}
