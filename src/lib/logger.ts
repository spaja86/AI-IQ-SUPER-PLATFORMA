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

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  modul: string;
  poruka: string;
  timestamp: string;
  details?: unknown;
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

// ─── HTTP Request logger helper ───────────────────────────────────────────────

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
