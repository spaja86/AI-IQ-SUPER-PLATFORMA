import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/durit-ekser-far-dir-dor-dar-ekstribusen/health/route';
import { POST } from '../../app/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate/route';
import { _resetDuritEkserFarDirDorDarEkstribusenMetrics } from '../../lib/durit-ekser-far-dir-dor-dar-ekstribusen';

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
  return new Request('http://localhost/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDuritEkserFarDirDorDarEkstribusenMetrics();

  console.log('\n🔗 [durit-ekser-far-dir-dor-dar-ekstribusen] route tests\n');

  await test('GET /health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Durit-Ekstribusen-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Durit-Ekstribusen-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'durit-ekser-ekstribusen-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      start: 2,
      end: 8,
      step: 2,
      target: 5,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Durit-Ekstribusen-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'EKSTRIBUSEN', `expected EKSTRIBUSEN, got ${body.data.status}`);
  });

  await test('POST /evaluate returns 422 for degraded guard-stop payload', async () => {
    const response = await POST(makeEvaluateRequest({
      start: 0,
      end: 50,
      step: 1,
      target: 25,
      maxIterations: 5,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === false, 'result should be invalid');
    assert(body.data.status === 'DEGRADED', `expected DEGRADED, got ${body.data.status}`);
  });

  await test('POST /evaluate returns 422 for contradictory thresholds', async () => {
    const response = await POST(makeEvaluateRequest({
      start: 1,
      end: 3,
      step: 1,
      target: 2,
      minimumScore: 90,
      targetScore: 80,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
  });

  await test('POST /evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /evaluate returns 400 for shallow type mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      start: '2',
      end: 8,
      step: 2,
      target: 5,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
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
