import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/pozadine-svih-projekcija/health/route';
import { POST } from '../../app/api/pozadine-svih-projekcija/evaluate/route';
import {
  _resetPozadineSvihProjekcijaMetrics,
  POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
  POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION,
  POZADINE_SVIH_PROJEKCIJA_PERSONA_ID,
} from '../../lib/pozadine-svih-projekcija';

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
  return new Request('http://localhost/api/pozadine-svih-projekcija/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetPozadineSvihProjekcijaMetrics();

  console.log('\n🔗 [pozadine-svih-projekcija] route tests\n');

  await test('GET /api/pozadine-svih-projekcija/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(
      response.headers.get('X-Pozadine-Svih-Projekcija-Contract-Version') === POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
      'missing contract version header',
    );
    assert(
      response.headers.get('X-Pozadine-Svih-Projekcija-Module-Version') === POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION,
      'missing module version header',
    );
    assert(
      elapsed <= POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
      `health response ${elapsed.toFixed(1)}ms exceeds ${POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === POZADINE_SVIH_PROJEKCIJA_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 200 for equivalent payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
      strictOrder: true,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Pozadine-Svih-Projekcija-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Pozadine-Svih-Projekcija-Equivalent') === 'true', 'missing equivalent header');
    assert(
      elapsed <= POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
      `evaluate response ${elapsed.toFixed(1)}ms exceeds ${POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS}ms`,
    );

    const body = await response.json() as { data: { status: string; equivalent: boolean } };
    assert(body.data.status === 'EKVIVALENTNA', `expected EKVIVALENTNA, got ${body.data.status}`);
    assert(body.data.equivalent === true, 'expected equivalent=true');
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 200 for known but non-equivalent payload', async () => {
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE JAKRE GIMBA',
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Pozadine-Svih-Projekcija-Valid') === 'true', 'valid header should be true');
    assert(response.headers.get('X-Pozadine-Svih-Projekcija-Status') === 'ODSTUPANJE', 'status should be ODSTUPANJE');

    const body = await response.json() as { data: { equivalent: boolean; missingLayers: string[] } };
    assert(body.data.equivalent === false, 'equivalent should be false');
    assert(body.data.missingLayers.includes('NIKOS'), 'missing layers should include NIKOS');
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 422 for unknown layer', async () => {
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA XENO',
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Pozadine-Svih-Projekcija-Valid') === 'false', 'expected valid=false header');

    const body = await response.json() as { code: string; details?: { validation?: { status?: string } } };
    assert(body.code === 'UNPROCESSABLE_ENTITY', `expected UNPROCESSABLE_ENTITY, got ${body.code}`);
    assert(body.details?.validation?.status === 'NEPOZNATO', 'validation status should be NEPOZNATO');
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/pozadine-svih-projekcija/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'Invalid JSON body', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 400 without expression/layers', async () => {
    const response = await POST(makeEvaluateRequest({ referenceId: 'shape-fail' }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'projectionExpression or layers is required', `unexpected error: ${body.error}`);
  });

  await test('POST /api/pozadine-svih-projekcija/evaluate returns 400 for non-finite signalStrength in JSON shape', async () => {
    const response = await POST(makeEvaluateRequest({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
      signalStrength: null,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'signalStrength must be a number', `unexpected error: ${body.error}`);
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
