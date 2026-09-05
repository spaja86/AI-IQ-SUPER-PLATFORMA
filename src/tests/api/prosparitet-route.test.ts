import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/prosparitet/health/route';
import { POST } from '../../app/api/prosparitet/evaluate/route';
import {
  PROSPARITET_API_RESPONSE_MAX_MS,
  PROSPARITET_CONTRACT_VERSION,
  PROSPARITET_MODULE_VERSION,
  PROSPARITET_PERSONA_ID,
} from '../../lib/prosparitet';
import { _resetProsparitetMetrics } from '../../lib/prosparitet/engine';

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
  return new Request('http://localhost/api/prosparitet/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetProsparitetMetrics();

  console.log('\n🔗 [prosparitet] route tests\n');

  await test('GET /api/prosparitet/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Prosparitet-Contract-Version') === PROSPARITET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Prosparitet-Module-Version') === PROSPARITET_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= PROSPARITET_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${PROSPARITET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === PROSPARITET_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/prosparitet/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'INVESTMENT',
      horizon: 'MEDIUM',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 79,
      marginScore: 71,
      liquidityScore: 77,
      debtLoadScore: 34,
      disciplineScore: 70,
      horizonMonths: 24,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Prosparitet-Contract-Version') === PROSPARITET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Prosparitet-Valid') === 'true', 'missing valid header');
    assert(elapsed <= PROSPARITET_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${PROSPARITET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status.length > 0, 'status must be present');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/prosparitet/evaluate returns 400 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'PING',
      horizon: 'MEDIUM',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 60,
      marginScore: 55,
      liquidityScore: 62,
      debtLoadScore: 40,
      disciplineScore: 58,
      horizonMonths: 12,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; details?: { valid?: boolean } };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
  });

  await test('POST /api/prosparitet/evaluate returns 400 for out-of-range numeric domain values', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'INVESTMENT',
      horizon: 'MEDIUM',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 60,
      marginScore: -1,
      liquidityScore: 62,
      debtLoadScore: 40,
      disciplineScore: 58,
      horizonMonths: 12,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
  });

  await test('POST /api/prosparitet/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/prosparitet/evaluate', {
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

  await test('POST /api/prosparitet/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      horizon: 'MEDIUM',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 60,
      marginScore: 55,
      liquidityScore: 62,
      debtLoadScore: 40,
      disciplineScore: 58,
      horizonMonths: 12,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/prosparitet/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'CASHFLOW',
      horizon: 'SHORT',
      riskAppetite: 'LOW',
      revenueStabilityScore: '60',
      marginScore: 55,
      liquidityScore: 62,
      debtLoadScore: 40,
      disciplineScore: 58,
      horizonMonths: 12,
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
