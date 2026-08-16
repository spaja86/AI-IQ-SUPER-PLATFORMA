// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/dnevna-svetlost/health/route';
import { POST } from '../../app/api/dnevna-svetlost/evaluate/route';
import { _resetDnevnaSvetlostMetrics } from '../../lib/dnevna-svetlost';

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
  return new Request('http://localhost/api/dnevna-svetlost/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDnevnaSvetlostMetrics();

  console.log('\n🔗 [dnevna-svetlost] route tests\n');

  await test('GET /api/dnevna-svetlost/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Dnevna-Svetlost-Contract-Version') === 'v1',
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Dnevna-Svetlost-Module-Version') === '1.0.0',
      'missing module version header',
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'dnevna-svetlost-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 8000,
      uvIndex: 3,
      focusLevel: 80,
      sleepHours: 8,
      exposureMinutes: 30,
      supportTools: ['SUNGLASSES'],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Dnevna-Svetlost-Contract-Version') === 'v1',
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Dnevna-Svetlost-Mode') === 'MORNING',
      'missing mode header',
    );
    assert(
      response.headers.get('X-Dnevna-Svetlost-Valid') === 'true',
      'missing valid header',
    );

    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'OPTIMAL', `expected OPTIMAL, got ${body.data.status}`);
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 422 for invalid domain payload', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'BADMODE',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 400 for missing required field', async () => {
    const response = await POST(makeEvaluateRequest({
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
      // mode missing
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 400 for wrong field type', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 'not-a-number',
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/dnevna-svetlost/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dnevna-svetlost/evaluate returns 400 for array body', async () => {
    const response = await POST(makeEvaluateRequest([1, 2, 3]));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // Summary
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ passed: ${passed}   ❌ failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected test runner error:', err);
  process.exit(1);
});
