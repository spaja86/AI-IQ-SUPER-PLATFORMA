// SpajaUltraOmegaCore -∞Ω+∞ — Forgot Password API Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/forgot-password

import { NextRequest, NextResponse } from 'next/server';
import { checkBruteForce, recordFailedLoginAttempt } from '@/middleware/omega-security';
import { ΩAuditLogger } from '@/middleware/omega-audit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  // Brute-force zastita
  if (!checkBruteForce(ip)) {
    return NextResponse.json(
      { error: 'Previse zahteva. Pokusajte ponovo za 15 minuta.' },
      { status: 429 }
    );
  }

  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON' }, { status: 400 });
  }

  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    return NextResponse.json({ error: 'Email je obavezan' }, { status: 400 });
  }

  const emailTrimmed = body.email.trim().toLowerCase();
  if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.') || emailTrimmed.length < 5) {
    return NextResponse.json({ error: 'Neispravan format email adrese' }, { status: 400 });
  }

  // Zastitni odgovor — uvek vracamo isti odgovor bez obzira da li email postoji
  // Ovo sprecava enumeraciju korisnika
  recordFailedLoginAttempt(ip);

  ΩAuditLogger.log({
    userId: emailTrimmed,
    action: 'FORGOT_PASSWORD_REQUEST',
    resource: '/api/auth/forgot-password',
    ip,
    userAgent,
    outcome: 'SUCCESS',
    details: { email: emailTrimmed },
  });

  // U produkciji: ovde bi se generisao reset token i slao email
  // Za sada vracamo genericki odgovor
  return NextResponse.json({
    message:
      'Ako nalog sa ovim email-om postoji, poslaticemo instrukcije za resetovanje lozinke na vasu email adresu.',
  });
}
