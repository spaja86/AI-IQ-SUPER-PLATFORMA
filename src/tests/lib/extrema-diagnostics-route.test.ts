// Integration test za ExtremaAPI route
// Pokretanje: npx tsx src/tests/lib/extrema-diagnostics-route.test.ts

import { strict as assert } from 'node:assert';
import { POST } from '../../app/api/diagnostics/extrema/route';
import { GET } from '../../app/api/diagnostics/extrema/report/route';
import { clearAuditLog } from '../../lib/diagnostics/extrema-reporter';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/diagnostics/extrema', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(params = ''): Request {
  return new Request(`http://localhost/api/diagnostics/extrema/report${params}`);
}

async function runTests(): Promise<void> {
  console.log('\n🔗 ExtremaAPI — Integration testovi\n');

  // ── POST /api/diagnostics/extrema ──────────────────────────────────────────
  console.log('📮 POST /api/diagnostics/extrema:');

  await test('POST single module (gigatron) sa CRITICAL nalazom', async () => {
    const req = makeRequest({
      module: 'gigatron',
      inputs: { 'GIG-001': -50, 'GIG-003': 150 },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['module'], 'gigatron');
    assert.equal(body['status'], 'CRITICAL');
    assert((body['criticalCount'] as number) >= 2, 'mora biti >= 2 CRITICAL');
  });

  await test('POST single module bez nalaza vraća OK', async () => {
    const req = makeRequest({
      module: 'gigatron',
      inputs: { 'GIG-001': 100 },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['status'], 'OK');
    assert.equal(body['totalFindings'], 0);
  });

  await test('POST module=all sa više modula', async () => {
    const req = makeRequest({
      module: 'all',
      inputsByModule: {
        gigatron: { 'GIG-001': -5 },
        network: { 'NET-002': 503 },
      },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['module'], 'all');
    assert((body['totalFindings'] as number) >= 2);
  });

  await test('POST bez module polja tretira kao all', async () => {
    const req = makeRequest({ inputsByModule: {} });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['module'], 'all');
  });

  await test('POST nepoznati modul vraća 400', async () => {
    const req = makeRequest({
      module: 'nepostojeci-modul',
      inputs: {},
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const body = await res.json() as Record<string, unknown>;
    assert(typeof body['error'] === 'string', 'mora imati error poruku');
  });

  await test('POST bez inputs za single module vraća 400', async () => {
    const req = makeRequest({ module: 'gigatron' });
    const res = await POST(req);
    assert.equal(res.status, 400);
  });

  await test('POST neispravan JSON vraća 400', async () => {
    const req = new Request('http://localhost/api/diagnostics/extrema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
  });

  await test('POST network module: 5xx detekcija', async () => {
    const req = makeRequest({
      module: 'network',
      inputs: { 'NET-002': 503 },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['status'], 'CRITICAL');
  });

  await test('POST nova-generacija: RTP ekstrem', async () => {
    const req = makeRequest({
      module: 'nova-generacija',
      inputs: { 'NG-002': 80 },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['status'], 'CRITICAL');
  });

  await test('POST calculator: deljenje nulom i performance breach', async () => {
    const req = makeRequest({
      module: 'calculator',
      inputs: { 'CALC-001': 0, 'CALC-004': 150 },
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.equal(body['status'], 'CRITICAL');
    assert((body['criticalCount'] as number) >= 1);
  });

  // ── GET /api/diagnostics/extrema/report ────────────────────────────────────
  console.log('\n📊 GET /api/diagnostics/extrema/report:');

  await test('GET report vraća audit log i catalog stats', async () => {
    const res = await GET(makeGetRequest());
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert(typeof body['generatedAt'] === 'string', 'mora imati generatedAt');
    assert(typeof body['totalEntries'] === 'number', 'mora imati totalEntries');
    assert(typeof body['catalogStats'] === 'object', 'mora imati catalogStats');
    assert(Array.isArray(body['entries']), 'entries mora biti niz');
  });

  await test('GET report sa severity filterom', async () => {
    const res = await GET(makeGetRequest('?severity=CRITICAL'));
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    const entries = body['entries'] as { level: string }[];
    assert(entries.every((e) => e.level === 'CRITICAL'), 'svi moraju biti CRITICAL');
  });

  await test('GET report catalog stats ima ispravan total', async () => {
    const res = await GET(makeGetRequest());
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    const stats = body['catalogStats'] as { total: number };
    assert(stats.total > 0, 'catalog total mora biti > 0');
  });

  // ── Rezultati ──────────────────────────────────────────────────────────────
  clearAuditLog();
  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('\n❌ Greške:\n' + failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✅ Svi integration testovi prošli!\n');
  }
}

void runTests();
