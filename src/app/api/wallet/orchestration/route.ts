import { type NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api/response';
import { routePayment, getWalletCoverageMatrix } from '@/lib/wallet/payment-orchestration';
import { getDigitalnaIndustrijaNacinPlacanjaPregled } from '@/lib/digitalna-industrija-nacini-placanja';
import type { WalletRegion, WalletCardNetwork } from '@/lib/wallet/types';

export async function GET(request: NextRequest) {
  const region = (request.nextUrl.searchParams.get('region') ?? 'GLOBAL') as WalletRegion;
  const currency = (request.nextUrl.searchParams.get('currency') ?? 'EUR').toUpperCase();
  const cardNetwork = (request.nextUrl.searchParams.get('cardNetwork') ?? 'visa') as WalletCardNetwork;
  const amountMinor = Number.parseInt(request.nextUrl.searchParams.get('amountMinor') ?? '1000', 10);

  if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
    return apiError('BAD_REQUEST', 'amountMinor mora biti pozitivan broj.');
  }

  const pregled = getDigitalnaIndustrijaNacinPlacanjaPregled();

  return apiSuccess({
    request: { region, currency, cardNetwork, amountMinor },
    routingDecision: routePayment({ region, currency, cardNetwork, amountMinor }),
    matrix: getWalletCoverageMatrix(),
    izvor: pregled.meta,
  });
}
