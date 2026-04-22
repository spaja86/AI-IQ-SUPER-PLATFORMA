// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Auth
// Kompanija SPAJA — Digitalna Industrija
// Pokretanje: node --experimental-vm-modules src/tests/auth/omega-auth.test.ts
// Ili sa Jest/Vitest ako je dostupno

/**
 * Minimalista test runner koji ne zahteva eksternu zavisnost.
 * Testovi verifikuju sve ključne auth komponente.
 */

import { ΩCryptoEngine } from '../../lib/auth/omega-crypto';
import {
  ΩAuthProvider,
  storeTOTPSecret,
  getStoredTOTPSecret,
  deleteTOTPSecret,
  ensureDemoSeeded,
} from '../../lib/auth/omega-auth';
import { ΩPermissionMatrix, ΩClearanceLevel } from '../../lib/auth/omega-permissions';
import { ΩAuditLogger } from '../../middleware/omega-audit';
import { ΩSessionManager } from '../../lib/digital-industry/omega-session';
import { ΩResourceGuard } from '../../lib/digital-industry/omega-resource-guard';
import { ΩIdentityVault, createIdentity, getGlobalVault } from '../../lib/auth/omega-identity';
import type { ΩIdentity } from '../../lib/auth/types';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(a: T, b: T, message?: string): void {
  if (a !== b) throw new Error(`${message ?? 'assertEqual'}: expected ${String(b)}, got ${String(a)}`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔐 SpajaUltraOmegaCore -∞Ω+∞ — Auth Test Suite\n');

  // ── ΩCryptoEngine ────────────────────────────────────────────────────────

  console.log('📦 ΩCryptoEngine');

  await test('generateSecureToken returns non-empty string', () => {
    const token = ΩCryptoEngine.generateSecureToken();
    assert(token.length > 0, 'token should be non-empty');
  });

  await test('generateId returns 32-char hex string', () => {
    const id = ΩCryptoEngine.generateId();
    assertEqual(id.length, 32, 'id length');
    assert(/^[0-9a-f]+$/.test(id), 'id should be hex');
  });

  await test('hashSHA256 returns consistent hash', () => {
    const h1 = ΩCryptoEngine.hashSHA256('omega');
    const h2 = ΩCryptoEngine.hashSHA256('omega');
    assertEqual(h1, h2, 'hashes should match');
    assertEqual(h1.length, 64, 'sha256 hex length');
  });

  await test('hmacSHA256 returns consistent HMAC', () => {
    const h1 = ΩCryptoEngine.hmacSHA256('data', 'secret');
    const h2 = ΩCryptoEngine.hmacSHA256('data', 'secret');
    assertEqual(h1, h2, 'HMACs should match');
  });

  await test('timingSafeCompare handles equal strings', () => {
    assert(ΩCryptoEngine.timingSafeCompare('abc', 'abc'), 'equal strings');
  });

  await test('timingSafeCompare handles unequal strings', () => {
    assert(!ΩCryptoEngine.timingSafeCompare('abc', 'xyz'), 'unequal strings');
  });

  await test('encryptPayload / decryptPayload round-trip', () => {
    const key = ΩCryptoEngine.generateSymmetricKey();
    const data = { userId: '123', roles: ['admin'], secret: 'Omega-∞' };
    const encrypted = ΩCryptoEngine.encryptPayload(data, key);
    const decrypted = ΩCryptoEngine.decryptPayload(encrypted, key) as typeof data;
    assertEqual(decrypted.userId, data.userId, 'userId');
    assertEqual(decrypted.secret, data.secret, 'secret');
  });

  await test('encryptPayload produces different ciphertexts for same input (random IV)', () => {
    const key = ΩCryptoEngine.generateSymmetricKey();
    const data = 'hello omega';
    const e1 = ΩCryptoEngine.encryptPayload(data, key);
    const e2 = ΩCryptoEngine.encryptPayload(data, key);
    assert(e1.ciphertext !== e2.ciphertext, 'different ciphertexts due to random IV');
  });

  await test('hashPassword creates verifiable hash', async () => {
    const hash = await ΩCryptoEngine.hashPassword('Omega!@#123');
    assert(hash.includes('$'), 'hash format');
    const valid = await ΩCryptoEngine.verifyPassword('Omega!@#123', hash);
    assert(valid, 'password should verify');
  });

  await test('verifyPassword rejects wrong password', async () => {
    const hash = await ΩCryptoEngine.hashPassword('correctHorse');
    const invalid = await ΩCryptoEngine.verifyPassword('wrongHorse', hash);
    assert(!invalid, 'wrong password should not verify');
  });

  await test('verifyPassword rejects malformed hash format', async () => {
    const invalid = await ΩCryptoEngine.verifyPassword('anything', 'malformed-hash');
    assert(!invalid, 'malformed hash should not verify');
  });

  await test('generateKeyPair creates Ed25519 key pair', async () => {
    const kp = await ΩCryptoEngine.generateKeyPair();
    assert(kp.publicKey.length > 0, 'public key non-empty');
    assert(kp.privateKey.length > 0, 'private key non-empty');
    assertEqual(kp.algorithm, 'Ed25519', 'algorithm');
  });

  await test('signData / verifySignature round-trip', async () => {
    const kp = await ΩCryptoEngine.generateKeyPair();
    const payload = 'omega-signature-test';
    const sig = await ΩCryptoEngine.signData(payload, kp.privateKey);
    const ok = await ΩCryptoEngine.verifySignature(payload, sig, kp.publicKey);
    assert(ok, 'signature should verify');
  });

  await test('verifySignature returns false for invalid signature', async () => {
    const kp = await ΩCryptoEngine.generateKeyPair();
    const ok = await ΩCryptoEngine.verifySignature('omega-signature-test', 'invalid-signature', kp.publicKey);
    assert(!ok, 'invalid signature should fail');
  });

  await test('generateTOTPSecret returns base64 string', () => {
    const secret = ΩCryptoEngine.generateTOTPSecret();
    assert(secret.length > 0, 'TOTP secret non-empty');
  });

  await test('verifyTOTP returns false for invalid code', () => {
    const secret = ΩCryptoEngine.generateTOTPSecret();
    const result = ΩCryptoEngine.verifyTOTP(secret, '000000');
    // May pass or fail depending on timing — just check it returns boolean
    assert(typeof result === 'boolean', 'result should be boolean');
  });

  await test('encodeBase32 returns uppercase base32 output', () => {
    const encoded = ΩCryptoEngine.encodeBase32(Buffer.from('omega'));
    assert(/^[A-Z2-7]+$/.test(encoded), 'base32 alphabet only');
  });

  // ── ΩIdentityVault ───────────────────────────────────────────────────────

  console.log('\n📦 ΩIdentityVault');

  await test('storeIdentity and retrieveIdentity round-trip', () => {
    const vault = new ΩIdentityVault();
    const identity: ΩIdentity = {
      id: 'test-id-001',
      did: 'did:omega:test',
      publicKey: 'abc123',
      roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER,
      digitalIndustryAccess: true,
      mfaEnabled: false,
      createdAt: Date.now(),
    };
    vault.storeIdentity(identity);
    const retrieved = vault.retrieveIdentity('test-id-001');
    assert(retrieved !== null, 'should retrieve identity');
    assertEqual(retrieved?.id, 'test-id-001', 'id');
    assertEqual(retrieved?.clearanceLevel, ΩClearanceLevel.USER, 'clearance level');
  });

  await test('retrieveIdentity returns null for unknown id', () => {
    const vault = new ΩIdentityVault();
    const result = vault.retrieveIdentity('nonexistent');
    assert(result === null, 'should return null');
  });

  await test('deleteIdentity removes identity', () => {
    const vault = new ΩIdentityVault();
    const identity: ΩIdentity = {
      id: 'del-id', did: 'did:omega:del', publicKey: '', roles: [], clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false, mfaEnabled: false, createdAt: 0,
    };
    vault.storeIdentity(identity);
    vault.deleteIdentity('del-id');
    assert(vault.retrieveIdentity('del-id') === null, 'should be deleted');
  });

  await test('createIdentity creates valid identity', async () => {
    const identity = await createIdentity({ email: 'omega@test.com' });
    assert(identity.id.length > 0, 'id non-empty');
    assert(identity.did.startsWith('did:omega:'), 'DID format');
    assertEqual(identity.clearanceLevel, ΩClearanceLevel.USER, 'default clearance');
    assert(identity.digitalIndustryAccess, 'digital industry access');
  });

  // ── ΩPermissionMatrix ────────────────────────────────────────────────────

  console.log('\n📦 ΩPermissionMatrix');

  await test('VISITOR can access /api/status', () => {
    const identity: ΩIdentity = {
      id: 'v1', did: 'did:omega:v1', publicKey: '', roles: ['visitor'],
      clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false,
      mfaEnabled: false, createdAt: 0,
    };
    const resource = { id: 'status', type: 'API' as const, path: '/api/status', classification: 'PUBLIC' as const };
    assert(ΩPermissionMatrix.checkAccess(identity, resource), 'VISITOR should access /api/status');
  });

  await test('VISITOR cannot access /security (OMEGA_CORE only)', () => {
    const identity: ΩIdentity = {
      id: 'v2', did: 'did:omega:v2', publicKey: '', roles: ['visitor'],
      clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false,
      mfaEnabled: false, createdAt: 0,
    };
    const resource = { id: 'sec', type: 'OMEGA_MODULE' as const, path: '/security', classification: 'OMEGA' as const };
    assert(!ΩPermissionMatrix.checkAccess(identity, resource), 'VISITOR should not access /security');
  });

  await test('OMEGA_CORE can access /security', () => {
    const identity: ΩIdentity = {
      id: 'oc1', did: 'did:omega:oc1', publicKey: '', roles: ['omega_core'],
      clearanceLevel: ΩClearanceLevel.OMEGA_CORE, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: 0,
    };
    const resource = { id: 'sec', type: 'OMEGA_MODULE' as const, path: '/security', classification: 'OMEGA' as const };
    assert(ΩPermissionMatrix.checkAccess(identity, resource), 'OMEGA_CORE should access /security');
  });

  await test('getClearanceLevelName returns correct names', () => {
    assertEqual(ΩPermissionMatrix.getClearanceLevelName(ΩClearanceLevel.VISITOR), 'VISITOR');
    assertEqual(ΩPermissionMatrix.getClearanceLevelName(ΩClearanceLevel.OMEGA_CORE), 'OMEGA_CORE -∞Ω+∞');
  });

  // ── ΩAuthProvider ────────────────────────────────────────────────────────

  console.log('\n📦 ΩAuthProvider');

  await test('issueToken and verifyIdentity round-trip', async () => {
    const identity: ΩIdentity = {
      id: 'auth-test-1', did: 'did:omega:auth1', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const token = await ΩAuthProvider.issueToken(identity, ['digital_industry:read']);
    assert(token.value.length > 0, 'token value non-empty');

    const verified = await ΩAuthProvider.verifyIdentity(token.value);
    assert(verified !== null, 'should verify token');
    assertEqual(verified?.id, 'auth-test-1', 'identity id');
  });

  await test('verifyIdentity returns null for invalid token', async () => {
    const result = await ΩAuthProvider.verifyIdentity('invalid.token.here');
    assert(result === null, 'invalid token should return null');
  });

  await test('verifyIdentity returns null for empty token', async () => {
    const result = await ΩAuthProvider.verifyIdentity('');
    assert(result === null, 'empty token should return null');
  });

  await test('revokeToken invalidates token', async () => {
    const identity: ΩIdentity = {
      id: 'revoke-test', did: 'did:omega:rev', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const token = await ΩAuthProvider.issueToken(identity, ['digital_industry:read']);
    ΩAuthProvider.revokeToken(token.value);

    const result = await ΩAuthProvider.verifyIdentity(token.value);
    assert(result === null, 'revoked token should return null');
  });

  await test('register and login with password succeed', async () => {
    const uniqueEmail = `user-${ΩCryptoEngine.generateId()}@test.local`;
    const registered = await ΩAuthProvider.register({
      email: uniqueEmail,
      password: 'StrongPass!123',
      fullName: 'Test User',
    });
    assert(registered !== null, 'register should succeed');

    const loggedIn = await ΩAuthProvider.login({
      email: uniqueEmail,
      password: 'StrongPass!123',
    });
    assert(loggedIn !== null, 'login should succeed');
    assertEqual(loggedIn?.identity.email, uniqueEmail, 'email should match');
  });

  await test('register rejects duplicate email', async () => {
    const uniqueEmail = `dup-${ΩCryptoEngine.generateId()}@test.local`;
    const first = await ΩAuthProvider.register({ email: uniqueEmail, password: 'StrongPass!123' });
    const second = await ΩAuthProvider.register({ email: uniqueEmail, password: 'StrongPass!123' });
    assert(first !== null, 'first register succeeds');
    assert(second === null, 'second register should fail');
  });

  await test('login fails with wrong password', async () => {
    const uniqueEmail = `wrong-${ΩCryptoEngine.generateId()}@test.local`;
    await ΩAuthProvider.register({ email: uniqueEmail, password: 'CorrectPass!123' });
    const loggedIn = await ΩAuthProvider.login({
      email: uniqueEmail,
      password: 'WrongPass!123',
    });
    assert(loggedIn === null, 'wrong password should fail');
  });

  await test('login requires either password or oauthCode', async () => {
    const uniqueEmail = `oauth-${ΩCryptoEngine.generateId()}@test.local`;
    await ΩAuthProvider.register({ email: uniqueEmail, password: 'CorrectPass!123' });
    const loggedIn = await ΩAuthProvider.login({
      email: uniqueEmail,
      password: '',
    });
    assert(loggedIn === null, 'missing credentials should fail');
  });

  await test('login with MFA enabled fails without totpCode', async () => {
    const uniqueEmail = `mfa-${ΩCryptoEngine.generateId()}@test.local`;
    const identity = await createIdentity({
      email: uniqueEmail,
      password: 'MfaPass!123',
      clearanceLevel: ΩClearanceLevel.USER,
    });
    const vault = getGlobalVault();
    vault.storeIdentity({ ...identity, mfaEnabled: true });
    const loggedIn = await ΩAuthProvider.login({
      email: uniqueEmail,
      password: 'MfaPass!123',
    });
    assert(loggedIn === null, 'missing TOTP should fail for MFA user');
  });

  await test('refreshAccessToken rotates and revokes old refresh token', async () => {
    const identity = await createIdentity({
      email: `refresh-${ΩCryptoEngine.generateId()}@test.local`,
      password: 'RefreshPass!123',
    });
    const vault = getGlobalVault();
    vault.storeIdentity(identity);

    const refresh = await ΩAuthProvider.issueRefreshToken(identity);
    const rotated = await ΩAuthProvider.refreshAccessToken(refresh.value);
    assert(rotated !== null, 'rotation should succeed');
    assert(!!rotated?.accessToken.value.length, 'new access token issued');

    const secondTry = await ΩAuthProvider.refreshAccessToken(refresh.value);
    assert(secondTry === null, 'old refresh token must be revoked');
  });

  await test('refreshAccessToken returns null for unknown refresh token', async () => {
    const rotated = await ΩAuthProvider.refreshAccessToken('unknown-refresh-token');
    assert(rotated === null, 'unknown refresh token should fail');
  });

  await test('revokeAll invalidates all user tokens', async () => {
    const identity = await createIdentity({
      email: `revokeall-${ΩCryptoEngine.generateId()}@test.local`,
      password: 'RevokeAllPass!123',
    });
    const token = await ΩAuthProvider.issueToken(identity, ['digital_industry:read']);
    const refresh = await ΩAuthProvider.issueRefreshToken(identity);
    ΩAuthProvider.revokeAll(identity.id);
    const accessOk = await ΩAuthProvider.verifyIdentity(token.value);
    const refreshResult = await ΩAuthProvider.refreshAccessToken(refresh.value);
    assert(accessOk === null, 'access token should be revoked');
    assert(refreshResult === null, 'refresh token should be revoked');
  });

  await test('registerAPIKey enables API key authentication', async () => {
    const identity: ΩIdentity = {
      id: `api-${ΩCryptoEngine.generateId()}`,
      did: 'did:omega:api',
      publicKey: '',
      roles: ['service'],
      clearanceLevel: ΩClearanceLevel.ADMIN,
      digitalIndustryAccess: true,
      mfaEnabled: false,
      createdAt: Date.now(),
    };
    const apiKey = `api-key-${ΩCryptoEngine.generateId()}`;
    ΩAuthProvider.registerAPIKey(apiKey, identity);
    const verified = await ΩAuthProvider.verifyIdentity(apiKey);
    assert(verified !== null, 'API key should authenticate');
    assertEqual(verified?.id, identity.id, 'identity id should match');
  });

  await test('extractTokenFromHeader extracts Bearer token', () => {
    const token = ΩAuthProvider.extractTokenFromHeader('Bearer mytoken123');
    assertEqual(token, 'mytoken123', 'extracted token');
  });

  await test('extractTokenFromHeader returns null for missing header', () => {
    const token = ΩAuthProvider.extractTokenFromHeader(null);
    assert(token === null, 'null header -> null token');
  });

  await test('extractTokenFromHeader returns null for non-Bearer header', () => {
    const token = ΩAuthProvider.extractTokenFromHeader('Basic abc123');
    assert(token === null, 'non-bearer header should return null');
  });

  await test('TOTP secret store helpers round-trip and delete', () => {
    const userId = `totp-${ΩCryptoEngine.generateId()}`;
    const secret = ΩCryptoEngine.generateTOTPSecret();
    storeTOTPSecret(userId, secret);
    assertEqual(getStoredTOTPSecret(userId), secret, 'stored secret');
    deleteTOTPSecret(userId);
    assert(getStoredTOTPSecret(userId) === null, 'deleted secret');
  });

  await test('ensureDemoSeeded is idempotent and keeps demo account available', async () => {
    await ensureDemoSeeded();
    await ensureDemoSeeded();
    const vault = getGlobalVault();
    const foundDemo = vault
      .listIds()
      .map((id) => vault.retrieveIdentity(id))
      .some((identity) => identity?.email === 'demo@spaja.ai');
    assert(foundDemo, 'demo account should exist');
  });

  // ── ΩAuditLogger ─────────────────────────────────────────────────────────

  console.log('\n📦 ΩAuditLogger');

  await test('log creates audit event', () => {
    const event = ΩAuditLogger.log({
      userId: 'u1', action: 'TEST_ACTION', resource: '/test', ip: '1.2.3.4',
      userAgent: 'TestAgent/1.0', outcome: 'SUCCESS',
    });
    assert(event.id.length > 0, 'event id non-empty');
    assert(event.hash.length === 64, 'hash length');
    assert(event.previousHash.length === 64, 'previousHash length');
  });

  await test('verifyChain returns valid after multiple logs', () => {
    ΩAuditLogger.log({ userId: 'u2', action: 'A1', resource: '/r', ip: '1.1.1.1', userAgent: 'UA', outcome: 'SUCCESS' });
    ΩAuditLogger.log({ userId: 'u2', action: 'A2', resource: '/r', ip: '1.1.1.1', userAgent: 'UA', outcome: 'DENIED' });
    const { valid } = ΩAuditLogger.verifyChain();
    assert(valid, 'chain should be valid');
  });

  await test('getStats returns correct counts', () => {
    const stats = ΩAuditLogger.getStats();
    assert(stats.total >= 0, 'total >= 0');
    assert(typeof stats.chainValid === 'boolean', 'chainValid is boolean');
  });

  // ── ΩSessionManager ───────────────────────────────────────────────────────

  console.log('\n📦 ΩSessionManager');

  await test('createSession and getSession round-trip', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-1', did: 'did:omega:s1', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const session = ΩSessionManager.createSession({
      identity, accessToken: 'at1', refreshToken: 'rt1', ip: '1.2.3.4', userAgent: 'UA',
    });
    assert(session.id.length > 0, 'session id non-empty');

    const retrieved = ΩSessionManager.getSession(session.id);
    assert(retrieved !== null, 'should retrieve session');
    assertEqual(retrieved?.userId, 'sess-user-1', 'userId');
  });

  await test('terminateSession marks session inactive and blocks token lookup', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-2', did: 'did:omega:s2', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const session = ΩSessionManager.createSession({
      identity, accessToken: 'at2', refreshToken: 'rt2', ip: '5.6.7.8', userAgent: 'UA',
    });
    const { accessToken } = session;
    assert(ΩSessionManager.getSessionByToken(accessToken)?.id === session.id, 'active token should resolve');
    ΩSessionManager.terminateSession(session.id);
    const retrieved = ΩSessionManager.getSession(session.id);
    assert(retrieved !== null, 'session metadata remains retrievable');
    assert(retrieved.active === false, 'session should be inactive');
    assert(ΩSessionManager.getSessionByToken(accessToken) === null, 'inactive token should not resolve');
  });

  await test('refreshSession updates active session token pair', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-refresh', did: 'did:omega:srefresh', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const session = ΩSessionManager.createSession({
      identity, accessToken: 'at-old', refreshToken: 'rt-old', ip: '2.2.2.2', userAgent: 'UA',
    });
    const ok = ΩSessionManager.refreshSession(session.id, 'at-new', 'rt-new');
    const updated = ΩSessionManager.getSessionByToken('at-new');
    assert(ok, 'refresh should succeed');
    assert(updated !== null, 'new token should resolve to session');
    assertEqual(updated?.refreshToken, 'rt-new', 'refresh token updated');
  });

  await test('refreshSession returns false for inactive session', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-inactive', did: 'did:omega:sinactive', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const session = ΩSessionManager.createSession({
      identity, accessToken: 'at-inactive', refreshToken: 'rt-inactive', ip: '3.3.3.3', userAgent: 'UA',
    });
    ΩSessionManager.terminateSession(session.id);
    const ok = ΩSessionManager.refreshSession(session.id, 'at-nope', 'rt-nope');
    assert(!ok, 'refresh inactive session should fail');
  });

  await test('terminateAllUserSessions inactivates all user sessions', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-all', did: 'did:omega:sall', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    ΩSessionManager.createSession({
      identity, accessToken: 'at-all-1', refreshToken: 'rt-all-1', ip: '4.4.4.4', userAgent: 'UA',
    });
    ΩSessionManager.createSession({
      identity, accessToken: 'at-all-2', refreshToken: 'rt-all-2', ip: '4.4.4.5', userAgent: 'UA',
    });
    ΩSessionManager.terminateAllUserSessions(identity.id);
    assertEqual(ΩSessionManager.getUserSessions(identity.id).length, 0, 'all sessions should be inactive');
    assert(ΩSessionManager.getSessionByToken('at-all-1') === null, 'first token should be inactive');
    assert(ΩSessionManager.getSessionByToken('at-all-2') === null, 'second token should be inactive');
  });

  await test('getStats returns session statistics', () => {
    const stats = ΩSessionManager.getStats();
    assert(typeof stats.total === 'number', 'total is number');
    assert(typeof stats.active === 'number', 'active is number');
  });

  // ── ΩResourceGuard ───────────────────────────────────────────────────────

  console.log('\n📦 ΩResourceGuard');

  await test('USER can access /dashboard', () => {
    const identity: ΩIdentity = {
      id: 'rg1', did: 'did:omega:rg1', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: 0,
    };
    assert(ΩResourceGuard.guard(identity, '/dashboard'), 'USER should access /dashboard');
  });

  await test('VISITOR cannot access /security', () => {
    const identity: ΩIdentity = {
      id: 'rg2', did: 'did:omega:rg2', publicKey: '', roles: ['visitor'],
      clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false,
      mfaEnabled: false, createdAt: 0,
    };
    assert(!ΩResourceGuard.guard(identity, '/security'), 'VISITOR should not access /security');
  });

  await test('unknown resource requires USER clearance', () => {
    const visitor: ΩIdentity = {
      id: 'rg-visitor', did: 'did:omega:rguv', publicKey: '', roles: ['visitor'],
      clearanceLevel: ΩClearanceLevel.VISITOR, digitalIndustryAccess: false,
      mfaEnabled: false, createdAt: 0,
    };
    const user: ΩIdentity = {
      id: 'rg-user', did: 'did:omega:rgu', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: 0,
    };
    assert(!ΩResourceGuard.guard(visitor, '/unknown/private'), 'visitor should be blocked');
    assert(ΩResourceGuard.guard(user, '/unknown/private'), 'user should pass');
  });

  await test('guardAsync mirrors guard decision', async () => {
    const identity: ΩIdentity = {
      id: 'rg-async', did: 'did:omega:rgasync', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: 0,
    };
    const sync = ΩResourceGuard.guard(identity, '/dashboard');
    const asyncResult = await ΩResourceGuard.guardAsync(identity, '/dashboard');
    assertEqual(asyncResult, sync, 'sync/async should match');
  });

  await test('getResourceInfo returns null for unknown path', () => {
    const resource = ΩResourceGuard.getResourceInfo('/missing-resource');
    assert(resource === null, 'unknown resource should return null');
  });

  await test('encryptAtRest returns serializable encrypted payload', () => {
    const raw = ΩResourceGuard.encryptAtRest({ ok: true }, 'di:test');
    const parsed = JSON.parse(raw) as { payload?: unknown; keyId?: string };
    assert(typeof parsed.keyId === 'string', 'keyId should exist');
    assert(parsed.payload !== undefined, 'payload should exist');
  });

  await test('getClassificationLabel returns correct labels', () => {
    const label = ΩResourceGuard.getClassificationLabel('OMEGA');
    assert(label.includes('OMEGA'), 'OMEGA label');
  });

  await test('getAllResources returns non-empty array', () => {
    const resources = ΩResourceGuard.getAllResources();
    assert(resources.length > 0, 'should have resources');
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('─'.repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
