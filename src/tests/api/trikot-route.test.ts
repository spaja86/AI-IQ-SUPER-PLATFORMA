import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/trikot/health/route';
import { POST } from '../../app/api/trikot/evaluate/route';
import {
  _resetTrikotMetrics,
  TRIKOT_API_RESPONSE_MAX_MS,
  TRIKOT_CONTRACT_VERSION,
  TRIKOT_MODULE_VERSION,
  TRIKOT_PERSONA_ID,
} from '../../lib/trikot';

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
  return new Request('http://localhost/api/trikot/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetTrikotMetrics();

  console.log('\n🔗 [trikot] route tests\n');

  await test('GET /api/trikot/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Contract-Version') === TRIKOT_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Trikot-Module-Version') === TRIKOT_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= TRIKOT_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${TRIKOT_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === TRIKOT_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/trikot/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'FORMAL',
      season: 'WINTER',
      dressCode: 'STRICT',
      comfortScore: 88,
      weatherFitScore: 90,
      budgetFitScore: 82,
      mobilityScore: 78,
      maintenanceRisk: 20,
      prepTimeHours: 8,
      accessoryComplexity: 3,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Contract-Version') === TRIKOT_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Trikot-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Trikot-Status') === 'PRIME', 'unexpected status header');
    assert(elapsed <= TRIKOT_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${TRIKOT_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string; recommendedAction: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'PRIME', `expected PRIME, got ${body.data.status}`);
    assert(body.data.recommendedAction === 'LOCK_COMBINATION', `expected LOCK_COMBINATION, got ${body.data.recommendedAction}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/trikot/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'NIGHT',
      season: 'WINTER',
      dressCode: 'STRICT',
      comfortScore: 60,
      weatherFitScore: 60,
      budgetFitScore: 60,
      mobilityScore: 60,
      maintenanceRisk: 30,
      prepTimeHours: 6,
      accessoryComplexity: 3,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Contract-Version') === TRIKOT_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Trikot-Valid') === 'false', 'invalid branch must set X-Trikot-Valid=false');
    assert(response.headers.get('X-Trikot-Status') === null, 'invalid branch must not expose X-Trikot-Status');
    assert(response.headers.get('X-Trikot-Action') === null, 'invalid branch must not expose X-Trikot-Action');

    const body = await response.json() as {
      code: string;
      details?: {
        data?: { valid?: boolean; disclaimer?: string };
        validation?: { valid?: boolean; objective?: string };
      };
    };
    assert(body.code === 'UNPROCESSABLE_ENTITY', `expected UNPROCESSABLE_ENTITY, got ${body.code}`);
    assert(body.details?.validation?.valid === false, 'invalid result details should include valid=false');
    assert(body.details?.validation?.objective === 'NIGHT', 'invalid enum value should be preserved in validation details');
    assert(body.details?.data?.valid === false, 'full invalid result payload should be returned in details.data');
    assert((body.details?.data?.disclaimer ?? '').length > 0, 'invalid payload should include disclaimer');
  });

  await test('POST /api/trikot/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/trikot/evaluate', {
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

  await test('POST /api/trikot/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      season: 'SUMMER',
      dressCode: 'RELAXED',
      comfortScore: 60,
      weatherFitScore: 60,
      budgetFitScore: 60,
      mobilityScore: 60,
      maintenanceRisk: 30,
      prepTimeHours: 3,
      accessoryComplexity: 2,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Valid') === null, 'shape-validation failures must not include TRIKOT evaluation headers');
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'objective is required (string)', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/trikot/evaluate returns 400 for empty string objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: '',
      season: 'SUMMER',
      dressCode: 'RELAXED',
      comfortScore: 60,
      weatherFitScore: 60,
      budgetFitScore: 60,
      mobilityScore: 60,
      maintenanceRisk: 30,
      prepTimeHours: 3,
      accessoryComplexity: 2,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'objective must be a non-empty string', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/trikot/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'SPORT',
      season: 'SPRING',
      dressCode: 'RELAXED',
      comfortScore: '80',
      weatherFitScore: 85,
      budgetFitScore: 70,
      mobilityScore: 90,
      maintenanceRisk: 20,
      prepTimeHours: 2,
      accessoryComplexity: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Valid') === null, 'shape-validation failures must not include TRIKOT evaluation headers');
    assert(response.headers.get('X-Trikot-Status') === null, 'shape-validation failures must not include status headers');
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'comfortScore must be a number', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/trikot/evaluate returns 400 for non-numeric field value', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'SPORT',
      season: 'SPRING',
      dressCode: 'RELAXED',
      comfortScore: null,
      weatherFitScore: 85,
      budgetFitScore: 70,
      mobilityScore: 90,
      maintenanceRisk: 20,
      prepTimeHours: 2,
      accessoryComplexity: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Trikot-Valid') === null, 'shape-validation failures must not include TRIKOT evaluation headers');
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'comfortScore must be a number', `unexpected error message: ${body.error}`);
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
