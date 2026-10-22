import { ΩAuthProvider } from '../../lib/auth/omega-auth';
import { ΩClearanceLevel, type ΩIdentity } from '../../lib/auth/types';
import { randomBytes } from 'crypto';
import { POST } from '../../app/api/deploy-platforma/trigger/route';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assert failed: ${message}`);
  }
}

let accessToken = '';
function makeRequest(body: unknown, token = accessToken): Request {
  return new Request('http://localhost/api/deploy-platforma/trigger', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-omega-user': 'spoofed-admin',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function runTests(): Promise<void> {
  console.log('\n🧪 Deploy Platforma Trigger Route Test Suite\n');

  process.env.OMEGA_JWT_SECRET = randomBytes(32).toString('hex');
  const identity: ΩIdentity = { id: 'deploy-test-admin', did: 'did:test:admin', publicKey: '', roles: ['admin'], clearanceLevel: ΩClearanceLevel.ADMIN, digitalIndustryAccess: true, mfaEnabled: false, createdAt: Date.now() };
  accessToken = (await ΩAuthProvider.issueToken(identity, [])).value;
  await test('rejects spoofed identity without Bearer token', async () => {
    assert((await POST(makeRequest({}, '') as never)).status === 401, 'must reject anonymous request');
  });
  await test('rejects tampered signature', async () => {
    assert((await POST(makeRequest({}, accessToken + 'x') as never)).status === 401, 'must reject invalid signature');
  });
  await test('rejects non-admin ACCESS token', async () => {
    const token = await ΩAuthProvider.issueToken({ ...identity, id: 'deploy-test-user', clearanceLevel: ΩClearanceLevel.USER }, []);
    assert((await POST(makeRequest({}, token.value) as never)).status === 403, 'must reject non-admin');
  });
  await test('rejects REFRESH token', async () => {
    const token = await ΩAuthProvider.issueToken(identity, [], 'REFRESH');
    assert((await POST(makeRequest({}, token.value) as never)).status === 401, 'must reject refresh token');
  });
  await test('fails closed without signing configuration', async () => {
    const secret = process.env.OMEGA_JWT_SECRET;
    delete process.env.OMEGA_JWT_SECRET;
    try { assert((await POST(makeRequest({}) as never)).status === 503, 'must fail closed'); }
    finally { process.env.OMEGA_JWT_SECRET = secret; }
  });

  await test('Mekartor alias does not bypass ACCESS or ADMIN authorization', async () => {
    const body = { platformId: 'mekartor', environment: 'staging' };
    assert((await POST(makeRequest(body, '') as never)).status === 401, 'alias must require ACCESS token');
    const token = await ΩAuthProvider.issueToken({ ...identity, id: 'alias-test-user', clearanceLevel: ΩClearanceLevel.USER }, []);
    assert((await POST(makeRequest(body, token.value) as never)).status === 403, 'alias must require ADMIN');
  });

  await test('rejects offline providers and invalid JSON body shapes', async () => {
    for (const provider of ['spaja-local', 'unknown', null]) {
      assert((await POST(makeRequest({ provider, platformId: 'ai-iq-super-platforma', environment: 'dev' }) as never)).status === 400, 'must not trigger Vercel');
    }
    for (const body of [null, [], 1, 'spaja-local']) {
      assert((await POST(makeRequest(body) as never)).status === 400, 'must reject invalid shape');
    }
  });

  await test('vraća 400 kada platformId nedostaje', async () => {
    const response = await POST(makeRequest({ environment: 'staging' }) as never);
    assert(response.status === 400, `očekivan status 400, dobijen ${response.status}`);
  });

  await test('vraća 400 kada environment nije validan', async () => {
    const response = await POST(makeRequest({ platformId: 'ai-iq-super-platforma', environment: 'local' }) as never);
    assert(response.status === 400, `očekivan status 400, dobijen ${response.status}`);
  });

  await test('vraća 422 kada production gate token nije ispravan', async () => {
    const response = await POST(
      makeRequest({
        platformId: 'ai-iq-super-platforma',
        environment: 'production',
        confirmToken: 'WRONG_TOKEN',
      }) as never,
    );

    assert(response.status === 422, `očekivan status 422, dobijen ${response.status}`);
    const json = await response.json() as { success?: boolean; result?: { message?: string } };
    assert(json.success === false, 'success mora biti false');
    assert(
      (json.result?.message ?? '').includes('DEPLOY_PRODUCTION'),
      'poruka mora referisati DEPLOY_PRODUCTION gate',
    );
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Kritična greška test runnera:', error);
  process.exit(1);
});
