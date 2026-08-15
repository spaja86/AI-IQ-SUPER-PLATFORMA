import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/dumbir/health/route';
import { POST } from '../../app/api/dumbir/evaluate/route';
import {
  _resetDumbirMetrics,
  DUMBIR_API_RESPONSE_MAX_MS,
  DUMBIR_CONTRACT_VERSION,
  DUMBIR_MODULE_VERSION,
  DUMBIR_PERSONA_ID,
} from '../../lib/dumbir';

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
  return new Request('http://localhost/api/dumbir/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDumbirMetrics();

  console.log('\n🔗 [dumbir] route tests\n');

  await test('GET /api/dumbir/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Dumbir-Contract-Version') === DUMBIR_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Dumbir-Module-Version') === DUMBIR_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= DUMBIR_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${DUMBIR_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === DUMBIR_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/dumbir/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      goal: 'DIGESTION',
      sensitivity: 'MEDIUM',
      preparation: 'TEA',
      gingerGrams: 12,
      waterMl: 320,
      steepMinutes: 8,
      servings: 2,
      addons: ['LEMON', 'MINT'],
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Dumbir-Contract-Version') === DUMBIR_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Dumbir-Valid') === 'true', 'missing valid header');
    assert(elapsed <= DUMBIR_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${DUMBIR_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'BOOSTED', `expected BOOSTED, got ${body.data.status}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/dumbir/evaluate returns 422 for unsupported addon', async () => {
    const response = await POST(makeEvaluateRequest({
      goal: 'DIGESTION',
      sensitivity: 'LOW',
      preparation: 'TEA',
      gingerGrams: 8,
      waterMl: 250,
      steepMinutes: 5,
      addons: ['PEPPER'],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/dumbir/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/dumbir/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dumbir/evaluate returns 400 when goal is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      sensitivity: 'LOW',
      preparation: 'TEA',
      gingerGrams: 8,
      waterMl: 250,
      steepMinutes: 5,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dumbir/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      goal: 'DIGESTION',
      sensitivity: 'LOW',
      preparation: 'TEA',
      gingerGrams: '8',
      waterMl: 250,
      steepMinutes: 5,
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
