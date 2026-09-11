import type { NextRequest } from 'next/server';
import { GET as getHealth } from '../../app/api/spaja-bioskop/health/route';
import { POST as postEvaluate } from '../../app/api/spaja-bioskop/evaluate/route';
import {
  _resetSpajaBioskopMetrics,
  SPAJA_BIOSKOP_CONTRACT_VERSION,
  SPAJA_BIOSKOP_MODULE_VERSION,
} from '../../lib/spaja-bioskop';

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
  return new Request('http://localhost/api/spaja-bioskop/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetSpajaBioskopMetrics();

  console.log('\n🎬 [spaja-bioskop] route tests\n');

  await test('GET /api/spaja-bioskop/health returns 200 + headers', async () => {
    const response = await getHealth();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Spaja-Bioskop-Contract-Version') === SPAJA_BIOSKOP_CONTRACT_VERSION, 'missing contract header');
    assert(response.headers.get('X-Spaja-Bioskop-Module-Version') === SPAJA_BIOSKOP_MODULE_VERSION, 'missing module header');
  });

  await test('POST /api/spaja-bioskop/evaluate returns 200 for canonical sequence', async () => {
    const response = await postEvaluate(
      makeRequest({ sequence: 'KAGON ERAGON SIROKE DJUKAR EPAR DOPER OKTAN DUKAT' }),
    );
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Spaja-Bioskop-Status') === 'NORMAL', 'expected NORMAL status header');
    const body = await response.json() as { data: { valid: boolean; goNoGo: string } };
    assert(body.data.valid === true, 'canonical sequence should be valid');
    assert(body.data.goNoGo === 'go', 'canonical sequence should be go');
  });

  await test('POST /api/spaja-bioskop/evaluate returns 422 for invalid sequence', async () => {
    const response = await postEvaluate(
      makeRequest({ sequence: 'KAGON ERAGON SIROKE DJUKAR EPAR DOPER OKTAN UNKNOWN' }),
    );
    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { details: { status: string; valid: boolean } };
    assert(body.details.status === 'BLOCKED', 'invalid sequence should be BLOCKED');
    assert(body.details.valid === false, 'invalid sequence should be invalid');
  });

  await test('POST /api/spaja-bioskop/evaluate returns WARNING + no-go for non-strict reorder', async () => {
    const response = await postEvaluate(
      makeRequest({
        sequence: 'ERAGON KAGON SIROKE DJUKAR EPAR DOPER OKTAN DUKAT',
        strictOrder: false,
      }),
    );
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Spaja-Bioskop-Status') === 'WARNING', 'expected WARNING status header');
    assert(response.headers.get('X-Spaja-Bioskop-Go-NoGo') === 'no-go', 'expected WARNING to map to no-go');
    const body = await response.json() as { data: { valid: boolean; status: string; goNoGo: string } };
    assert(body.data.valid === true, 'reordered non-strict sequence should remain valid');
    assert(body.data.status === 'WARNING', 'body status should be WARNING');
    assert(body.data.goNoGo === 'no-go', 'body goNoGo should be no-go');
  });

  await test('POST /api/spaja-bioskop/evaluate returns 400 for missing sequence', async () => {
    const response = await postEvaluate(makeRequest({ signalStrength: 70 }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/spaja-bioskop/evaluate returns 400 for non-string array sequence', async () => {
    const response = await postEvaluate(
      makeRequest({ sequence: [1, 2, 3] }),
    );
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/spaja-bioskop/evaluate returns 400 for malformed JSON body', async () => {
    const request = new Request('http://localhost/api/spaja-bioskop/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{INVALID_JSON',
    }) as unknown as NextRequest;
    const response = await postEvaluate(request);
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
