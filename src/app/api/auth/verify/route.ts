// SpajaUltraOmegaCore -∞Ω+∞ — Verify Token Route
// Kompanija SPAJA — Digitalna Industrija
// GET /api/auth/verify

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩPermissionMatrix } from '@/lib/auth/omega-permissions';
import { ΩAuditLogger } from '@/middleware/omega-audit';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  const authHeader = request.headers.get('authorization');
  const tokenValue = ΩAuthProvider.extractTokenFromHeader(authHeader);

  if (!tokenValue) {
    return NextResponse.json({ error: 'Token nije pronađen' }, { status: 401 });
  }

  const identity = await ΩAuthProvider.verifyIdentity(tokenValue);

  if (!identity) {
    ΩAuditLogger.log({
      userId: 'unknown',
      action: 'TOKEN_VERIFY_FAILED',
      resource: '/api/auth/verify',
      ip,
      userAgent,
      outcome: 'DENIED',
    });

    return NextResponse.json({ error: 'Nevažeći token' }, { status: 401 });
  }

  ΩAuditLogger.log({
    userId: identity.id,
    action: 'TOKEN_VERIFY_SUCCESS',
    resource: '/api/auth/verify',
    ip,
    userAgent,
    outcome: 'SUCCESS',
  });

  return NextResponse.json({
    valid: true,
    identity: {
      id: identity.id,
      did: identity.did,
      roles: identity.roles,
      clearanceLevel: identity.clearanceLevel,
      clearanceLevelName: ΩPermissionMatrix.getClearanceLevelName(identity.clearanceLevel),
      digitalIndustryAccess: identity.digitalIndustryAccess,
      mfaEnabled: identity.mfaEnabled,
    },
  });
}
