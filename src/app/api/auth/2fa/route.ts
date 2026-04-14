// SpajaUltraOmegaCore -∞Ω+∞ — 2FA Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/2fa

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider, storeTOTPSecret, getStoredTOTPSecret, deleteTOTPSecret } from '@/lib/auth/omega-auth';
import { ΩCryptoEngine } from '@/lib/auth/omega-crypto';
import { getGlobalVault } from '@/lib/auth/omega-identity';
import { ΩAuditLogger } from '@/middleware/omega-audit';

interface TwoFARequest {
  action: 'enable' | 'disable' | 'verify';
  totpCode?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  // Autentifikacija
  const authHeader = request.headers.get('authorization');
  const tokenValue = ΩAuthProvider.extractTokenFromHeader(authHeader);

  if (!tokenValue) {
    return NextResponse.json({ error: 'Autentifikacija je obavezna' }, { status: 401 });
  }

  const identity = await ΩAuthProvider.verifyIdentity(tokenValue);
  if (!identity) {
    return NextResponse.json({ error: 'Nevažeći token' }, { status: 401 });
  }

  let body: TwoFARequest;
  try {
    body = (await request.json()) as TwoFARequest;
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON' }, { status: 400 });
  }

  const vault = getGlobalVault();

  if (body.action === 'enable') {
    // Generiši TOTP secret
    const secret = ΩCryptoEngine.generateTOTPSecret();
    const secretBase32 = ΩCryptoEngine.encodeBase32(Buffer.from(secret, 'base64'));

    // Privremeno sačuvaj secret (biće potvrđen u verify koraku)
    storeTOTPSecret(`pending:${identity.id}`, secret);

    // TOTP URI za Google Authenticator
    const issuer = 'AI-IQ-SUPER-PLATFORMA';
    const label = encodeURIComponent(`${issuer}:${identity.email ?? identity.id}`);
    const totpUri = `otpauth://totp/${label}?secret=${secretBase32}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

    ΩAuditLogger.log({
      userId: identity.id,
      action: '2FA_ENABLE_INITIATED',
      resource: '/api/auth/2fa',
      ip,
      userAgent,
      outcome: 'SUCCESS',
    });

    return NextResponse.json({
      secret: secretBase32,
      totpUri,
      message: 'Skenirajte QR kod u Google Authenticator aplikaciji, zatim potvrdite kodom',
    });
  }

  if (body.action === 'verify') {
    if (!body.totpCode) {
      return NextResponse.json({ error: 'TOTP kod je obavezan' }, { status: 400 });
    }

    // Dohvati pending secret
    const pendingSecret = getStoredTOTPSecret(`pending:${identity.id}`);
    if (!pendingSecret) {
      return NextResponse.json({ error: 'Nema pending 2FA setup-a. Pokrenite enable prvo.' }, { status: 400 });
    }

    // Verifikuj kod
    if (!ΩCryptoEngine.verifyTOTP(pendingSecret, body.totpCode)) {
      ΩAuditLogger.log({
        userId: identity.id,
        action: '2FA_VERIFY_FAILED',
        resource: '/api/auth/2fa',
        ip,
        userAgent,
        outcome: 'DENIED',
      });

      return NextResponse.json({ error: 'Neispravan TOTP kod' }, { status: 401 });
    }

    // Potvrdi aktivaciju
    deleteTOTPSecret(`pending:${identity.id}`);
    storeTOTPSecret(identity.id, pendingSecret);

    // Ažuriraj identitet
    const updated = { ...identity, mfaEnabled: true };
    vault.storeIdentity(updated);

    ΩAuditLogger.log({
      userId: identity.id,
      action: '2FA_ENABLED',
      resource: '/api/auth/2fa',
      ip,
      userAgent,
      outcome: 'SUCCESS',
    });

    return NextResponse.json({ success: true, message: '2FA je uspešno aktiviran' });
  }

  if (body.action === 'disable') {
    if (!body.totpCode) {
      return NextResponse.json({ error: 'TOTP kod je obavezan za deaktivaciju' }, { status: 400 });
    }

    const secret = getStoredTOTPSecret(identity.id);
    if (!secret) {
      return NextResponse.json({ error: '2FA nije aktivan' }, { status: 400 });
    }

    if (!ΩCryptoEngine.verifyTOTP(secret, body.totpCode)) {
      ΩAuditLogger.log({
        userId: identity.id,
        action: '2FA_DISABLE_FAILED',
        resource: '/api/auth/2fa',
        ip,
        userAgent,
        outcome: 'DENIED',
      });

      return NextResponse.json({ error: 'Neispravan TOTP kod' }, { status: 401 });
    }

    // Deaktiviraj 2FA
    deleteTOTPSecret(identity.id);
    const updated = { ...identity, mfaEnabled: false };
    vault.storeIdentity(updated);

    ΩAuditLogger.log({
      userId: identity.id,
      action: '2FA_DISABLED',
      resource: '/api/auth/2fa',
      ip,
      userAgent,
      outcome: 'SUCCESS',
    });

    return NextResponse.json({ success: true, message: '2FA je deaktiviran' });
  }

  return NextResponse.json({ error: 'Nepoznata akcija. Koristite: enable, verify, disable' }, { status: 400 });
}
