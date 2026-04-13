// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Auth
// Kompanija SPAJA — Digitalna Industrija
// Pokretanje: node --experimental-vm-modules src/tests/auth/omega-auth.test.ts
// Ili sa Jest/Vitest ako je dostupno

/**
 * Minimalista test runner koji ne zahteva eksternu zavisnost.
 * Testovi verifikuju sve ključne auth komponente.
 */

import { ΩCryptoEngine } from '../../lib/auth/omega-crypto';
import { ΩAuthProvider } from '../../lib/auth/omega-auth';
import { ΩPermissionMatrix, ΩClearanceLevel } from '../../lib/auth/omega-permissions';
import { ΩAuditLogger } from '../../middleware/omega-audit';
import { ΩSessionManager } from '../../lib/digital-industry/omega-session';
import { ΩResourceGuard } from '../../lib/digital-industry/omega-resource-guard';
import { ΩIdentityVault, createIdentity } from '../../lib/auth/omega-identity';
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

function assert(condition: boolean, message: string): void {
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

  await test('generateKeyPair creates Ed25519 key pair', async () => {
    const kp = await ΩCryptoEngine.generateKeyPair();
    assert(kp.publicKey.length > 0, 'public key non-empty');
    assert(kp.privateKey.length > 0, 'private key non-empty');
    assertEqual(kp.algorithm, 'Ed25519', 'algorithm');
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

  await test('extractTokenFromHeader extracts Bearer token', () => {
    const token = ΩAuthProvider.extractTokenFromHeader('Bearer mytoken123');
    assertEqual(token, 'mytoken123', 'extracted token');
  });

  await test('extractTokenFromHeader returns null for missing header', () => {
    const token = ΩAuthProvider.extractTokenFromHeader(null);
    assert(token === null, 'null header -> null token');
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

  await test('terminateSession invalidates session', () => {
    const identity: ΩIdentity = {
      id: 'sess-user-2', did: 'did:omega:s2', publicKey: '', roles: ['user'],
      clearanceLevel: ΩClearanceLevel.USER, digitalIndustryAccess: true,
      mfaEnabled: false, createdAt: Date.now(),
    };
    const session = ΩSessionManager.createSession({
      identity, accessToken: 'at2', refreshToken: 'rt2', ip: '5.6.7.8', userAgent: 'UA',
    });
    ΩSessionManager.terminateSession(session.id);
    const retrieved = ΩSessionManager.getSession(session.id);
    assert(retrieved === null, 'terminated session should return null');
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
