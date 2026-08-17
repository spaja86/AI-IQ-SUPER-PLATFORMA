// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/konvencionalni-odnosi/health/route';
import { POST } from '../../app/api/konvencionalni-odnosi/evaluate/route';
import {
  _resetKonvencionalniOdnosiMetrics,
  KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS,
} from '../../lib/konvencionalni-odnosi';

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

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/konvencionalni-odnosi/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetKonvencionalniOdnosiMetrics();

  console.log('\n🔗 [konvencionalni-odnosi] route tests\n');

  await test('GET /api/konvencionalni-odnosi/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-KonvencionalniOdnosi-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-KonvencionalniOdnosi-Module-Version') === '1.0.0', 'missing module version header');
    assert(
      elapsed <= KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'konvencionalni-odnosi-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/konvencionalni-odnosi/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeRequest({
      referenceId: 'route-ok',
      relationType: 'PARTNERSKI',
      dimensions: [
        { dimension: 'POVERENJE', score: 84 },
        { dimension: 'KOMUNIKACIJA', score: 77 },
        { dimension: 'POSTOVANJE', score: 81 },
      ],
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-KonvencionalniOdnosi-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-KonvencionalniOdnosi-Valid') === 'true', 'missing valid header');
    assert(
      elapsed <= KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { valid: boolean; tier: string; dominantStrength: string; focusArea: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(typeof body.data.tier === 'string', 'tier must be a string');
    assert(typeof body.data.dominantStrength === 'string', 'dominantStrength must be a string');
    assert(typeof body.data.focusArea === 'string', 'focusArea must be a string');
  });

  await test('POST /api/konvencionalni-odnosi/evaluate returns 400 for missing dimensions field', async () => {
    const response = await POST(makeRequest({ referenceId: 'missing-dimensions' }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/konvencionalni-odnosi/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/konvencionalni-odnosi/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;

    const response = await POST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/konvencionalni-odnosi/evaluate returns 422 for score above 100', async () => {
    const response = await POST(makeRequest({
      dimensions: [{ dimension: 'POVERENJE', score: 150 }],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
  });

  await test('POST /api/konvencionalni-odnosi/evaluate headers include tier and focus on valid result', async () => {
    const response = await POST(makeRequest({
      referenceId: 'header-test',
      dimensions: [
        { dimension: 'POVERENJE', score: 90 },
        { dimension: 'GRANICE', score: 58 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-KonvencionalniOdnosi-Tier') !== null, 'X-KonvencionalniOdnosi-Tier header missing');
    assert(response.headers.get('X-KonvencionalniOdnosi-Focus') !== null, 'X-KonvencionalniOdnosi-Focus header missing');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Unexpected test runner error:', error);
  process.exit(1);
});
