// SpajaUltraOmegaCore -infOmega+inf Centralizovani Vercel KV Klijent
// Kompanija SPAJA Digitalna Industrija
//
// Pruza jedinstven interfejs za Vercel KV REST API sa graceful fallback-om
// na in-memory store kada KV nije dostupan (lokalni razvoj, CI).
//
// Podrzava oba formata kljuceva:
//   - VERCEL_KV_REST_API_URL / VERCEL_KV_REST_API_TOKEN
//   - KV_REST_API_URL / KV_REST_API_TOKEN
//
// Upotreba:
//   import { kvGet, kvSet, kvDel, isKvAvailable } from "@/lib/kv-client";
//   await kvSet("moj-kljuc", { data: 123 }, 300); // TTL 5 min
//   const val = await kvGet<{ data: number }>("moj-kljuc");

// In-memory fallback

interface MemEntry {
  value: string;
  expiresMs: number | null;
}

const memStore = new Map<string, MemEntry>();

function memExpire(key: string): void {
  const entry = memStore.get(key);
  if (entry && entry.expiresMs !== null && Date.now() > entry.expiresMs) {
    memStore.delete(key);
  }
}

// KV URL/Token resolver

function resolveKvCredentials(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ??
    process.env.VERCEL_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ??
    process.env.VERCEL_KV_REST_API_TOKEN;

  if (!url || !token) return null;
  return { url, token };
}

/** Gradi Authorization header vrednost. */
function authHeaderValue(token: string): string {
  return ["Bearer", token].join(" ");
}

// Javni API

/**
 * Da li je Vercel KV dostupan (env varijable su postavljene).
 */
export function isKvAvailable(): boolean {
  return resolveKvCredentials() !== null;
}

/**
 * Cita vrednost iz Vercel KV ili in-memory fallback-a.
 * Vraca null ako kljuc ne postoji ili je istekao.
 */
export async function kvGet<T>(key: string): Promise<T | null> {
  const creds = resolveKvCredentials();

  if (!creds) {
    memExpire(key);
    const entry = memStore.get(key);
    if (!entry) return null;
    try { return JSON.parse(entry.value) as T; } catch { return null; }
  }

  try {
    const resp = await fetch(`${creds.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: authHeaderValue(creds.token) },
      cache: "no-store",
    });
    if (!resp.ok) return null;
    const { result } = (await resp.json()) as { result: string | null };
    if (!result) return null;
    return JSON.parse(result) as T;
  } catch (err) {
    console.warn("[kv-client] kvGet fallback to memory", { key, err });
    memExpire(key);
    const entry = memStore.get(key);
    if (!entry) return null;
    try { return JSON.parse(entry.value) as T; } catch { return null; }
  }
}

/**
 * Upisuje vrednost u Vercel KV ili in-memory fallback.
 * @param key    - kljuc
 * @param value  - vrednost (bice JSON.stringify-ovana)
 * @param ttlSec - TTL u sekundama (opciono)
 */
export async function kvSet<T>(key: string, value: T, ttlSec?: number): Promise<void> {
  const serialized = JSON.stringify(value);
  const creds = resolveKvCredentials();

  if (!creds) {
    memStore.set(key, {
      value: serialized,
      expiresMs: ttlSec !== undefined ? Date.now() + ttlSec * 1000 : null,
    });
    return;
  }

  try {
    const body = ttlSec !== undefined
      ? { value: serialized, ex: ttlSec }
      : { value: serialized };

    await fetch(`${creds.url}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: authHeaderValue(creds.token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[kv-client] kvSet fallback to memory", { key, err });
    memStore.set(key, {
      value: serialized,
      expiresMs: ttlSec !== undefined ? Date.now() + ttlSec * 1000 : null,
    });
  }
}

/**
 * Brise kljuc iz Vercel KV ili in-memory fallback-a.
 */
export async function kvDel(key: string): Promise<void> {
  const creds = resolveKvCredentials();

  if (!creds) {
    memStore.delete(key);
    return;
  }

  try {
    await fetch(`${creds.url}/del/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: authHeaderValue(creds.token) },
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[kv-client] kvDel fallback to memory", { key, err });
    memStore.delete(key);
  }
}

/**
 * Inkrementise numericki counter u KV. Vraca novu vrednost.
 */
export async function kvIncr(key: string, ttlSec?: number): Promise<number> {
  const creds = resolveKvCredentials();

  if (!creds) {
    memExpire(key);
    const entry = memStore.get(key);
    const current = entry ? (parseInt(entry.value, 10) || 0) : 0;
    const next = current + 1;
    memStore.set(key, {
      value: String(next),
      expiresMs: ttlSec !== undefined ? Date.now() + ttlSec * 1000 : (entry?.expiresMs ?? null),
    });
    return next;
  }

  try {
    const incrResp = await fetch(`${creds.url}/incr/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: authHeaderValue(creds.token) },
      cache: "no-store",
    });
    if (!incrResp.ok) return 1;
    const { result: count } = (await incrResp.json()) as { result: number };

    if (count === 1 && ttlSec !== undefined) {
      void fetch(`${creds.url}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
        method: "POST",
        headers: { Authorization: authHeaderValue(creds.token) },
        cache: "no-store",
      });
    }
    return count;
  } catch (err) {
    console.warn("[kv-client] kvIncr fallback to memory", { key, err });
    return 1;
  }
}

/**
 * Proverava da li KV odgovara - pogodno za health check.
 * Vraca true ako je KV dostupan i responzivan.
 */
export async function kvPing(): Promise<boolean> {
  const creds = resolveKvCredentials();
  if (!creds) return false;

  try {
    const resp = await fetch(`${creds.url}/ping`, {
      headers: { Authorization: authHeaderValue(creds.token) },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return resp.ok;
  } catch {
    return false;
  }
}
