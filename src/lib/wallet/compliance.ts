import type { WalletKPI } from './types';

export interface WalletComplianceRequirement {
  code: string;
  title: string;
  status: 'planned' | 'in_progress' | 'implemented';
  scope: string;
}

export const walletComplianceRequirements: WalletComplianceRequirement[] = [
  { code: 'PCI-DSS', title: 'PCI DSS segmentacija i tokenizacija', status: 'in_progress', scope: 'kartični podaci i obrada plaćanja' },
  { code: 'PSD2-SCA', title: 'Strong Customer Authentication (3DS/SCA)', status: 'planned', scope: 'EEA transakcije' },
  { code: 'KYC-KYB', title: 'KYC/KYB verifikacije identiteta', status: 'planned', scope: 'wallet onboarding' },
  { code: 'AML', title: 'AML kontrole i praćenje sumnjivih aktivnosti', status: 'planned', scope: 'transakcioni monitoring' },
  { code: 'GDPR', title: 'Zaštita i minimizacija ličnih podataka', status: 'implemented', scope: 'identitet, audit i retention politika' },
];

export const walletKpiBaseline: WalletKPI = {
  authorizationSuccessRate: 0.982,
  avgAuthorizationLatencyMs: 410,
  falseDeclineRate: 0.009,
  fraudRate: 0.002,
  uptimePercent: 99.95,
};

export const walletDataClassification = {
  secret: ['tokenized_payment_method_metadata', 'risk_signals_internal'],
  restricted: ['identity_status', 'kyc_kyb_state', 'device_risk_flags'],
  internal: ['processor_routing_decisions', 'regional_coverage_matrix'],
  public: ['wallet_feature_flags', 'status_page_metrics'],
};
