import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/eprincip/health/route';
import { POST } from '../../app/api/eprincip/evaluate/route';
import { _resetEPrincipMetrics } from '../../lib/eprincip';

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
  return new Request('http://localhost/api/eprincip/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetEPrincipMetrics();

  console.log('\n🔗 [eprincip] route tests\n');

  await test('GET /api/eprincip/health returns report and headers', async () => {
    const response = await GET();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Eprincip-Contract-Version') === 'v1', 'missing contract version header');
    assert(response.headers.get('X-Eprincip-Module-Version') === '1.0.0', 'missing module version header');

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'eprincip-governance', `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/eprincip/evaluate returns 200 for valid payload', async () => {
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      principles: [
        { id: 'security', label: 'Security', score: 90, weight: 0.6, required: true, evidenceCount: 2 },
        { id: 'performance', label: 'Performance', score: 75, weight: 0.4, required: true, evidenceCount: 1 },
      ],
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Eprincip-Contract-Version') === 'v1', 'missing contract version header');
    const body = await response.json() as { data: { valid: boolean; status: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'ALIGNED', `expected ALIGNED, got ${body.data.status}`);
  });

  await test('POST /api/eprincip/evaluate returns 422 for failed required principle', async () => {
    const response = await POST(makeEvaluateRequest({
      minimumScore: 80,
      principles: [
        { id: 'security', label: 'Security', score: 70, weight: 1, required: true, evidenceCount: 1 },
      ],
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'result should be invalid');
  });

  await test('POST /api/eprincip/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/eprincip/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/eprincip/evaluate returns 400 when principles is missing', async () => {
    const response = await POST(makeEvaluateRequest({}));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/eprincip/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      principles: [{ id: 'security', label: 'Security', score: '90', weight: 1 }],
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
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
