/**
 * Digitalna Industrija — Načini Plaćanja
 *
 * Kanonski izvor načina plaćanja za celu Digitalnu Industriju (Kompanija SPAJA).
 * Svi wallet, billing i payment moduli MORAJU da koriste ovaj modul kao jedini
 * izvor istine za region/valuta/kartična-šema/procesor matricu.
 *
 * Tok: Digitalna Industrija → payment-orchestration → wallet → billing
 */

import type { WalletCoverageEntry, WalletRegion, WalletCardNetwork } from './wallet/types';
import { APP_VERSION } from './constants';

export interface NacinPlacanjaMeta {
  izvor: 'digitalna-industrija';
  entitet: 'Digitalna Industrija — Kompanija SPAJA';
  verzija: string;
  timestamp: string;
  aktivniProcesori: string[];
}

export interface DigitalnaIndustrijaNacinPlacanjaPregled {
  meta: NacinPlacanjaMeta;
  matrix: WalletCoverageEntry[];
  ukupnoRegiona: number;
  ukupnoValuta: number;
  ukupnoKarticihnSema: number;
}

/** Kanonska matrica načina plaćanja po regionu. */
const DIGITALNA_INDUSTRIJA_PAYMENT_MATRIX: WalletCoverageEntry[] = [
  {
    region: 'RS' as WalletRegion,
    currencies: ['RSD', 'EUR', 'USD'],
    cardNetworks: ['visa', 'mastercard', 'amex'] as WalletCardNetwork[],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'EU' as WalletRegion,
    currencies: ['EUR', 'USD', 'GBP'],
    cardNetworks: ['visa', 'mastercard', 'amex', 'jcb'] as WalletCardNetwork[],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'US' as WalletRegion,
    currencies: ['USD'],
    cardNetworks: ['visa', 'mastercard', 'amex', 'discover'] as WalletCardNetwork[],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
  {
    region: 'GLOBAL' as WalletRegion,
    currencies: ['USD', 'EUR'],
    cardNetworks: ['visa', 'mastercard'] as WalletCardNetwork[],
    processors: ['stripe'],
    fallbackProcessors: ['paypal'],
  },
];

/**
 * Validira jednu WalletCoverageEntry stavku.
 * Vraća niz greška; prazan niz = validno.
 */
export function validirajNacinPlacanja(entry: WalletCoverageEntry): string[] {
  const greske: string[] = [];

  if (!entry.region || typeof entry.region !== 'string') {
    greske.push('Nedostaje ili neispravan region.');
  }
  if (!Array.isArray(entry.currencies) || entry.currencies.length === 0) {
    greske.push(`Region ${entry.region}: currencies moraju biti neprazan niz.`);
  }
  if (!Array.isArray(entry.cardNetworks) || entry.cardNetworks.length === 0) {
    greske.push(`Region ${entry.region}: cardNetworks moraju biti neprazan niz.`);
  }
  if (!Array.isArray(entry.processors) || entry.processors.length === 0) {
    greske.push(`Region ${entry.region}: processors moraju biti neprazan niz.`);
  }
  if (!Array.isArray(entry.fallbackProcessors) || entry.fallbackProcessors.length === 0) {
    greske.push(`Region ${entry.region}: fallbackProcessors moraju biti neprazan niz.`);
  }

  return greske;
}

/**
 * Vraća kanonsku matricu načina plaćanja Digitalne Industrije.
 * Filtrira sve nevalidne stavke i prijavljuje greške u konzolu.
 */
export function getDigitalnaIndustrijaMatrix(): WalletCoverageEntry[] {
  const validne: WalletCoverageEntry[] = [];

  for (const entry of DIGITALNA_INDUSTRIJA_PAYMENT_MATRIX) {
    const greske = validirajNacinPlacanja(entry);
    if (greske.length === 0) {
      validne.push(entry);
    } else {
      console.error(`[digitalna-industrija-nacini-placanja] Nevalidna stavka:`, greske);
    }
  }

  if (validne.length === 0) {
    console.error('[digitalna-industrija-nacini-placanja] Kanonska matrica je prazna — aktiviran hardkodovani fallback.');
    return DIGITALNA_INDUSTRIJA_PAYMENT_MATRIX;
  }

  return validne;
}

/**
 * Vraća kompletan pregled načina plaćanja sa metapodacima.
 * Koristi se u API odgovorima koji izlažu payment konfiguraciju.
 */
export function getDigitalnaIndustrijaNacinPlacanjaPregled(): DigitalnaIndustrijaNacinPlacanjaPregled {
  const matrix = getDigitalnaIndustrijaMatrix();

  const sveValute = new Set<string>();
  const sveKarticneSheme = new Set<string>();
  const aktivniProcesori = new Set<string>();

  for (const entry of matrix) {
    entry.currencies.forEach((c) => sveValute.add(c));
    entry.cardNetworks.forEach((n) => sveKarticneSheme.add(n));
    entry.processors.forEach((p) => aktivniProcesori.add(p));
    entry.fallbackProcessors.forEach((p) => aktivniProcesori.add(p));
  }

  return {
    meta: {
      izvor: 'digitalna-industrija',
      entitet: 'Digitalna Industrija — Kompanija SPAJA',
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
      aktivniProcesori: Array.from(aktivniProcesori),
    },
    matrix,
    ukupnoRegiona: matrix.length,
    ukupnoValuta: sveValute.size,
    ukupnoKarticihnSema: sveKarticneSheme.size,
  };
}
