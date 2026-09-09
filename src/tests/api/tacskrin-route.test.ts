import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/tacskrin/health/route';
import { POST } from '../../app/api/tacskrin/evaluate/route';
import {
  _resetTacskrinMetrics,
  TACSKRIN_API_RESPONSE_MAX_MS,
  TACSKRIN_CONTRACT_VERSION,
  TACSKRIN_MODULE_VERSION,
  TACSKRIN_PERSONA_ID,
} from '../../lib/tacskrin';

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
  return new Request('http://localhost/api/tacskrin/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetTacskrinMetrics();

  console.log('\n🔗 [tacskrin] route tests\n');

  await test('GET /api/tacskrin/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Tacskrin-Contract-Version') === TACSKRIN_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Tacskrin-Module-Version') === TACSKRIN_MODULE_VERSION, 'missing module version header');
    assert(
      elapsed <= TACSKRIN_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${TACSKRIN_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === TACSKRIN_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/tacskrin/evaluate returns 200 for equivalent payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE',
      strictOrder: true,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Tacskrin-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Tacskrin-Equivalent') === 'true', 'missing equivalent header');
    assert(
      elapsed <= TACSKRIN_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${TACSKRIN_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { status: string; equivalent: boolean } };
    assert(body.data.status === 'EKVIVALENTNA', `expected EKVIVALENTNA, got ${body.data.status}`);
    assert(body.data.equivalent === true, 'expected equivalent=true');
  });

  await test('POST /api/tacskrin/evaluate returns 400 for shape validation mismatch', async () => {
    const response = await POST(makeEvaluateRequest({ projectionExpression: 123 }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'projectionExpression must be a string', `unexpected error: ${body.error}`);
  });

  await test('POST /api/tacskrin/evaluate returns 422 for unknown layer', async () => {
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE XENO',
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Tacskrin-Valid') === 'false', 'expected valid=false header');

    const body = await response.json() as { code: string; details?: { validation?: { status?: string } } };
    assert(body.code === 'UNPROCESSABLE_ENTITY', `expected UNPROCESSABLE_ENTITY, got ${body.code}`);
    assert(body.details?.validation?.status === 'NEPOZNATO', 'validation status should be NEPOZNATO');
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
