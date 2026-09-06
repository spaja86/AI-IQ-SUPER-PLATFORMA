import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/nude/health/route';
import { POST } from '../../app/api/nude/evaluate/route';
import {
  _resetNudeMetrics,
  NUDE_API_RESPONSE_MAX_MS,
  NUDE_CONTRACT_VERSION,
  NUDE_MODULE_VERSION,
  NUDE_PERSONA_ID,
} from '../../lib/nude';

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
  return new Request('http://localhost/api/nude/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetNudeMetrics();

  console.log('\n🔗 [nude] route tests\n');

  await test('GET /api/nude/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Nude-Contract-Version') === NUDE_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Nude-Module-Version') === NUDE_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= NUDE_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${NUDE_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === NUDE_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/nude/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      mode: 'FOCUS',
      environment: 'WORK',
      priority: 'MEDIUM',
      stressLevel: 42,
      contextLoad: 58,
      sessionMinutes: 75,
      breaksTaken: 2,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Nude-Contract-Version') === NUDE_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Nude-Valid') === 'true', 'missing valid header');
    assert(elapsed <= NUDE_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${NUDE_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'BALANCED', `expected BALANCED, got ${body.data.status}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/nude/evaluate returns 422 for domain-invalid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'FOCUS',
      environment: 'WORK',
      priority: 'MEDIUM',
      stressLevel: -10,
      contextLoad: 58,
      sessionMinutes: 75,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/nude/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/nude/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/nude/evaluate returns 400 when mode is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      environment: 'WORK',
      priority: 'MEDIUM',
      stressLevel: 42,
      contextLoad: 58,
      sessionMinutes: 75,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/nude/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'FOCUS',
      environment: 'WORK',
      priority: 'MEDIUM',
      stressLevel: '42',
      contextLoad: 58,
      sessionMinutes: 75,
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
