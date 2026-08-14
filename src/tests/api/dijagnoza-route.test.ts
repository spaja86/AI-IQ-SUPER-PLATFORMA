// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/dijagnoza/health/route';
import { POST } from '../../app/api/dijagnoza/evaluate/route';
import { _resetDijagnozaMetrics } from '../../lib/dijagnoza';

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
  return new Request('http://localhost/api/dijagnoza/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDijagnozaMetrics();

  console.log('\n🔗 [dijagnoza] route tests\n');

  await test('GET /api/dijagnoza/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Dijagnoza-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Dijagnoza-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'dijagnoza-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/dijagnoza/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      profile: { patientId: 'p-001', ageYears: 35, gender: 'FEMALE' },
      symptoms: ['temperatura', 'kašalj', 'umor', 'grlobolja'],
      durationDays: 2,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Dijagnoza-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; urgency: string; disclaimer: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/dijagnoza/evaluate returns 400 for empty symptoms array', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {},
      symptoms: [],
      durationDays: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dijagnoza/evaluate returns 422 for invalid domain payload (NaN durationDays)', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: -1,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/dijagnoza/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/dijagnoza/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dijagnoza/evaluate returns 400 when symptoms is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {},
      durationDays: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dijagnoza/evaluate returns 400 when durationDays is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {},
      symptoms: ['kašalj'],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dijagnoza/evaluate returns 400 when profile is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      symptoms: ['kašalj'],
      durationDays: 1,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/dijagnoza/evaluate with critical symptoms returns high urgency', async () => {
    const response = await POST(makeEvaluateRequest({
      profile: {},
      symptoms: ['bol u grudima', 'kratkoća daha', 'znojenje'],
      vitals: { spO2Percent: 85, pulseBpm: 160 },
      durationDays: 1,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { urgency: string; nextStep: string } };
    assert(
      ['CRITICAL', 'HIGH'].includes(body.data.urgency),
      `expected CRITICAL or HIGH, got ${body.data.urgency}`,
    );
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
