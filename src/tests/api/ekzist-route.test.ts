// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/ekzist/health/route';
import { POST } from '../../app/api/ekzist/evaluate/route';
import { _resetEkzistMetrics, EKZIST_API_RESPONSE_MAX_MS, EKZIST_HEADERS } from '../../lib/ekzist';

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
    assert(response.headers.get(EKZIST_HEADERS.CONTRACT_VERSION) === 'v1', 'missing contract version header');
    assert(response.headers.get(EKZIST_HEADERS.MODULE_VERSION) === '1.0.0', 'missing module version header');
    assert(response.headers.get(EKZIST_HEADERS.DISPLAY_NAME) === 'EKZIST', 'missing display-name header');
    assert(response.headers.get(EKZIST_HEADERS.CANONICAL_SLUG) === 'ekzist', 'missing canonical-slug header');
    assert(response.headers.get(EKZIST_HEADERS.PERSONA_ID) === 'ekzist-core', 'missing persona-id header');
    assert(response.headers.get(EKZIST_HEADERS.EVAL_KPI_MS) === '50', 'missing eval KPI header');
    assert(response.headers.get(EKZIST_HEADERS.API_KPI_MS) === '200', 'missing API KPI header');
    assert(elapsed <= EKZIST_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${EKZIST_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string; displayName: string; canonicalSlug: string; aliases: string[] } };
    assert(body.data.personaId === 'ekzist-core', `unexpected personaId: ${body.data.personaId}`);
    assert(body.data.displayName === 'EKZIST', `unexpected displayName: ${body.data.displayName}`);
    assert(body.data.canonicalSlug === 'ekzist', `unexpected canonicalSlug: ${body.data.canonicalSlug}`);
    assert(body.data.aliases.includes('exist'), 'exist alias is missing');
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
    assert(response.headers.get(EKZIST_HEADERS.CONTRACT_VERSION) === 'v1', 'missing contract version header');
    assert(response.headers.get(EKZIST_HEADERS.VALID) === 'true', 'missing valid header');
    assert(response.headers.get(EKZIST_HEADERS.TIER) !== null, 'missing tier header');
    assert(response.headers.get(EKZIST_HEADERS.DOMAIN) !== null, 'missing domain header');
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

  await test('POST /api/ekzist/evaluate returns 422 for out-of-range score', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'MEANING', score: 101 }],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
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
    assert(response.headers.get(EKZIST_HEADERS.TIER) !== null, 'X-Ekzist-Tier header missing');
    assert(response.headers.get(EKZIST_HEADERS.DOMAIN) !== null, 'X-Ekzist-Domain header missing');
  });

  await test('POST /api/ekzist/evaluate accepts DURBULE domain and returns it when dominant', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'durbule-route-test',
      domains: [
        { domain: 'DURBULE', score: 99 },
        { domain: 'MEANING', score: 55 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get(EKZIST_HEADERS.DOMAIN) === 'DURBULE', 'expected X-Ekzist-Domain to be DURBULE');
    assert(response.headers.get(EKZIST_HEADERS.VALID) === 'true', 'expected valid header to remain true');

    const body = await response.json() as { data: { dominantVector: string; valid: boolean } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.dominantVector === 'DURBULE', `expected DURBULE, got ${body.data.dominantVector}`);
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

  await test('POST /api/ekzist/evaluate returns 400 for malformed lifePressures type', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'MEANING', score: 70 }],
      lifePressures: 'high',
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 400 for malformed domain score type', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'MEANING', score: null }],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 422 for unsupported domain', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'UNKNOWN', score: 70 }],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 422 for duplicate domain entries', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [
        { domain: 'MEANING', score: 70 },
        { domain: 'MEANING', score: 50 },
      ],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
  });

  await test('POST /api/ekzist/evaluate returns 422 for unsupported ageGroup', async () => {
    const response = await POST(makeEvaluateRequest({
      domains: [{ domain: 'MEANING', score: 70 }],
      ageGroup: 'UNKNOWN',
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
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
