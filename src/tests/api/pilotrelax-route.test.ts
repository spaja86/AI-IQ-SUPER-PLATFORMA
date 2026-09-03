import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/pilotrelax/health/route';
import { POST } from '../../app/api/pilotrelax/evaluate/route';
import {
  _resetPilotrelaxMetrics,
  PILOTRELAX_API_RESPONSE_MAX_MS,
  PILOTRELAX_CONTRACT_VERSION,
  PILOTRELAX_MODULE_VERSION,
  PILOTRELAX_PERSONA_ID,
} from '../../lib/pilotrelax';

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
  return new Request('http://localhost/api/pilotrelax/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetPilotrelaxMetrics();

  console.log('\n🔗 [pilotrelax] route tests\n');

  await test('GET /api/pilotrelax/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Pilotrelax-Contract-Version') === PILOTRELAX_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Pilotrelax-Module-Version') === PILOTRELAX_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= PILOTRELAX_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${PILOTRELAX_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === PILOTRELAX_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/pilotrelax/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'FOCUS',
      environment: 'LOUNGE',
      phaseOfDay: 'AFTERNOON',
      stressLoad: 48,
      availableMinutes: 18,
      breathingCycles: 8,
      noiseLevelDb: 46,
      screenMinutesBeforeBreak: 40,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Pilotrelax-Contract-Version') === PILOTRELAX_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Pilotrelax-Valid') === 'true', 'missing valid header');
    assert(elapsed <= PILOTRELAX_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${PILOTRELAX_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string; recommendedProtocol: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'CALM', `expected CALM, got ${body.data.status}`);
    assert(body.data.recommendedProtocol === 'SILENT_RESET', `expected SILENT_RESET, got ${body.data.recommendedProtocol}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/pilotrelax/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'NAP',
      environment: 'HOME',
      phaseOfDay: 'EVENING',
      stressLoad: 20,
      availableMinutes: 15,
      breathingCycles: 4,
      noiseLevelDb: 30,
      screenMinutesBeforeBreak: 15,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/pilotrelax/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/pilotrelax/evaluate', {
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

  await test('POST /api/pilotrelax/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      environment: 'HOME',
      phaseOfDay: 'EVENING',
      stressLoad: 20,
      availableMinutes: 15,
      breathingCycles: 4,
      noiseLevelDb: 30,
      screenMinutesBeforeBreak: 15,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/pilotrelax/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'RESET',
      environment: 'HOME',
      phaseOfDay: 'EVENING',
      stressLoad: '20',
      availableMinutes: 15,
      breathingCycles: 4,
      noiseLevelDb: 30,
      screenMinutesBeforeBreak: 15,
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
