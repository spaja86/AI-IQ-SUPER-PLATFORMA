import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/digitron/health/route';
import { POST } from '../../app/api/digitron/evaluate/route';
import {
  _resetDigitronMetrics,
  DIGITRON_API_RESPONSE_MAX_MS,
  DIGITRON_CONTRACT_VERSION,
  DIGITRON_MODULE_VERSION,
  DIGITRON_PERSONA_ID,
  DIGITRON_SUCCESSOR_OF,
} from '../../lib/digitron';

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
  return new Request('http://localhost/api/digitron/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDigitronMetrics();

  console.log('\n🔧 [digitron] route tests\n');

  await test('GET /api/digitron/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Digitron-Contract-Version') === DIGITRON_CONTRACT_VERSION, 'missing contract header');
    assert(response.headers.get('X-Digitron-Module-Version') === DIGITRON_MODULE_VERSION, 'missing module header');
    assert(response.headers.get('X-Digitron-Successor-Of') === DIGITRON_SUCCESSOR_OF, 'missing successor header');
    assert(elapsed <= DIGITRON_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${DIGITRON_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === DIGITRON_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/digitron/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'digitron-route-ok',
      digit: 9,
      mode: 'NATIVE',
      signalStrength: 88,
      syncScore: 84,
      resilienceScore: 82,
      latencyMs: 20,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Digitron-Valid') === 'true', 'valid header mismatch');
    assert(response.headers.get('X-Digitron-Status') === 'STELLAR', 'status header mismatch');
    assert(elapsed <= DIGITRON_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${DIGITRON_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      data: { valid: boolean; status: string; recommendedAction: string; disclaimer: string };
    };
    assert(body.data.valid === true, 'expected valid result');
    assert(body.data.status === 'STELLAR', `unexpected status: ${body.data.status}`);
    assert(body.data.recommendedAction === 'SCALE_NATIVE', `unexpected action: ${body.data.recommendedAction}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer should be present');
  });

  await test('POST /api/digitron/evaluate returns 422 for unsupported mode', async () => {
    const response = await POST(makeEvaluateRequest({
      digit: 4,
      mode: 'UNKNOWN',
      signalStrength: 70,
      syncScore: 70,
      resilienceScore: 70,
      latencyMs: 40,
    }));
    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'expected valid=false');
  });

  await test('POST /api/digitron/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/digitron/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;
    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string };
    assert(body.code === 'BAD_REQUEST', `unexpected code: ${body.code}`);
  });

  await test('POST /api/digitron/evaluate returns 400 when field is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'NATIVE',
      signalStrength: 70,
      syncScore: 70,
      resilienceScore: 70,
      latencyMs: 40,
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
