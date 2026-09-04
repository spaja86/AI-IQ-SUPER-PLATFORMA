import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/direkt/health/route';
import { POST } from '../../app/api/direkt/evaluate/route';
import { _resetDirektMetrics } from '../../lib/direkt';

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
  return new Request('http://localhost/api/direkt/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDirektMetrics();

  console.log('\n🔗 [direkt] route tests\n');

  await test('GET /api/direkt/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Direkt-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Direkt-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'direkt-communication-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/direkt/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      signals: [
        { id: 'clarity', label: 'Clarity', score: 90, weight: 0.4, required: true, exampleCount: 2 },
        { id: 'specificity', label: 'Specificity', score: 80, weight: 0.3, required: true, exampleCount: 1 },
        { id: 'actionability', label: 'Actionability', score: 78, weight: 0.2, required: true, exampleCount: 1 },
        { id: 'respect', label: 'Respect', score: 88, weight: 0.1, required: true, exampleCount: 1 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Direkt-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'DIRECT', `expected DIRECT, got ${body.data.status}`);
  });

  await test('POST /api/direkt/evaluate returns 422 for failed required signal', async () => {
    const response = await POST(makeEvaluateRequest({
      minimumScore: 70,
      signals: [
        { id: 'clarity', label: 'Clarity', score: 60, weight: 1, required: true, exampleCount: 1 },
      ],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/direkt/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/direkt/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/direkt/evaluate returns 400 when signals is missing', async () => {
    const response = await POST(makeEvaluateRequest({}));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/direkt/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      signals: [{ id: 'clarity', label: 'Clarity', score: '90', weight: 1 }],
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
