import type { NextRequest } from 'next/server';
import { GET as listGET } from '../../app/api/repozit/route';
import { GET as detailGET } from '../../app/api/repozit/[id]/route';
import { GET as healthGET } from '../../app/api/repozit/health/route';

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
  console.log('\n🔗 [repozit] route tests\n');

  await test('GET /api/repozit/health returns 200 and headers', async () => {
    const response = await healthGET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Repozit-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { status: string } };
    assert(body.data.status === 'ok', `expected health status ok, got ${body.data.status}`);
  });

  await test('GET /api/repozit returns paginated list', async () => {
    const response = await listGET(makeRequest('http://localhost/api/repozit?page=1&pageSize=5'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { items: unknown[]; total: number; pageSize: number } };
    assert(body.data.total > 0, 'total must be > 0');
    assert(body.data.items.length <= 5, 'items should be paginated');
    assert(body.data.pageSize === 5, 'pageSize should be 5');
  });

  await test('GET /api/repozit query filter works', async () => {
    const response = await listGET(makeRequest('http://localhost/api/repozit?query=IO-OPENUI-AO'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { items: Array<{ id: string }> } };
    assert(body.data.items.some((item) => item.id === 'io-openui-ao'), 'expected io-openui-ao in filtered results');
  });

  await test('GET /api/repozit invalid status returns 400', async () => {
    const response = await listGET(makeRequest('http://localhost/api/repozit?status=invalid'));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('GET /api/repozit/[id] returns details', async () => {
    const response = await detailGET(
      makeRequest('http://localhost/api/repozit/ai-iq-super-platforma'),
      { params: Promise.resolve({ id: 'ai-iq-super-platforma' }) },
    );
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { id: string; metadata: { syncStatus: string } } };
    assert(body.data.id === 'ai-iq-super-platforma', 'id mismatch');
    assert(typeof body.data.metadata.syncStatus === 'string', 'metadata.syncStatus should be present');
  });

  await test('GET /api/repozit/[id] missing repo returns 404', async () => {
    const response = await detailGET(
      makeRequest('http://localhost/api/repozit/not-found'),
      { params: Promise.resolve({ id: 'not-found' }) },
    );
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
