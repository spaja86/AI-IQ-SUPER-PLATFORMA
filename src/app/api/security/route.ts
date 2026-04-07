import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'secure',
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,

    headers: {
      csp: 'aktivan — Content-Security-Policy sa strict pravilima',
      hsts: 'aktivan — Strict-Transport-Security sa max-age=63072000',
      xFrameOptions: 'DENY',
      xContentType: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
      crossDomainPolicy: 'none',
    },

    autentikacija: {
      apiKljucevi: 'HMAC-SHA256',
      lozinke: 'PBKDF2-SHA512 (310k iteracija)',
      sesije: 'Secure token sa rotacijom',
      dvofaktorska: '2FA podrška',
    },

    infrastruktura: {
      vercel: 'Edge mreža sa automatskim HTTPS',
      proksi: 'Proksi mreža sa šifrovanom komunikacijom',
      robotsTxt: 'Disallow za /api/cron/ i /api/auto-repair/',
    },

    timestamp: new Date().toISOString(),
  });
}
