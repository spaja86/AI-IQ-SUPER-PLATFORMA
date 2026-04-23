// SpajaUltraOmegaCore -∞Ω+∞ — Globalni Rate Limiter
// Kompanija SPAJA — Digitalna Industrija
//
// Arhitektura:
//   1. Pokuša Vercel KV (cross-instance, produkcijski) ako je VERCEL_KV_REST_API_URL postavljen
//   2. Pada na in-memory store za lokalni razvoj / ako KV nije konfigurisano
//
// Oba back-end-a implementuju isti interfejs RateLimitStore, pa je zamena transparentna.
//
// Upotreba:
//   const allowed = await checkRateLimitGlobal('user:123', 100, 60);
//   if (!allowed) return apiRateLimited(60);

// ─── Store interfejs ──────────────────────────────────────────────────────────

interface RateLimitStore {
  /** Inkrementiraj counter za dati ključ. Vraća {count, ttl}. */
  increment(key: string, windowSec: number): Promise<{ count: number; ttl: number }>;
}

// ─── In-memory store ──────────────────────────────────────────────────────────
// Fallback za dev i serverless okruženja bez KV-a.
// Napomena: ne deli stanje između Edge/Node instanci.

interface MemoryEntry {
  count: number;
  resetAt: number; // ms timestamp
}

const memStore = new Map<string, MemoryEntry>();

const inMemoryStore: RateLimitStore = {
  async increment(key, windowSec) {
    const now = Date.now();
    const resetAt = now + windowSec * 1000;
    const existing = memStore.get(key);

    if (!existing || now >= existing.resetAt) {
      memStore.set(key, { count: 1, resetAt });
      return { count: 1, ttl: windowSec };
    }

    existing.count++;
    memStore.set(key, existing);
    const ttl = Math.ceil((existing.resetAt - now) / 1000);
    return { count: existing.count, ttl };
  },
};

// ─── Vercel KV store ──────────────────────────────────────────────────────────
// Koristi Vercel KV REST API direktno (bez npm paketa) kako bi radio i u
// Edge Runtime-u.

let _kvStore: RateLimitStore | null = null;

function getKVStore(): RateLimitStore | null {
  if (_kvStore) return _kvStore;

  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) return null;

  _kvStore = {
    async increment(key, windowSec) {
      try {
        // INCR — atomski increment
        const incrResp = await fetch(`${kvUrl}/incr/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${kvToken}` },
        });

        if (!incrResp.ok) return inMemoryStore.increment(key, windowSec);
        const { result: count } = (await incrResp.json()) as { result: number };

        // Postavi TTL samo pri prvom pozivu (count === 1)
        if (count === 1) {
          await fetch(`${kvUrl}/expire/${encodeURIComponent(key)}/${windowSec}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${kvToken}` },
          });
        }

        // Dohvati TTL
        const ttlResp = await fetch(`${kvUrl}/ttl/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        const ttlData = ttlResp.ok
          ? ((await ttlResp.json()) as { result: number })
          : { result: windowSec };
        const ttl = Math.max(ttlData.result, 1);

        return { count, ttl };
      } catch {
        // Fallback na in-memory pri KV grešci
        return inMemoryStore.increment(key, windowSec);
      }
    },
  };

  return _kvStore;
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Proverava globalni rate limit za dati ključ.
 *
 * @param key - identifikator (npr. `ip:1.2.3.4` ili `user:uuid`)
 * @param limit - maksimalni broj zahteva u prozoru
 * @param windowSec - dužina prozora u sekundama (podrazumevano 60)
 * @returns `true` ako je zahtev dozvoljen, `false` ako je limit premašen
 */
export async function checkRateLimitGlobal(
  key: string,
  limit: number,
  windowSec = 60,
): Promise<boolean> {
  const store = getKVStore() ?? inMemoryStore;
  const { count } = await store.increment(key, windowSec);
  return count <= limit;
}

/**
 * Kombinovani ključ za IP + endpoint rate limiting.
 * Grupiše sve zahteve sa iste IP adrese po endpoint prefiksu.
 *
 * @example
 * rateLimitKey('1.2.3.4', '/api/auth/login') => 'rl:api:auth:login:1.2.3.4'
 */
export function rateLimitKey(ip: string, endpoint: string): string {
  // Normalizuj endpoint na 2 segmenta da bi se srodne rute grupisale
  const normalized = endpoint
    .replace(/^\//, '')
    .split('/')
    .slice(0, 3)
    .join(':');
  return `rl:${normalized}:${ip}`;
}

/**
 * Proverava da li je KV store konfigurisan (produkcija).
 * Korisno za health check endpoint-e.
 */
export function isKVConfigured(): boolean {
  return !!(process.env.VERCEL_KV_REST_API_URL && process.env.VERCEL_KV_REST_API_TOKEN);
}
