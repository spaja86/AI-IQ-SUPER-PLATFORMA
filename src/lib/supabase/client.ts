// SpajaUltraOmegaCore -∞Ω+∞ — Supabase Browser Client
// Kompanija SPAJA — Digitalna Industrija
// Singleton klijent za browser okruzenje

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase kredencijali nisu postavljeni. Postavite NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY u .env.local',
    );
  }

  _client = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}
