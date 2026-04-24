// Autofinish #832 — Strukturirani Error Odgovori
// Kompanija SPAJA — Digitalna Industrija
//
// Standardizovani helper za kreiranje konzistentnih HTTP error odgovora.
// Svaki error odgovor sadrži: error (kod), poruka, verzija, timestamp.
//
// Upotreba:
//   return apiError(400, 'INVALID_INPUT', 'Neispravan unos');
//   return apiError(401, 'UNAUTHORIZED', 'Token je nevažeći');
//   return apiError(500, 'INTERNAL_ERROR', 'Neočekivana greška', { details: e });

import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from './constants';
import { logger } from './logger';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type ApiErrorKod =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFLICT'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface ApiErrorTelo {
  error: ApiErrorKod;
  poruka: string;
  verzija: string;
  autofinishIteracija: number;
  timestamp: string;
  detalji?: unknown;
}

// ─── HTTP status mapa ─────────────────────────────────────────────────────────

const HTTP_STATUS: Record<ApiErrorKod, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ─── Helper funkcija ──────────────────────────────────────────────────────────

/**
 * Kreira standardizovani NextResponse sa strukturiranim error tijelom.
 *
 * @param kod     - ApiErrorKod koji određuje HTTP status
 * @param poruka  - Korisnički čitljiva poruka na srpskom
 * @param detalji - Opcionalni dodatni detalji (samo za debug, nikad PII)
 * @param headers - Opcionalni HTTP headeri (npr. Retry-After)
 */
export function apiError(
  kod: ApiErrorKod,
  poruka: string,
  detalji?: unknown,
  headers?: Record<string, string>,
): NextResponse<ApiErrorTelo> {
  const status = HTTP_STATUS[kod];

  const telo: ApiErrorTelo = {
    error: kod,
    poruka,
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    timestamp: new Date().toISOString(),
    ...(detalji !== undefined ? { detalji } : {}),
  };

  if (status >= 500) {
    logger.error('API_ERROR', `${kod}: ${poruka}`, detalji);
  } else if (status >= 400) {
    logger.warn('API_ERROR', `${kod}: ${poruka}`);
  }

  return NextResponse.json(telo, { status, headers });
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/** 400 Bad Request */
export const apiBadRequest = (poruka: string, detalji?: unknown) =>
  apiError('BAD_REQUEST', poruka, detalji);

/** 401 Unauthorized */
export const apiUnauthorized = (poruka = 'Autorizacija je obavezna.') =>
  apiError('UNAUTHORIZED', poruka);

/** 403 Forbidden */
export const apiForbidden = (poruka = 'Nemate dozvolu za ovu akciju.') =>
  apiError('FORBIDDEN', poruka);

/** 404 Not Found */
export const apiNotFound = (poruka = 'Resurs nije pronađen.') =>
  apiError('NOT_FOUND', poruka);

/** 429 Too Many Requests */
export const apiRateLimited = (retryAfterSec = 60) =>
  apiError(
    'TOO_MANY_REQUESTS',
    `Previše zahteva. Pokušajte ponovo za ${retryAfterSec} sekundi.`,
    undefined,
    { 'Retry-After': String(retryAfterSec) },
  );

/** 500 Internal Server Error */
export const apiInternalError = (detalji?: unknown) =>
  apiError('INTERNAL_ERROR', 'Neočekivana greška servera. Pokušajte ponovo.', detalji);
