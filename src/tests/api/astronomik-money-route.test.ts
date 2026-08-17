// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/astronomik-money/health/route';
import { POST } from '../../app/api/astronomik-money/evaluate/route';
import { _resetAstronomikMetrics, ASTRONOMIK_API_RESPONSE_MAX_MS } from '../../lib/astronomik-money';

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

function makeEvaluateRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/astronomik-money/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validPayload = {
  referenceId: 'route-test-1',
  assets: [
    { id: 'a1', name: 'Alpha', class: 'PLANET', value: 100000, mass: 2.0 },
    { id: 'a2', name: 'Beta', class: 'STAR', value: 50000, mass: 1.5 },
    { id: 'a3', name: 'Gamma', class: 'PULSAR', value: 30000, mass: 1.0 },
  ],
};

async function runTests(): Promise<void> {
  _resetAstronomikMetrics();

  console.log('\n🔗 [astronomik-money] route tests\n');

  await test('GET /api/astronomik-money/health returns 200 and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Astronomik-Contract-Version') === 'v1',
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Astronomik-Module-Version') === '1.0.0',
      'missing module version header',
    );
    assert(
      elapsed <= ASTRONOMIK_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${ASTRONOMIK_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(
      body.data.personaId === 'astronomik-money-core',
      `unexpected personaId: ${body.data.personaId}`,
    );
  });

  await test('POST /api/astronomik-money/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest(validPayload));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Astronomik-Contract-Version') === 'v1',
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Astronomik-Valid') === 'true',
      'missing valid header',
    );
    assert(
      elapsed <= ASTRONOMIK_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${ASTRONOMIK_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as {
      data: { valid: boolean; tier: string; disclaimer: string; score: { total: number } };
    };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(typeof body.data.tier === 'string', 'tier must be a string');
    assert(body.data.score.total >= 0 && body.data.score.total <= 1000, 'score out of range');
  });

  await test('POST /api/astronomik-money/evaluate returns 400 for missing assets', async () => {
    const response = await POST(makeEvaluateRequest({ referenceId: 'no-assets' }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/astronomik-money/evaluate returns 400 for empty assets', async () => {
    const response = await POST(makeEvaluateRequest({ assets: [] }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/astronomik-money/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/astronomik-money/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;
    const response = await POST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/astronomik-money/evaluate disclaimer is always present', async () => {
    const response = await POST(makeEvaluateRequest(validPayload));
    const body = await response.json() as { data: { disclaimer: string } };
    assert(body.data.disclaimer.length > 0, 'disclaimer must always be present');
    assert(
      body.data.disclaimer === 'Astronomik Money is a simulation engine. This is not financial advice.',
      'disclaimer content mismatch',
    );
  });

  await test('POST /api/astronomik-money/evaluate returns 422 for invalid portfolio (VOID_PORTFOLIO)', async () => {
    // null-value assets pass array check but engine marks them invalid
    const response = await POST(makeEvaluateRequest({ referenceId: 'void', assets: [null] }));
    assert([400, 422].includes(response.status), `expected 400 or 422 for invalid portfolio, got ${response.status}`);
  });

  await test('POST with cosmic events reduces resilience in response', async () => {
    const withEvent = {
      ...validPayload,
      activeEvents: [{ type: 'SUPERNOVA', severity: 1.0 }],
    };
    const response = await POST(makeEvaluateRequest(withEvent));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { score: { cosmicResilience: number } } };
    assert(body.data.score.cosmicResilience < 200, 'SUPERNOVA should reduce cosmic resilience');
  });
}

runTests().then(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
});
