import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/gamelord/health/route';
import { POST } from '../../app/api/gamelord/evaluate/route';
import { _resetGamelordMetrics } from '../../lib/gamelord';

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
  return new Request('http://localhost/api/gamelord/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetGamelordMetrics();

  await test('GET /api/gamelord/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Gamelord-Contract-Version') === 'v1', 'missing contract header');
    assert(response.headers.get('X-Gamelord-Module-Version') === '1.0.0', 'missing module header');

    const body = await response.json() as { data: { slug: string } };
    assert(body.data.slug === 'gamelord', 'slug mismatch');
  });

  await test('POST /api/gamelord/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      mode: 'DUO',
      strategyScore: 81,
      executionScore: 78,
      consistencyScore: 75,
      riskControlScore: 80,
      penaltyPoints: 10,
      anomalyCount: 1,
      matchDurationMs: 320000,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Gamelord-Contract-Version') === 'v1', 'missing contract header on evaluate');
    assert(response.headers.get('X-Gamelord-Module-Version') === '1.0.0', 'missing module header on evaluate');
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(typeof body.data.status === 'string' && body.data.status.length > 0, 'status required');
  });

  await test('POST /api/gamelord/evaluate returns 422 for invalid domain input', async () => {
    const response = await POST(makeEvaluateRequest({
      mode: 'DUO',
      strategyScore: 120,
      executionScore: 78,
      consistencyScore: 75,
      riskControlScore: 80,
      penaltyPoints: 10,
      anomalyCount: 1,
      matchDurationMs: 320000,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Gamelord-Contract-Version') === 'v1', 'missing contract header on 422');
  });

  await test('POST /api/gamelord/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/gamelord/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Gamelord-Contract-Version') === 'v1', 'missing contract header on invalid JSON');
  });

  await test('POST /api/gamelord/evaluate returns 400 for missing required fields', async () => {
    const response = await POST(makeEvaluateRequest({ mode: 'SOLO' }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Gamelord-Contract-Version') === 'v1', 'missing contract header on bad request');
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
