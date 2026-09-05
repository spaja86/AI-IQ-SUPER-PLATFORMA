import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/duet/health/route';
import { POST } from '../../app/api/duet/evaluate/route';
import {
  _resetDuetMetrics,
  DUET_API_RESPONSE_MAX_MS,
  DUET_CONTRACT_VERSION,
  DUET_MODULE_VERSION,
  DUET_PERSONA_ID,
} from '../../lib/duet';

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
  return new Request('http://localhost/api/duet/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDuetMetrics();

  console.log('\n🎼 [duet] route tests\n');

  await test('GET /api/duet/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Duet-Contract-Version') === DUET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Duet-Module-Version') === DUET_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= DUET_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${DUET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === DUET_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/duet/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'CREATE',
      mode: 'HYBRID',
      energyMatch: 'HIGH',
      clarityScore: 82,
      reciprocityScore: 78,
      trustScore: 84,
      rhythmScore: 86,
      tensionLevel: 18,
      sharedWindowHours: 24,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Duet-Contract-Version') === DUET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Duet-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Duet-Status') === 'HARMONIZED', 'unexpected status header');
    assert(elapsed <= DUET_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${DUET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      data: { valid: boolean; status: string; disclaimer: string; recommendedAction: string };
    };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'HARMONIZED', `expected HARMONIZED, got ${body.data.status}`);
    assert(body.data.recommendedAction === 'LOCK_DUET', `expected LOCK_DUET, got ${body.data.recommendedAction}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/duet/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'IMPROVISE',
      mode: 'LIVE',
      energyMatch: 'HIGH',
      clarityScore: 60,
      reciprocityScore: 55,
      trustScore: 58,
      rhythmScore: 64,
      tensionLevel: 20,
      sharedWindowHours: 6,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/duet/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/duet/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { error: string; code: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'Invalid JSON body', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/duet/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'LIVE',
      energyMatch: 'HIGH',
      clarityScore: 60,
      reciprocityScore: 55,
      trustScore: 58,
      rhythmScore: 64,
      tensionLevel: 20,
      sharedWindowHours: 6,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/duet/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'CREATE',
      mode: 'LIVE',
      energyMatch: 'HIGH',
      clarityScore: '60',
      reciprocityScore: 55,
      trustScore: 58,
      rhythmScore: 64,
      tensionLevel: 20,
      sharedWindowHours: 6,
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
