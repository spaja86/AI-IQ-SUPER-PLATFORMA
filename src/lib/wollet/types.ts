import type { WorldBankCurrency, WorldBankTransactionStatus } from '@/lib/wallet/types';

export type { WorldBankCurrency, WorldBankTransactionStatus };

export interface WolletAccount {
  brojRacuna: string;
  naziv: string;
  valuta: WorldBankCurrency;
  /** Stanje u najmanjoj jedinici (para za RSD, centi za EUR/USD) */
  stanjeMinor: number;
  aktivan: boolean;
}

export interface WolletTransaction {
  id: number;
  naziv: string;
  opis: string;
  /** Iznos u najmanjoj jedinici */
  iznosMinor: number;
  valuta: WorldBankCurrency;
  izvor: string;
  destinacija: string;
  status: WorldBankTransactionStatus;
  /** Unix timestamp (seconds) */
  datumBlok: number;
  inicijator: string;
  /** Polygonscan deep-link (ako je poznat hash) */
  polygonscanUrl?: string;
}

export interface WolletBalance {
  rsd: number;   // RSD u dinarima (pune jedinice)
  eur: number;   // EUR (2 decimale)
  usd: number;   // USD (2 decimale)
  ukupnoUsd: number;
}

export interface WolletTransferRequest {
  izvor: string;
  destinacija: string;
  iznos: number;
  valuta: WorldBankCurrency;
  opis: string;
}

export interface WolletAuditEntry {
  id: string;
  transakcijId: number;
  akcija: 'deposit' | 'transfer' | 'write' | 'read';
  akcijaMeta: string;
  vreme: Date;
  inicijator: string;
  blockchainHash?: string;
  polygonscanUrl?: string;
}
