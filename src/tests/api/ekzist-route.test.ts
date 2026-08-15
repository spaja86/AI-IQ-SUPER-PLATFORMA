// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/ekzist/health/route';
import { POST } from '../../app/api/ekzist/evaluate/route';
import { _resetEkzistMetrics, EKZIST_API_RESPONSE_MAX_MS } from '../../lib/ekzist';

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
  return new Request('http://localhost/api/ekzist/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetEkzistMetrics();

  console.log('\n🔗 [ekzist] route tests\n');

  await test('GET /api/ekzist/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekzist-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Ekzist-Module-Version') === '1.0.0', 'missing module version header');
    assert(elapsed <= EKZIST_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${EKZIST_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'ekzist-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/ekzist/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      domains: [
        { domain: 'MEANING', score: 75 },
        { domain: 'PURPOSE', score: 70 },
        { domain: 'GROWTH', score: 80 },
      ],
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekzist-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Ekzist-Valid') === 'true', 'missing valid header');
    assert(elapsed <= EKZIST_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${EKZIST_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; tier: string; disclaimer: string; dominantVector: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(typeof body.data.tier === 'string', 'tier must be a string');
    assert(typeof body.data.dominantVector === 'string', 'dominantVector must be a string');
  });

  await test('POST /api/ekzist/evaluate returns 400 for empty domains array', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 400 for missing domains field', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'missing-domains',
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 422 for invalid score (NaN)', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'MEANING', score: null }],
    }));

    // Engine will return invalid, route returns 422
    assert([400, 422].includes(response.status), `expected 400 or 422, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate headers include tier and domain on valid result', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'header-test',
      domains: [
        { domain: 'LEGACY', score: 90 },
        { domain: 'GROWTH', score: 50 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekzist-Tier') !== null, 'X-Ekzist-Tier header missing');
    assert(response.headers.get('X-Ekzist-Domain') !== null, 'X-Ekzist-Domain header missing');
  });

  await test('POST /api/ekzist/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/ekzist/evaluate', {
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
