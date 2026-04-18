'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Omega Auth Provider Wrapper
// Kompanija SPAJA — Digitalna Industrija
// Automatski osvežava token pre isteka — sprečava neočekivano odjavljivanje

import { useEffect } from 'react';
import { trebaOsveziti, osveziToken, dohvatiSesiju } from '@/lib/auth/omega-session-client';

// Proveravaj svakih 60 sekundi da li treba osvežiti token
const CHECK_INTERVAL_MS = 60 * 1000;

export default function OmegaAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Početna provera pri mount-u
    async function initialCheck() {
      if (trebaOsveziti()) {
        await osveziToken();
      }
    }
    initialCheck();

    // Periodična provera
    const interval = setInterval(async () => {
      const sesija = dohvatiSesiju();
      if (!sesija) return; // Nema sesije — ne radi ništa

      if (trebaOsveziti()) {
        const success = await osveziToken();
        if (!success) {
          // Refresh nije uspeo — ne radi ništa, korisnik će biti preusmereno kad pristupi zaštićenoj stranici
          console.warn('[OMEGA-AUTH] Auto-refresh neuspešan — sesija je istekla');
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
