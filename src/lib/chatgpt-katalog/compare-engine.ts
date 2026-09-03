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

  const uniqueModelIds = Array.from(new Set(modelIds.map((modelId) => modelId.trim()).filter(Boolean)));

  if (uniqueModelIds.length < 2) {
    return { result: null, error: 'At least 2 unique model IDs are required for comparison' };
  }

  if (uniqueModelIds.length > CHATGPT_KATALOG_MAX_COMPARE_ENTRIES) {
    return { result: null, error: `Cannot compare more than ${CHATGPT_KATALOG_MAX_COMPARE_ENTRIES} models at once` };
  }

  const models: GPTModel[] = [];
  for (const id of uniqueModelIds) {
    const model = getModelById(id);
    if (!model) {
      return { result: null, error: `Model not found: ${id}` };
    }
    models.push(model);
  }

  const capabilityUnion = Array.from(new Set(models.flatMap((model) => model.capabilities))).sort();
  const sharedCapabilities = capabilityUnion.filter((capability) => models.every((model) => model.capabilities.includes(capability)));

  const rows: ModelCompareRow[] = models.map((model) => ({
    modelId: model.id,
    name: model.name,
    contextWindow: model.contextWindow,
    inputPricePer1k: model.pricing.inputPer1kTokens,
    outputPricePer1k: model.pricing.outputPer1kTokens,
    speedTier: model.speedTier,
    capabilities: model.capabilities,
    status: model.status,
    uniqueCapabilities: model.capabilities.filter((capability) =>
      models.filter((otherModel) => otherModel.id !== model.id).every((otherModel) => !otherModel.capabilities.includes(capability)),
    ),
    strengths: model.strengths ?? [],
  }));

  const cheapestModel = models.reduce((best, model) =>
    model.pricing.inputPer1kTokens < best.pricing.inputPer1kTokens ? model : best,
  );

  const largestContextModel = models.reduce((best, model) =>
    model.contextWindow > best.contextWindow ? model : best,
  );

  const speedOrder: Record<string, number> = { fast: 0, medium: 1, slow: 2 };
  const fastestModel = models.reduce((best, model) =>
    speedOrder[model.speedTier] < speedOrder[best.speedTier] ? model : best,
  );

  const tradeoffs: string[] = [
    `${cheapestModel.name} is the cheapest option for cost-sensitive flows at $${cheapestModel.pricing.inputPer1kTokens}/1k input tokens.`,
    `${largestContextModel.name} provides the largest context window (${largestContextModel.contextWindow.toLocaleString()} tokens) for long-context tasks.`,
    `${fastestModel.name} is the fastest-latency option in this comparison set.`,
  ];

  if (sharedCapabilities.length > 0) {
    tradeoffs.push(`All selected models support: ${sharedCapabilities.join(', ')}.`);
  }

  return {
    result: {
      models: rows,
      capabilityUnion,
      sharedCapabilities,
      cheapestModelId: cheapestModel.id,
      largestContextModelId: largestContextModel.id,
      fastestModelId: fastestModel.id,
      tradeoffs,
      disclaimer: CHATGPT_KATALOG_DISCLAIMER,
      contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
      evaluationMs: Math.round((performance.now() - start) * 100) / 100,
    },
  };
}
