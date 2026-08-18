// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Lib Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  searchKatalog,
  compareModels,
  recommend,
  getKatalogHealth,
  getEntryById,
  getModelById,
  getToolById,
  getUseCaseById,
  getAllEntries,
  GPT_MODELS,
  GPT_TOOLS,
  GPT_USE_CASES,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISCLAIMER,
  CHATGPT_KATALOG_MAX_COMPARE_ENTRIES,
  CHATGPT_KATALOG_PERSONA_ID,
  CHATGPT_KATALOG_COMPARE_MAX_MS,
  CHATGPT_KATALOG_SEARCH_MAX_MS,
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

async function runTests(): Promise<void> {
  console.log('\n🔎 [chatgpt-katalog] constants\n');

  await test('contract version is non-empty', () => {
    assert(CHATGPT_KATALOG_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(CHATGPT_KATALOG_PERSONA_ID === 'chatgpt-katalog-core', `unexpected persona id: ${CHATGPT_KATALOG_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(CHATGPT_KATALOG_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('max compare entries is 4', () => {
    assert(CHATGPT_KATALOG_MAX_COMPARE_ENTRIES === 4, 'max compare must be 4');
  });

  // ─── Registry ─────────────────────────────────────────────────────────────────

  console.log('\n🔎 [chatgpt-katalog] registry\n');

  await test('GPT_MODELS has at least 5 entries', () => {
    assert(GPT_MODELS.length >= 5, `Expected ≥5 models, got ${GPT_MODELS.length}`);
  });

  await test('GPT_TOOLS has at least 4 entries', () => {
    assert(GPT_TOOLS.length >= 4, `Expected ≥4 tools, got ${GPT_TOOLS.length}`);
  });

  await test('GPT_USE_CASES has at least 4 entries', () => {
    assert(GPT_USE_CASES.length >= 4, `Expected ≥4 use cases, got ${GPT_USE_CASES.length}`);
  });

  await test('all models have required fields', () => {
    for (const m of GPT_MODELS) {
      assert(m.id.length > 0, `model missing id`);
      assert(m.name.length > 0, `model ${m.id} missing name`);
      assert(m.contextWindow > 0, `model ${m.id} context window must be positive`);
      assert(m.pricing.inputPer1kTokens >= 0, `model ${m.id} negative input price`);
      assert(m.pricing.outputPer1kTokens >= 0, `model ${m.id} negative output price`);
      assert(Array.isArray(m.capabilities) && m.capabilities.length > 0, `model ${m.id} must have capabilities`);
      assert(['active', 'deprecated', 'preview', 'legacy'].includes(m.status), `model ${m.id} invalid status`);
    }
  });

  await test('gpt-4o model exists and is active', () => {
    const model = getModelById('gpt-4o');
    assert(model !== undefined, 'gpt-4o must exist');
    assert(model!.status === 'active', 'gpt-4o must be active');
    assert(model!.contextWindow === 128000, 'gpt-4o context window must be 128000');
  });

  await test('getEntryById returns undefined for unknown id', () => {
    const entry = getEntryById('nonexistent-xyz-99');
    assert(entry === undefined, 'unknown id must return undefined');
  });

  await test('getAllEntries returns models + tools + use-cases', () => {
    const all = getAllEntries();
    assert(all.length === GPT_MODELS.length + GPT_TOOLS.length + GPT_USE_CASES.length, 'total entry count mismatch');
  });

  await test('getToolById finds dalle-3', () => {
    const tool = getToolById('dalle-3');
    assert(tool !== undefined, 'dalle-3 must exist');
    assert(tool!.type === 'tool', 'dalle-3 must be type tool');
  });

  await test('getUseCaseById finds uc-customer-support', () => {
    const uc = getUseCaseById('uc-customer-support');
    assert(uc !== undefined, 'uc-customer-support must exist');
    assert(uc!.type === 'use-case', 'must be type use-case');
  });

  // ─── Search Engine ────────────────────────────────────────────────────────────

  console.log('\n🔎 [chatgpt-katalog] search-engine\n');

  await test('empty query returns all entries paginated', () => {
    const result = searchKatalog({ pageSize: 5 });
    assert(result.entries.length <= 5, 'pageSize=5 must return ≤5 entries');
    assert(result.total === getAllEntries().length, 'total must equal all entries count');
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.contractVersion === CHATGPT_KATALOG_CONTRACT_VERSION, 'contract version must match');
  });

  await test('search by type=model returns only models', () => {
    const result = searchKatalog({ type: 'model' });
    assert(result.entries.every((e) => e.type === 'model'), 'all results must be models');
  });

  await test('search by type=tool returns only tools', () => {
    const result = searchKatalog({ type: 'tool' });
    assert(result.entries.every((e) => e.type === 'tool'), 'all results must be tools');
  });

  await test('search by type=use-case returns only use-cases', () => {
    const result = searchKatalog({ type: 'use-case' });
    assert(result.entries.every((e) => e.type === 'use-case'), 'all results must be use-cases');
  });

  await test('search by query "gpt-4o" finds gpt-4o', () => {
    const result = searchKatalog({ query: 'gpt-4o', type: 'model' });
    assert(result.entries.length > 0, 'must find gpt-4o');
  });

  await test('search by status=active returns only active models', () => {
    const result = searchKatalog({ type: 'model', status: 'active' });
    assert(result.entries.every((e) => e.type === 'model' && e.status === 'active'), 'all must be active models');
  });

  await test('search with tag filter', () => {
    const result = searchKatalog({ tags: ['reasoning'] });
    assert(result.entries.length > 0, 'must find entries with reasoning tag');
    assert(result.entries.every((e) => e.tags.some((t) => t.includes('reasoning'))), 'all must have reasoning tag');
  });

  await test('pagination works correctly', () => {
    const page1 = searchKatalog({ page: 1, pageSize: 2 });
    const page2 = searchKatalog({ page: 2, pageSize: 2 });
    assert(page1.entries.length <= 2, 'page 1 must have ≤2 entries');
    assert(page1.page === 1, 'page must be 1');
    assert(page2.page === 2, 'page must be 2');
  });

  await test('sort by name-asc returns sorted entries', () => {
    const result = searchKatalog({ sortBy: 'name-asc', type: 'model' });
    for (let i = 1; i < result.entries.length; i++) {
      const a = (result.entries[i - 1] as { name: string }).name;
      const b = (result.entries[i] as { name: string }).name;
      assert(a.localeCompare(b) <= 0, `entries not sorted: ${a} > ${b}`);
    }
  });

  await test('search performance ≤50ms', () => {
    const start = performance.now();
    searchKatalog({ query: 'gpt' });
    const elapsed = performance.now() - start;
    assert(elapsed <= CHATGPT_KATALOG_SEARCH_MAX_MS, `search took ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_SEARCH_MAX_MS}ms`);
  });

  // ─── Compare Engine ───────────────────────────────────────────────────────────

  console.log('\n🔎 [chatgpt-katalog] compare-engine\n');

  await test('compare 2 valid models succeeds', () => {
    const { result, error } = compareModels(['gpt-4o', 'gpt-4o-mini']);
    assert(error === undefined, `unexpected error: ${error}`);
    assert(result !== null, 'result must not be null');
    assert(result!.models.length === 2, 'must have 2 model rows');
    assert(result!.cheapestModelId !== null, 'cheapestModelId must be set');
    assert(result!.largestContextModelId !== null, 'largestContextModelId must be set');
    assert(result!.fastestModelId !== null, 'fastestModelId must be set');
    assert(result!.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('compare fewer than 2 models returns error', () => {
    const { result, error } = compareModels(['gpt-4o']);
    assert(result === null, 'result must be null');
    assert(typeof error === 'string' && error.length > 0, 'error must be set');
  });

  await test('compare more than 4 models returns error', () => {
    const { result, error } = compareModels(['gpt-4o', 'gpt-4o-mini', 'o1', 'gpt-3.5-turbo', 'gpt-4']);
    assert(result === null, 'result must be null for >4 models');
    assert(typeof error === 'string', 'error must be set');
  });

  await test('compare with unknown model id returns error', () => {
    const { result, error } = compareModels(['gpt-4o', 'nonexistent-model']);
    assert(result === null, 'result must be null for unknown model');
    assert(typeof error === 'string', 'error must be set');
  });

  await test('compare identifies unique capabilities', () => {
    const { result } = compareModels(['gpt-4o', 'o1']);
    assert(result !== null, 'result must not be null');
    const hasUnique = result!.models.some((m) => m.uniqueCapabilities.length > 0);
    assert(hasUnique, 'at least one model should have unique capabilities');
  });

  await test('compare performance ≤100ms', () => {
    const start = performance.now();
    compareModels(['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini']);
    const elapsed = performance.now() - start;
    assert(elapsed <= CHATGPT_KATALOG_COMPARE_MAX_MS, `compare took ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_COMPARE_MAX_MS}ms`);
  });

  // ─── Recommendation Engine ────────────────────────────────────────────────────

  console.log('\n🔎 [chatgpt-katalog] recommendation-engine\n');

  await test('recommend for code domain returns result with disclaimer', () => {
    const result = recommend({ domain: 'code', budget: 100 });
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.contractVersion === CHATGPT_KATALOG_CONTRACT_VERSION, 'contract version must match');
    assert(result.reasoning.length > 0, 'reasoning must be non-empty');
  });

  await test('recommend with very low budget returns cheapest models', () => {
    const result = recommend({ domain: 'text', budget: 0.5 });
    if (result.recommendedModel) {
      const costPerMillion = result.recommendedModel.pricing.inputPer1kTokens * 1000;
      assert(costPerMillion <= 0.5, `recommended model ${result.recommendedModel.name} exceeds budget`);
    }
  });

  await test('recommend with negative budget returns result without error', () => {
    const result = recommend({ domain: 'test', budget: -100 });
    assert(result.disclaimer.length > 0, 'must have disclaimer even for negative budget');
  });

  await test('recommend with NaN budget returns result without error', () => {
    const result = recommend({ domain: 'test', budget: NaN });
    assert(result.disclaimer.length > 0, 'must have disclaimer for NaN budget');
  });

  await test('recommend with preferSpeed returns fast model first', () => {
    const result = recommend({ domain: 'customer-service', budget: 1000, preferSpeed: true });
    if (result.recommendedModel) {
      assert(['fast', 'medium', 'slow'].includes(result.recommendedModel.speedTier), 'speedTier must be valid');
    }
  });

  await test('recommend with requiredCapabilities filters models', () => {
    const result = recommend({ domain: 'image', budget: 1000, requiredCapabilities: ['vision'] });
    if (result.recommendedModel) {
      assert(result.recommendedModel.capabilities.includes('vision'), 'recommended model must have vision');
    }
  });

  await test('recommend performance ≤50ms', () => {
    const start = performance.now();
    recommend({ domain: 'analytics', budget: 10 });
    const elapsed = performance.now() - start;
    assert(elapsed <= 50, `recommend took ${elapsed.toFixed(1)}ms > 50ms`);
  });

  // ─── Health ───────────────────────────────────────────────────────────────────

  console.log('\n🔎 [chatgpt-katalog] health\n');

  await test('health report has correct structure', () => {
    const health = getKatalogHealth();
    assert(health.status === 'ok', 'status must be ok');
    assert(health.personaId === CHATGPT_KATALOG_PERSONA_ID, 'personaId must match');
    assert(health.modelCount === GPT_MODELS.length, 'modelCount must match');
    assert(health.toolCount === GPT_TOOLS.length, 'toolCount must match');
    assert(health.useCaseCount === GPT_USE_CASES.length, 'useCaseCount must match');
    assert(health.totalEntries === GPT_MODELS.length + GPT_TOOLS.length + GPT_USE_CASES.length, 'totalEntries must match');
    assert(health.activeModelCount > 0, 'must have at least one active model');
    assert(typeof health.lastUpdated === 'string', 'lastUpdated must be string');
    assert(health.kpi.searchMaxMs === 50, 'searchMaxMs must be 50');
    assert(health.kpi.compareMaxMs === 100, 'compareMaxMs must be 100');
    assert(health.kpi.apiResponseMaxMs === 200, 'apiResponseMaxMs must be 200');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log('✅ All chatgpt-katalog lib tests passed\n');
}

// Eksportujemo za direktno pokretanje
runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
