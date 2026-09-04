import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/aktiviti-all/health/route';
import { POST } from '../../app/api/aktiviti-all/evaluate/route';
import {
  _resetAktivitiAllMetrics,
  AKTIVITI_ALL_API_RESPONSE_MAX_MS,
  AKTIVITI_ALL_CONTRACT_VERSION,
  AKTIVITI_ALL_MODULE_VERSION,
  AKTIVITI_ALL_PERSONA_ID,
} from '../../lib/aktiviti-all';

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
  return new Request('http://localhost/api/aktiviti-all/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetAktivitiAllMetrics();

  console.log('\n🔗 [aktiviti-all] route tests\n');

  await test('GET /api/aktiviti-all/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Aktiviti-All-Contract-Version') === AKTIVITI_ALL_CONTRACT_VERSION, 'missing contract header');
    assert(response.headers.get('X-Aktiviti-All-Module-Version') === AKTIVITI_ALL_MODULE_VERSION, 'missing module header');
    assert(elapsed <= AKTIVITI_ALL_API_RESPONSE_MAX_MS, `health took ${elapsed.toFixed(1)}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === AKTIVITI_ALL_PERSONA_ID, `unexpected persona ${body.data.personaId}`);
  });

  await test('POST /api/aktiviti-all/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      activity: 'FOCUS',
      durationMinutes: 90,
      energyLevel: 80,
      focusLevel: 86,
      stressLevel: 22,
      completionRate: 72,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Aktiviti-All-Contract-Version') === AKTIVITI_ALL_CONTRACT_VERSION, 'missing contract header');
    assert(response.headers.get('X-Aktiviti-All-Valid') === 'true', 'valid header missing');
    assert(elapsed <= AKTIVITI_ALL_API_RESPONSE_MAX_MS, `evaluate took ${elapsed.toFixed(1)}ms`);

    const body = await response.json() as { data: { valid: boolean; activity: string } };
    assert(body.data.valid === true, 'expected valid true');
    assert(body.data.activity === 'FOCUS', `unexpected activity ${body.data.activity}`);
  });

  await test('POST /api/aktiviti-all/evaluate returns 422 for invalid domain payload', async () => {
    const response = await POST(makeEvaluateRequest({
      activity: 'FOCUS',
      durationMinutes: -1,
      energyLevel: 80,
      focusLevel: 86,
      stressLevel: 22,
      completionRate: 72,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Aktiviti-All-Valid') === 'false', 'expected X-Aktiviti-All-Valid=false');
    assert(response.headers.get('X-Aktiviti-All-Status') === 'BLOCKED', 'expected X-Aktiviti-All-Status=BLOCKED');
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'expected valid false');
  });

  await test('POST /api/aktiviti-all/evaluate returns 422 for non-integer duration (engine validation)', async () => {
    const response = await POST(makeEvaluateRequest({
      activity: 'FOCUS',
      durationMinutes: 12.5,
      energyLevel: 80,
      focusLevel: 86,
      stressLevel: 22,
      completionRate: 72,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'expected valid false');
  });

  await test('POST /api/aktiviti-all/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/aktiviti-all/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/aktiviti-all/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      activity: 'FOCUS',
      durationMinutes: '90',
      energyLevel: 80,
      focusLevel: 86,
      stressLevel: 22,
      completionRate: 72,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/aktiviti-all/evaluate returns 422 for unsupported activity', async () => {
    const response = await POST(makeEvaluateRequest({
      activity: 'DANCE',
      durationMinutes: 90,
      energyLevel: 80,
      focusLevel: 86,
      stressLevel: 22,
      completionRate: 72,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
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
