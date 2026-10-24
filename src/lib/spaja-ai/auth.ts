import { ΩAuthProvider } from '../auth/omega-auth';
import { getGlobalVault } from '../auth/omega-identity';
import { PilotError } from './pilot';

/** Paid pilot accepts only current, explicitly allowed Omega ACCESS identities.
 * Refresh/API/demo tokens and JWT-only fallback identities cannot spend quota.
 */
export async function authenticatePilot(header: string | null): Promise<string> {
  const denied = () => new PilotError(401, 'UNAUTHENTICATED', 'Prijavite se ponovo za AI pilot.');
  if (!header || !/^Bearer [A-Za-z0-9_.-]+$/.test(header) || header.length > 8192) throw denied();
  const token = header.slice(7);
  let claims;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw denied();
    const jwtHeader = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (jwtHeader.alg !== 'HS256' || jwtHeader.typ !== 'JWT' || claims.type !== 'ACCESS' ||
        typeof claims.sub !== 'string' || !claims.sub || !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000 ||
        !Array.isArray(claims.scope) || !claims.scope.includes('digital_industry:write')) throw denied();
  } catch { throw denied(); }
  const verified = await ΩAuthProvider.verifyIdentity(token);
  if (!verified || verified.id !== claims.sub) throw denied();
  const current = getGlobalVault().retrieveIdentity(verified.id);
  if (!current || !current.digitalIndustryAccess || current.roles.includes('demo')) throw denied();
  return current.id;
}
