// SpajaUltraOmegaCore -∞Ω+∞ — Structured Logger
// Kompanija SPAJA — Digitalna Industrija
//
// Standardizovani logger za sve module platforme.
// U produkciji: JSON format koji Vercel/externe log platforme mogu parsirati.
// U razvoju: čitljiv format sa bojama.
//
// Upotreba:
//   import { logger } from '@/lib/logger';
//   logger.info('AUTH', 'Login uspešan', { userId: '...' });
//   logger.error('BILLING', 'Stripe greška', error);
//   logApiCall('AUTH', { reqId, userId, route, method, statusCode, durationMs });

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  modul: string;
  poruka: string;
  timestamp: string;
  reqId?: string;
  userId?: string;
  route?: string;
  durationMs?: number;
  details?: unknown;
}

// ─── Maskiranje osetljivih podataka (#39, Talas 2) ───────────────────────────

/** Ključevi koji se uvek maskiraju u logovima. */
const SENSITIVE_KEYS = new Set([
  'password', 'lozinka', 'secret', 'token', 'access_token', 'refresh_token',
  'authorization', 'api_key', 'apikey', 'stripe_key', 'webhook_secret',
  'card_number', 'cvv', 'cvc', 'pan', 'ssn', 'credit_card',
  'private_key', 'signing_key', 'session_token', 'cookie',
]);

/**
 * Maskira osetljive vrednosti u objektu pre logovanja.
 * Vrši duboko maskiranje rekurzivno.
 *
 * @example
 * maskSensitive({ password: 'secret', userId: 'abc' })
 * // → { password: '***', userId: 'abc' }
 */
export function maskSensitive(data: unknown, depth = 0): unknown {
  if (depth > 6) return data; // Sprečava beskonačnu rekurziju
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map((item) => maskSensitive(item, depth + 1));
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = '***';
    } else if (value !== null && typeof value === 'object') {
      result[key] = maskSensitive(value, depth + 1);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ─── Logger implementacija ────────────────────────────────────────────────────

function log(level: LogLevel, modul: string, poruka: string, details?: unknown): void {
  const entry: LogEntry = {
    level,
    modul,
    poruka,
    timestamp: new Date().toISOString(),
    ...(details !== undefined ? { details } : {}),
  };

  if (process.env.NODE_ENV === 'production') {
    // JSON log za production — Vercel i log agregatori parsiraju ovo
    const output = JSON.stringify(entry);
    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  } else {
    // Čitljiv format za razvoj
    const prefix = `[${entry.timestamp}] [${level.toUpperCase().padEnd(5)}] [${modul}]`;
    if (level === 'error') {
      console.error(prefix, poruka, details !== undefined ? details : '');
    } else if (level === 'warn') {
      console.warn(prefix, poruka, details !== undefined ? details : '');
    } else if (level === 'debug') {
      console.debug(prefix, poruka, details !== undefined ? details : '');
    } else {
      console.log(prefix, poruka, details !== undefined ? details : '');
    }
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

export const logger = {
  debug: (modul: string, poruka: string, details?: unknown) =>
    log('debug', modul, poruka, details),
  info: (modul: string, poruka: string, details?: unknown) =>
    log('info', modul, poruka, details),
  warn: (modul: string, poruka: string, details?: unknown) =>
    log('warn', modul, poruka, details),
  error: (modul: string, poruka: string, details?: unknown) =>
    log('error', modul, poruka, details),
};

// ─── Request ID propagacija (#836) ───────────────────────────────────────────

import { resolveRequestId } from './request-id';

/**
 * Generiše ili dohvata request ID iz headera.
 * Koristiti u API rutama za praćenje zahteva kroz logove.
 * Delegira na centralizovani resolveRequestId iz src/lib/request-id.ts
 *
 * @example
 *   const reqId = getRequestId(req);
 *   logger.info('API', 'Zahtev primljen', { reqId });
 */
export function getRequestId(req?: { headers: { get: (h: string) => string | null } }): string {
  if (!req) return resolveRequestId({});
  return resolveRequestId(req.headers);
}

/**
 * Kreira logger kontekst sa request ID-om.
 * Svaki log poziv automatski uključuje reqId.
 */
export function createRequestLogger(reqId: string, modul: string) {
  return {
    debug: (poruka: string, details?: unknown) =>
      log('debug', modul, poruka, { reqId, ...toObject(details) }),
    info: (poruka: string, details?: unknown) =>
      log('info', modul, poruka, { reqId, ...toObject(details) }),
    warn: (poruka: string, details?: unknown) =>
      log('warn', modul, poruka, { reqId, ...toObject(details) }),
    error: (poruka: string, details?: unknown) =>
      log('error', modul, poruka, { reqId, ...toObject(details) }),
  };
}

function toObject(details: unknown): Record<string, unknown> {
  if (details === null || details === undefined) return {};
  if (details instanceof Error) return { message: details.message, name: details.name, stack: details.stack };
  if (typeof details === 'object' && !Array.isArray(details) && !(details instanceof Date)) {
    return details as Record<string, unknown>;
  }
  return { data: details };
}

/**
 * Loguje dolazni HTTP zahtev.
 * Koristiti u API rutama za trag zahteva.
 */
export function logRequest(
  modul: string,
  method: string,
  path: string,
  ip: string,
  userId?: string,
): void {
  logger.info(modul, `${method} ${path}`, {
    ip,
    ...(userId ? { userId } : {}),
  });
}

/**
 * Loguje odlazni HTTP odgovor.
 */
export function logResponse(
  modul: string,
  method: string,
  path: string,
  status: number,
  durationMs?: number,
): void {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
  log(level, modul, `${method} ${path} → ${status}`, durationMs ? { durationMs } : undefined);
}

// ─── Strukturovani API log (Talas 2 — Wave 2) ────────────────────────────────

export interface ApiCallLog {
  reqId: string;
  route: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  userId?: string;
  /** Dodatna osetljiva polja se automatski maskiraju. */
  extra?: Record<string, unknown>;
}

/**
 * Emituje strukturovani log za jedan API poziv sa svim obaveznim poljima.
 * Osetljivi podaci u `extra` se automatski maskiraju.
 *
 * @example
 *   logApiCall('BILLING', {
 *     reqId: trace.requestId,
 *     route: '/api/stripe/checkout',
 *     method: 'POST',
 *     statusCode: 200,
 *     durationMs: 42,
 *     userId: user.id,
 *   });
 */
export function logApiCall(modul: string, params: ApiCallLog): void {
  const { reqId, route, method, statusCode, durationMs, userId, extra } = params;
  const level: LogLevel =
    statusCode !== undefined && statusCode >= 500
      ? 'error'
      : statusCode !== undefined && statusCode >= 400
        ? 'warn'
        : 'info';

  const maskedExtra = extra ? (maskSensitive(extra) as Record<string, unknown>) : undefined;

  const entry: LogEntry = {
    level,
    modul,
    poruka: `${method ?? 'API'} ${route}${statusCode !== undefined ? ` → ${statusCode}` : ''}`,
    timestamp: new Date().toISOString(),
    reqId,
    route,
    ...(userId ? { userId } : {}),
    ...(durationMs !== undefined ? { durationMs } : {}),
    ...(maskedExtra ? { details: maskedExtra } : {}),
  };

  if (process.env.NODE_ENV === 'production') {
    const output = JSON.stringify(entry);
    if (level === 'error') console.error(output);
    else if (level === 'warn') console.warn(output);
    else console.log(output);
  } else {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase().padEnd(5)}] [${modul}]`;
    const suffix = [
      `reqId=${reqId}`,
      userId ? `userId=${userId}` : null,
      durationMs !== undefined ? `${durationMs}ms` : null,
    ]
      .filter(Boolean)
      .join(' ');
    console.log(prefix, entry.poruka, suffix, maskedExtra ?? '');
  }
}
