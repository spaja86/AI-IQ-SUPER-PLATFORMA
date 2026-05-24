/**
 * SPAJA Digitalni Brouvzer — Inkognito Mode Helpers
 *
 * Čisti helper modul za inkognito mod.
 * Inkognito mod onemogućava čuvanje istorije i bookmarkova u localStorage.
 * Autentifikacija (auth) ostaje aktivna — inkognito ≠ odjava.
 * Sandbox politika iframes-a ostaje nepromenjena.
 */

/** Label koji se prikazuje u UI za inkognito mod */
export const INKOGNITO_LABEL = '🕵️ Inkognito';

/** Opis inkognito moda koji se prikazuje korisniku */
export const INKOGNITO_OPIS =
  'Inkognito mod aktivan: istorija pregledanja i bookmarkovi se NE čuvaju za vreme ove sesije. ' +
  'Navigacija po tabovima, autentifikacija i sandbox politika ostaju nepromenjeni.';

/**
 * Da li treba pisati u localStorage (istorija, bookmarkovi).
 * U inkognito modu, localStorage upisi su zabranjeni — samo in-memory operacije.
 *
 * @param isInkognito - Da li je inkognito mod aktivan
 * @returns `true` ako je čuvanje dozvoljeno, `false` u inkognito modu
 */
export function shouldWriteToStorage(isInkognito: boolean): boolean {
  return !isInkognito;
}

/**
 * Da li prikazivati sačuvane podatke (istorija/bookmarkovi) korisniku.
 * U inkognito modu, prikaz sačuvanih podataka je onemogućen.
 *
 * @param isInkognito - Da li je inkognito mod aktivan
 * @returns `true` ako je prikaz dozvoljen, `false` u inkognito modu
 */
export function shouldShowStoredData(isInkognito: boolean): boolean {
  return !isInkognito;
}

/**
 * Vraća Tailwind CSS klase za inkognito dugme u toolbar-u.
 * Aktivan inkognito dugme je naglašen ljubičastom bojom.
 *
 * @param isInkognito - Da li je inkognito mod aktivan
 * @returns Tailwind CSS klase kao string
 */
export function getInkognitoButtonClass(isInkognito: boolean): string {
  return isInkognito
    ? 'rounded-lg p-1.5 transition bg-purple-900/30 text-purple-400 hover:bg-purple-800/40'
    : 'rounded-lg p-1.5 transition text-gray-400 hover:bg-gray-800 hover:text-white';
}
