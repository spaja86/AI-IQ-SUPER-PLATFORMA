// SpajaUltraOmegaCore -∞Ω+∞ — Omega Auth Provider
// Kompanija SPAJA — Digitalna Industrija
// Zero Trust: Svaki zahtev se verifikuje bez memorisanja poverenja

import type {
  ΩToken,
  ΩIdentity,
  ΩScope,
  ΩLoginRequest,
  ΩLoginResponse,
} from './types';
import { ΩClearanceLevel, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from './types';
import { ΩCryptoEngine } from './omega-crypto';
import { getGlobalVault } from './omega-identity';

// In-memory store za tokene (u produkciji: Redis)
const tokenStore = new Map<string, { identity: ΩIdentity; expiresAt: number }>();
const refreshTokenStore = new Map<string, { userId: string; expiresAt: number }>();
const apiKeyStore = new Map<string, { identity: ΩIdentity }>();
const revokedTokens = new Set<string>();

// ΩAuthProvider — centralni autentifikacioni provajder
export class ΩAuthProvider {
  private static readonly JWT_SECRET = process.env.OMEGA_JWT_SECRET ?? 'omega-secret-change-in-production-min-32-chars!!';

  // verifyIdentity — verifikuje SVE tipove tokena
  static async verifyIdentity(token: string): Promise<ΩIdentity | null> {
    // Zero Trust: uvek verifikuj, nikad ne pretpostavljaj
    if (!token) return null;

    // Provjeri da li je token opozvan
    const tokenHash = ΩCryptoEngine.hashSHA256(token);
    if (revokedTokens.has(tokenHash)) return null;

    // Pokušaj JWT verifikaciju
    const jwtIdentity = await this.verifyJWT(token);
    if (jwtIdentity) return jwtIdentity;

    // Pokušaj API ključ verifikaciju
    const apiIdentity = this.verifyAPIKey(token);
    if (apiIdentity) return apiIdentity;

    return null;
  }

  // issueToken — izdaje kriptografski potpisan token
  static async issueToken(
    identity: ΩIdentity,
    scope: ΩScope[],
    type: ΩToken['type'] = 'ACCESS'
  ): Promise<ΩToken> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = type === 'REFRESH' ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL;
    const expiresAt = now + ttl;

    const payload = {
      sub: identity.id,
      did: identity.did,
      roles: identity.roles,
      clearance: identity.clearanceLevel,
      scope,
      type,
      iat: now,
      exp: expiresAt,
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const message = `${header}.${payloadB64}`;
    const signature = ΩCryptoEngine.hmacSHA256(message, this.JWT_SECRET);

    const value = `${message}.${Buffer.from(signature).toString('base64url')}`;

    // Sačuvaj u store
    tokenStore.set(ΩCryptoEngine.hashSHA256(value), {
      identity,
      expiresAt: expiresAt * 1000,
    });

    return {
      value,
      type,
      issuedAt: now,
      expiresAt,
      scope,
      signature,
      quantumSafe: false, // Ed25519 + Kyber opciono
    };
  }

  // issueRefreshToken — izdaje refresh token
  static async issueRefreshToken(identity: ΩIdentity): Promise<ΩToken> {
    const token = await this.issueToken(identity, ['digital_industry:read'], 'REFRESH');

    refreshTokenStore.set(ΩCryptoEngine.hashSHA256(token.value), {
      userId: identity.id,
      expiresAt: token.expiresAt * 1000,
    });

    return token;
  }

  // refreshToken — obnavlja access token (Token Rotation)
  static async refreshAccessToken(
    refreshTokenValue: string
  ): Promise<{ accessToken: ΩToken; refreshToken: ΩToken; userId: string } | null> {
    const tokenHash = ΩCryptoEngine.hashSHA256(refreshTokenValue);

    // Verifikuj refresh token
    if (revokedTokens.has(tokenHash)) return null;

    const stored = refreshTokenStore.get(tokenHash);
    if (!stored) return null;
    if (Date.now() > stored.expiresAt) {
      refreshTokenStore.delete(tokenHash);
      return null;
    }

    // Token Rotation: odmah opozovi stari refresh token
    refreshTokenStore.delete(tokenHash);
    revokedTokens.add(tokenHash);

    // Dohvati identitet
    const vault = getGlobalVault();
    const identity = vault.retrieveIdentity(stored.userId);
    if (!identity) return null;

    // Izdaj nove tokene
    const accessToken = await this.issueToken(
      identity,
      ['digital_industry:read', 'digital_industry:write'],
      'ACCESS'
    );
    const newRefreshToken = await this.issueRefreshToken(identity);

    return { accessToken, refreshToken: newRefreshToken, userId: stored.userId };
  }

  // revokeAll — opoziva sve tokene korisnika
  static revokeAll(userId: string): void {
    // Opozivi sve access tokene za ovog korisnika
    for (const [hash, data] of tokenStore.entries()) {
      if (data.identity.id === userId) {
        revokedTokens.add(hash);
        tokenStore.delete(hash);
      }
    }

    // Opozivi sve refresh tokene
    for (const [hash, data] of refreshTokenStore.entries()) {
      if (data.userId === userId) {
        revokedTokens.add(hash);
        refreshTokenStore.delete(hash);
      }
    }
  }

  // revokeToken — opoziva jedan token
  static revokeToken(tokenValue: string): void {
    const hash = ΩCryptoEngine.hashSHA256(tokenValue);
    revokedTokens.add(hash);
    tokenStore.delete(hash);
    refreshTokenStore.delete(hash);
  }

  // login — prijava korisnika
  static async login(
    request: ΩLoginRequest
  ): Promise<ΩLoginResponse | null> {
    const vault = getGlobalVault();

    // Pronađi korisnika po email-u
    const allIds = vault.listIds();
    let identity: ΩIdentity | null = null;

    for (const id of allIds) {
      const candidate = vault.retrieveIdentity(id);
      if (candidate?.email === request.email) {
        identity = candidate;
        break;
      }
    }

    if (!identity) return null;

    // Provjeri 2FA ako je omogućeno
    if (identity.mfaEnabled) {
      if (!request.totpCode) {
        return null; // Potreban TOTP kod
      }
      // TOTP verifikacija
      const totpSecret = getStoredTOTPSecret(identity.id);
      if (!totpSecret) return null;
      if (!ΩCryptoEngine.verifyTOTP(totpSecret, request.totpCode)) {
        return null;
      }
    }

    // Izdaj tokene
    const scopes: ΩScope[] = ['digital_industry:read', 'digital_industry:write'];
    if (identity.clearanceLevel >= ΩClearanceLevel.ADMIN) {
      scopes.push('digital_industry:admin', 'audit:read', 'users:manage');
    }
    if (identity.clearanceLevel >= ΩClearanceLevel.OMEGA_CORE) {
      scopes.push('omega_core:access');
    }

    const accessToken = await this.issueToken(identity, scopes, 'ACCESS');
    const refreshTokenToken = await this.issueRefreshToken(identity);

    // Ažuriraj lastLoginAt
    const updatedIdentity: ΩIdentity = { ...identity, lastLoginAt: Date.now() };
    vault.storeIdentity(updatedIdentity);

    return {
      token: accessToken,
      refreshToken: refreshTokenToken,
      identity: updatedIdentity,
      expiresAt: accessToken.expiresAt,
    };
  }

  // registerAPIKey — registruje API ključ za identitet
  // API ključ se čuva kao HMAC-SHA256 sa server-side tajnim ključem (ne obični SHA-256)
  static registerAPIKey(key: string, identity: ΩIdentity): void {
    apiKeyStore.set(ΩCryptoEngine.hmacSHA256(key, this.JWT_SECRET), { identity });
  }

  // extractTokenFromHeader — izvlači token iz Authorization headera
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;
    const match = /^Bearer\s+(.+)$/i.exec(authHeader);
    return match ? match[1] : null;
  }

  // Private: verifikuje JWT token
  private static async verifyJWT(token: string): Promise<ΩIdentity | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, payload, sig] = parts;
      const message = `${header}.${payload}`;
      const expectedSig = ΩCryptoEngine.hmacSHA256(message, this.JWT_SECRET);
      const expectedSigB64 = Buffer.from(expectedSig).toString('base64url');

      // Timing-safe komparacija
      if (!ΩCryptoEngine.timingSafeCompare(sig, expectedSigB64)) return null;

      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
        sub: string;
        exp: number;
        clearance: ΩClearanceLevel;
        roles: string[];
        scope: ΩScope[];
        did: string;
        type: string;
      };

      // Provjeri expiry
      if (Date.now() / 1000 > decoded.exp) return null;

      // Dohvati identity iz vaulta (Zero Trust: uvek verifikuj iz izvora)
      const vault = getGlobalVault();
      const storedIdentity = vault.retrieveIdentity(decoded.sub);

      if (storedIdentity) return storedIdentity;

      // Fallback: koristi podatke iz tokena
      return {
        id: decoded.sub,
        did: decoded.did,
        publicKey: '',
        roles: decoded.roles,
        clearanceLevel: decoded.clearance,
        digitalIndustryAccess: true,
        mfaEnabled: false,
        createdAt: 0,
      };
    } catch {
      return null;
    }
  }

  // Private: verifikuje API ključ (koristi HMAC-SHA256 sa server-side tajnim ključem)
  private static verifyAPIKey(key: string): ΩIdentity | null {
    const hash = ΩCryptoEngine.hmacSHA256(key, this.JWT_SECRET);
    const stored = apiKeyStore.get(hash);
    return stored?.identity ?? null;
  }
}

// In-memory TOTP store (u produkciji: enkriptovana baza)
const totpSecretStore = new Map<string, string>();

export function storeTOTPSecret(userId: string, secret: string): void {
  totpSecretStore.set(userId, secret);
}

export function getStoredTOTPSecret(userId: string): string | null {
  return totpSecretStore.get(userId) ?? null;
}

export function deleteTOTPSecret(userId: string): void {
  totpSecretStore.delete(userId);
}
