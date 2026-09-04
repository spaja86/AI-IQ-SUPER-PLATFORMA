import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/tru/health/route';
import { POST } from '../../app/api/tru/evaluate/route';
import {
  _resetTruMetrics,
  TRU_API_RESPONSE_MAX_MS,
  TRU_CONTRACT_VERSION,
  TRU_MODULE_VERSION,
  TRU_PERSONA_ID,
} from '../../lib/tru';

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
  return new Request('http://localhost/api/tru/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetTruMetrics();

  console.log('\n🔗 [tru] route tests\n');

  await test('GET /api/tru/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Tru-Contract-Version') === TRU_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Tru-Module-Version') === TRU_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= TRU_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${TRU_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === TRU_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/tru/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'COMMIT',
      channel: 'MEETING',
      evidenceLevel: 'STRONG',
      transparencyScore: 90,
      reliabilityScore: 88,
      reciprocityScore: 82,
      riskLevel: 22,
      responseLatencyHours: 108,
      escalationCount: 1,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Tru-Contract-Version') === TRU_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Tru-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Tru-Status') === 'TRUSTED', 'unexpected status header');
    assert(elapsed <= TRU_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${TRU_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string; recommendedAction: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'TRUSTED', `expected TRUSTED, got ${body.data.status}`);
    assert(body.data.recommendedAction === 'PROCEED', `expected PROCEED, got ${body.data.recommendedAction}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/tru/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'PING',
      channel: 'CALL',
      evidenceLevel: 'PARTIAL',
      transparencyScore: 60,
      reliabilityScore: 60,
      reciprocityScore: 60,
      riskLevel: 40,
      responseLatencyHours: 24,
      escalationCount: 1,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Tru-Contract-Version') === TRU_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Tru-Valid') === 'false', 'invalid branch must set X-Tru-Valid=false');
    assert(response.headers.get('X-Tru-Status') === null, 'invalid branch must not expose X-Tru-Status');
    assert(response.headers.get('X-Tru-Action') === null, 'invalid branch must not expose X-Tru-Action');

    const body = await response.json() as { error: string; code: string; details?: { validation?: { valid?: boolean } } };
    assert(body.code === 'UNPROCESSABLE_ENTITY', `expected UNPROCESSABLE_ENTITY, got ${body.code}`);
    assert(body.details?.validation?.valid === false, 'invalid result details should include valid=false');
  });

  await test('POST /api/tru/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/tru/evaluate', {
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

  await test('POST /api/tru/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      channel: 'CALL',
      evidenceLevel: 'PARTIAL',
      transparencyScore: 60,
      reliabilityScore: 60,
      reciprocityScore: 60,
      riskLevel: 40,
      responseLatencyHours: 24,
      escalationCount: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/tru/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'VERIFY',
      channel: 'CALL',
      evidenceLevel: 'PARTIAL',
      transparencyScore: '60',
      reliabilityScore: 60,
      reciprocityScore: 60,
      riskLevel: 40,
      responseLatencyHours: 24,
      escalationCount: 1,
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
