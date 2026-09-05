import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/delet/health/route';
import { POST } from '../../app/api/delet/evaluate/route';
import {
  _resetDeletMetrics,
  DELET_API_RESPONSE_MAX_MS,
  DELET_CONTRACT_VERSION,
  DELET_MODULE_VERSION,
  DELET_PERSONA_ID,
} from '../../lib/delet';

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
  return new Request('http://localhost/api/delet/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDeletMetrics();

  console.log('\n🔗 [delet] route tests\n');

  await test('GET /api/delet/health returns report and headers', async () => {
    const start = performance.now();
    const response = await GET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Delet-Contract-Version') === DELET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Delet-Module-Version') === DELET_MODULE_VERSION, 'missing module version header');
    assert(elapsed <= DELET_API_RESPONSE_MAX_MS, `health response ${elapsed.toFixed(1)}ms exceeds ${DELET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { personaId: string } };
    assert(body.data.personaId === DELET_PERSONA_ID, `unexpected personaId: ${body.data.personaId}`);
  });

  await test('POST /api/delet/evaluate returns 200 for valid payload', async () => {
    const start = performance.now();
    const response = await POST(makeEvaluateRequest({
      referenceId: 'route-ok',
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 30,
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: false,
    }));
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Delet-Contract-Version') === DELET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Delet-Valid') === 'true', 'missing valid header');
    assert(response.headers.get('X-Delet-Status') === 'AUTO_APPROVE', 'unexpected status header');
    assert(elapsed <= DELET_API_RESPONSE_MAX_MS, `evaluate response ${elapsed.toFixed(1)}ms exceeds ${DELET_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { valid: boolean; status: string; disclaimer: string; recommendedAction: string } };
    assert(body.data.valid === true, 'result should be valid');
    assert(body.data.status === 'AUTO_APPROVE', `expected AUTO_APPROVE, got ${body.data.status}`);
    assert(body.data.recommendedAction === 'EXECUTE', `expected EXECUTE, got ${body.data.recommendedAction}`);
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/delet/evaluate returns 422 for unsupported objective', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'DELETE_NOW',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 30,
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: false,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    assert(response.headers.get('X-Delet-Contract-Version') === DELET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Delet-Valid') === 'false', 'invalid branch must set X-Delet-Valid=false');
    assert(response.headers.get('X-Delet-Status') === null, 'invalid branch must not expose X-Delet-Status');
    assert(response.headers.get('X-Delet-Action') === null, 'invalid branch must not expose X-Delet-Action');

    assert(response.headers.get('X-Delet-Error-Code') === 'UNPROCESSABLE_ENTITY', 'missing unprocessable error code header');
    assert(response.headers.get('X-Delet-Validation-Reason') !== null, 'missing validation reason header');
    const body = await response.json() as { data?: { valid?: boolean; objective?: string | null; scope?: string | null } };
    assert(body.data?.valid === false, 'invalid result should be returned in top-level data payload');
    assert(body.data?.objective === null, 'invalid result objective should be null');
    assert(body.data?.scope === null, 'invalid result scope should be null');
  });

  await test('POST /api/delet/evaluate returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/delet/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await POST(request);
    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Delet-Contract-Version') === DELET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Delet-Module-Version') === DELET_MODULE_VERSION, 'missing module version header');
    assert(response.headers.get('X-Delet-Valid') === null, 'shape errors should not include validity header');
    const body = await response.json() as { error: string; code: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'Invalid JSON body', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/delet/evaluate returns 400 when objective is missing', async () => {
    const response = await POST(makeEvaluateRequest({
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 30,
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: false,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Delet-Valid') === null, 'shape-validation failures must not include DELET evaluation headers');
    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'objective is required (string)', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/delet/evaluate returns 400 for shallow-shape mismatch', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: '30',
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: false,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    assert(response.headers.get('X-Delet-Contract-Version') === DELET_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Delet-Module-Version') === DELET_MODULE_VERSION, 'missing module version header');
    assert(response.headers.get('X-Delet-Valid') === null, 'shape-validation failures must not include validity header');
    assert(response.headers.get('X-Delet-Status') === null, 'shape-validation failures must not include status header');

    const body = await response.json() as { code: string; error: string };
    assert(body.code === 'BAD_REQUEST', `expected BAD_REQUEST, got ${body.code}`);
    assert(body.error === 'dataSensitivityScore is required (number)', `unexpected error message: ${body.error}`);
  });

  await test('POST /api/delet/evaluate returns 400 when legalHoldActive is not boolean', async () => {
    const response = await POST(makeEvaluateRequest({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 30,
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: 'false',
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
    const body = await response.json() as { error: string };
    assert(body.error === 'legalHoldActive is required (boolean)', `unexpected error message: ${body.error}`);
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
