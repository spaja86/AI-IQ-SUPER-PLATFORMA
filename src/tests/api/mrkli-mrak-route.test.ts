import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/mrkli-mrak/health/route';
import { POST } from '../../app/api/mrkli-mrak/evaluate/route';
import {
  _resetMrkliMrakMetrics,
  MRKLI_MRAK_API_RESPONSE_MAX_MS,
  MRKLI_MRAK_CONTRACT_VERSION,
  MRKLI_MRAK_MODULE_VERSION,
  MRKLI_MRAK_PERSONA_ID,
} from '../../lib/mrkli-mrak';

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
  return new Request('http://localhost/api/mrkli-mrak/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetMrkliMrakMetrics();

  console.log('\n🔗 [mrkli-mrak] route tests\n');

  await test('GET /api/mrkli-mrak/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Mrkli-Mrak-Contract-Version') === MRKLI_MRAK_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Mrkli-Mrak-Module-Version') === MRKLI_MRAK_MODULE_VERSION,
      'missing module version header',
    );
    assert(
      elapsed <= MRKLI_MRAK_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${MRKLI_MRAK_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === MRKLI_MRAK_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/mrkli-mrak/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      mode: 'EXPLORATION',
      riskTolerance: 'MEDIUM',
      ambientLightLux: 45,
      focusLevel: 78,
      sleepHours: 7,
      sessionMinutes: 35,
      supportTools: ['FLASHLIGHT', 'MAP'],
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Mrkli-Mrak-Contract-Version') === MRKLI_MRAK_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(response.headers.get('X-Mrkli-Mrak-Valid') === 'true', 'missing valid header');
    assert(
      elapsed <= MRKLI_MRAK_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${MRKLI_MRAK_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { valid: boolean; disclaimer: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/mrkli-mrak/evaluate returns 422 for unsupported support tool', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'EXPLORATION',
      riskTolerance: 'LOW',
      ambientLightLux: 55,
      focusLevel: 75,
      sleepHours: 7,
      sessionMinutes: 30,
      supportTools: ['DRONE'],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/mrkli-mrak/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/mrkli-mrak/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/mrkli-mrak/evaluate returns 400 when mode is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      riskTolerance: 'LOW',
      ambientLightLux: 55,
      focusLevel: 75,
      sleepHours: 7,
      sessionMinutes: 30,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/mrkli-mrak/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'EXPLORATION',
      riskTolerance: 'LOW',
      ambientLightLux: '55',
      focusLevel: 75,
      sleepHours: 7,
      sessionMinutes: 30,
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
