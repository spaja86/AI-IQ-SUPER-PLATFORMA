import type { NextRequest } from 'next/server';
import { GET as listGET } from '../../app/api/base/route';
import { GET as detailGET } from '../../app/api/base/[id]/route';
import { GET as healthGET } from '../../app/api/base/health/route';
import { resetSupabaseServerPoolState } from '../../lib/supabase/server';

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

function makeRequest(url: string): NextRequest {
  return new Request(url, { method: 'GET' }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  resetSupabaseServerPoolState();

  console.log('\n🔗 [base] route tests\n');

  await test('GET /api/base/health returns 200 and headers', async () => {
    const response = await healthGET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Base-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { sportId: string; supabasePool: { poolName: string } } };
    assert(body.data.sportId === 'base-jumping', `unexpected sportId: ${body.data.sportId}`);
    assert(body.data.supabasePool.poolName === 'base', 'missing base pool snapshot');
  });

  await test('GET /api/base returns paginated list', async () => {
    const response = await listGET(makeRequest('http://localhost/api/base?page=1&pageSize=2'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { items: unknown[]; total: number; pageSize: number } };
    assert(body.data.total === 3, `expected total 3, got ${body.data.total}`);
    assert(body.data.items.length === 2, `expected 2 items, got ${body.data.items.length}`);
    assert(body.data.pageSize === 2, `expected pageSize 2, got ${body.data.pageSize}`);
  });

  await test('GET /api/base status filter works', async () => {
    const response = await listGET(makeRequest('http://localhost/api/base?status=weather-hold'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { items: Array<{ id: string; status: string }> } };
    assert(body.data.items.length === 1, `expected 1 item, got ${body.data.items.length}`);
    assert(body.data.items[0]?.id === 'base-urban-vector', 'unexpected filtered item');
  });

  await test('GET /api/base invalid status returns 400', async () => {
    const response = await listGET(makeRequest('http://localhost/api/base?status=invalid'));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('GET /api/base/[id] returns details', async () => {
    const response = await detailGET(makeRequest('http://localhost/api/base/base-alpine-zero'), {
      params: Promise.resolve({ id: 'base-alpine-zero' }),
    });
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { id: string; sportId: string } };
    assert(body.data.id === 'base-alpine-zero', `unexpected id: ${body.data.id}`);
    assert(body.data.sportId === 'base-jumping', `unexpected sportId: ${body.data.sportId}`);
  });

  await test('GET /api/base/[id] missing pool returns 404', async () => {
    const response = await detailGET(makeRequest('http://localhost/api/base/missing'), {
      params: Promise.resolve({ id: 'missing' }),
    });
    assert(response.status === 404, `expected 404, got ${response.status}`);
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
