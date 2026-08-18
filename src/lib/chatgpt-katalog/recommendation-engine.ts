// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Recommendation Engine
// Kompanija SPAJA — Digitalna Industrija

import type { GPTModel, GPTTool, GPTUseCase, KatalogRecommendation, RecommendationRequest } from './types';
import { CHATGPT_KATALOG_CONTRACT_VERSION, CHATGPT_KATALOG_DISCLAIMER } from './types';
import { GPT_MODELS, GPT_TOOLS, GPT_USE_CASES } from './registry';

function sanitizeBudget(budget: number): number {
  if (!Number.isFinite(budget) || isNaN(budget)) return 0;
  return Math.max(0, budget);
}

function modelMatchesDomain(model: GPTModel, domain: string): boolean {
  const domainLower = domain.toLowerCase();
  return (
    model.tags.some((t) => t.toLowerCase().includes(domainLower)) ||
    model.description.toLowerCase().includes(domainLower) ||
    model.capabilities.some((c) => c.toLowerCase().includes(domainLower))
  );
}

function modelMeetsBudget(model: GPTModel, budgetPerMillionTokens: number): boolean {
  const inputCostPerMillion = model.pricing.inputPer1kTokens * 1000;
  return inputCostPerMillion <= budgetPerMillionTokens;
}

export function recommend(req: RecommendationRequest): KatalogRecommendation {
  const start = performance.now();

  const safeBudget = sanitizeBudget(req.budget);
  const domain = (req.domain ?? '').trim().toLowerCase();

  const activeModels = GPT_MODELS.filter((m) => m.status === 'active');

  let candidates = activeModels.filter((m) => modelMeetsBudget(m, safeBudget > 0 ? safeBudget : Infinity));

  if (req.requiredCapabilities && req.requiredCapabilities.length > 0) {
    candidates = candidates.filter((m) =>
      req.requiredCapabilities!.every((cap) => m.capabilities.includes(cap)),
    );
  }

  const domainMatches = domain ? candidates.filter((m) => modelMatchesDomain(m, domain)) : candidates;
  const pool = domainMatches.length > 0 ? domainMatches : candidates;

  let sorted = [...pool];
  if (req.preferSpeed) {
    const speedOrder: Record<string, number> = { fast: 0, medium: 1, slow: 2 };
    sorted.sort((a, b) => speedOrder[a.speedTier] - speedOrder[b.speedTier]);
  } else {
    sorted.sort((a, b) => a.pricing.inputPer1kTokens - b.pricing.inputPer1kTokens);
  }

  const recommended: GPTModel | null = sorted[0] ?? null;
  const alternatives: GPTModel[] = sorted.slice(1, 4);

  const recommendedTools: GPTTool[] = domain
    ? GPT_TOOLS.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase().includes(domain)) ||
        t.description.toLowerCase().includes(domain) ||
        t.category.toLowerCase().includes(domain),
      ).slice(0, 3)
    : GPT_TOOLS.slice(0, 2);

  const relevantUseCases: GPTUseCase[] = domain
    ? GPT_USE_CASES.filter((uc) =>
        uc.domain.toLowerCase().includes(domain) ||
        uc.tags.some((tag) => tag.toLowerCase().includes(domain)),
      ).slice(0, 3)
    : GPT_USE_CASES.slice(0, 2);

  let reasoning = 'No model matched the given constraints.';
  if (recommended) {
    const budgetNote = safeBudget > 0 ? ` within budget of $${safeBudget}/1M tokens` : '';
    const domainNote = domain ? ` for domain "${req.domain}"` : '';
    const speedNote = req.preferSpeed ? ' (speed-optimized)' : ' (cost-optimized)';
    reasoning = `Recommended ${recommended.name}${domainNote}${budgetNote}${speedNote}. Context window: ${recommended.contextWindow.toLocaleString()} tokens.`;
  }

  return {
    recommendedModel: recommended,
    alternativeModels: alternatives,
    recommendedTools,
    relevantUseCases,
    reasoning,
    disclaimer: CHATGPT_KATALOG_DISCLAIMER,
    contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
    evaluationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}
