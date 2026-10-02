import { ΩAuthProvider } from '../auth/omega-auth';
import { ΩClearanceLevel } from '../auth/types';

type Authorization =
  | { ok: true; identityId: string }
  | { ok: false; status: number; error: string };

/** Fail closed: no development signing fallback for deployment operations. */
export async function authorizeDeployRequest(request: Request): Promise<Authorization> {
  if (!process.env.OMEGA_JWT_SECRET?.trim()) {
    return { ok: false, status: 503, error: 'Deploy authentication is not configured.' };
  }
  const match = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') ?? '');
  const denied: Authorization = { ok: false, status: 401, error: 'Valid ACCESS Bearer token required.' };
  if (!match) return denied;
  try {
    const parts = match[1].split('.');
    if (parts.length !== 3) return denied;
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (header.alg !== 'HS256' || header.typ !== 'JWT'
      || payload.type !== 'ACCESS' || typeof payload.sub !== 'string' || !payload.sub
      || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)
      || payload.exp <= Date.now() / 1000) return denied;
    // Parsed claims alone are never trusted: verify signature and revocation via provider.
    const identity = await ΩAuthProvider.verifyIdentity(match[1]);
    if (!identity || identity.id !== payload.sub) return denied;
    if (!Number.isInteger(identity.clearanceLevel)
      || identity.clearanceLevel < ΩClearanceLevel.ADMIN
      || identity.clearanceLevel > ΩClearanceLevel.OMEGA_CORE) {
      return { ok: false, status: 403, error: 'Administrator clearance required for deployment.' };
    }
    return { ok: true, identityId: identity.id };
  } catch {
    return denied;
  }
}
