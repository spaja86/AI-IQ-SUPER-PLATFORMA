// SpajaUltraOmegaCore -∞Ω+∞ — Omega Security Middleware
// Kompanija SPAJA — Digitalna Industrija
// Zero Trust: Interceptira SVE zahteve

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting in-memory store
// Format: IP -> { count, resetAt }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Brute force protection za login
// Format: IP -> { attempts, blockedUntil }
const bruteForceStore = new Map<string, { attempts: number; blockedUntil: number }>();

// Poznate maliciozne IP adrese (primer lista — u produkciji: dinamički iz threat intelligence)
const BLOCKED_IPS = new Set<string>();

// Konstante
const RATE_LIMIT_ANON = 100; // 100 req/min za anonimne korisnike
const RATE_LIMIT_AUTH = 1000; // 1000 req/min za autentifikovane
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minut
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minuta

// Rute koje ne zahtevaju autentifikaciju
const PUBLIC_ROUTES = [
  '/',
  '/api/status',
  '/api/health',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/verify',
  '/ai-platforma',
  '/banka',
  '/menjacnica',
  '/kompanija',
  '/organizacija',
  '/ekosistem',
  '/dashboard',
  '/omega-ai',
  '/deploy',
  '/auto-popravka',
];

// Rute koje zahtevaju OMEGA_CORE nivo
const OMEGA_CORE_ROUTES = ['/security', '/api/omega-core'];

// Security headers — HSTS, CSP, X-Frame, Permissions, Referrer
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/fonts/')) return true;
  if (/\.(ico|png|jpg|svg|woff2?)$/.test(pathname)) return true;
  return false;
}

function isOmegaCoreRoute(pathname: string): boolean {
  return OMEGA_CORE_ROUTES.some((r) => pathname.startsWith(r));
}

function checkRateLimit(ip: string, isAuthenticated: boolean): boolean {
  const limit = isAuthenticated ? RATE_LIMIT_AUTH : RATE_LIMIT_ANON;
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count++;
  return true;
}

export function checkBruteForce(ip: string): boolean {
  const now = Date.now();
  const existing = bruteForceStore.get(ip);

  if (existing && now < existing.blockedUntil) return false;
  return true;
}

export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();
  const existing = bruteForceStore.get(ip);

  if (existing && now > existing.blockedUntil) {
    bruteForceStore.set(ip, { attempts: 1, blockedUntil: 0 });
    return;
  }

  const current = existing ?? { attempts: 0, blockedUntil: 0 };
  current.attempts++;

  if (current.attempts >= LOGIN_MAX_ATTEMPTS) {
    current.blockedUntil = now + LOGIN_BLOCK_DURATION_MS;
  }

  bruteForceStore.set(ip, current);
}

export function resetLoginAttempts(ip: string): void {
  bruteForceStore.delete(ip);
}

function validateCSRF(request: NextRequest): boolean {
  // Double Submit Cookie pattern
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return true;
  }

  const csrfCookie = request.cookies.get('omega-csrf')?.value;
  const csrfHeader = request.headers.get('x-omega-csrf');

  if (!csrfCookie || !csrfHeader) {
    // Auth endpointi ne zahtevaju CSRF (koriste Bearer token)
    if (request.nextUrl.pathname.startsWith('/api/auth/')) return true;
    return false;
  }

  return csrfCookie === csrfHeader;
}

// omegaSecurityMiddleware — Zero Trust middleware za SVE rute
export function omegaSecurityMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // 1. Provjeri blokirane IP adrese
  if (BLOCKED_IPS.has(ip)) {
    const response = new NextResponse('Forbidden', { status: 403 });
    return applySecurityHeaders(response);
  }

  // 2. Rate limiting
  const authHeader = request.headers.get('authorization');
  const isAuthenticated = authHeader?.startsWith('Bearer ') ?? false;

  if (!checkRateLimit(ip, isAuthenticated)) {
    const response = new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
    return applySecurityHeaders(response);
  }

  // 3. CSRF zaštita
  if (!validateCSRF(request)) {
    const response = new NextResponse('CSRF validation failed', { status: 403 });
    return applySecurityHeaders(response);
  }

  // 4. OMEGA CORE rute zahtevaju poseban header indikator
  if (isOmegaCoreRoute(pathname)) {
    const omegaToken = request.headers.get('x-omega-core-token');
    if (!omegaToken && !isAuthenticated) {
      const response = new NextResponse('Omega Core Access Required', { status: 403 });
      return applySecurityHeaders(response);
    }
  }

  // 5. Nastavi sa zahtevom + dodaj bezbednosne headere
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

// isPublicRouteExport za upotrebu u middleware.ts
export { isPublicRoute };
