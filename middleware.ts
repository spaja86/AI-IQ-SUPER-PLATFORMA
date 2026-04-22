// SpajaUltraOmegaCore -∞Ω+∞ — Next.js Edge Middleware
// Kompanija SPAJA — Digitalna Industrija
//
// Edge-compatible middleware: IP blocking + rate limiting.
// Runs in the Vercel Edge Runtime before every request.
// Security headers are applied by vercel.json and next.config.ts.
// Brute-force protection for auth endpoints is handled inside
// /api/auth/login via omega-security.ts helpers.

import { NextRequest, NextResponse } from 'next/server';

// ─── IP Block List ────────────────────────────────────────────────────────────

const BLOCKED_IPS = new Set<string>(
  (process.env.OMEGA_BLOCKED_IPS ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean),
);

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// In-memory store — resets per Edge function instance (serverless limitation).
// For global rate limiting, replace with an external KV store (e.g. Vercel KV).

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_ANON = 200; // requests per window for anonymous users
const RATE_LIMIT_AUTH = 1_000; // requests per window for authenticated users

function checkRateLimit(ip: string, isAuthenticated: boolean): boolean {
  const now = Date.now();
  const limit = isAuthenticated ? RATE_LIMIT_AUTH : RATE_LIMIT_ANON;
  const existing = rateLimitMap.get(ip);

  if (!existing || now > existing.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count++;
  return true;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const ip = getClientIP(request);

  // 1. Block known malicious IPs (loaded from OMEGA_BLOCKED_IPS env var)
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting — authenticated users get a higher limit
  const isAuthenticated = request.headers.get('authorization')?.startsWith('Bearer ') ?? false;
  if (!checkRateLimit(ip, isAuthenticated)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }

  return NextResponse.next();
}

// Apply to all routes except static assets and Next.js internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
