import fs from 'node:fs';
import path from 'node:path';
import { POST as gatewayPost, GET as gatewayGet } from '../../app/api/platforms/[platformId]/[...path]/route';
import { GET as healthGet } from '../../app/api/platforms/health/route';
import { POST as syncPost } from '../../app/api/platforms/sync/route';
import { POST as tokenPost } from '../../app/api/auth/token/route';
import { createPlatformScopedSession } from '../../lib/platform-auth/unified-auth';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function makeRequest(url: string, method: 'GET' | 'POST', token: string, body?: Record<string, unknown>) {
  return new Request(url, {
    method,
    headers: {
      authorization: ['Bearer', token].join(' '),
      'x-forwarded-for': '127.0.0.1',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Platform Integration Test Suite\n');

  const { accessToken, refreshToken } = createPlatformScopedSession('owner');

  await test('required files exist', () => {
    const paths = [
      'src/lib/platform-gateway/router.ts',
      'src/lib/platform-gateway/middleware.ts',
      'src/lib/platform-auth/unified-auth.ts',
      'src/lib/realtime/event-bus.ts',
      'src/lib/api-contracts/platforms.ts',
      'contracts/IntegratedPlatformHub.sol',
      'supabase/migrations/018_unified_platform_integration.sql',
    ];

    for (const rel of paths) {
      const abs = path.resolve(process.cwd(), rel);
      assert(fs.existsSync(abs), `Missing: ${rel}`);
    }
  });

  let accountId = '';

  await test('POST/GET world-bank account works through gateway', async () => {
    const createReq = makeRequest(
      'http://localhost/api/platforms/world-bank/accounts',
      'POST',
      accessToken,
      {
        userId: '4f4d337b-b9bc-4668-a20f-0fcf842d0f24',
        accountNumber: 'RS35000000000000123456',
        currency: 'USD',
        blockchainAddress: '0x1111111111111111111111111111111111111111',
        initialBalance: 1500,
      },
    );

    const createRes = await gatewayPost(createReq as never, {
      params: Promise.resolve({ platformId: 'world-bank', path: ['accounts'] }),
    });

    assert(createRes.status === 201, `Expected 201, got ${createRes.status}`);
    const created = (await createRes.json()) as {
      data?: { account?: { id?: string } };
    };
    accountId = created.data?.account?.id ?? '';
    assert(typeof accountId === 'string' && accountId.length > 0, 'account id');

    const getReq = makeRequest(
      `http://localhost/api/platforms/world-bank/accounts/${accountId}`,
      'GET',
      accessToken,
    );

    const getRes = await gatewayGet(getReq as never, {
      params: Promise.resolve({ platformId: 'world-bank', path: ['accounts', accountId] }),
    });
    assert(getRes.status === 200, `Expected 200, got ${getRes.status}`);
  });

  await test('POST /api/platforms/sync triggers sync', async () => {
    const req = makeRequest('http://localhost/api/platforms/sync', 'POST', accessToken, {
      sourcePlatform: 'world-bank',
      targetPlatform: 'menja-nica',
      eventType: 'wallet.updated',
      payload: {
        walletId: 'w-1',
        userId: '4f4d337b-b9bc-4668-a20f-0fcf842d0f24',
        balance: 100,
        currency: 'USD',
      },
    });

    const res = await syncPost(req as never);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const body = (await res.json()) as { data?: { triggered?: boolean } };
    assert(body.data?.triggered === true, 'sync triggered');
  });

  await test('GET /api/platforms/health returns unified health', async () => {
    const req = makeRequest('http://localhost/api/platforms/health', 'GET', accessToken);
    const res = await healthGet(req as never);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('POST /api/auth/token refreshes token', async () => {
    const req = new Request('http://localhost/api/auth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ refreshToken }),
    });

    const res = await tokenPost(req as never);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const body = (await res.json()) as { data?: { accessToken?: string } };
    assert(typeof body.data?.accessToken === 'string', 'access token in response');
  });

  console.log(`\n🏁 Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n❌ Failed tests:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Critical error in test runner:', e);
  process.exit(1);
});
