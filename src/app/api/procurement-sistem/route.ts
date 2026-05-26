import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { APP_VERSION } from '@/lib/constants';
import { getProcurementSistemStatus } from '@/lib/procurement-sistem';

async function requireUser(request: NextRequest) {
  const token = ΩAuthProvider.extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Token je obavezan.' }, { status: 401 }),
    };
  }
  const identity = await ΩAuthProvider.verifyIdentity(token);
  if (!identity) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Nevažeći token.' }, { status: 401 }),
    };
  }
  if (identity.clearanceLevel < ΩClearanceLevel.USER) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Nedovoljan clearance.' }, { status: 403 }),
    };
  }
  return { ok: true as const, identity };
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;

  const sistemStatus = await getProcurementSistemStatus();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Prkitandejrski sistem — Unified Procurement System',
    verzija: APP_VERSION,
    ...sistemStatus,
    timestamp: new Date().toISOString(),
  });
}
