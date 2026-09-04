export type PekicSubscriptionStatus =
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

export type PekicPaymentModel =
  | 'periodic-subscription'
  | 'advance-payment'
  | 'one-time-payment'
  | 'framework-agreement';

export type PekicBillingInterval = 'monthly' | 'yearly';

export interface PekicContractParty {
  pravnoIme: 'PEKIC d.o.o.';
  sediste: string | null;
  pib: string | null;
  mb: string | null;
  ovlasceniPotpisnik: string | null;
  email: string | null;
  telefon: string | null;
}

export interface PekicSubscriptionRecord {
  okrid: string;
  invoiceNumber: string;
  currency: 'RSD';
  paymentModel: PekicPaymentModel;
  interval: PekicBillingInterval;
  iznosRsd: number | null;
  pdvStopa: number | null;
  startDate: string | null;
  endDate: null;
  pravniOsnov: string | null;
  dokumentModel: string | null;
  opisUsluge: string | null;
  status: PekicSubscriptionStatus;
}

export interface PekicInvoice {
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
  interval: PekicBillingInterval;
  paymentModel: PekicPaymentModel;
  status: PekicSubscriptionStatus;
}

export interface PekicAuditEntry {
  okrid: string;
  invoiceNumber: string;
  status: PekicSubscriptionStatus;
  currency: 'RSD';
  paymentModel: PekicPaymentModel;
  cycleStart: string;
  cycleEnd: string;
  timestamp: string;
}

export const PEKIC_PARTY: PekicContractParty = {
  pravnoIme: 'PEKIC d.o.o.',
  sediste: null,
  pib: null,
  mb: null,
  ovlasceniPotpisnik: null,
  email: null,
  telefon: null,
};

export const PEKIC_SUBSCRIPTION: PekicSubscriptionRecord = {
  okrid: 'OKRID-2026-PEKIC-001',
  invoiceNumber: 'INV-PEKIC-2026-001',
  currency: 'RSD',
  paymentModel: 'framework-agreement',
  interval: 'monthly',
  iznosRsd: null,
  pdvStopa: null,
  startDate: null,
  endDate: null,
  pravniOsnov: null,
  dokumentModel: 'okvirni ugovor sa aneksom o dinarskim uplatama',
  opisUsluge: null,
  status: 'incomplete-intake',
};

export function getPekicParty(): PekicContractParty {
  return { ...PEKIC_PARTY };
}

export function getPekicSubscription(): PekicSubscriptionRecord {
  return { ...PEKIC_SUBSCRIPTION };
}

export function isPekicIntakeComplete(): boolean {
  return Boolean(
    PEKIC_PARTY.sediste &&
      PEKIC_PARTY.pib &&
      PEKIC_PARTY.mb &&
      PEKIC_PARTY.ovlasceniPotpisnik &&
      PEKIC_PARTY.email &&
      PEKIC_SUBSCRIPTION.pravniOsnov &&
      PEKIC_SUBSCRIPTION.opisUsluge &&
      PEKIC_SUBSCRIPTION.iznosRsd !== null &&
      PEKIC_SUBSCRIPTION.iznosRsd > 0,
  );
}

export function canIssuePekicInvoice(): boolean {
  return PEKIC_SUBSCRIPTION.status === 'approved-for-invoice' || PEKIC_SUBSCRIPTION.status === 'payment-pending';
}

export function generatePekicInvoice(datumIzdavanja: string): PekicInvoice | null {
  const sub = PEKIC_SUBSCRIPTION;
  if (!canIssuePekicInvoice() || sub.iznosRsd === null || sub.pdvStopa === null) return null;

  const datumDospeca = computeDatumDospeca(datumIzdavanja, sub.interval);
  const pdvIznosRsd = round2(sub.iznosRsd * sub.pdvStopa);
  const ukupnoRsd = round2(sub.iznosRsd + pdvIznosRsd);

  return {
    invoiceNumber: sub.invoiceNumber,
    okrid: sub.okrid,
    izdavalac: 'AI-IQ-SUPER-PLATFORMA / Kompanija SPAJA — Digitalna Industrija',
    primalac: PEKIC_PARTY.pravnoIme,
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

export function buildPekicAuditEntry(cycleStart: string, cycleEnd: string): PekicAuditEntry {
  return {
    okrid: PEKIC_SUBSCRIPTION.okrid,
    invoiceNumber: PEKIC_SUBSCRIPTION.invoiceNumber,
    status: PEKIC_SUBSCRIPTION.status,
    currency: 'RSD',
    paymentModel: PEKIC_SUBSCRIPTION.paymentModel,
    cycleStart,
    cycleEnd,
    timestamp: new Date().toISOString(),
  };
}

export function getPekicSubscriptionOverview() {
  return {
    klijent: getPekicParty(),
    pretplata: getPekicSubscription(),
    intakeComplete: isPekicIntakeComplete(),
    canIssueInvoice: canIssuePekicInvoice(),
    governance: '/docs/PEKIC-DOO-PRETPLATA-RSD.md',
  };
}

function computeDatumDospeca(datumIzdavanja: string, interval: PekicBillingInterval): string {
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
