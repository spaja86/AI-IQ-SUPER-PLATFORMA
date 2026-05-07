// SpajaUltraOmegaCore -∞Ω+∞ — Idempotency Key Management
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 2 (P0/P1): API standardizacija i idempotency/retry obrasci.
//
// Implementira:
//   • Idempotency key ekstrakcija iz HTTP headera (Idempotency-Key)
//   • In-memory + Vercel KV cache za dedupliciranje zahteva
//   • TTL-based expiry (podrazumevano 24h)
//   • Sigurna validacija formata ključeva
//
// Upotreba:
//   const result = await withIdempotency(key, async () => {
//     return executeCheckout(userId, plan);
//   });

import { randomUUID } from 'crypto';

// ─── Konstante ────────────────────────────────────────────────────────────────

/** Naziv headera za idempotency ključ. */
export const IDEMPOTENCY_HEADER = 'Idempotency-Key';

/** Podrazumevani TTL za keširane odgovore (24 sata u sekundama). */
export const IDEMPOTENCY_TTL_SEC = 86_400;

/** Maksimalna dužina idempotency ključa. */
export const IDEMPOTENCY_KEY_MAX_LEN = 255;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface IdempotencyRecord<T = unknown> {
  key: string;
  result: T;
  statusCode: number;
  createdAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp
}

export interface IdempotencyOptions {
  /** TTL u sekundama. Podrazumevano: IDEMPOTENCY_TTL_SEC (24h). */
  ttlSec?: number;
  /** Prefiks namespace-a za ključ u store-u. */
  namespace?: string;
}

// ─── In-memory store ──────────────────────────────────────────────────────────

interface MemEntry<T> {
  record: IdempotencyRecord<T>;
  expiresMs: number;
}

const memStore = new Map<string, MemEntry<unknown>>();

function memGet<T>(storeKey: string): IdempotencyRecord<T> | null {
  const entry = memStore.get(storeKey) as MemEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresMs) {
    memStore.delete(storeKey);
    return null;
  }
  return entry.record;
}

function memSet<T>(storeKey: string, record: IdempotencyRecord<T>, ttlSec: number): void {
  memStore.set(storeKey, {
    record: record as IdempotencyRecord<unknown>,
    expiresMs: Date.now() + ttlSec * 1000,
  });
}

// ─── Validacija ───────────────────────────────────────────────────────────────

/**
 * Validira format idempotency ključa.
 * Dozvoljeni znakovi: alfanumerički, crtica, podvlaka, tačka, dvotačka.
 * Maksimalna dužina: 255 znakova.
 */
export function validateIdempotencyKey(key: string): { valid: boolean; reason?: string } {
  if (!key || key.trim() === '') {
    return { valid: false, reason: 'Idempotency ključ ne sme biti prazan.' };
  }
  if (key.length > IDEMPOTENCY_KEY_MAX_LEN) {
    return { valid: false, reason: `Idempotency ključ ne sme biti duži od ${IDEMPOTENCY_KEY_MAX_LEN} znakova.` };
  }
  if (!/^[a-zA-Z0-9\-_.:/]+$/.test(key)) {
    return { valid: false, reason: 'Idempotency ključ sadrži nedozvoljene znakove.' };
  }
  return { valid: true };
}

/**
 * Generiše novi UUID v4 idempotency ključ.
 */
export function generateIdempotencyKey(): string {
  return randomUUID();
}

/**
 * Dohvata idempotency ključ iz HTTP headera zahteva.
 * Vraća `null` ako header nije prisutan.
 */
export function extractIdempotencyKey(
  headers: { get: (h: string) => string | null } | Record<string, string | undefined>,
): string | null {
  const get =
    typeof (headers as { get?: unknown }).get === 'function'
      ? (h: string) => (headers as { get: (h: string) => string | null }).get(h)
      : (h: string) => (headers as Record<string, string | undefined>)[h] ?? null;

  return get(IDEMPOTENCY_HEADER) ?? get(IDEMPOTENCY_HEADER.toLowerCase()) ?? null;
}

// ─── Główny mehanizam ─────────────────────────────────────────────────────────

/**
 * Izvršava operaciju sa idempotency zaštitom.
 *
 * Ako ključ već postoji u store-u (unutar TTL-a), vraća keširani rezultat.
 * Inače, izvršava `fn` i kešira rezultat.
 *
 * @param key       - Idempotency ključ
 * @param fn        - Funkcija koja se izvršava (npr. Stripe checkout)
 * @param opts      - Opcije (ttl, namespace)
 * @returns         - { result, fromCache }
 */
export async function withIdempotency<T>(
  key: string,
  fn: () => Promise<{ result: T; statusCode: number }>,
  opts: IdempotencyOptions = {},
): Promise<{ result: T; statusCode: number; fromCache: boolean }> {
  const ttlSec = opts.ttlSec ?? IDEMPOTENCY_TTL_SEC;
  const ns = opts.namespace ?? 'idem';
  const storeKey = `${ns}:${key}`;

  // 1. Pokušaj KV lookup
  const cached = await kvGet<T>(storeKey) ?? memGet<T>(storeKey);
  if (cached) {
    return { result: cached.result, statusCode: cached.statusCode, fromCache: true };
  }

  // 2. Izvrši operaciju
  const { result, statusCode } = await fn();

  // 3. Kešira uspešan rezultat
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlSec * 1000).toISOString();
  const record: IdempotencyRecord<T> = { key, result, statusCode, createdAt: now, expiresAt };

  await kvSet(storeKey, record, ttlSec);
  memSet(storeKey, record, ttlSec);

  return { result, statusCode, fromCache: false };
}

// ─── Vercel KV integracija ────────────────────────────────────────────────────

async function kvGet<T>(key: string): Promise<IdempotencyRecord<T> | null> {
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    const resp = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    if (!resp.ok) return null;
    const { result } = (await resp.json()) as { result: string | null };
    if (!result) return null;
    return JSON.parse(result) as IdempotencyRecord<T>;
  } catch {
    return null;
  }
}

async function kvSet<T>(key: string, record: IdempotencyRecord<T>, ttlSec: number): Promise<void> {
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return;

  try {
    await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: JSON.stringify(record), ex: ttlSec }),
    });
  } catch {
    // Fallback na in-memory — ne bacaj grešku
  }
}

/**
 * Briše idempotency zapis (npr. pri rollback-u).
 */
export async function deleteIdempotencyRecord(key: string, namespace = 'idem'): Promise<void> {
  const storeKey = `${namespace}:${key}`;
  memStore.delete(storeKey);

  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return;

  try {
    await fetch(`${kvUrl}/del/${encodeURIComponent(storeKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}` },
    });
  } catch {
    // silent
  }
}
