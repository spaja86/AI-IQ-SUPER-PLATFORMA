import { type NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩClearanceLevel } from '@/lib/auth/types';
import type { IssuerLicensingActorRole } from '@/lib/issuer-licensing';

export interface IssuerIdentity {
  id: string;
  role: IssuerLicensingActorRole;
  clearanceLevel: ΩClearanceLevel;
}

function mapRoleFromClearance(clearanceLevel: ΩClearanceLevel): IssuerLicensingActorRole {
  if (clearanceLevel >= ΩClearanceLevel.SUPER_ADMIN) return 'admin';
  if (clearanceLevel >= ΩClearanceLevel.ADMIN) return 'approver';
  if (clearanceLevel >= ΩClearanceLevel.OPERATOR) return 'editor';
  return 'viewer';
}

export async function requireIssuerIdentity(
  request: NextRequest,
  minClearance = ΩClearanceLevel.USER,
): Promise<{ ok: true; identity: IssuerIdentity } | { ok: false; response: NextResponse }> {
  const token = ΩAuthProvider.extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Token je obavezan.' }, { status: 401 }),
    };
  }

  const identity = await ΩAuthProvider.verifyIdentity(token);
  if (!identity) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Nevažeći token.' }, { status: 401 }),
    };
  }

  if (identity.clearanceLevel < minClearance) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Nedovoljan clearance.' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    identity: {
      id: identity.id,
      clearanceLevel: identity.clearanceLevel,
      role: mapRoleFromClearance(identity.clearanceLevel),
    },
  };
}
