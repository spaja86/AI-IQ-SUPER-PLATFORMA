// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Recommendation Engine
// Kompanija SPAJA — Digitalna Industrija

import type { GPTModel, GPTTool, GPTUseCase, KatalogRecommendation, RecommendationRequest } from './types';
import {
  CHATGPT_KATALOG_CATALOG_MODE,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISCLAIMER,
  CHATGPT_KATALOG_SCOPE,
} from './types';
import { GPT_MODELS, GPT_TOOLS, GPT_USE_CASES } from './registry';

function sanitizeBudget(budget: number): number {
  if (!Number.isFinite(budget)) return 0;
  return Math.max(0, budget);
}

function normalizeList(values?: string[]): string[] {
  if (!values) return [];
  return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

function modelMatchesDomain(model: GPTModel, domain: string): boolean {
  return (
    model.tags.some((tag) => tag.toLowerCase().includes(domain)) ||
    model.description.toLowerCase().includes(domain) ||
    model.capabilities.some((capability) => capability.toLowerCase().includes(domain)) ||
    (model.strengths ?? []).some((strength) => strength.toLowerCase().includes(domain))
  );
}

function modelMeetsBudget(model: GPTModel, budgetPerMillionTokens: number): boolean {
  if (!Number.isFinite(budgetPerMillionTokens) || budgetPerMillionTokens <= 0) return true;
  return model.pricing.inputPer1kTokens * 1000 <= budgetPerMillionTokens;
}

function modelMatchesCapabilities(model: GPTModel, requiredCapabilities: string[]): boolean {
  if (requiredCapabilities.length === 0) return true;
  const capabilities = model.capabilities.map((capability) => capability.toLowerCase());
  return requiredCapabilities.every((capability) => capabilities.includes(capability));
}

function useCaseMatchesDomain(useCase: GPTUseCase, domain: string): boolean {
  if (!domain) return true;
  return (
    useCase.domain.toLowerCase().includes(domain) ||
    useCase.tags.some((tag) => tag.toLowerCase().includes(domain)) ||
    useCase.title.toLowerCase().includes(domain)
  );
}

function useCaseMatchesCapabilities(useCase: GPTUseCase, requiredCapabilities: string[]): boolean {
  if (requiredCapabilities.length === 0) return true;
  const capabilities = (useCase.requiredCapabilities ?? []).map((capability) => capability.toLowerCase());
  return requiredCapabilities.every((capability) => capabilities.includes(capability));
}

function getSpeedWeight(model: GPTModel): number {
  return model.speedTier === 'fast' ? 3 : model.speedTier === 'medium' ? 2 : 1;
}

function scoreModel(
  model: GPTModel,
  domain: string,
  budget: number,
  preferSpeed: boolean,
  requiredCapabilities: string[],
  relevantUseCases: GPTUseCase[],
  budgetFit: boolean,
): number {
  let score = 0;

  if (modelMatchesDomain(model, domain)) score += 20;
  score += requiredCapabilities.filter((capability) => model.capabilities.map((entry) => entry.toLowerCase()).includes(capability)).length * 10;
  score += relevantUseCases.filter((useCase) => useCase.recommendedModelId === model.id).length * 14;

  if (preferSpeed) {
    score += getSpeedWeight(model) * 6;
  } else {
    const costPerMillion = model.pricing.inputPer1kTokens * 1000;
    score += Math.max(1, 12 - Math.min(10, costPerMillion));
  }

  if (budget > 0) {
    const costPerMillion = model.pricing.inputPer1kTokens * 1000;
    if (budgetFit) {
      score += Math.max(0, 10 - Math.abs(budget - costPerMillion));
    } else {
      score -= Math.max(0, costPerMillion - budget);
    }
  }

  if (model.capabilities.includes('structured-outputs')) score += 3;
  if (model.capabilities.includes('function-calling')) score += 2;

  return score;
}

function pickRecommendedTools(domain: string, requiredCapabilities: string[], relevantUseCases: GPTUseCase[]): GPTTool[] {
  const relatedTerms = new Set<string>([
    domain,
    ...requiredCapabilities,
    ...relevantUseCases.flatMap((useCase) => [useCase.domain, ...useCase.tags]),
  ].map((value) => value.toLowerCase()).filter(Boolean));

  const scored = GPT_TOOLS.map((tool) => {
    let score = 0;
    const searchSpace = [tool.category, tool.description, tool.integrationGuide, ...(tool.recommendedDomains ?? []), ...tool.tags]
      .join(' ')
      .toLowerCase();

    for (const term of relatedTerms) {
      if (searchSpace.includes(term)) score += 4;
    }

    if (domain && (tool.recommendedDomains ?? []).some((toolDomain) => toolDomain.toLowerCase().includes(domain))) {
      score += 8;
    }

    return { tool, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, 4)
    .map((entry) => entry.tool);
}

export function recommend(req: RecommendationRequest): KatalogRecommendation {
  const start = performance.now();

  const safeBudget = sanitizeBudget(req.budget);
  const domain = (req.domain ?? '').trim().toLowerCase();
  const requiredCapabilities = normalizeList(req.requiredCapabilities);
  const preferSpeed = req.preferSpeed === true;

  const activeModels = GPT_MODELS.filter((model) => model.status === 'active');
  const capabilityCandidates = activeModels.filter((model) => modelMatchesCapabilities(model, requiredCapabilities));

  const relevantUseCases = GPT_USE_CASES
    .filter((useCase) => useCaseMatchesDomain(useCase, domain) && useCaseMatchesCapabilities(useCase, requiredCapabilities))
    .slice(0, 4);

  const budgetEligible = capabilityCandidates.filter((model) => modelMeetsBudget(model, safeBudget));
  const budgetFit = safeBudget <= 0 || budgetEligible.length > 0;
  const candidatePool = budgetFit ? budgetEligible : capabilityCandidates;
  const fallbackPool = candidatePool.length > 0 ? candidatePool : activeModels;

  const sorted = [...fallbackPool].sort((a, b) => {
    const scoreB = scoreModel(b, domain, safeBudget, preferSpeed, requiredCapabilities, relevantUseCases, budgetFit);
    const scoreA = scoreModel(a, domain, safeBudget, preferSpeed, requiredCapabilities, relevantUseCases, budgetFit);
    if (scoreB !== scoreA) return scoreB - scoreA;

    if (preferSpeed) {
      const speedDelta = getSpeedWeight(b) - getSpeedWeight(a);
      if (speedDelta !== 0) return speedDelta;
    }

    const priceDelta = a.pricing.inputPer1kTokens - b.pricing.inputPer1kTokens;
    if (priceDelta !== 0) return priceDelta;
    return b.contextWindow - a.contextWindow;
  });

  const recommended = sorted[0] ?? null;
  const alternatives = sorted.slice(1, 4);
  const recommendedTools = pickRecommendedTools(domain, requiredCapabilities, relevantUseCases);
  const matchedUseCases = relevantUseCases.map((useCase) => useCase.id);

  let reasoning = 'No model matched the given constraints.';
  if (recommended) {
    const budgetNote = safeBudget > 0
      ? budgetFit
        ? ` within the stated budget of $${safeBudget}/1M input tokens`
        : ` as the closest available fallback even though no active model fits the stated budget of $${safeBudget}/1M input tokens`
      : '';
    const domainNote = domain ? ` for domain "${req.domain}"` : '';
    const capabilityNote = requiredCapabilities.length > 0 ? ` Required capabilities: ${requiredCapabilities.join(', ')}.` : '';
    const useCaseNote = matchedUseCases.length > 0
      ? ` Matched use cases: ${relevantUseCases.map((useCase) => useCase.title).join(', ')}.`
      : '';
    const optimizationNote = preferSpeed ? ' Speed was prioritized over cost.' : ' Cost was prioritized over latency.';
    reasoning = `Recommended ${recommended.name}${domainNote}${budgetNote}.${capabilityNote}${useCaseNote}${optimizationNote} Context window: ${recommended.contextWindow.toLocaleString()} tokens.`.trim();
  }

  return {
    recommendedModel: recommended,
    alternativeModels: alternatives,
    recommendedTools,
    relevantUseCases,
    matchedUseCases,
    reasoning,
    budgetFit,
    budgetPerMillionTokens: safeBudget,
    candidateCount: fallbackPool.length,
    scope: CHATGPT_KATALOG_SCOPE,
    catalogMode: CHATGPT_KATALOG_CATALOG_MODE,
    disclaimer: CHATGPT_KATALOG_DISCLAIMER,
    contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
    evaluationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}
