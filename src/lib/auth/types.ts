// SpajaUltraOmegaCore -∞Ω+∞ — Authentication Types
// Kompanija SPAJA — Digitalna Industrija

// ΩToken — kriptografski potpisani token
export interface ΩToken {
  value: string;
  type: 'ACCESS' | 'REFRESH' | 'API_KEY' | 'SERVICE';
  issuedAt: number;
  expiresAt: number;
  scope: ΩScope[];
  signature: string; // Ed25519
  quantumSafe: boolean;
}

// ΩScope — opseg pristupa
export type ΩScope =
  | 'digital_industry:read'
  | 'digital_industry:write'
  | 'digital_industry:admin'
  | 'omega_core:access'
  | 'audit:read'
  | 'users:manage'
  | string;

// ΩResource — zaštićeni resurs
export interface ΩResource {
  id: string;
  type: 'API' | 'DATA' | 'SERVICE' | 'UI' | 'OMEGA_MODULE';
  path: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'TOP_SECRET' | 'OMEGA';
}

// ΩSecurityPolicy — bezbednosna politika
export interface ΩSecurityPolicy {
  zeroTrust: true; // Uvek true — ne može biti false
  mfaRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  quantumSafeRequired: boolean;
  auditLevel: 'BASIC' | 'FULL' | 'PARANOID';
}

// ΩKeyPair — par kriptografskih ključeva
export interface ΩKeyPair {
  publicKey: string; // hex
  privateKey: string; // hex
  algorithm: 'Ed25519' | 'CRYSTALS-Dilithium';
  createdAt: number;
}

// ΩKey — kriptografski ključ
export interface ΩKey {
  value: string; // hex
  algorithm: 'AES-256-GCM' | 'CRYSTALS-Kyber';
  createdAt: number;
}

// ΩEncryptedPayload — enkriptovani sadržaj
export interface ΩEncryptedPayload {
  ciphertext: string; // base64
  iv: string; // base64
  authTag: string; // base64
  algorithm: string;
  keyId?: string;
}

// ΩClearanceLevel — nivo bezbednosnog klirensa
export enum ΩClearanceLevel {
  VISITOR = 0,
  USER = 1,
  OPERATOR = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
  OMEGA_CORE = 5, // -∞Ω+∞
}

// ΩIdentity — digitalni identitet korisnika
export interface ΩIdentity {
  id: string;
  did: string; // Decentralized Identifier (DID)
  publicKey: string; // Ed25519 public key hex
  roles: string[];
  clearanceLevel: ΩClearanceLevel;
  digitalIndustryAccess: boolean;
  email?: string;
  passwordHash?: string; // PBKDF2-SHA512 hash lozinke
  mfaEnabled: boolean;
  createdAt: number;
  lastLoginAt?: number;
}

// ΩAuditEvent — revizijski događaj
export interface ΩAuditEvent {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  outcome: 'SUCCESS' | 'DENIED' | 'ERROR';
  previousHash: string;
  hash: string; // SHA-256 hash ovog događaja + previousHash
  details?: Record<string, unknown>;
}

// ΩSession — korisnička sesija
export interface ΩSession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
  active: boolean;
}

// ΩLoginRequest — zahtev za prijavu
export interface ΩLoginRequest {
  email: string;
  password: string;
  totpCode?: string;
  oauthProvider?: 'github' | 'google';
  oauthCode?: string;
}

// ΩLoginResponse — odgovor na prijavu
export interface ΩLoginResponse {
  token: ΩToken;
  refreshToken: ΩToken;
  identity: ΩIdentity;
  expiresAt: number;
  requiresMfa?: boolean;
}

// DEFAULT_SECURITY_POLICY — podrazumevana bezbednosna politika
export const DEFAULT_SECURITY_POLICY: ΩSecurityPolicy = {
  zeroTrust: true,
  mfaRequired: false,
  sessionTimeout: 3600, // 1 sat
  maxLoginAttempts: 5,
  quantumSafeRequired: false,
  auditLevel: 'FULL',
};

// MAX_SESSIONS — maksimalni broj aktivnih sesija po korisniku
export const MAX_SESSIONS = 5;

// ACCESS_TOKEN_TTL — vreme trajanja access tokena (1 sat)
export const ACCESS_TOKEN_TTL = 3600;

// REFRESH_TOKEN_TTL — vreme trajanja refresh tokena (30 dana)
export const REFRESH_TOKEN_TTL = 30 * 24 * 3600;
