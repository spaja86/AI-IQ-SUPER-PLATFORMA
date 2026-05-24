/**
 * SPAJA Digitalni Brouvzer — Tab Menadžer Helpers
 *
 * Čisti helper modul za upravljanje tabovima.
 * Podržava multi-tab, tab grupe, hibernaciju, pin tabove i sinhronizaciju.
 */

/** Maksimalan broj aktivnih tabova pre automatske hibernacije */
export const TAB_MENADZER_MAX_AKTIVNIH = 20;

/** Maksimalan broj piniranih tabova */
export const TAB_MENADZER_MAX_PINIRANIH = 10;

/** Maksimalan broj tab grupa */
export const TAB_MENADZER_MAX_GRUPA = 8;

/** Label koji se prikazuje u UI za tab menadžer */
export const TAB_MENADZER_LABEL = '📑 Tab Menadžer';

/** Opis tab menadžer funkcionalnosti */
export const TAB_MENADZER_OPIS =
  'Tab Menadžer upravlja svim otvorenim tabovima — grupisanje, hibernacija neaktivnih tabova, ' +
  'piniranje važnih tabova i opciona sinhronizacija između uređaja.';

/**
 * Da li treba hibernirati tab na osnovu broja aktivnih tabova.
 * Tabovi koji prelaze limit automatski ulaze u hibernaciju (suspendovani su u memoriji).
 *
 * @param ukupnoAktivnih - Ukupan broj aktivnih tabova
 * @returns `true` ako treba pokrenuti hibernaciju
 */
export function trebaPokrenuthHibernaciju(ukupnoAktivnih: number): boolean {
  return ukupnoAktivnih > TAB_MENADZER_MAX_AKTIVNIH;
}

/**
 * Da li tab može biti piniran.
 * Broj piniranih tabova ne sme preći TAB_MENADZER_MAX_PINIRANIH.
 *
 * @param trenutnoPiniranih - Broj već piniranih tabova
 * @returns `true` ako je moguće pinirati još jedan tab
 */
export function mozePinirati(trenutnoPiniranih: number): boolean {
  return trenutnoPiniranih < TAB_MENADZER_MAX_PINIRANIH;
}

/**
 * Da li je moguće kreirati novu tab grupu.
 *
 * @param trenutnoGrupa - Broj već kreiranih tab grupa
 * @returns `true` ako je kreiranje nove grupe dozvoljeno
 */
export function mozeKreiratiGrupu(trenutnoGrupa: number): boolean {
  return trenutnoGrupa < TAB_MENADZER_MAX_GRUPA;
}

/**
 * Vraća Tailwind CSS klase za tab item u zavisnosti od stanja (aktivan/hiberniran/piniran).
 *
 * @param stanje - 'aktivan' | 'hiberniran' | 'piniran'
 * @returns Tailwind CSS klase kao string
 */
export function getTabItemClass(stanje: 'aktivan' | 'hiberniran' | 'piniran'): string {
  switch (stanje) {
    case 'aktivan':
      return 'rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-700 text-white border border-gray-600';
    case 'hiberniran':
      return 'rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-900 text-gray-500 border border-gray-800 opacity-60';
    case 'piniran':
      return 'rounded-lg px-3 py-1.5 text-sm font-medium bg-blue-900/30 text-blue-300 border border-blue-700/40';
  }
}
