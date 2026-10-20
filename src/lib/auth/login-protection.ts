import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { checkBruteForce, recordFailedLoginAttempt, resetLoginAttempts } from '@/middleware/omega-security';
import { ΩAuditLogger } from '@/middleware/omega-audit';

/**
 * Next's Request does not expose a verified socket peer. Ignore forwarding
 * headers unless the operator explicitly configures a fixed, trusted proxy
 * chain that is the ONLY path to the origin. See docs/LOGIN-PROTECTION.md.
 */
export function getLoginClientIP(headers: Headers): string | null {
  const configuredHops = process.env.OMEGA_LOGIN_TRUSTED_PROXY_HOPS ?? '';
  if (!/^[1-9]\d*$/.test(configuredHops)) return null;
  const hops = Number(configuredHops);
  if (hops > 16) return null;

  const forwarded = headers.get('x-forwarded-for');
  if (!forwarded || forwarded.length > 2048) return null;
  const addresses = forwarded.split(',').map((value) => value.trim());
  if (addresses.length < hops || addresses.length > 32) return null;
  // Walk from the trusted end; a client may prepend arbitrary addresses.
  const candidate = addresses[addresses.length - hops];
  const version = isIP(candidate);
  if (!version || candidate.includes('%')) return null;
  if (version === 4) return candidate;

  // Canonicalize IPv6 so spelling/case differences cannot reset a bucket.
  const canonical = new URL(`http://[${candidate}]/`).hostname.slice(1, -1);
  const mapped = /^::ffff:([0-9a-f]+):([0-9a-f]+)$/.exec(canonical);
  if (mapped) {
    const high = parseInt(mapped[1], 16);
    const low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join('.');
  }
  return canonical;
}

/** Both login routes use the same account counter and optional trusted-IP counter. */
export function createLoginProtection(email: string, headers: Headers, resource: string) {
  const clientIP = getLoginClientIP(headers);
  const ip = clientIP ?? 'unknown';
  const userAgent = headers.get('user-agent') ?? 'unknown';
  const normalizedEmail = email.trim().toLowerCase();
  const accountHash = createHash('sha256').update(normalizedEmail).digest('hex');
  const keys = [`login:account:${accountHash}`];
  if (clientIP) keys.push(`login:ip:${clientIP}`);

  return {
    ip,
    userAgent,
    isAllowed(): boolean {
      if (keys.every(checkBruteForce)) return true;
      ΩAuditLogger.log({
        userId: 'anonymous', action: 'LOGIN_BLOCKED_BRUTE_FORCE', resource,
        ip, userAgent, outcome: 'DENIED',
      });
      return false;
    },
    recordFailure(): void {
      keys.forEach(recordFailedLoginAttempt);
      ΩAuditLogger.log({
        userId: normalizedEmail, action: 'LOGIN_FAILED', resource,
        ip, userAgent, outcome: 'DENIED', details: { reason: 'invalid_credentials' },
      });
    },
    reset(): void {
      keys.forEach(resetLoginAttempts);
    },
  };
}
