/** Synthetic SPAJA Billing contract. This is not a Stripe event or settlement proof. */
export const CURRENCY_EXPONENTS = { RSD: 2, EUR: 2, USD: 2, JPY: 0 } as const;
export type Currency = keyof typeof CURRENCY_EXPONENTS;
export type PaymentStatus = 'failed' | 'succeeded' | 'partially_reversed' | 'reversed';
export interface BillingTestEvent {
  schemaVersion: 1;
  source: 'spaja-billing-test';
  livemode: false;
  eventId: string;
  paymentId: string;
  customerId: string;
  invoiceId: string;
  type: 'payment.succeeded' | 'payment.failed' | 'payment.reversed';
  amountMinor: number;
  currency: Currency;
  occurredAt: string;
  attemptId?: string;
  reversalId?: string;
}
export class LedgerError extends Error {
  constructor(public readonly code: string, public readonly status = 422) { super(code); }
}
export function validateTenant(tenant: string): void {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(tenant)) throw new LedgerError('invalid_tenant');
}
export function parseTestEvent(input: unknown): BillingTestEvent {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new LedgerError('invalid_event');
  const e = input as Record<string, unknown>;
  const required = ['schemaVersion', 'source', 'livemode', 'eventId', 'paymentId', 'customerId', 'invoiceId', 'type', 'amountMinor', 'currency', 'occurredAt'];
  if (required.some(k => !Object.hasOwn(e, k)) || Object.keys(e).some(k => ![...required, 'attemptId', 'reversalId'].includes(k))) {
    throw new LedgerError('invalid_fields');
  }
  if (e.schemaVersion !== 1 || e.source !== 'spaja-billing-test' || e.livemode !== false) throw new LedgerError('test_events_only');
  for (const [key, prefix] of Object.entries({ eventId: 'evt', paymentId: 'pay', customerId: 'cus', invoiceId: 'inv' })) {
    if (typeof e[key] !== 'string' || !new RegExp(`^test_${prefix}_[a-zA-Z0-9_-]{1,96}$`).test(e[key])) throw new LedgerError('invalid_identifier');
  }
  if (!['payment.succeeded', 'payment.failed', 'payment.reversed'].includes(String(e.type))) throw new LedgerError('unsupported_type');
  if (typeof e.amountMinor !== 'number' || !Number.isSafeInteger(e.amountMinor) || e.amountMinor <= 0 || e.amountMinor > 1_000_000_000_000) throw new LedgerError('invalid_amount');
  if (typeof e.currency !== 'string' || !Object.hasOwn(CURRENCY_EXPONENTS, e.currency)) throw new LedgerError('unsupported_currency');
  if (typeof e.occurredAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(e.occurredAt) ||
      !Number.isFinite(Date.parse(e.occurredAt)) || new Date(e.occurredAt).toISOString() !== e.occurredAt) throw new LedgerError('invalid_time');
  for (const [key, prefix, type] of [['attemptId', 'attempt', 'payment.failed'], ['reversalId', 'rev', 'payment.reversed']]) {
    if (e.type === type) {
      if (typeof e[key] !== 'string' || !new RegExp(`^test_${prefix}_[a-zA-Z0-9_-]{1,96}$`).test(e[key])) throw new LedgerError('missing_effect_identifier');
    } else if (Object.hasOwn(e, key)) throw new LedgerError('unexpected_effect_identifier');
  }
  // Explicit construction fixes hash ordering and prevents retaining arbitrary metadata/PII.
  return { schemaVersion: 1, source: 'spaja-billing-test', livemode: false,
    eventId: e.eventId as string, paymentId: e.paymentId as string, customerId: e.customerId as string,
    invoiceId: e.invoiceId as string, type: e.type as BillingTestEvent['type'], amountMinor: e.amountMinor,
    currency: e.currency as Currency, occurredAt: e.occurredAt,
    ...(e.type === 'payment.failed' ? { attemptId: e.attemptId as string } : {}),
    ...(e.type === 'payment.reversed' ? { reversalId: e.reversalId as string } : {}) };
}
