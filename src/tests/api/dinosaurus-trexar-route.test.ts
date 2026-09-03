import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/dinosaurus-trexar/health/route';
import { POST } from '../../app/api/dinosaurus-trexar/evaluate/route';
import { _resetDinosaurusTrexarMetrics } from '../../lib/dinosaurus-trexar';

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
  return new Request('http://localhost/api/dinosaurus-trexar/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDinosaurusTrexarMetrics();

  console.log('\n🔗 [dinosaurus-trexar] route tests\n');

  await test('GET /api/dinosaurus-trexar/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Dinosaurus-Trexar-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Dinosaurus-Trexar-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'dinosaurus-trexar-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      profile: {
        specimenId: 'trex-007',
        ageCategory: 'ADULT',
        massKg: 7600,
      },
      signals: {
        stamina: 86,
        aggression: 80,
        focus: 78,
        threatLevel: 28,
        terrainFriction: 67,
        packSupport: 64,
        reactionMs: 210,
      },
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(typeof body.data.status === 'string', 'status should be present');
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 422 for invalid domain payload', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        ageCategory: 'ADULT',
        massKg: -5,
      },
      signals: {
        stamina: 86,
        aggression: 80,
        focus: 78,
        threatLevel: 28,
        terrainFriction: 67,
        packSupport: 64,
        reactionMs: 210,
      },
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/dinosaurus-trexar/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 400 when profile is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      signals: {
        stamina: 86,
        aggression: 80,
        focus: 78,
        threatLevel: 28,
        terrainFriction: 67,
        packSupport: 64,
        reactionMs: 210,
      },
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 400 for non-number signal', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7600,
      },
      signals: {
        stamina: '86',
        aggression: 80,
        focus: 78,
        threatLevel: 28,
        terrainFriction: 67,
        packSupport: 64,
        reactionMs: 210,
      },
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dinosaurus-trexar/evaluate returns 422 for Infinity (serialized as null)', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7600,
      },
      signals: {
        stamina: Infinity,
        aggression: 80,
        focus: 78,
        threatLevel: 28,
        terrainFriction: 67,
        packSupport: 64,
        reactionMs: 210,
      },
    }));

    // Infinity becomes null in JSON so route validation treats it as non-number -> 400
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
