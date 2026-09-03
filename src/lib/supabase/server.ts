// SpajaUltraOmegaCore -∞Ω+∞ — Supabase Server Client
// Kompanija SPAJA — Digitalna Industrija
// Server-side klijent za API rute i Server Components

import { getPooledSupabaseServerClient, getSupabaseServerPoolSnapshot, resetSupabasePoolState } from './pool';

/**
 * Kreira ili ponovo koristi imenovani Supabase klijent iz laganog in-memory pool-a.
 * Koristi se u API rutama i Server Components-ima.
 */
export function getSupabaseServerClient(poolName = 'default') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase server kredencijali nisu postavljeni. Postavite NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return getPooledSupabaseServerClient(poolName, url, serviceKey);
}

/**
 * Graceful varijanta za read-only i javne dijagnostike.
 * Kritične API mutacije i auth tokovi i dalje treba da koriste strict varijantu.
 */
export function getSupabaseServerClientSafe(poolName = 'default') {
  try {
    return getSupabaseServerClient(poolName);
  } catch {
    return null;
  }
}

export function getSupabaseBaseServerClient() {
  return getSupabaseServerClient('base');
}

export function getSupabaseBaseServerClientSafe() {
  return getSupabaseServerClientSafe('base');
}

export function getSupabaseServerPoolHealth(poolName = 'default') {
  return getSupabaseServerPoolSnapshot(poolName, {
    urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}

export function getSupabaseBasePoolSnapshot() {
  return getSupabaseServerPoolHealth('base');
}

export function resetSupabaseServerPoolState(poolName?: string): void {
  resetSupabasePoolState(poolName);
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
      // Koristi se za API rute koje očekuju user.id i user.email
      return {
        id: identity.id,
        email: identity.email ?? '',
        aud: 'authenticated' as const,
        role: 'authenticated' as const,
        app_metadata: {} as Record<string, unknown>,
        user_metadata: {
          roles: identity.roles,
          clearanceLevel: identity.clearanceLevel,
          did: identity.did,
        } as Record<string, unknown>,
        created_at: new Date(identity.createdAt).toISOString(),
      };
    }
  } catch {
    // Omega Auth verifikacija neuspešna
  }

  return null;
}
