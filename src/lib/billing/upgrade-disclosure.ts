import { createHash } from 'crypto';

export interface UpgradeDisclosureLineItem {
  id: 'pro' | 'member' | 'preview-deployment-suffix';
  label: string;
  costUsd: number;
}

export interface UpgradeDisclosure {
  version: string;
  currency: 'USD';
  cadence: 'monthly';
  lineItems: UpgradeDisclosureLineItem[];
  totalUsd: number;
  legalDisclosure: string;
  billingThresholdPolicy: string;
}

export interface UpgradeCompanyRequestPayload {
  expectedTotalUsd: number;
  version: string;
  acceptanceText: string;
  autoSendToCompanyBilling: boolean;
  sendMode?: 'ready_to_send' | 'dispatch_internal';
}

export interface UpgradeCompanyRequestContext {
  accountEmail: string;
  ownerName: string;
}

export interface UpgradeCompanyRequestRecord {
  requestId: string;
  auditHash: string;
  createdAt: string;
  version: string;
  accountEmail: string;
  ownerName: string;
  acceptanceText: string;
  autoSendToCompanyBilling: boolean;
  sendMode: 'ready_to_send' | 'dispatch_internal';
  requestedPlans: string[];
  status: 'queued_for_billing_dispatch' | 'ready_to_send';
}

export const BILLING_UPGRADE_DISCLOSURE: UpgradeDisclosure = {
  version: '2026-05-upgrade-120-v1',
  currency: 'USD',
  cadence: 'monthly',
  lineItems: [
    { id: 'pro', label: 'Pro', costUsd: 20 },
    { id: 'member', label: '1 member', costUsd: 0 },
    { id: 'preview-deployment-suffix', label: 'Preview Deployment Suffix', costUsd: 100 },
  ],
  totalUsd: 120,
  legalDisclosure:
    'Upon clicking Upgrade, you will be charged $120, plus any applicable taxes and fees, immediately and then every month, until you cancel.',
  billingThresholdPolicy:
    'If your usage exceeds a billing threshold during a cycle, your payment method on file may be charged before the cycle ends.',
};

export const UPGRADE_ACCEPTANCE_TEXT = `${BILLING_UPGRADE_DISCLOSURE.legalDisclosure} ${BILLING_UPGRADE_DISCLOSURE.billingThresholdPolicy}`;

export const DEFAULT_UPGRADE_COMPANY_REQUEST_CONTEXT: UpgradeCompanyRequestContext = {
  accountEmail: 'spajicn@yahoo.com',
  ownerName: 'Nikola Spajić',
};

export function calculateUpgradeDisclosureTotal(items: UpgradeDisclosureLineItem[]): number {
  return items.reduce((sum, item) => sum + item.costUsd, 0);
}

export function validateUpgradeDisclosureConsistency(disclosure: UpgradeDisclosure): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const calculated = calculateUpgradeDisclosureTotal(disclosure.lineItems);

  if (calculated !== disclosure.totalUsd) {
    errors.push(`Total mismatch: expected ${disclosure.totalUsd}, calculated ${calculated}`);
  }

  if (!disclosure.legalDisclosure.includes('$120')) {
    errors.push('Legal disclosure must include $120 immediate/monthly statement.');
  }

  if (!disclosure.billingThresholdPolicy.toLowerCase().includes('threshold')) {
    errors.push('Billing threshold policy text must mention threshold charging.');
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpgradeCompanyRequestPayload(payload: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload mora biti objekat.'] };
  }

  const data = payload as Partial<UpgradeCompanyRequestPayload>;

  if (typeof data.expectedTotalUsd !== 'number') {
    errors.push('expectedTotalUsd mora biti broj.');
  } else if (data.expectedTotalUsd !== BILLING_UPGRADE_DISCLOSURE.totalUsd) {
    errors.push(`expectedTotalUsd mora biti ${BILLING_UPGRADE_DISCLOSURE.totalUsd}.`);
  }

  if (data.version !== BILLING_UPGRADE_DISCLOSURE.version) {
    errors.push('Nevažeća verzija upgrade disclosure modela.');
  }

  if (typeof data.acceptanceText !== 'string' || data.acceptanceText.trim() !== UPGRADE_ACCEPTANCE_TEXT) {
    errors.push('acceptanceText mora biti tačan pravni tekst za nadogradnju.');
  }

  if (data.autoSendToCompanyBilling !== true) {
    errors.push('autoSendToCompanyBilling mora biti true.');
  }

  if (data.sendMode && data.sendMode !== 'ready_to_send' && data.sendMode !== 'dispatch_internal') {
    errors.push('sendMode mora biti ready_to_send ili dispatch_internal.');
  }

  return { valid: errors.length === 0, errors };
}

export function buildUpgradeCompanyRequestRecord(
  payload: UpgradeCompanyRequestPayload,
  context: UpgradeCompanyRequestContext = DEFAULT_UPGRADE_COMPANY_REQUEST_CONTEXT,
): UpgradeCompanyRequestRecord {
  const createdAt = new Date().toISOString();
  const sendMode = payload.sendMode ?? 'dispatch_internal';
  const base = `${payload.version}|${context.accountEmail}|${context.ownerName}|${payload.expectedTotalUsd}|${createdAt}`;
  const auditHash = createHash('sha256').update(base).digest('hex');

  return {
    requestId: `UPG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    auditHash,
    createdAt,
    version: payload.version,
    accountEmail: context.accountEmail,
    ownerName: context.ownerName,
    acceptanceText: payload.acceptanceText,
    autoSendToCompanyBilling: payload.autoSendToCompanyBilling,
    sendMode,
    requestedPlans: ['GitHub Enterprise', 'GitHub Copilot Enterprise', 'Best available subscription package'],
    status: sendMode === 'dispatch_internal' ? 'queued_for_billing_dispatch' : 'ready_to_send',
  };
}
