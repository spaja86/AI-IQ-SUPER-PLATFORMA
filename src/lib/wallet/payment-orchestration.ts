import type { WalletCoverageEntry, WalletCardNetwork, WalletRegion } from './types';

export interface RoutingRequest {
  region: WalletRegion;
  currency: string;
  cardNetwork: WalletCardNetwork;
  amountMinor: number;
}

export interface RoutingDecision {
  primaryProcessor: string;
  fallbackProcessors: string[];
  reason: string;
}

export const HIGH_AMOUNT_THRESHOLD_MINOR = 1_000_000;

export const walletCoverageMatrix: WalletCoverageEntry[] = [
  {
    region: 'RS',
    currencies: ['RSD', 'EUR', 'USD'],
    cardNetworks: ['visa', 'mastercard', 'amex'],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'EU',
    currencies: ['EUR', 'USD', 'GBP'],
    cardNetworks: ['visa', 'mastercard', 'amex', 'jcb'],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'US',
    currencies: ['USD'],
    cardNetworks: ['visa', 'mastercard', 'amex', 'discover'],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'GLOBAL',
    currencies: ['USD', 'EUR'],
    cardNetworks: ['visa', 'mastercard'],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
];

export function routePayment(request: RoutingRequest): RoutingDecision {
  const coverage = walletCoverageMatrix.find((entry) => entry.region === request.region) ?? walletCoverageMatrix.find((entry) => entry.region === 'GLOBAL');

  if (!coverage) {
    return {
      primaryProcessor: 'stripe',
      fallbackProcessors: ['paypal'],
      reason: 'Nije pronađena pokrivenost regiona; korišćen globalni fallback.',
    };
  }

  const currencySupported = coverage.currencies.includes(request.currency.toUpperCase());
  const cardSupported = coverage.cardNetworks.includes(request.cardNetwork);

  if (!currencySupported || !cardSupported) {
    return {
      primaryProcessor: coverage.fallbackProcessors[0] ?? 'paypal',
      fallbackProcessors: ['stripe'],
      reason: 'Primarni procesor za region ne pokriva valutu ili kartičnu šemu; aktiviran fallback.',
    };
  }

  const highAmountFallback = request.amountMinor > HIGH_AMOUNT_THRESHOLD_MINOR;
  return {
    primaryProcessor: coverage.processors[0] ?? 'stripe',
    fallbackProcessors: highAmountFallback ? [...coverage.fallbackProcessors, 'manual-review'] : coverage.fallbackProcessors,
    reason: highAmountFallback
      ? 'Visok iznos transakcije zahteva dodatni fallback i ručni pregled.'
      : 'Pokrivenost regiona/valute/kartice je validna.',
  };
}
