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
  CHATGPT_KATALOG_CATALOG_MODE,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISCLAIMER,
  CHATGPT_KATALOG_MAX_COMPARE_ENTRIES,
  CHATGPT_KATALOG_PERSONA_ID,
  CHATGPT_KATALOG_COMPARE_MAX_MS,
  CHATGPT_KATALOG_SCOPE,
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

  console.log('\n🔎 [chatgpt-katalog] registry\n');

  await test('GPT_MODELS has at least 5 entries', () => {
    assert(GPT_MODELS.length >= 5, `Expected ≥5 models, got ${GPT_MODELS.length}`);
  });

  await test('GPT_TOOLS has at least 6 entries', () => {
    assert(GPT_TOOLS.length >= 6, `Expected ≥6 tools, got ${GPT_TOOLS.length}`);
  });

  await test('GPT_USE_CASES has at least 6 entries', () => {
    assert(GPT_USE_CASES.length >= 6, `Expected ≥6 use cases, got ${GPT_USE_CASES.length}`);
  });

  await test('all models have required fields', () => {
    for (const model of GPT_MODELS) {
      assert(model.id.length > 0, 'model missing id');
      assert(model.name.length > 0, `model ${model.id} missing name`);
      assert(model.contextWindow > 0, `model ${model.id} context window must be positive`);
      assert(model.pricing.inputPer1kTokens >= 0, `model ${model.id} negative input price`);
      assert(model.pricing.outputPer1kTokens >= 0, `model ${model.id} negative output price`);
      assert(Array.isArray(model.capabilities) && model.capabilities.length > 0, `model ${model.id} must have capabilities`);
      assert(['active', 'deprecated', 'preview', 'legacy'].includes(model.status), `model ${model.id} invalid status`);
    }
  });

  await test('gpt-4o model exists and is active', () => {
    const model = getModelById('gpt-4o');
    assert(model !== undefined, 'gpt-4o must exist');
    assert(model!.status === 'active', 'gpt-4o must be active');
    assert(model!.contextWindow === 128000, 'gpt-4o context window must be 128000');
  });

  await test('new tool registry entries are addressable', () => {
    const tool = getToolById('responses-api');
    assert(tool !== undefined, 'responses-api must exist');
  });

  await test('new use-case registry entries are addressable', () => {
    const useCase = getUseCaseById('uc-rag-assistant');
    assert(useCase !== undefined, 'uc-rag-assistant must exist');
    assert(useCase!.requiredCapabilities?.includes('structured-outputs') === true, 'uc-rag-assistant must require structured outputs');
  });

  await test('getEntryById returns undefined for unknown id', () => {
    const entry = getEntryById('nonexistent-xyz-99');
    assert(entry === undefined, 'unknown id must return undefined');
  });

  await test('getAllEntries returns models + tools + use-cases', () => {
    const all = getAllEntries();
    assert(all.length === GPT_MODELS.length + GPT_TOOLS.length + GPT_USE_CASES.length, 'total entry count mismatch');
  });

  console.log('\n🔎 [chatgpt-katalog] search-engine\n');

  await test('empty query returns all entries paginated', () => {
    const result = searchKatalog({ pageSize: 5 });
    assert(result.entries.length <= 5, 'pageSize=5 must return ≤5 entries');
    assert(result.total === getAllEntries().length, 'total must equal all entries count');
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.contractVersion === CHATGPT_KATALOG_CONTRACT_VERSION, 'contract version must match');
  });

  await test('search result summary exposes scope and catalog mode', () => {
    const result = searchKatalog({});
    assert(result.summary.catalogMode === CHATGPT_KATALOG_CATALOG_MODE, 'catalog mode must match');
    assert(result.summary.scope === CHATGPT_KATALOG_SCOPE, 'scope must match');
  });

  await test('search by type=model returns only models', () => {
    const result = searchKatalog({ type: 'model' });
    assert(result.entries.every((entry) => entry.type === 'model'), 'all results must be models');
  });

  await test('search by capabilities filters models', () => {
    const result = searchKatalog({ type: 'model', capabilities: ['vision', 'function-calling'] });
    assert(result.entries.length > 0, 'must find capability-matching models');
    assert(result.entries.every((entry) => entry.type === 'model' && entry.capabilities.includes('vision') && entry.capabilities.includes('function-calling')), 'all results must include requested capabilities');
  });

  await test('search by maxInputCostPer1k filters expensive models', () => {
    const result = searchKatalog({ type: 'model', maxInputCostPer1k: 0.0012 });
    assert(result.entries.length > 0, 'must find affordable models');
    assert(result.entries.every((entry) => entry.type === 'model' && entry.pricing.inputPer1kTokens <= 0.0012), 'all model prices must be within threshold');
  });

  await test('search by query "gpt-4o" finds gpt-4o first by relevance', () => {
    const result = searchKatalog({ query: 'gpt-4o', type: 'model' });
    assert(result.entries.length > 0, 'must find gpt-4o');
    assert(result.entries[0].id === 'gpt-4o', 'gpt-4o should rank first');
  });

  await test('search by status=active returns only active models', () => {
    const result = searchKatalog({ type: 'model', status: 'active' });
    assert(result.entries.every((entry) => entry.type === 'model' && entry.status === 'active'), 'all must be active models');
  });

  await test('search with tag filter', () => {
    const result = searchKatalog({ tags: ['reasoning'] });
    assert(result.entries.length > 0, 'must find entries with reasoning tag');
    assert(result.entries.every((entry) => entry.tags.some((tag) => tag.includes('reasoning')) || (entry.type === 'model' && entry.capabilities.includes('reasoning'))), 'all must match reasoning context');
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

  console.log('\n🔎 [chatgpt-katalog] compare-engine\n');

  await test('compare 2 valid models succeeds', () => {
    const { result, error } = compareModels(['gpt-4o', 'gpt-4o-mini']);
    assert(error === undefined, `unexpected error: ${error}`);
    assert(result !== null, 'result must not be null');
    assert(result!.models.length === 2, 'must have 2 model rows');
    assert(result!.cheapestModelId !== null, 'cheapestModelId must be set');
    assert(result!.largestContextModelId !== null, 'largestContextModelId must be set');
    assert(result!.fastestModelId !== null, 'fastestModelId must be set');
    assert(result!.tradeoffs.length >= 3, 'tradeoffs must be populated');
    assert(result!.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('compare strips duplicate model ids', () => {
    const { result, error } = compareModels(['gpt-4o', 'gpt-4o', 'o3-mini']);
    assert(error === undefined, `unexpected error: ${error}`);
    assert(result?.models.length === 2, 'duplicate model ids should collapse to 2 unique rows');
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

  await test('compare identifies shared and unique capabilities', () => {
    const { result } = compareModels(['gpt-4o', 'o1']);
    assert(result !== null, 'result must not be null');
    const hasUnique = result!.models.some((model) => model.uniqueCapabilities.length > 0);
    assert(hasUnique, 'at least one model should have unique capabilities');
    assert(result!.sharedCapabilities.includes('text'), 'text should be shared');
  });

  await test('compare performance ≤100ms', () => {
    const start = performance.now();
    compareModels(['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini']);
    const elapsed = performance.now() - start;
    assert(elapsed <= CHATGPT_KATALOG_COMPARE_MAX_MS, `compare took ${elapsed.toFixed(1)}ms > ${CHATGPT_KATALOG_COMPARE_MAX_MS}ms`);
  });

  console.log('\n🔎 [chatgpt-katalog] recommendation-engine\n');

  await test('recommend for code domain returns result with disclaimer', () => {
    const result = recommend({ domain: 'code', budget: 100 });
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.contractVersion === CHATGPT_KATALOG_CONTRACT_VERSION, 'contract version must match');
    assert(result.reasoning.length > 0, 'reasoning must be non-empty');
    assert(result.catalogMode === CHATGPT_KATALOG_CATALOG_MODE, 'catalog mode must match');
  });

  await test('recommend with very low budget falls back and flags budget mismatch', () => {
    const result = recommend({ domain: 'text', budget: 0.1 });
    assert(result.recommendedModel !== null, 'fallback recommendation should still exist');
    assert(result.budgetFit === false, 'budgetFit must be false when nothing fits the budget');
  });

  await test('recommend with negative budget returns result without error', () => {
    const result = recommend({ domain: 'test', budget: -100 });
    assert(result.disclaimer.length > 0, 'must have disclaimer even for negative budget');
  });

  await test('recommend with NaN budget returns result without error', () => {
    const result = recommend({ domain: 'test', budget: Number.NaN });
    assert(result.disclaimer.length > 0, 'must have disclaimer for NaN budget');
  });

  await test('recommend with preferSpeed returns a valid speed tier', () => {
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

  await test('recommend includes matched use cases for analytics domain', () => {
    const result = recommend({ domain: 'analytics', budget: 10, requiredCapabilities: ['structured-outputs'] });
    assert(result.matchedUseCases.length > 0, 'matched use cases should be populated');
  });

  await test('recommend performance ≤50ms', () => {
    const start = performance.now();
    recommend({ domain: 'analytics', budget: 10 });
    const elapsed = performance.now() - start;
    assert(elapsed <= 50, `recommend took ${elapsed.toFixed(1)}ms > 50ms`);
  });

  console.log('\n🔎 [chatgpt-katalog] health\n');

  await test('health report has correct structure', () => {
    const health = getKatalogHealth();
    assert(health.status === 'ok', 'status must be ok');
    assert(health.personaId === CHATGPT_KATALOG_PERSONA_ID, 'personaId must match');
    assert(health.scope === CHATGPT_KATALOG_SCOPE, 'scope must match');
    assert(health.catalogMode === CHATGPT_KATALOG_CATALOG_MODE, 'catalog mode must match');
    assert(health.modelCount === GPT_MODELS.length, 'modelCount must match');
    assert(health.toolCount === GPT_TOOLS.length, 'toolCount must match');
    assert(health.useCaseCount === GPT_USE_CASES.length, 'useCaseCount must match');
    assert(health.totalEntries === GPT_MODELS.length + GPT_TOOLS.length + GPT_USE_CASES.length, 'totalEntries must match');
    assert(health.linkedModules.length >= 3, 'linked modules must be present');
    assert(health.activeModelCount > 0, 'must have at least one active model');
    assert(typeof health.lastUpdated === 'string', 'lastUpdated must be string');
    assert(health.kpi.searchMaxMs === 50, 'searchMaxMs must be 50');
    assert(health.kpi.compareMaxMs === 100, 'compareMaxMs must be 100');
    assert(health.kpi.apiResponseMaxMs === 200, 'apiResponseMaxMs must be 200');
  });

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }
  console.log('✅ All chatgpt-katalog lib tests passed\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
