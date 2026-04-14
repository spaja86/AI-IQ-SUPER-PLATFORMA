// SpajaUltraOmegaCore -∞Ω+∞ — Omega Session Client
// Kompanija SPAJA — Digitalna Industrija
// Klijentski modul za upravljanje Omega Auth sesijama u browseru.
// Ovo je primarni auth mehanizam — radi bez eksternih servisa.

const STORAGE_KEY = 'omega-session';

export interface OmegaSesija {
  token: string;
  email: string;
  plan: string;
  uloga: string;
  identityId: string;
  did: string;
  roles: string[];
  clearanceLevel: number;
  expiresAt: number;
}

/** Cuva sesiju u localStorage. */
export function sacuvajSesiju(sesija: OmegaSesija): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesija));
  } catch {
    // localStorage nedostupan — sesija ostaje samo u memoriji
  }
}

/** Dohvata aktivnu sesiju. Vraća null ako nema ili je istekla. */
export function dohvatiSesiju(): OmegaSesija | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const sesija = JSON.parse(raw) as OmegaSesija;
    // Proveri da li je token istekao
    if (sesija.expiresAt && Date.now() / 1000 > sesija.expiresAt) {
      obrisiSesiju();
      return null;
    }
    return sesija;
  } catch {
    return null;
  }
}

/** Brise sesiju iz localStorage. */
export function obrisiSesiju(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Proverava da li je korisnik ulogovan. */
export function jeUlogovan(): boolean {
  return dohvatiSesiju() !== null;
}
