import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/geografija-realna/health/route';
import { POST } from '../../app/api/geografija-realna/evaluate/route';
import {
  _resetGeografijaRealnaMetrics,
  GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
  GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  GEOGRAFIJA_REALNA_MODULE_VERSION,
  GEOGRAFIJA_REALNA_PERSONA_ID,
} from '../../lib/geografija-realna';

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
  return new Request('http://localhost/api/geografija-realna/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetGeografijaRealnaMetrics();

  console.log('\n🔗 [geografija-realna] route tests\n');

  await test('GET /api/geografija-realna/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Geografija-Realna-Contract-Version') ===
        GEOGRAFIJA_REALNA_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Geografija-Realna-Module-Version') ===
        GEOGRAFIJA_REALNA_MODULE_VERSION,
      'missing module version header',
    );
    assert(
      elapsed <= GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS}ms`,
    );

    const body = (await response.json()) as { data: { personaId: string } };
    assert(
      body.data.personaId === GEOGRAFIJA_REALNA_PERSONA_ID,
      `unexpected personaId: ${body.data.personaId}`,
    );
  });

  await test('POST /api/geografija-realna/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(
      makeEvaluateRequest({
        referenceId: 'route-ok',
        objective: 'ANALYSIS',
        regionScale: 'REGIONAL',
        terrainComplexity: 'MEDIUM',
        accuracyScore: 82,
        contextScore: 77,
        dataFreshnessScore: 79,
        riskScore: 28,
        timeWindowHours: 48,
        constraintsCount: 4,
      }),
    );
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Geografija-Realna-Contract-Version') ===
        GEOGRAFIJA_REALNA_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Geografija-Realna-Valid') === 'true',
      'missing valid header',
    );
    assert(
      elapsed <= GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS}ms`,
    );

    const body = (await response.json()) as {
      data: { valid: boolean; status: string; disclaimer: string };
    };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'PRECISE', `expected PRECISE, got ${body.data.status}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/geografija-realna/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(
      makeEvaluateRequest({
        objective: 'UNKNOWN',
        regionScale: 'REGIONAL',
        terrainComplexity: 'MEDIUM',
        accuracyScore: 60,
        contextScore: 60,
        dataFreshnessScore: 60,
        riskScore: 30,
        timeWindowHours: 48,
        constraintsCount: 2,
      }),
    );

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = (await response.json()) as { code: string; error: string };
    assert(
      body.code === 'UNPROCESSABLE_ENTITY',
      `expected UNPROCESSABLE_ENTITY, got ${body.code}`,
    );
    assert(body.error.length > 0, 'error message should be present');
  });

  await test('POST /api/geografija-realna/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/geografija-realna/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(
      response.headers.get('X-Geografija-Realna-Contract-Version') ===
        GEOGRAFIJA_REALNA_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Geografija-Realna-Module-Version') ===
        GEOGRAFIJA_REALNA_MODULE_VERSION,
      'missing module version header',
    );
  });

  await test('POST /api/geografija-realna/evaluate returns 400 when required field is missing', async () => {
    const response = await POST(
      makeEvaluateRequest({
        objective: 'ANALYSIS',
        regionScale: 'REGIONAL',
        terrainComplexity: 'MEDIUM',
        accuracyScore: 82,
        contextScore: 77,
        dataFreshnessScore: 79,
        riskScore: 28,
        constraintsCount: 4,
      }),
    );

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/geografija-realna/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(
      makeEvaluateRequest({
        objective: 'ANALYSIS',
        regionScale: 'REGIONAL',
        terrainComplexity: 'MEDIUM',
        accuracyScore: '82',
        contextScore: 77,
        dataFreshnessScore: 79,
        riskScore: 28,
        timeWindowHours: 48,
        constraintsCount: 4,
      }),
    );

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
