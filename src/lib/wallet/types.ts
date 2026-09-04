// ── WorldBank types (aligned with AIIQWorldBank.sol) ─────────────────────────

export type WorldBankCurrency = 'RSD' | 'EUR' | 'USD';

export type WorldBankTransactionStatus = 'IZVRSENO' | 'U_OBRADI' | 'CEKANJE';

export interface WorldBankTransaction {
  id: number;
  naziv: string;
  opis: string;
  iznos: number;        // smallest unit (paras/cents)
  valuta: WorldBankCurrency;
  izvor: string;
  destinacija: string;
  status: WorldBankTransactionStatus;
  datumBlok: number;    // block.timestamp (Unix seconds)
  inicijator: string;   // Ethereum address
}

export interface WorldBankAccount {
  brojRacuna: string;
  naziv: string;
  valuta: WorldBankCurrency;
  stanje: number;       // smallest unit
  aktivan: boolean;
}

export interface WorldBankWalletState {
  vlasnik: string;
  naziv: string;
  kompanija: string;
  verzija: string;
  ukupnoTransakcija: number;
  ukupnoPotroseno: number;  // USD cents
  racuni: WorldBankAccount[];
  transakcije: WorldBankTransaction[];
}

// ── Wallet identity / card types ─────────────────────────────────────────────

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
