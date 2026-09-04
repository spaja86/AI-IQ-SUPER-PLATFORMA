// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Route Tests
// Kompanija SPAJA — Digitalna Industrija

import { GET, POST } from '../../app/api/ekselencio/route';
import {
  _resetEkselencioMetrics,
  EKSELENCIO_API_RESPONSE_MAX_MS,
  EKSELENCIO_DISCLAIMER,
} from '../../lib/ekselencio';

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

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/ekselencio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function runTests(): Promise<void> {
  _resetEkselencioMetrics();

  console.log('\n🔗 [ekselencio] route tests\n');

  await test('GET /api/ekselencio returns health report', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Ekselencio-Contract-Version') === 'v1',
      'missing contract version header',
    );
    assert(elapsed <= EKSELENCIO_API_RESPONSE_MAX_MS, `response ${elapsed.toFixed(1)}ms exceeds ${EKSELENCIO_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { personaId: string };
    assert(body.personaId === 'ekselencio-apex', `unexpected personaId: ${body.personaId}`);
  });

  await test('POST /api/ekselencio returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeRequest({
      agentId: 'route-test-agent',
      domainScores: { ES: 80, KC: 75, UOA: 90, AR: 60, RT: 70, EV: 85 },
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Ekselencio-Valid') === 'true',
      'missing valid header',
    );
    assert(elapsed <= EKSELENCIO_API_RESPONSE_MAX_MS, `response ${elapsed.toFixed(1)}ms exceeds ${EKSELENCIO_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      valid: boolean;
      tier: string;
      ekuareRaScore: number;
      disclaimer: string;
    };
    assert(body.valid === true, 'result should be valid');
    assert(body.disclaimer === EKSELENCIO_DISCLAIMER, 'disclaimer must be present');
    assert(typeof body.tier === 'string', 'tier must be a string');
    assert(body.ekuareRaScore > 0, 'score must be positive');
  });

  await test('POST /api/ekselencio returns 400 when agentId missing', async () => {
    const response = await POST(makeRequest({ domainScores: { ES: 50 } }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekselencio returns 400 for empty agentId', async () => {
    const response = await POST(makeRequest({ agentId: '', domainScores: { ES: 50 } }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekselencio returns 400 for invalid JSON', async () => {
    const response = await POST(new Request('http://localhost/api/ekselencio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekselencio returns 400 for whitespace-only agentId', async () => {
    const response = await POST(makeRequest({ agentId: '   ', domainScores: { ES: 50 } }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/ekselencio with empty domainScores → GENESIS', async () => {
    const response = await POST(makeRequest({ agentId: 'empty-test', domainScores: {} }));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { tier: string };
    assert(body.tier === 'GENESIS', `expected GENESIS, got ${body.tier}`);
  });

  // ─── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
