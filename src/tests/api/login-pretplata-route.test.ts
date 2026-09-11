import type { NextRequest } from 'next/server';
import { POST as postLogin } from '../../app/api/login/route';
import { POST as postAuthLogin } from '../../app/api/auth/login/route';
import { ensureDemoSeeded } from '../../lib/auth/omega-auth';
import { getGlobalVault } from '../../lib/auth/omega-identity';
import type { ΩIdentity } from '../../lib/auth/types';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function makeLoginRequest(body: unknown): Request {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeAuthLoginRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function getDemoIdentity(): ΩIdentity {
  const vault = getGlobalVault();
  const demoId = vault.listIds().find((id) => vault.retrieveIdentity(id)?.email === 'demo@spaja.ai');
  if (!demoId) throw new Error('Demo identity not found');
  const identity = vault.retrieveIdentity(demoId);
  if (!identity) throw new Error('Demo identity could not be loaded');
  return identity;
}

function setDemoIdentityPatch(patch: Partial<ΩIdentity>): ΩIdentity {
  const vault = getGlobalVault();
  const identity = getDemoIdentity();
  const next: ΩIdentity = { ...identity, ...patch };
  vault.storeIdentity(next);
  return identity;
}

function restoreDemoIdentity(identity: ΩIdentity): void {
  const vault = getGlobalVault();
  vault.storeIdentity(identity);
}

async function runTests(): Promise<void> {
  await ensureDemoSeeded();

  console.log('\n🔐 [login-pretplata] route E2E tests\n');

  await test('POST /api/login returns aktivan pretplata for demo user', async () => {
    const response = await postLogin(makeLoginRequest({
      email: 'demo@spaja.ai',
      password: 'Demo2024!',
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; goNoGo: string };
      pristup: { industrija: boolean };
    };
    assert(body.pretplata.status === 'aktivan', `expected aktivan, got ${body.pretplata.status}`);
    assert(body.pretplata.goNoGo === 'go', `expected go, got ${body.pretplata.goNoGo}`);
    assert(body.pristup.industrija === true, 'expected industry access for aktivan status');
  });

  await test('POST /api/auth/login returns aktivan pretplata for demo user', async () => {
    const response = await postAuthLogin(makeAuthLoginRequest({
      email: 'demo@spaja.ai',
      password: 'Demo2024!',
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; goNoGo: string };
      pristup: { industrija: boolean };
    };
    assert(body.pretplata.status === 'aktivan', `expected aktivan, got ${body.pretplata.status}`);
    assert(body.pretplata.goNoGo === 'go', `expected go, got ${body.pretplata.goNoGo}`);
    assert(body.pristup.industrija === true, 'expected industry access for aktivan status');
  });

  await test('POST /api/login supports login without active pretplata (cekanje)', async () => {
    const original = setDemoIdentityPatch({
      roles: ['user', 'demo', 'subscription-pending'],
      digitalIndustryAccess: true,
    });
    try {
      const response = await postLogin(makeLoginRequest({
        email: 'demo@spaja.ai',
        password: 'Demo2024!',
      }));
      assert(response.status === 200, `expected 200, got ${response.status}`);
      const body = await response.json() as {
        pretplata: { status: string; goNoGo: string };
        pristup: { industrija: boolean; platforme: boolean };
      };
      assert(body.pretplata.status === 'cekanje', `expected cekanje, got ${body.pretplata.status}`);
      assert(body.pretplata.goNoGo === 'no-go', `expected no-go, got ${body.pretplata.goNoGo}`);
      assert(body.pristup.industrija === false, 'pending status must deny industry');
      assert(body.pristup.platforme === true, 'pending status must keep platform access');
    } finally {
      restoreDemoIdentity(original);
    }
  });

  await test('POST /api/auth/login blocks access when pretplata is blocked', async () => {
    const original = setDemoIdentityPatch({
      roles: ['user', 'demo', 'subscription-blocked'],
      digitalIndustryAccess: true,
    });
    try {
      const response = await postAuthLogin(makeAuthLoginRequest({
        email: 'demo@spaja.ai',
        password: 'Demo2024!',
      }));
      assert(response.status === 403, `expected 403, got ${response.status}`);
      const body = await response.json() as {
        pretplata: { status: string; goNoGo: string };
      };
      assert(body.pretplata.status === 'blokiran', `expected blokiran, got ${body.pretplata.status}`);
      assert(body.pretplata.goNoGo === 'no-go', `expected no-go, got ${body.pretplata.goNoGo}`);
    } finally {
      restoreDemoIdentity(original);
    }
  });

  await test('POST /api/login enters failover/degraded path when digitalIndustryAccess is false', async () => {
    const original = setDemoIdentityPatch({
      roles: ['user', 'demo'],
      digitalIndustryAccess: false,
    });
    try {
      const response = await postLogin(makeLoginRequest({
        email: 'demo@spaja.ai',
        password: 'Demo2024!',
      }));
      assert(response.status === 403, `expected 403, got ${response.status}`);
      const body = await response.json() as {
        pretplata: { status: string; razlog: string };
      };
      assert(body.pretplata.status === 'blokiran', `expected blokiran, got ${body.pretplata.status}`);
      assert(
        body.pretplata.razlog.toLowerCase().includes('digitalna industrija'),
        `expected degraded reason mentioning digital industry, got: ${body.pretplata.razlog}`,
      );
    } finally {
      restoreDemoIdentity(original);
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
