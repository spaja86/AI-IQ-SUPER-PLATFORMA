// SpajaUltraOmegaCore -∞Ω+∞ — Security Headers
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 1 (P0): Sigurnosni HTTP headeri za sve API rute i Next.js middleware.
//
// Implementira:
//   • Content-Security-Policy (CSP) sa nonce-om
//   • Strict-Transport-Security (HSTS)
//   • X-Frame-Options / frame-ancestors
//   • X-Content-Type-Options
//   • Referrer-Policy
//   • Permissions-Policy
//   • X-XSS-Protection (legacy browsersi)
//
// Upotreba:
//   import { applySecurityHeaders } from '@/lib/security-headers';
//   const headers = applySecurityHeaders(new Headers());

import { randomBytes } from 'crypto';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface SecurityHeadersOptions {
  /** Da li da uključi nonce u CSP. Podrazumevano: true */
  withNonce?: boolean;
  /** Da li je ovo produkcijsko okruženje. Podrazumevano: process.env.NODE_ENV === 'production' */
  isProduction?: boolean;
  /** Dozvoljeni iframe hosrovi za frame-ancestors. Podrazumevano: [] (deny all) */
  frameAncestors?: string[];
  /** Dozvoljeni connect-src domeni za CSP. */
  connectSrc?: string[];
}

export interface SecurityHeadersResult {
  headers: Record<string, string>;
  nonce?: string;
}

// ─── CSP builder ──────────────────────────────────────────────────────────────

/**
 * Gradi Content-Security-Policy string.
 */
function buildCSP(nonce: string | null, opts: SecurityHeadersOptions): string {
  const isProd = opts.isProduction ?? process.env.NODE_ENV === 'production';
  const nonceAttr = nonce ? ` 'nonce-${nonce}'` : '';

  const scriptSrc = isProd
    ? `'self'${nonceAttr} 'strict-dynamic'`
    : `'self'${nonceAttr} 'unsafe-eval' 'unsafe-inline'`;

  const connectSrc = [
    "'self'",
    'https://api.stripe.com',
    'https://api.openai.com',
    ...(opts.connectSrc ?? []),
  ].join(' ');

  const frameAncestors =
    opts.frameAncestors && opts.frameAncestors.length > 0
      ? opts.frameAncestors.join(' ')
      : "'none'";

  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https:`,
    `connect-src ${connectSrc}`,
    `frame-ancestors ${frameAncestors}`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join('; ');
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Generiše nonce za CSP (Base64, 16 bajta).
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Vraća kompletan set sigurnosnih HTTP headera.
 *
 * @example
 * const { headers, nonce } = getSecurityHeaders({ withNonce: true });
 * const response = NextResponse.next();
 * Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
 */
export function getSecurityHeaders(opts: SecurityHeadersOptions = {}): SecurityHeadersResult {
  const { withNonce = true } = opts;
  const isProd = opts.isProduction ?? process.env.NODE_ENV === 'production';

  const nonce = withNonce ? generateNonce() : null;
  const csp = buildCSP(nonce, opts);

  const headers: Record<string, string> = {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "https://js.stripe.com")',
      'usb=()',
    ].join(', '),
    'X-XSS-Protection': '1; mode=block',
  };

  if (isProd) {
    // HSTS — samo u produkciji (sprečava probleme u dev-u sa lokalnim HTTP-om)
    headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  }

  return { headers, ...(nonce ? { nonce } : {}) };
}

/**
 * Primenjuje sigurnosne headere na postojeći `Headers` objekat ili Record.
 * Vraća nonce ako je generisan.
 */
export function applySecurityHeaders(
  target: Headers | Record<string, string>,
  opts: SecurityHeadersOptions = {},
): string | undefined {
  const { headers, nonce } = getSecurityHeaders(opts);

  if (target instanceof Headers) {
    Object.entries(headers).forEach(([k, v]) => target.set(k, v));
  } else {
    Object.assign(target, headers);
  }

  return nonce;
}

/**
 * Kreira `Headers` objekat sa svim sigurnosnim headerima.
 */
export function createSecurityHeaders(opts: SecurityHeadersOptions = {}): {
  headers: Headers;
  nonce?: string;
} {
  const { headers: headerMap, nonce } = getSecurityHeaders(opts);
  const headers = new Headers();
  Object.entries(headerMap).forEach(([k, v]) => headers.set(k, v));
  return { headers, ...(nonce ? { nonce } : {}) };
}

// ─── CSP Report-Only za testiranje ───────────────────────────────────────────

/**
 * Generiše Content-Security-Policy-Report-Only header za testiranje bez blokiranja.
 * Korisno za staging okruženje pre aktiviranja enforcement-a.
 */
export function getCSPReportOnly(
  reportUri: string,
  opts: SecurityHeadersOptions = {},
): string {
  const nonce = opts.withNonce !== false ? generateNonce() : null;
  const csp = buildCSP(nonce, opts);
  return `${csp}; report-uri ${reportUri}`;
}
