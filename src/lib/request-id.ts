// Autofinish #861 — Shared request ID utility
// Kompanija SPAJA — Digitalna Industrija
//
// Centralizovana logika za generisanje i propagaciju X-Request-Id headera.
// Koristi se u middleware.ts i logger.ts za konzistentno ponašanje.

const ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function secureRandomString(length: number): string {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('Secure random generator is not available.');
  }
  const bytes = new Uint8Array(length);
  cryptoApi.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ID_CHARS[byte % ID_CHARS.length]).join('');
}

export function createSecureId(prefix: string, suffixLength = 8): string {
  return `${prefix}-${Date.now()}-${secureRandomString(suffixLength)}`;
}

/**
 * Generiše ili propagira request ID.
 *
 * Prioritet:
 *   1. x-request-id ulazni header
 *   2. x-correlation-id ulazni header
 *   3. Generiše pun UUID (v4) sa "req-" prefiksom
 *
 * @param headers — objekat sa get() metodom (NextRequest, IncomingMessage) ili plain record
 * @returns string ID u formatu "req-<uuid>" ili propagirani ID
 */
export function resolveRequestId(
  headers: { get: (h: string) => string | null } | Record<string, string | undefined>,
): string {
  const get =
    typeof (headers as { get?: unknown }).get === 'function'
      ? (h: string) => (headers as { get: (h: string) => string | null }).get(h)
      : (h: string) => (headers as Record<string, string | undefined>)[h] ?? null;

  return get('x-request-id') ?? get('x-correlation-id') ?? createSecureId('req');
}
