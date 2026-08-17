// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/reklamitin/health/route';
import { POST } from '../../app/api/reklamitin/evaluate/route';
import { _resetReklamitiнMetrics, REKLAMITIN_API_RESPONSE_MAX_MS } from '../../lib/reklamitin';

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
  return new Request('http://localhost/api/reklamitin/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetReklamitiнMetrics();

  console.log('\n🔗 [reklamitin] route tests\n');

  await test('GET /api/reklamitin/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Reklamitin-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Reklamitin-Module-Version') === '1.0.0', 'missing module version header');
    assert(elapsed <= REKLAMITIN_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${REKLAMITIN_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'reklamitin-core', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/reklamitin/evaluate returns 200 for valid RADICAL payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-radical',
      level: 'RADICAL',
      broadcastTargets: ['WEB', 'MOBILE', 'SOCIAL'],
      audienceSegment: 'HIGH_VALUE',
      durationSeconds: 120,
      budgetScore: 1000,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Reklamitin-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Reklamitin-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Reklamitin-Level') === 'RADICAL', 'missing level header');
    assert(elapsed <= REKLAMITIN_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${REKLAMITIN_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as {
      data: {
        valid: boolean;
        level: string;
        zeroCap: boolean;
        disclaimer: string;
        broadcastResults: unknown[];
      };
    };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.level === 'RADICAL', 'level must be RADICAL');
    assert(body.data.zeroCap === true, 'RADICAL must have zeroCap = true');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(
      body.data.disclaimer.includes('Reklamitin rezultati su automatski generisani'),
      'disclaimer must contain mandatory phrase',
    );
    assert(body.data.broadcastResults.length > 0, 'broadcastResults must be non-empty');
  });

  await test('POST /api/reklamitin/evaluate returns 200 for STANDARD payload', async () => {
    const response = await POST(makeEvaluateRequest({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 200,
    }));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; level: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.level === 'STANDARD', 'level must be STANDARD');
  });

  await test('POST /api/reklamitin/evaluate returns 400 for missing level', async () => {
    const response = await POST(makeEvaluateRequest({
      broadcastTargets: ['WEB'],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 100,
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/reklamitin/evaluate returns 400 for empty broadcastTargets', async () => {
    const response = await POST(makeEvaluateRequest({
      level: 'STANDARD',
      broadcastTargets: [],
      audienceSegment: 'GENERAL',
      durationSeconds: 30,
      budgetScore: 100,
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/reklamitin/evaluate returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost/api/reklamitin/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid-json}',
    }) as unknown as NextRequest;
    const response = await POST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/reklamitin/evaluate returns 400 for missing audienceSegment', async () => {
    const response = await POST(makeEvaluateRequest({
      level: 'STANDARD',
      broadcastTargets: ['WEB'],
      durationSeconds: 30,
      budgetScore: 100,
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log('\n────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    for (const f of failures) {
      console.error(`  • ${f}`);
    }
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
