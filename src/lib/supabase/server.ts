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
 */
export async function verifyUserFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabase = getSupabaseServerClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  return user;
}
