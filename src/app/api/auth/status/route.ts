// SpajaUltraOmegaCore -∞Ω+∞ — Auth Status API Route
// Kompanija SPAJA — Digitalna Industrija
// GET /api/auth/status — status login sistema

import { NextResponse } from 'next/server';
import { getGlobalVault } from '@/lib/auth/omega-identity';
import { APP_VERSION } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  const vault = getGlobalVault();
  const registrovaniKorisnici = vault.listIds().length;

  // Proveri da li demo nalog postoji
  let demoPostoji = false;
  for (const id of vault.listIds()) {
    const identity = vault.retrieveIdentity(id);
    if (identity?.email === 'demo@spaja.ai') {
      demoPostoji = true;
      break;
    }
  }

  return NextResponse.json({
    status: 'aktivan',
    verzija: APP_VERSION,
    sistem: {
      tip: 'Zero Trust + In-Memory Vault',
      enkripcija: 'AES-256-GCM',
      hashLozinke: 'PBKDF2-SHA512 (310.000 iteracija)',
      tokenFormat: 'JWT (HS256)',
      bruteForceZastita: 'Max 5 pokusaja / 15 min po IP',
      csrfZastita: 'Double Submit Cookie',
      mfaPodrska: 'TOTP (RFC 6238)',
    },
    registrovaniKorisnici,
    demoNalog: {
      postoji: demoPostoji,
      email: 'demo@spaja.ai',
      napomena: 'Demo nalog se automatski kreira pri pokretanju servera',
    },
    napomena: 'In-memory vault — nalozi se resetuju pri restartu servera. Demo nalog se automatski ponovo kreira.',
  });
}
