// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/ekvivalent-network/health/route';
import { POST } from '../../app/api/ekvivalent-network/evaluate/route';
import { _resetEkvivalentMetrics, EKVIVALENT_API_RESPONSE_MAX_MS } from '../../lib/ekvivalent-network';

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
  return new Request('http://localhost/api/ekvivalent-network/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const VALID_BODY = {
  referenceId: 'route-test',
  nodes: [
    { id: 'n1', label: 'Module A', domain: 'MODULE' },
    { id: 'n2', label: 'Module B', domain: 'MODULE' },
    { id: 'n3', label: 'Agent X', domain: 'AGENT' },
  ],
  edges: [
    { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: 90 },
    { fromId: 'n1', toId: 'n3', relationType: 'FUNCTIONAL', score: 75 },
  ],
  queryNodeId: 'n1',
};

async function runTests(): Promise<void> {
  _resetEkvivalentMetrics();

  console.log('\n🔗 [ekvivalent-network] route tests\n');

  await test('GET /api/ekvivalent-network/health returns 200 and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekvivalent-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Ekvivalent-Module-Version') === '1.0.0', 'missing module version header');
    assert(elapsed <= EKVIVALENT_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${EKVIVALENT_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'ekvivalent-network-core',
      `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest(VALID_BODY));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekvivalent-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Ekvivalent-Valid') === 'true', 'missing valid header');
    assert(elapsed <= EKVIVALENT_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${EKVIVALENT_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      data: { valid: boolean; disclaimer: string; equivalentNodes: unknown[]; networkScore: number };
    };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(Array.isArray(body.data.equivalentNodes), 'equivalentNodes must be an array');
    assert(typeof body.data.networkScore === 'number', 'networkScore must be a number');
  });

  await test('POST evaluate: response headers include match count and network score', async () => {
    const response = await POST(makeEvaluateRequest(VALID_BODY));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Ekvivalent-Match-Count') !== null, 'X-Ekvivalent-Match-Count header missing');
    assert(response.headers.get('X-Ekvivalent-Network-Score') !== null, 'X-Ekvivalent-Network-Score header missing');
  });

  await test('POST /api/ekvivalent-network/evaluate returns 400 for empty nodes array', async () => {
    const response = await POST(makeEvaluateRequest({ nodes: [], edges: [] }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 400 for missing nodes field', async () => {
    const response = await POST(makeEvaluateRequest({ edges: [] }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 400 for missing edges field', async () => {
    const response = await POST(makeEvaluateRequest({ nodes: [{ id: 'x', label: 'X', domain: 'MODULE' }] }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/ekvivalent-network/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;
    const response = await POST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 400 for non-object body', async () => {
    const response = await POST(makeEvaluateRequest([1, 2, 3]));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekvivalent-network/evaluate returns 422 for invalid queryNodeId', async () => {
    const response = await POST(makeEvaluateRequest({
      ...VALID_BODY,
      queryNodeId: 'does-not-exist',
    }));
    assert([400, 422].includes(response.status), `expected 400 or 422, got ${response.status}`);
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
