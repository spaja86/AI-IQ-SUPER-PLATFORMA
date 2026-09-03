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
  CHATGPT_KATALOG_CATALOG_MODE,
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

  await test('GET /api/chatgpt-katalog/health returns 200 with headers', async () => {
    const start = performance.now();
    const response = await healthGET();
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-ChatGPT-Katalog-Contract-Version') === CHATGPT_KATALOG_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-ChatGPT-Katalog-Persona-Id') === CHATGPT_KATALOG_PERSONA_ID, 'missing persona id header');
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `health ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);

    const body = await response.json() as { data: { status: string; modelCount: number; catalogMode: string } };
    assert(body.data.status === 'ok', 'health status must be ok');
    assert(body.data.modelCount > 0, 'must have models');
    assert(body.data.catalogMode === CHATGPT_KATALOG_CATALOG_MODE, 'catalog mode must match');
  });

  await test('GET /api/chatgpt-katalog returns all entries', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog', 'GET');
    const response = await listGET(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { total: number; entries: unknown[]; summary: { models: number } } };
    assert(body.data.total > 0, 'must have entries');
    assert(body.data.summary.models > 0, 'summary.models must be present');
  });

  await test('GET /api/chatgpt-katalog?type=model&capabilities=vision filters to models', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog?type=model&capabilities=vision', 'GET');
    const response = await listGET(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { entries: Array<{ type: string; capabilities: string[] }> } };
    assert(body.data.entries.every((entry) => entry.type === 'model' && entry.capabilities.includes('vision')), 'all must be vision models');
  });

  await test('GET /api/chatgpt-katalog with invalid type returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog?type=invalid', 'GET');
    const response = await listGET(req);
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

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
    assert(body.data.entries.every((entry) => entry.type === 'model'), 'all must be models');
  });

  await test('POST /api/chatgpt-katalog/search with capability and cost filters returns 200', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', { type: 'model', capabilities: ['function-calling'], maxInputCostPer1k: 0.005 });
    const response = await searchPOST(req);
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { entries: Array<{ capabilities: string[]; pricing: { inputPer1kTokens: number } }> } };
    assert(body.data.entries.every((entry) => entry.capabilities.includes('function-calling') && entry.pricing.inputPer1kTokens <= 0.005), 'entries must satisfy capability and cost filters');
  });

  await test('POST /api/chatgpt-katalog/search with invalid type returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', { type: 'invalid' });
    const response = await searchPOST(req);
    assert(response.status === 400, `expected 400 for invalid type, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/search with invalid status returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', { status: 'unknown' });
    const response = await searchPOST(req);
    assert(response.status === 400, `expected 400 for invalid status, got ${response.status}`);
  });

  await test('POST /api/chatgpt-katalog/search with invalid sortBy returns 400', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/search', 'POST', { sortBy: 'invalid-sort' });
    const response = await searchPOST(req);
    assert(response.status === 400, `expected 400 for invalid sortBy, got ${response.status}`);
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

  await test('POST /api/chatgpt-katalog/compare 2 models returns compare result', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/compare', 'POST', { modelIds: ['gpt-4o', 'gpt-4o-mini'] });
    const start = performance.now();
    const response = await comparePOST(req);
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `compare ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);
    const body = await response.json() as { data: { models: unknown[]; cheapestModelId: string; tradeoffs: string[] } };
    assert(body.data.models.length === 2, 'must have 2 models in result');
    assert(typeof body.data.cheapestModelId === 'string', 'cheapestModelId must be set');
    assert(body.data.tradeoffs.length >= 3, 'tradeoffs must be returned');
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

  await test('POST /api/chatgpt-katalog/recommend with valid payload returns 200', async () => {
    const req = makeRequest('http://localhost/api/chatgpt-katalog/recommend', 'POST', { domain: 'code', budget: 10, requiredCapabilities: ['function-calling'] });
    const start = performance.now();
    const response = await recommendPOST(req);
    const elapsed = performance.now() - start;

    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(elapsed <= CHATGPT_KATALOG_API_RESPONSE_MAX_MS, `recommend ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_API_RESPONSE_MAX_MS}ms`);
    const body = await response.json() as { data: { reasoning: string; disclaimer: string; budgetFit: boolean; matchedUseCases: string[] } };
    assert(body.data.reasoning.length > 0, 'reasoning must be non-empty');
    assert(body.data.disclaimer.length > 0, 'disclaimer must be present');
    assert(Array.isArray(body.data.matchedUseCases), 'matchedUseCases must be returned');
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

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }
  console.log('✅ All chatgpt-katalog route tests passed\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
