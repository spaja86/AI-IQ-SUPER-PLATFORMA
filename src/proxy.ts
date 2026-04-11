import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 📡 OMEGA Proxy — Request Logger & Monitor
 *
 * Loguje sve zahteve ka platformi.
 * Dodaje X-Request-Id i X-Response-Time hedere.
 *
 * Next.js 16 koristi proxy.ts umesto middleware.ts
 */
export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  const response = NextResponse.next();

  // Dodaj request ID za praćenje
  response.headers.set('X-Request-Id', requestId);
  // Napomena: meri vreme izvršavanja proxy-ja, ne ukupno vreme odgovora
  // (Next.js proxy se izvršava pre route handler-a)
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  response.headers.set('X-Powered-By', 'Kompanija SPAJA - OMEGA AI');

  return response;
}

export const config = {
  matcher: [
    /*
     * Pokreni proxy na svim rutama osim:
     * - _next/static (statički fajlovi)
     * - _next/image (optimizovane slike)
     * - favicon.ico (ikonica)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)',
  ],
};
