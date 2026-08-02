// SpajaUltraOmegaCore -∞Ω+∞ — Autokuća B2B Perpetual Subscription
// Kompanija SPAJA — Digitalna Industrija
//
// Governance: docs/AUTOKUCA-PRETPLATA.md
// Defines the perpetual recurring invoice model for:
//   - Kragujevac Autokuća d.o.o.  (OKRID-2026-AUTOKUCA-KG-001)
//   - Beograd Autokuća d.o.o.     (OKRID-2026-AUTOKUCA-BG-001)

export type AutokucaKlijentId = 'AUTOKUCA-KG' | 'AUTOKUCA-BG';

export type AutokucaSubscriptionStatus =
  | 'incomplete-intake'
  | 'kyc-pending'
  | 'kyc-approved'
  | 'blocked-until-validated'
  | 'active'
  | 'suspended'
  | 'canceled';

export type NaplataInterval = 'monthly' | 'yearly';

export interface AutokucaKlijent {
  klijentId: AutokucaKlijentId;
  okrid: string;
  pravnoIme: string;
  sediste: string;
  pib: string | null;
  mb: string | null;
  ovlasceniPotpisnik: string | null;
  email: string | null;
  telefon: string | null;
}

export interface AutokucaSubscription {
  klijentId: AutokucaKlijentId;
  invoiceNumber: string;
  currency: 'EUR';
  /** iznos bez PDV-a (u EUR); null dok ugovor nije potpisan */
  iznos: number | null;
  pdvStopa: number; // 0.20 = 20%
  naplataInterval: NaplataInterval;
  /** ISO-8601 datum aktivacije; null dok KYC nije odobren */
  startDate: string | null;
  /** null = beskonačno (perpetual) */
  endDate: null;
  autoRenew: true;
  status: AutokucaSubscriptionStatus;
  efakturaEnabled: boolean;
}

export interface AutokucaFullInvoice {
  invoiceNumber: string;
  klijentId: AutokucaKlijentId;
  izdavalac: string;
  primalac: string;
  datumIzdavanja: string;
  datumDospeca: string;
  valuta: 'EUR';
  iznos: number;
  pdvIznos: number;
  ukupnoSaPdv: number;
  pdvStopa: number;
  naplataInterval: NaplataInterval;
  status: AutokucaSubscriptionStatus;
  efakturaEnabled: boolean;
}

// ─── Klijenti ────────────────────────────────────────────────────────────────

export const AUTOKUCA_KLIJENTI: Record<AutokucaKlijentId, AutokucaKlijent> = {
  'AUTOKUCA-KG': {
    klijentId: 'AUTOKUCA-KG',
    okrid: 'OKRID-2026-AUTOKUCA-KG-001',
    pravnoIme: 'Kragujevac Autokuća d.o.o.',
    sediste: 'Kragujevac, Republika Srbija',
    pib: null,
    mb: null,
    ovlasceniPotpisnik: null,
    email: null,
    telefon: null,
  },
  'AUTOKUCA-BG': {
    klijentId: 'AUTOKUCA-BG',
    okrid: 'OKRID-2026-AUTOKUCA-BG-001',
    pravnoIme: 'Beograd Autokuća d.o.o.',
    sediste: 'Beograd, Republika Srbija',
    pib: null,
    mb: null,
    ovlasceniPotpisnik: null,
    email: null,
    telefon: null,
  },
};

// ─── Subscription registar ────────────────────────────────────────────────────

export const AUTOKUCA_SUBSCRIPTIONS: Record<AutokucaKlijentId, AutokucaSubscription> = {
  'AUTOKUCA-KG': {
    klijentId: 'AUTOKUCA-KG',
    invoiceNumber: 'INV-KG-2026-001',
    currency: 'EUR',
    iznos: null,
    pdvStopa: 0.20,
    naplataInterval: 'monthly',
    startDate: null,
    endDate: null,
    autoRenew: true,
    status: 'incomplete-intake',
    efakturaEnabled: false,
  },
  'AUTOKUCA-BG': {
    klijentId: 'AUTOKUCA-BG',
    invoiceNumber: 'INV-BG-2026-001',
    currency: 'EUR',
    iznos: null,
    pdvStopa: 0.20,
    naplataInterval: 'monthly',
    startDate: null,
    endDate: null,
    autoRenew: true,
    status: 'incomplete-intake',
    efakturaEnabled: false,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAutokucaSubscription(klijentId: AutokucaKlijentId): AutokucaSubscription {
  return { ...AUTOKUCA_SUBSCRIPTIONS[klijentId] };
}

export function getAutokucaKlijent(klijentId: AutokucaKlijentId): AutokucaKlijent {
  return { ...AUTOKUCA_KLIJENTI[klijentId] };
}

/** Provera da li su svi obavezni podaci popunjeni za aktivaciju */
export function isIntakeComplete(klijentId: AutokucaKlijentId): boolean {
  const k = AUTOKUCA_KLIJENTI[klijentId];
  const s = AUTOKUCA_SUBSCRIPTIONS[klijentId];
  return (
    k.pib !== null &&
    k.mb !== null &&
    k.ovlasceniPotpisnik !== null &&
    k.email !== null &&
    s.iznos !== null &&
    s.iznos > 0
  );
}

/** Provera da li je pretplata u aktivnom statusu */
export function isSubscriptionActive(klijentId: AutokucaKlijentId): boolean {
  return AUTOKUCA_SUBSCRIPTIONS[klijentId].status === 'active';
}

/**
 * Generiše pun račun (full invoice) za tekući billing ciklus.
 * Vraća null ako pretplata nije aktivna ili iznos nije definisan.
 */
export function generateFullInvoice(
  klijentId: AutokucaKlijentId,
  datumIzdavanja: string,
): AutokucaFullInvoice | null {
  const sub = AUTOKUCA_SUBSCRIPTIONS[klijentId];
  const klijent = AUTOKUCA_KLIJENTI[klijentId];

  if (sub.status !== 'active' || sub.iznos === null) return null;

  const pdvIznos = Math.round(sub.iznos * sub.pdvStopa * 100) / 100;
  const ukupnoSaPdv = Math.round((sub.iznos + pdvIznos) * 100) / 100;

  // Datum dospeća: 30 dana za mesečnu, 365 za godišnju naplatu
  const datumDospeca = computeDatumDospeca(datumIzdavanja, sub.naplataInterval);

  return {
    invoiceNumber: sub.invoiceNumber,
    klijentId,
    izdavalac: 'AI-IQ-SUPER-PLATFORMA / Kompanija SPAJA — Digitalna Industrija',
    primalac: klijent.pravnoIme,
    datumIzdavanja,
    datumDospeca,
    valuta: 'EUR',
    iznos: sub.iznos,
    pdvIznos,
    ukupnoSaPdv,
    pdvStopa: sub.pdvStopa,
    naplataInterval: sub.naplataInterval,
    status: sub.status,
    efakturaEnabled: sub.efakturaEnabled,
  };
}

function computeDatumDospeca(datumIzdavanja: string, interval: NaplataInterval): string {
  const d = new Date(datumIzdavanja);
  if (interval === 'monthly') {
    d.setMonth(d.getMonth() + 1);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Audit log zapis za billing ciklus.
 * U produkciji: prosleđuje se omega-audit middleware-u.
 */
export interface AutokucaAuditEntry {
  okrid: string;
  klijentId: AutokucaKlijentId;
  invoiceNumber: string;
  iznos: number | null;
  currency: 'EUR';
  cycleStart: string;
  cycleEnd: string;
  status: AutokucaSubscriptionStatus;
  timestamp: string;
}

export function buildAuditEntry(
  klijentId: AutokucaKlijentId,
  cycleStart: string,
  cycleEnd: string,
): AutokucaAuditEntry {
  const sub = AUTOKUCA_SUBSCRIPTIONS[klijentId];
  const klijent = AUTOKUCA_KLIJENTI[klijentId];
  return {
    okrid: klijent.okrid,
    klijentId,
    invoiceNumber: sub.invoiceNumber,
    iznos: sub.iznos,
    currency: 'EUR',
    cycleStart,
    cycleEnd,
    status: sub.status,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Vraća status svih autokuća subscription-a za API/admin pregled.
 */
export function getAllAutokucaSubscriptionStatuses() {
  return (['AUTOKUCA-KG', 'AUTOKUCA-BG'] as AutokucaKlijentId[]).map((id) => {
    const sub = AUTOKUCA_SUBSCRIPTIONS[id];
    const klijent = AUTOKUCA_KLIJENTI[id];
    return {
      klijentId: id,
      okrid: klijent.okrid,
      pravnoIme: klijent.pravnoIme,
      invoiceNumber: sub.invoiceNumber,
      currency: sub.currency,
      iznos: sub.iznos,
      pdvStopa: sub.pdvStopa,
      naplataInterval: sub.naplataInterval,
      endDate: sub.endDate,
      autoRenew: sub.autoRenew,
      status: sub.status,
      intakeComplete: isIntakeComplete(id),
      efakturaEnabled: sub.efakturaEnabled,
    };
  });
}
