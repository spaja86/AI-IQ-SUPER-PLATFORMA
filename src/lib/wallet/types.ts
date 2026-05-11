export type WalletIdentityTier = 'basic' | 'verified' | 'enterprise';

export type WalletCardNetwork = 'visa' | 'mastercard' | 'amex' | 'diners' | 'discover' | 'jcb' | 'unionpay' | 'unknown';

export type WalletRegion = 'RS' | 'EU' | 'US' | 'GLOBAL';

export type WalletReleaseLane = 'dev' | 'beta' | 'production';

export interface WalletIdentity {
  userId: string;
  tier: WalletIdentityTier;
  kycStatus: 'pending' | 'approved' | 'rejected';
  kybStatus: 'pending' | 'approved' | 'rejected';
}

export interface WalletCardTokenView {
  paymentMethodId: string;
  network: WalletCardNetwork;
  last4: string;
  expMonth: number;
  expYear: number;
  fingerprint?: string;
  country?: string;
}

export interface WalletCoverageEntry {
  region: WalletRegion;
  currencies: string[];
  cardNetworks: WalletCardNetwork[];
  processors: string[];
  fallbackProcessors: string[];
}

export interface WalletKPI {
  authorizationSuccessRate: number;
  avgAuthorizationLatencyMs: number;
  falseDeclineRate: number;
  fraudRate: number;
  uptimePercent: number;
}
