// SpajaUltraOmegaCore -∞Ω+∞ — Standardizovani API Response Helper
// Kompanija SPAJA — Digitalna Industrija
//
// Jedan izvor istine za API odgovore:
//   - Konzistentna polja greške i uspeha
//   - Standardni HTTP status kodovi
//   - Tipe-sigurni wrapper-i za NextResponse

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

/** Standardni API error kodovi — machine-readable */
export type ApiErrorCode =
  // 4xx — klijentske greške
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'TOO_MANY_REQUESTS'
  // 5xx — serverske greške
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'CONFIGURATION_ERROR'
  // Domenski kodovi
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_BRUTE_FORCE_BLOCKED'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_TOKEN_INVALID'
  | 'AUTH_MFA_REQUIRED'
  | 'BILLING_PLAN_NOT_FOUND'
  | 'BILLING_FREE_PLAN'
  | 'BILLING_STRIPE_NOT_CONFIGURED'
  | 'BILLING_CHECKOUT_FAILED'
  | 'CRON_UNAUTHORIZED';

/** Standardni okvir za sve API greške */
export interface ApiError {
  error: string;         // Human-readable poruka
  code: ApiErrorCode;    // Machine-readable kod
  verzija: string;       // Verzija platforme
  timestamp: string;     // ISO timestamp
  details?: unknown;     // Dodatni detalji (opciono)
}

/** Standardni okvir za sve uspešne API odgovore */
export interface ApiSuccess<T = unknown> {
  data: T;
  verzija: string;
  timestamp: string;
}

// ─── HTTP Status mapa ─────────────────────────────────────────────────────────

const ERROR_STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  CONFIGURATION_ERROR: 500,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_BRUTE_FORCE_BLOCKED: 429,
  AUTH_TOKEN_EXPIRED: 401,
  AUTH_TOKEN_INVALID: 401,
  AUTH_MFA_REQUIRED: 403,
  BILLING_PLAN_NOT_FOUND: 404,
  BILLING_FREE_PLAN: 400,
  BILLING_STRIPE_NOT_CONFIGURED: 500,
  BILLING_CHECKOUT_FAILED: 500,
  CRON_UNAUTHORIZED: 401,
};

// ─── Helper funkcije ──────────────────────────────────────────────────────────

/**
 * Kreira standardizovani NextResponse za grešku.
 *
 * @example
 * return apiError('AUTH_INVALID_CREDENTIALS', 'Neispravni podaci za prijavu');
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): NextResponse<ApiError> {
  const status = ERROR_STATUS[code];
  const body: ApiError = {
    error: message,
    code,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    ...(details !== undefined ? { details } : {}),
  };
  return NextResponse.json(body, { status });
}

/**
 * Kreira standardizovani NextResponse za uspeh.
 *
 * @example
 * return apiSuccess({ token: '...' });
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = {
    data,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

/**
 * Kreira 429 Too Many Requests odgovor sa Retry-After headerom.
 *
 * @param retryAfterSeconds - broj sekundi do sledećeg pokušaja
 */
export function apiRateLimited(retryAfterSeconds = 60): NextResponse<ApiError> {
  const body: ApiError = {
    error: `Previše zahteva. Pokušajte ponovo za ${retryAfterSeconds} sekundi.`,
    code: 'TOO_MANY_REQUESTS',
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, {
    status: 429,
    headers: { 'Retry-After': String(retryAfterSeconds) },
  });
}

/**
 * Loguje i kreira 500 Internal Server Error.
 * Čuva originalni error od prosleđivanja klijentu.
 */
export function apiInternalError(context: string, error?: unknown): NextResponse<ApiError> {
  // Log samo na serveru — nikad ne šalj detalje klijentu
  console.error(`[API ERROR] ${context}:`, error);
  const body: ApiError = {
    error: 'Interna serverska greška. Pokušajte ponovo.',
    code: 'INTERNAL_SERVER_ERROR',
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: 500 });
}

/**
 * Validira da su obavezna polja prisutna u telu zahteva.
 * Vraća null ako su sva polja prisutna, ili NextResponse sa greškom.
 */
export function requireFields(
  body: Record<string, unknown>,
  fields: string[],
): NextResponse<ApiError> | null {
  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      return apiError('BAD_REQUEST', `Polje '${field}' je obavezno.`);
    }
  }
  return null;
}
