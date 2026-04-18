// SpajaUltraOmegaCore -∞Ω+∞ — Omega Session Client
// Kompanija SPAJA — Digitalna Industrija
// Klijentski modul za upravljanje Omega Auth sesijama u browseru.
// Ovo je primarni auth mehanizam — radi bez eksternih servisa.

const STORAGE_KEY = 'omega-session';

// Vreme pre isteka tokena kada treba pokrenuti refresh (5 minuta pre isteka)
const REFRESH_THRESHOLD_SECONDS = 5 * 60;

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
    localStorage.removeItem('omega-pristup');
    localStorage.removeItem('omega-industrija-pristup');
    localStorage.removeItem('omega-gaming-pristup');
  } catch {
    // ignore
  }
}

/** Proverava da li je korisnik ulogovan. */
export function jeUlogovan(): boolean {
  return dohvatiSesiju() !== null;
}

/** Proverava da li je token blizu isteka i treba da se osveži. */
export function trebaOsveziti(): boolean {
  const sesija = dohvatiSesiju();
  if (!sesija || !sesija.expiresAt) return false;
  const nowSeconds = Date.now() / 1000;
  return sesija.expiresAt - nowSeconds < REFRESH_THRESHOLD_SECONDS;
}

// Sprečava višestruke istovremene refresh pozive
let refreshInProgress: Promise<boolean> | null = null;

/**
 * Automatski osvežava access token koristeći refresh token iz httpOnly kolačića.
 * Poziva /api/auth/refresh endpoint i ažurira localStorage sesiju.
 * Vraća true ako je uspešno, false ako nije (korisnik mora ponovo da se prijavi).
 */
export async function osveziToken(): Promise<boolean> {
  if (refreshInProgress) return refreshInProgress;

  refreshInProgress = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Šalje httpOnly kolačiće
      });

      if (!res.ok) {
        // Refresh token je istekao — korisnik mora ponovo da se prijavi
        obrisiSesiju();
        return false;
      }

      const data = await res.json();
      const sesija = dohvatiSesiju();
      if (sesija && data.token?.value) {
        sacuvajSesiju({
          ...sesija,
          token: data.token.value,
          expiresAt: data.expiresAt ?? data.token.expiresAt,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshInProgress = null;
    }
  })();

  return refreshInProgress;
}
