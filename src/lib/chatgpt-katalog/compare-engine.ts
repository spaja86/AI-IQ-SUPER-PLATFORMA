// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Compare Engine
// Kompanija SPAJA — Digitalna Industrija

import type { GPTModel, KatalogCompareResult, ModelCompareRow } from './types';
import { CHATGPT_KATALOG_CONTRACT_VERSION, CHATGPT_KATALOG_DISCLAIMER, CHATGPT_KATALOG_MAX_COMPARE_ENTRIES } from './types';
import { getModelById } from './registry';

export function compareModels(modelIds: string[]): { result: KatalogCompareResult | null; error?: string } {
  const start = performance.now();

  if (!Array.isArray(modelIds) || modelIds.length < 2) {
    return { result: null, error: 'At least 2 model IDs are required for comparison' };
  }
  if (modelIds.length > CHATGPT_KATALOG_MAX_COMPARE_ENTRIES) {
    return { result: null, error: `Cannot compare more than ${CHATGPT_KATALOG_MAX_COMPARE_ENTRIES} models at once` };
  }

  const models: GPTModel[] = [];
  for (const id of modelIds) {
    const model = getModelById(id);
    if (!model) {
      return { result: null, error: `Model not found: ${id}` };
    }
    models.push(model);
  }

  const capabilityUnion = Array.from(new Set(models.flatMap((m) => m.capabilities))).sort();

  const rows: ModelCompareRow[] = models.map((m) => ({
    modelId: m.id,
    name: m.name,
    contextWindow: m.contextWindow,
    inputPricePer1k: m.pricing.inputPer1kTokens,
    outputPricePer1k: m.pricing.outputPer1kTokens,
    speedTier: m.speedTier,
    capabilities: m.capabilities,
    status: m.status,
    uniqueCapabilities: m.capabilities.filter((cap) =>
      models.filter((other) => other.id !== m.id).every((other) => !other.capabilities.includes(cap)),
    ),
  }));

  const cheapestModelId = models.reduce((best, m) =>
    m.pricing.inputPer1kTokens < best.pricing.inputPer1kTokens ? m : best,
  ).id;

  const largestContextModelId = models.reduce((best, m) =>
    m.contextWindow > best.contextWindow ? m : best,
  ).id;

  const speedOrder: Record<string, number> = { fast: 0, medium: 1, slow: 2 };
  const fastestModelId = models.reduce((best, m) =>
    speedOrder[m.speedTier] < speedOrder[best.speedTier] ? m : best,
  ).id;

  return {
    result: {
      models: rows,
      capabilityUnion,
      cheapestModelId,
      largestContextModelId,
      fastestModelId,
      disclaimer: CHATGPT_KATALOG_DISCLAIMER,
      contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
      evaluationMs: Math.round((performance.now() - start) * 100) / 100,
    },
  };
}
