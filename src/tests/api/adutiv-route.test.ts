// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/adutiv/health/route';
import { POST } from '../../app/api/adutiv/evaluate/route';
import { _resetAdutivMetrics, ADUTIV_API_RESPONSE_MAX_MS } from '../../lib/adutiv';

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
  return new Request('http://localhost/api/adutiv/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetAdutivMetrics();

  console.log('\n🔗 [adutiv] route tests\n');

  await test('GET /api/adutiv/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Adutiv-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Adutiv-Module-Version') === '1.0.0', 'missing module version header');
    assert(elapsed <= ADUTIV_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${ADUTIV_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'adutiv-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/adutiv/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      advantages: [
        { domain: 'SKILL', score: 75 },
        { domain: 'KNOWLEDGE', score: 70 },
        { domain: 'NETWORK', score: 80 },
      ],
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Adutiv-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Adutiv-Valid') === 'true', 'missing valid header');
    assert(elapsed <= ADUTIV_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${ADUTIV_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; tier: string; disclaimer: string; apexAdut: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(typeof body.data.tier === 'string', 'tier must be a string');
    assert(typeof body.data.apexAdut === 'string', 'apexAdut must be a string');
  });

  await test('POST /api/adutiv/evaluate returns 400 for empty advantages array', async () => {
    const response = await POST(makeEvaluateRequest({
      advantages: [],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/adutiv/evaluate returns 400 for missing advantages field', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'missing-advantages',
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/adutiv/evaluate returns 422 for invalid score (null)', async () => {
    const response = await POST(makeEvaluateRequest({
      advantages: [{ domain: 'SKILL', score: null }],
    }));

    assert([400, 422].includes(response.status), `expected 400 or 422, got ${response.status}`);
  });

  await test('POST /api/adutiv/evaluate headers include tier and apex on valid result', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'header-test',
      advantages: [
        { domain: 'REPUTATION', score: 90 },
        { domain: 'SKILL', score: 50 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Adutiv-Tier') !== null, 'X-Adutiv-Tier header missing');
    assert(response.headers.get('X-Adutiv-Apex') !== null, 'X-Adutiv-Apex header missing');
  });

  await test('POST /api/adutiv/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/adutiv/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;

    const response = await POST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // ─── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Unexpected test runner error:', error);
  process.exit(1);
});
