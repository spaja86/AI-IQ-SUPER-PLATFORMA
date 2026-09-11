import type { NextRequest } from 'next/server';
import { POST as postLogin } from '../../app/api/login/route';
import { POST as postAuthLogin } from '../../app/api/auth/login/route';
import { ensureDemoSeeded, ΩAuthProvider } from '../../lib/auth/omega-auth';
import { getGlobalVault } from '../../lib/auth/omega-identity';

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

async function createTestAccount(params: {
  roles: string[];
  digitalIndustryAccess: boolean;
}): Promise<{ email: string; password: string }> {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const email = `login-pretplata-${suffix}@spaja.ai`;
  const password = 'Demo2024!';
  const registered = await ΩAuthProvider.register({ email, password });
  if (!registered) throw new Error('Failed to register test account');

  const vault = getGlobalVault();
  vault.storeIdentity({
    ...registered.identity,
    roles: params.roles,
    digitalIndustryAccess: params.digitalIndustryAccess,
  });

  return { email, password };
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
    const account = await createTestAccount({
      roles: ['user', 'demo', 'subscription-pending'],
      digitalIndustryAccess: true,
    });

    const response = await postLogin(makeLoginRequest(account));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; goNoGo: string };
      pristup: { industrija: boolean; platforme: boolean };
    };
    assert(body.pretplata.status === 'cekanje', `expected cekanje, got ${body.pretplata.status}`);
    assert(body.pretplata.goNoGo === 'no-go', `expected no-go, got ${body.pretplata.goNoGo}`);
    assert(body.pristup.industrija === false, 'pending status must deny industry');
    assert(body.pristup.platforme === true, 'pending status must keep platform access');
  });

  await test('POST /api/auth/login still authenticates but returns blocked pretplata snapshot', async () => {
    const account = await createTestAccount({
      roles: ['user', 'demo', 'subscription-blocked'],
      digitalIndustryAccess: true,
    });

    const response = await postAuthLogin(makeAuthLoginRequest(account));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; goNoGo: string };
      pristup: { industrija: boolean };
    };
    assert(body.pretplata.status === 'blokiran', `expected blokiran, got ${body.pretplata.status}`);
    assert(body.pretplata.goNoGo === 'no-go', `expected no-go, got ${body.pretplata.goNoGo}`);
    assert(body.pristup.industrija === false, 'blocked status must deny industry');
  });

  await test('POST /api/login returns blocked pretplata snapshot for subscription-blocked role', async () => {
    const account = await createTestAccount({
      roles: ['user', 'demo', 'subscription-blocked'],
      digitalIndustryAccess: true,
    });

    const response = await postLogin(makeLoginRequest(account));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; goNoGo: string };
      pristup: { industrija: boolean };
    };
    assert(body.pretplata.status === 'blokiran', `expected blokiran, got ${body.pretplata.status}`);
    assert(body.pretplata.goNoGo === 'no-go', `expected no-go, got ${body.pretplata.goNoGo}`);
    assert(body.pristup.industrija === false, 'blocked status must deny industry');
  });

  await test('POST /api/login enters failover/degraded path when digitalIndustryAccess is false', async () => {
    const account = await createTestAccount({
      roles: ['user', 'demo'],
      digitalIndustryAccess: false,
    });

    const response = await postLogin(makeLoginRequest(account));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as {
      pretplata: { status: string; razlog: string };
      pristup: { industrija: boolean };
    };
    assert(body.pretplata.status === 'blokiran', `expected blokiran, got ${body.pretplata.status}`);
    assert(body.pristup.industrija === false, 'degraded path must deny industry');
    assert(
      body.pretplata.razlog.toLowerCase().includes('digitalna industrija'),
      `expected degraded reason mentioning digital industry, got: ${body.pretplata.razlog}`,
    );
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
