import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/trenazer/health/route';
import { POST } from '../../app/api/trenazer/evaluate/route';
import { _resetTrenazerMetrics } from '../../lib/trenazer';

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
  return new Request('http://localhost/api/trenazer/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetTrenazerMetrics();

  console.log('\n🔗 [trenazer] route tests\n');

  await test('GET /api/trenazer/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Trenazer-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Trenazer-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'trenazer-coach-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/trenazer/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      profile: {
        traineeId: 'athlete-1',
        goal: 'ENDURANCE',
        experienceLevel: 'INTERMEDIATE',
      },
      metrics: {
        energy: 80,
        focus: 78,
        soreness: 15,
        stress: 20,
        sleepHours: 7.5,
        availableMinutes: 65,
      },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Trenazer-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; readiness: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.readiness === 'INTENSIVE', `expected INTENSIVE, got ${body.data.readiness}`);
  });

  await test('POST /api/trenazer/evaluate returns 422 for invalid domain payload', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'INTERMEDIATE',
      },
      metrics: {
        energy: -5,
        focus: 78,
        soreness: 15,
        stress: 20,
        sleepHours: 7.5,
        availableMinutes: 65,
      },
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/trenazer/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/trenazer/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/trenazer/evaluate returns 400 when metrics is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'INTERMEDIATE',
      },
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/trenazer/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'INTERMEDIATE',
      },
      metrics: {
        energy: '80',
        focus: 78,
        soreness: 15,
        stress: 20,
        sleepHours: 7.5,
        availableMinutes: 65,
      },
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
