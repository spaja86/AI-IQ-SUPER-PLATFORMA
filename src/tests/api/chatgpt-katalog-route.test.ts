// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET as listGET } from '../../app/api/chatgpt-katalog/route';
import { GET as healthGET } from '../../app/api/chatgpt-katalog/health/route';
import { POST as searchPOST } from '../../app/api/chatgpt-katalog/search/route';
import { POST as comparePOST } from '../../app/api/chatgpt-katalog/compare/route';
import { POST as recommendPOST } from '../../app/api/chatgpt-katalog/recommend/route';
import {
  CHATGPT_KATALOG_API_RESPONSE_MAX_MS,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_PERSONA_ID,
} from '../../lib/chatgpt-katalog';

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

function makeRequest(url: string, method: string, body?: unknown): NextRequest {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🔗 [chatgpt-katalog] route tests\n');

  // ─── GET /health ──────────────────────────────────────────────────────────────

  await test('GET /api/chatgpt-katalog/health returns 200 with headers', async () => {
    const start = performance.now();
    const response = await healthGET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-ChatGPT-Katalog-Contract-Version') === CHATGPT_KATALOG_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-ChatGPT-Katalog-Persona-Id') === CHATGPT_KATALOG_PERSONA_ID, 'missing persona id header');
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `health ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { status: string; modelCount: number } };
    assert(body.data.status === 'ok', 'health status must be ok');
    assert(body.data.modelCount > 0, 'must have models');
  });

  // ─── GET /list ────────────────────────────────────────────────────────────────

  await test('GET /api/chatgpt-katalog returns all entries', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog', 'GET');
    const response = await listGET(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { total: number; entries: unknown[] } };
    assert(body.data.total > 0, 'must have entries');
  });

  await test('GET /api/chatgpt-katalog?type=model filters to models', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog?type=model', 'GET');
    const response = await listGET(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { entries: Array<{ type: string }> } };
    assert(body.data.entries.every((e) => e.type === 'model'), 'all must be models');
  });

  await test('GET /api/chatgpt-katalog with invalid type returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog?type=invalid', 'GET');
    const response = await listGET(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // ─── POST /search ─────────────────────────────────────────────────────────────

  await test('POST /api/chatgpt-katalog/search with empty body returns all entries', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', {});
    const response = await searchPOST(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { total: number } };
    assert(body.data.total > 0, 'must have entries');
  });

  await test('POST /api/chatgpt-katalog/search by query returns relevant results', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', { query: 'reasoning', type: 'model' });
    const response = await searchPOST(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { entries: Array<{ type: string }> } };
    assert(body.data.entries.every((e) => e.type === 'model'), 'all must be models');
  });

  await test('POST /api/chatgpt-katalog/search with invalid JSON returns 400', async () => {
    const req = new Request('http://localhost/api/chatgpt-katalog/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    }) as unknown as NextRequest;
    const response = await searchPOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // ─── POST /compare ────────────────────────────────────────────────────────────

  await test('POST /api/chatgpt-katalog/compare 2 models returns compare result', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', { modelIds: ['gpt-4o', 'gpt-4o-mini'] });
    const start = performance.now();
    const response = await comparePOST(req);
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `compare ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);
    const body = await response.json() as { data: { models: unknown[]; cheapestModelId: string } };
    assert(body.data.models.length === 2, 'must have 2 models in result');
    assert(typeof body.data.cheapestModelId === 'string', 'cheapestModelId must be set');
  });

  await test('POST /api/chatgpt-katalog/compare with 1 model returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', { modelIds: ['gpt-4o'] });
    const response = await comparePOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/compare with 5 models returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', {
      modelIds: ['gpt-4o', 'gpt-4o-mini', 'o1', 'gpt-3.5-turbo', 'gpt-4'],
    });
    const response = await comparePOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/compare with unknown model returns 404', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', { modelIds: ['gpt-4o', 'nonexistent-model'] });
    const response = await comparePOST(req);
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/compare missing modelIds returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', {});
    const response = await comparePOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  // ─── POST /recommend ──────────────────────────────────────────────────────────

  await test('POST /api/chatgpt-katalog/recommend with valid payload returns 200', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/recommend', 'POST', { domain: 'code', budget: 10 });
    const start = performance.now();
    const response = await recommendPOST(req);
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `recommend ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);
    const body = await response.json() as { data: { reasoning: string; disclaimer: string } };
    assert(body.data.reasoning.length > 0, 'reasoning must be non-empty');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('POST /api/chatgpt-katalog/recommend missing domain returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/recommend', 'POST', { budget: 10 });
    const response = await recommendPOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/recommend missing budget returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/recommend', 'POST', { domain: 'code' });
    const response = await recommendPOST(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/recommend with negative budget returns 200 (sanitized)', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/recommend', 'POST', { domain: 'analytics', budget: -50 });
    const response = await recommendPOST(req);
    assert(response.status === 200, `expected 200 for negative budget, got ${response.status}`);
  });

  // ─── Summary ──────────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log('✅ All chatgpt-katalog route tests passed\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
