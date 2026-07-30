import type { WolletAccount, WolletBalance, WorldBankCurrency } from './types';

const EUR_USD_RATE = 1.08;  // approximation for display
const RSD_USD_RATE = 0.0093; // approximation for display

/**
 * Konvertuje iznos iz najmanje jedinice u prikazni format.
 * RSD: para → dinari (/ 100)
 * EUR/USD: centi → (/ 100)
 */
export function minorToDisplay(minor: number, _valuta: WorldBankCurrency): number {
  return Math.round((minor / 100) * 100) / 100;
}

/**
 * Formatira iznos za prikaz sa simbolom valute.
 */
export function formatIznos(minor: number, valuta: WorldBankCurrency): string {
  const value = minorToDisplay(minor, valuta);
  if (valuta === 'RSD') return `${value.toLocaleString('sr-Latn')} din`;
  if (valuta === 'EUR') return `€${value.toFixed(2)}`;
  return `$${value.toFixed(2)}`;
}

/**
 * Konvertuje iznos u USD (za agregaciju).
 */
export function toUsd(minor: number, valuta: WorldBankCurrency): number {
  const display = minorToDisplay(minor, valuta);
  if (valuta === 'USD') return display;
  if (valuta === 'EUR') return Math.round(display * EUR_USD_RATE * 100) / 100;
  return Math.round(display * RSD_USD_RATE * 100) / 100;
}

/**
 * Agregira stanja svih računa u WolletBalance.
 */
export function agregirajStanje(racuni: WolletAccount[]): WolletBalance {
  let rsd = 0;
  let eur = 0;
  let usd = 0;

  for (const racun of racuni) {
    if (!racun.aktivan) continue;
    const display = minorToDisplay(racun.stanjeMinor, racun.valuta);
    if (racun.valuta === 'RSD') rsd += display;
    else if (racun.valuta === 'EUR') eur += display;
    else usd += display;
  }

  const ukupnoUsd =
    Math.round((usd + eur * EUR_USD_RATE + rsd * RSD_USD_RATE) * 100) / 100;

  return { rsd, eur, usd, ukupnoUsd };
}
