// SpajaUltraOmegaCore -∞Ω+∞ — Ledger (Double-Entry Accounting)
// Kompanija SPAJA — Digitalna Industrija
//
// Pravila double-entry:
//   - Svaka transakcija ima tačno jedan credit i jedan debit (ili N parova).
//   - `balanceAfter` se uvek beleži u trenutku kreiranja unosa.
//   - Nijedan unos se ne briše — sve je append-only.
//   - Idempotency key sprečava duple unose.

import type { LedgerEntry, LedgerEntryType, LedgerDirection } from './types';

// ─── Validacija ───────────────────────────────────────────────────────────────

export function validateLedgerAmount(amount: number): { valid: boolean; reason?: string } {
  if (!Number.isFinite(amount)) {
    return { valid: false, reason: 'Iznos mora biti konačan broj.' };
  }
  if (amount <= 0) {
    return { valid: false, reason: 'Iznos mora biti pozitivan.' };
  }
  if (amount > 1e24) {
    return { valid: false, reason: 'Iznos premašuje maksimalnu granicu.' };
  }
  return { valid: true };
}

/**
 * Provjera da li bi debit operacija rezultirala negativnim stanjem.
 */
export function canDebit(currentBalance: number, amount: number): boolean {
  return currentBalance >= amount;
}

/**
 * Vraca novo stanje posle credit/debit operacije.
 * Baca grešku ako bi debit rezultirao negativnim saldom.
 */
export function applyLedgerEntry(
  currentBalance: number,
  direction: LedgerDirection,
  amount: number,
): number {
  if (direction === 'credit') {
    return roundLedger(currentBalance + amount);
  }
  if (currentBalance < amount) {
    throw new Error(
      `Nedovoljno sredstava: raspoloživo=${currentBalance}, zahtevano=${amount}`,
    );
  }
  return roundLedger(currentBalance - amount);
}

/** Zaokruži na 8 decimalnih mesta (max precisnosti). */
export function roundLedger(value: number): number {
  return Math.round(value * 1e8) / 1e8;
}

// ─── Double-entry provjera ────────────────────────────────────────────────────

export interface DoubleEntryPair {
  debitEntry: Pick<LedgerEntry, 'direction' | 'amount' | 'entryType'>;
  creditEntry: Pick<LedgerEntry, 'direction' | 'amount' | 'entryType'>;
}

/**
 * Provjera konzistentnosti para double-entry unosa.
 * U intra-asset transakcijama iznosi moraju biti jednaki.
 */
export function validateDoubleEntry(pair: DoubleEntryPair): { valid: boolean; reason?: string } {
  if (pair.debitEntry.direction !== 'debit') {
    return { valid: false, reason: 'Prva stavka para mora biti debit.' };
  }
  if (pair.creditEntry.direction !== 'credit') {
    return { valid: false, reason: 'Druga stavka para mora biti credit.' };
  }
  const diff = Math.abs(pair.debitEntry.amount - pair.creditEntry.amount);
  if (diff > 1e-8) {
    return {
      valid: false,
      reason: `Debit=${pair.debitEntry.amount} i credit=${pair.creditEntry.amount} se ne podudaraju.`,
    };
  }
  return { valid: true };
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export interface BuildLedgerEntryInput {
  accountId: string;
  userId: string;
  assetId: string;
  entryType: LedgerEntryType;
  direction: LedgerDirection;
  amount: number;
  currentBalance: number;
  referenceId?: string;
  referenceType?: string;
  idempotencyKey?: string;
  description?: string;
}

/**
 * Gradi LedgerEntry objekat bez ID-a i createdAt (dodaje DB).
 * Validira iznos i stanje pre buildovanja.
 */
export function buildLedgerEntry(input: BuildLedgerEntryInput): Omit<LedgerEntry, 'id' | 'createdAt'> {
  const { valid, reason } = validateLedgerAmount(input.amount);
  if (!valid) throw new Error(`Neispravni iznos: ${reason}`);

  const balanceAfter = applyLedgerEntry(input.currentBalance, input.direction, input.amount);

  return {
    accountId: input.accountId,
    userId: input.userId,
    assetId: input.assetId,
    entryType: input.entryType,
    amount: input.amount,
    direction: input.direction,
    balanceAfter,
    referenceId: input.referenceId,
    referenceType: input.referenceType,
    idempotencyKey: input.idempotencyKey,
    description: input.description,
  };
}

// ─── Provjera bilansa ─────────────────────────────────────────────────────────

/**
 * Provjera da li suma svih ledger unosa odgovara trenutnom stanju računa.
 * Koristi se za reconciliation i audit.
 */
export function reconcileLedger(
  entries: Pick<LedgerEntry, 'direction' | 'amount'>[],
): number {
  return entries.reduce((balance, entry) => {
    return entry.direction === 'credit'
      ? roundLedger(balance + entry.amount)
      : roundLedger(balance - entry.amount);
  }, 0);
}
