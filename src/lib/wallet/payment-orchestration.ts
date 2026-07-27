import type { WalletCoverageEntry, WalletCardNetwork, WalletRegion } from './types';
import { getDigitalnaIndustrijaMatrix } from '../digitalna-industrija-nacini-placanja';

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

/**
 * Načini plaćanja centralno dolaze iz Digitalne Industrije.
 * Povlači kanonsku matricu iz `digitalna-industrija-nacini-placanja`.
 */
export function getWalletCoverageMatrix(): WalletCoverageEntry[] {
  return getDigitalnaIndustrijaMatrix();
}

/**
 * Backward-compatible named export — uvek reflektuje DI izvor.
 * @deprecated Koristiti `getWalletCoverageMatrix()` za dinamički pristup.
 */
export const walletCoverageMatrix: WalletCoverageEntry[] = getDigitalnaIndustrijaMatrix();

export function routePayment(request: RoutingRequest): RoutingDecision {
  const matrix = getWalletCoverageMatrix();
  const coverage = matrix.find((entry) => entry.region === request.region) ?? matrix.find((entry) => entry.region === 'GLOBAL');

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
