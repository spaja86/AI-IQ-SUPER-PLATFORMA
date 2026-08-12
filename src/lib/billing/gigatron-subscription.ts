// SpajaUltraOmegaCore -∞Ω+∞ — GIGATRON B2B Perpetual Subscription
// Kompanija SPAJA — Digitalna Industrija
//
// Governance: docs/GIGATRON-PRETPLATA-BESKONACNI-RACUN.md
// Defines the perpetual recurring invoice model for GIGATRON korporativnu pretplatu
// sa „1 beskonačnim računom" — endDate: null, autoRenew: true.

export type GigatronSubscriptionStatus =
  | 'draft'
  | 'incomplete-intake'
  | 'legal-review'
  | 'tax-review'
  | 'approved-for-invoice'
  | 'payment-pending'
  | 'payment-confirmed'
  | 'service-active'
  | 'rollback'
  | 'closed'
  | 'blocked-until-validated';

export type GigatronPaymentModel =
  | 'periodic-subscription'
  | 'advance-payment'
  | 'one-time-payment'
  | 'framework-agreement';

export type GigatronBillingInterval = 'monthly' | 'yearly';

export interface GigatronContractParty {
  pravnoIme: 'GIGATRON d.o.o.';
  sediste: string | null;
  pib: string | null;
  mb: string | null;
  ovlasceniPotpisnik: string | null;
  email: string | null;
  telefon: string | null;
}

export interface GigatronSubscriptionRecord {
  okrid: string;
  invoiceNumber: string;
  currency: 'RSD';
  paymentModel: GigatronPaymentModel;
  interval: GigatronBillingInterval;
  /** iznos bez PDV-a (u RSD); null dok ugovor nije potpisan */
  iznosRsd: number | null;
  pdvStopa: number | null;
  startDate: string | null;
  /** null = beskonačno (perpetual) — „1 beskonačan račun" */
  endDate: null;
  autoRenew: true;
  pravniOsnov: string | null;
  dokumentModel: string | null;
  opisUsluge: string | null;
  status: GigatronSubscriptionStatus;
}

export interface GigatronInvoice {
  invoiceNumber: string;
  okrid: string;
  izdavalac: string;
  primalac: string;
  datumIzdavanja: string;
  datumDospeca: string;
  valuta: 'RSD';
  iznosRsd: number;
  pdvStopa: number;
  pdvIznosRsd: number;
  ukupnoRsd: number;
  interval: GigatronBillingInterval;
  paymentModel: GigatronPaymentModel;
  status: GigatronSubscriptionStatus;
}

export interface GigatronAuditEntry {
  okrid: string;
  invoiceNumber: string;
  status: GigatronSubscriptionStatus;
  currency: 'RSD';
  paymentModel: GigatronPaymentModel;
  cycleStart: string;
  cycleEnd: string;
  timestamp: string;
}

export const GIGATRON_PARTY: GigatronContractParty = {
  pravnoIme: 'GIGATRON d.o.o.',
  sediste: null,
  pib: null,
  mb: null,
  ovlasceniPotpisnik: null,
  email: null,
  telefon: null,
};

export const GIGATRON_SUBSCRIPTION: GigatronSubscriptionRecord = {
  okrid: 'OKRID-2026-GIGATRON-SUB-001',
  invoiceNumber: 'INV-GIGATRON-2026-001',
  currency: 'RSD',
  paymentModel: 'framework-agreement',
  interval: 'monthly',
  iznosRsd: null,
  pdvStopa: null,
  startDate: null,
  endDate: null,
  autoRenew: true,
  pravniOsnov: null,
  dokumentModel: 'okvirni ugovor sa aneksom o mesečnoj pretplati',
  opisUsluge: null,
  status: 'incomplete-intake',
};

export function getGigatronParty(): GigatronContractParty {
  return { ...GIGATRON_PARTY };
}

export function getGigatronSubscription(): GigatronSubscriptionRecord {
  return { ...GIGATRON_SUBSCRIPTION };
}

export function isGigatronIntakeComplete(): boolean {
  return Boolean(
    GIGATRON_PARTY.sediste &&
      GIGATRON_PARTY.pib &&
      GIGATRON_PARTY.mb &&
      GIGATRON_PARTY.ovlasceniPotpisnik &&
      GIGATRON_PARTY.email &&
      GIGATRON_SUBSCRIPTION.pravniOsnov &&
      GIGATRON_SUBSCRIPTION.opisUsluge &&
      GIGATRON_SUBSCRIPTION.iznosRsd !== null &&
      GIGATRON_SUBSCRIPTION.iznosRsd > 0,
  );
}

export function canIssueGigatronInvoice(): boolean {
  return (
    GIGATRON_SUBSCRIPTION.status === 'approved-for-invoice' ||
    GIGATRON_SUBSCRIPTION.status === 'payment-pending'
  );
}

export function generateGigatronInvoice(datumIzdavanja: string): GigatronInvoice | null {
  const sub = GIGATRON_SUBSCRIPTION;
  if (!canIssueGigatronInvoice() || sub.iznosRsd === null || sub.pdvStopa === null) return null;

  const datumDospeca = computeDatumDospeca(datumIzdavanja, sub.interval);
  const pdvIznosRsd = round2(sub.iznosRsd * sub.pdvStopa);
  const ukupnoRsd = round2(sub.iznosRsd + pdvIznosRsd);

  return {
    invoiceNumber: sub.invoiceNumber,
    okrid: sub.okrid,
    izdavalac: 'AI-IQ-SUPER-PLATFORMA / Kompanija SPAJA — Digitalna Industrija',
    primalac: GIGATRON_PARTY.pravnoIme,
    datumIzdavanja,
    datumDospeca,
    valuta: 'RSD',
    iznosRsd: sub.iznosRsd,
    pdvStopa: sub.pdvStopa,
    pdvIznosRsd,
    ukupnoRsd,
    interval: sub.interval,
    paymentModel: sub.paymentModel,
    status: sub.status,
  };
}

export function buildGigatronAuditEntry(cycleStart: string, cycleEnd: string): GigatronAuditEntry {
  return {
    okrid: GIGATRON_SUBSCRIPTION.okrid,
    invoiceNumber: GIGATRON_SUBSCRIPTION.invoiceNumber,
    status: GIGATRON_SUBSCRIPTION.status,
    currency: 'RSD',
    paymentModel: GIGATRON_SUBSCRIPTION.paymentModel,
    cycleStart,
    cycleEnd,
    timestamp: new Date().toISOString(),
  };
}

export function getGigatronSubscriptionOverview() {
  return {
    klijent: getGigatronParty(),
    pretplata: getGigatronSubscription(),
    intakeComplete: isGigatronIntakeComplete(),
    canIssueInvoice: canIssueGigatronInvoice(),
    governance: '/docs/GIGATRON-PRETPLATA-BESKONACNI-RACUN.md',
  };
}

function computeDatumDospeca(datumIzdavanja: string, interval: GigatronBillingInterval): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datumIzdavanja)) {
    return datumIzdavanja;
  }

  const [year, month, day] = datumIzdavanja.split('-').map(Number);
  if ([year, month, day].some((value) => Number.isNaN(value))) {
    return datumIzdavanja;
  }

  let normalizedYear = year;
  let targetMonth = month;

  if (interval === 'monthly') {
    targetMonth = month + 1;
    if (targetMonth > 12) {
      targetMonth = 1;
      normalizedYear = year + 1;
    }
  } else {
    normalizedYear = year + 1;
  }

  const maxDay = new Date(Date.UTC(normalizedYear, targetMonth, 0)).getUTCDate();
  const clampedDay = Math.min(day, maxDay);

  return `${normalizedYear.toString().padStart(4, '0')}-${targetMonth
    .toString()
    .padStart(2, '0')}-${clampedDay.toString().padStart(2, '0')}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
