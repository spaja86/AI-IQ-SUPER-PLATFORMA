import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/paraksil/health/route';
import { POST } from '../../app/api/paraksil/evaluate/route';
import { _resetParaksilMetrics } from '../../lib/paraksil';

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
  return new Request('http://localhost/api/paraksil/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetParaksilMetrics();

  console.log('\n🔗 [paraksil] route tests\n');

  await test('GET /api/paraksil/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Paraksil-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Paraksil-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'paraksil-validator-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/paraksil/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      target: {
        moduleId: 'trenazer',
        moduleVersion: '1.0.0',
        suite: 'API',
      },
      metrics: {
        totalChecks: 16,
        passedChecks: 16,
        failedChecks: 0,
        avgLatencyMs: 80,
        errorRatePct: 0,
        coveragePct: 96,
      },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Paraksil-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'READY', `expected READY, got ${body.data.status}`);
  });

  await test('POST /api/paraksil/evaluate returns 422 for invalid domain payload', async () => {
    const response = await POST(makeEvaluateRequest({
      target: {
        moduleId: 'broken-module',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: 4,
        passedChecks: 3,
        failedChecks: 2,
        avgLatencyMs: 10,
        errorRatePct: 0,
        coveragePct: 95,
      },
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/paraksil/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/paraksil/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/paraksil/evaluate returns 400 when metrics is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      target: {
        moduleId: 'missing-metrics',
        suite: 'FULL',
      },
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/paraksil/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      target: {
        moduleId: 'shape-mismatch',
        suite: 'API',
      },
      metrics: {
        totalChecks: '10',
        passedChecks: 10,
        failedChecks: 0,
        avgLatencyMs: 30,
        errorRatePct: 0,
        coveragePct: 100,
      },
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
