import type { NextRequest } from 'next/server';
import { GET as getDestructionHealth } from '../../app/api/extrimli/destruction/health/route';
import { GET as getDestructionAssets } from '../../app/api/extrimli/destruction/assets/route';
import { GET as getDestructionAsset } from '../../app/api/extrimli/destruction/assets/[id]/route';
import { POST as postDestruction } from '../../app/api/extrimli/destruction/route';
import { POST as postDestructionPreview } from '../../app/api/extrimli/destruction/preview/route';
import { _resetDestructionMetrics } from '../../lib/extrimli';

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

function makePostRequest(url: string, body: unknown): NextRequest {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeGetRequest(url: string): NextRequest {
  return new Request(url, { method: 'GET' }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetDestructionMetrics();

  console.log('\n🔗 [extrimli] route tests\n');

  await test('GET /api/extrimli/destruction/health returns report and headers', async () => {
    const response = await getDestructionHealth();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Extrimli-Destrukcija-Contract-Version') === 'v1-destrukcija', 'missing destruction contract header');

    const body = await response.json() as { data: { registrySize: number; destructionContractVersion: string } };
    assert(body.data.registrySize >= 5, `expected registry size >= 5, got ${body.data.registrySize}`);
    assert(body.data.destructionContractVersion === 'v1-destrukcija', 'unexpected destruction contract version');
  });

  await test('GET /api/extrimli/destruction/assets supports filtering', async () => {
    const response = await getDestructionAssets(makeGetRequest('http://localhost/api/extrimli/destruction/assets?material=glass'));
    assert(response.status === 200, `expected 200, got ${response.status}`);

    const body = await response.json() as { data: { assets: Array<{ material: string }> } };
    assert(body.data.assets.length >= 1, 'expected at least one glass asset');
    assert(body.data.assets.every((asset) => asset.material === 'glass'), 'filter should only return glass assets');
  });

  await test('GET /api/extrimli/destruction/assets/[id] returns asset', async () => {
    const response = await getDestructionAsset(
      makeGetRequest('http://localhost/api/extrimli/destruction/assets/glass-dome-arena'),
      { params: Promise.resolve({ id: 'glass-dome-arena' }) },
    );
    assert(response.status === 200, `expected 200, got ${response.status}`);

    const body = await response.json() as { data: { id: string } };
    assert(body.data.id === 'glass-dome-arena', `unexpected asset id: ${body.data.id}`);
  });

  await test('GET /api/extrimli/destruction/assets/[id] returns 404 for unknown asset', async () => {
    const response = await getDestructionAsset(
      makeGetRequest('http://localhost/api/extrimli/destruction/assets/missing'),
      { params: Promise.resolve({ id: 'missing' }) },
    );
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /api/extrimli/destruction returns 200 for valid payload', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      assetId: 'glass-dome-arena',
      dimension: '720D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
      athleteExperience: 6,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean; severityLevel: string } };
    assert(body.data.valid === true, 'expected valid result');
    assert(body.data.severityLevel === 'MAJOR' || body.data.severityLevel === 'MINOR' || body.data.severityLevel === 'CATASTROPHIC', 'unexpected severity level');
  });

  await test('POST /api/extrimli/destruction returns 422 for unsupported dimension', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      assetId: 'glass-dome-arena',
      dimension: '5760D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
    }));

    assert(response.status === 422, `expected 422, got ${response.status}`);
    const body = await response.json() as { data: { valid: boolean } };
    assert(body.data.valid === false, 'expected invalid result');
  });

  await test('POST /api/extrimli/destruction returns 400 when required field is missing', async () => {
    const response = await postDestruction(makePostRequest('http://localhost/api/extrimli/destruction', {
      dimension: '720D',
      impactForce: 180,
      resonanceIndex: 4,
      containmentLevel: 7,
    }));

    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/extrimli/destruction/preview returns degraded preview when limits exceed safety caps', async () => {
    const response = await postDestructionPreview(makePostRequest('http://localhost/api/extrimli/destruction/preview', {
      assetId: 'glass-dome-arena',
      dimension: '1440D',
      impactForce: 1000,
      resonanceIndex: 10,
      containmentLevel: 0,
    }));

    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { degraded: boolean; activationRequired: boolean } };
    assert(body.data.degraded === true, 'expected degraded preview');
    assert(body.data.activationRequired === false, 'preview should not require activation');
  });

  await test('POST /api/extrimli/destruction returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/extrimli/destruction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'INVALID JSON {{{',
    }) as unknown as NextRequest;

    const response = await postDestruction(request);
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
