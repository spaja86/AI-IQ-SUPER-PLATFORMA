// SpajaUltraOmegaCore -∞Ω+∞ — Supabase Server Client
// Kompanija SPAJA — Digitalna Industrija
// Server-side klijent za API rute i Server Components

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Kreira Supabase klijent sa service role kljucem za server-side operacije.
 * Koristi se u API rutama i Server Components-ima.
 * Svaki poziv kreira novu instancu (ne koristi singleton jer je server-side).
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase server kredencijali nisu postavljeni. Postavite NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verifikuje JWT token iz Authorization headera i vraca korisnika.
 * Podržava DVA auth sistema:
 *   1. Supabase Auth — standardni Supabase JWT
 *   2. Omega Auth — interni JWT iz ΩAuthProvider
 * Ako Supabase verifikacija ne uspe, pokušava sa Omega Auth.
 */
export async function verifyUserFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  // 1. Pokušaj Supabase verifikaciju
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) return user;
  } catch {
    // Supabase nije dostupan ili token nije Supabase format — pokušaj Omega Auth
  }

  // 2. Pokušaj Omega Auth verifikaciju
  try {
    const { ΩAuthProvider } = await import('@/lib/auth/omega-auth');
    const identity = await ΩAuthProvider.verifyIdentity(token);
    if (identity) {
      // Vraćamo objekat kompatibilan sa Supabase User interfejsom
      return {
        id: identity.id,
        email: identity.email ?? '',
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {
          roles: identity.roles,
          clearanceLevel: identity.clearanceLevel,
          did: identity.did,
        },
        created_at: new Date(identity.createdAt).toISOString(),
      };
    }
  } catch {
    // Omega Auth verifikacija neuspešna
  }

  return null;
}
