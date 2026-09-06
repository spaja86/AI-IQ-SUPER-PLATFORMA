// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Search Engine
// Kompanija SPAJA — Digitalna Industrija

import type { KatalogEntry, KatalogSearchQuery, KatalogSearchResult, GPTModel } from './types';
import {
  CHATGPT_KATALOG_CATALOG_MODE,
  CHATGPT_KATALOG_CONTRACT_VERSION,
  CHATGPT_KATALOG_DISCLAIMER,
  CHATGPT_KATALOG_SCOPE,
} from './types';
import { getAllEntries } from './registry';

function matchesText(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function normalizeTerms(values?: string[]): string[] {
  if (!values) return [];
  return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));
}

function getModelInputPrice(entry: KatalogEntry): number | null {
  return entry.type === 'model' ? entry.pricing.inputPer1kTokens : null;
}

function entryMatchesCapabilities(entry: KatalogEntry, capabilities: string[]): boolean {
  if (capabilities.length === 0) return true;
  if (entry.type === 'model') {
    const modelCapabilities = entry.capabilities.map((capability) => capability.toLowerCase());
    return capabilities.every((capability) => modelCapabilities.includes(capability));
  }
  if (entry.type === 'use-case') {
    const requiredCapabilities = (entry.requiredCapabilities ?? []).map((capability) => capability.toLowerCase());
    return capabilities.every((capability) => requiredCapabilities.includes(capability));
  }
  return capabilities.some((capability) => entry.tags.some((tag) => matchesText(tag, capability)));
}

function readQueryText(q: KatalogSearchQuery): string | undefined {
  const value = Reflect.get(q, 'query');
  return typeof value === 'string' ? value : undefined;
}

function entryMatchesQuery(entry: KatalogEntry, q: KatalogSearchQuery): boolean {
  if (q.type && entry.type !== q.type) return false;

  if (q.status && entry.type === 'model') {
    if ((entry as GPTModel).status !== q.status) return false;
  }

  if (q.category && entry.type === 'tool') {
    if (!matchesText(entry.category, q.category)) return false;
  }

  const domainQuery = q.domain;
  if (domainQuery) {
    if (entry.type === 'use-case') {
      if (!matchesText(entry.domain, domainQuery)) return false;
    } else if (entry.type === 'tool') {
      const domains = entry.recommendedDomains ?? [];
      const domainMatch = domains.some((domain) => matchesText(domain, domainQuery)) || matchesText(entry.description, domainQuery);
      if (!domainMatch) return false;
    } else {
      const modelDomainMatch = entry.tags.some((tag) => matchesText(tag, domainQuery)) || matchesText(entry.description, domainQuery);
      if (!modelDomainMatch) return false;
    }
  }

  if (q.tags && q.tags.length > 0) {
    const hasTag = q.tags.some((tag) => entry.tags.some((entryTag) => matchesText(entryTag, tag)));
    if (!hasTag) return false;
  }

  const capabilities = normalizeTerms(q.capabilities);
  if (!entryMatchesCapabilities(entry, capabilities)) return false;

  if (typeof q.maxInputCostPer1k === 'number' && Number.isFinite(q.maxInputCostPer1k)) {
    const price = getModelInputPrice(entry);
    if (price !== null && price > q.maxInputCostPer1k) return false;
    if (price === null && q.type === 'model') return false;
  }

  const queryText = readQueryText(q);
  if (queryText && queryText.trim().length > 0) {
    const term = queryText.trim();
    const searchable = buildSearchableText(entry);
    if (!matchesText(searchable, term)) return false;
  }

  return true;
}

function buildSearchableText(entry: KatalogEntry): string {
  if (entry.type === 'model') {
    return [entry.id, entry.name, entry.description, ...(entry.strengths ?? []), ...entry.capabilities, ...entry.tags].join(' ');
  }
  if (entry.type === 'tool') {
    return [entry.id, entry.name, entry.description, entry.category, entry.integrationGuide, ...(entry.recommendedDomains ?? []), ...entry.tags].join(' ');
  }
  return [entry.id, entry.title, entry.domain, entry.prompt, entry.expectedOutput, ...(entry.requiredCapabilities ?? []), ...entry.tags].join(' ');
}

function getEntryPrimaryLabel(entry: KatalogEntry): string {
  return entry.type === 'use-case' ? entry.title : entry.name;
}

function getRelevanceScore(entry: KatalogEntry, searchTerm?: string): number {
  const term = searchTerm?.trim().toLowerCase();
  if (!term) return 0;

  let score = 0;
  const id = entry.id.toLowerCase();
  const primaryLabel = getEntryPrimaryLabel(entry).toLowerCase();
  const tags = entry.tags.map((tag) => tag.toLowerCase());
  const searchable = buildSearchableText(entry).toLowerCase();

  if (id === term || primaryLabel === term) score += 200;
  if (id.includes(term)) score += 80;
  if (primaryLabel.includes(term)) score += 60;
  if (tags.some((tag) => tag === term)) score += 40;
  if (tags.some((tag) => tag.includes(term))) score += 20;
  if (searchable.includes(term)) score += 10;

  if (entry.type === 'model') {
    if (entry.capabilities.some((capability) => capability.toLowerCase() === term)) score += 35;
    if ((entry.strengths ?? []).some((strength) => strength.toLowerCase().includes(term))) score += 15;
  }

  if (entry.type === 'use-case' && (entry.requiredCapabilities ?? []).some((capability) => capability.toLowerCase() === term)) {
    score += 25;
  }

  return score;
}

function sortEntries(entries: KatalogEntry[], sortBy: KatalogSearchQuery['sortBy'], searchTerm?: string): KatalogEntry[] {
  if (!sortBy || sortBy === 'relevance') {
    return [...entries].sort((a, b) => {
      const scoreDelta = getRelevanceScore(b, searchTerm) - getRelevanceScore(a, searchTerm);
      if (scoreDelta !== 0) return scoreDelta;
      return getEntryPrimaryLabel(a).localeCompare(getEntryPrimaryLabel(b));
    });
  }

  return [...entries].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return getEntryPrimaryLabel(a).localeCompare(getEntryPrimaryLabel(b));
    }
    if (sortBy === 'context-window-desc') {
      const cwA = a.type === 'model' ? a.contextWindow : 0;
      const cwB = b.type === 'model' ? b.contextWindow : 0;
      return cwB - cwA;
    }
    if (sortBy === 'price-asc' || sortBy === 'price-desc') {
      const priceA = a.type === 'model' ? a.pricing.inputPer1kTokens : Number.POSITIVE_INFINITY;
      const priceB = b.type === 'model' ? b.pricing.inputPer1kTokens : Number.POSITIVE_INFINITY;
      return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
    }
    return 0;
  });
}

export function searchKatalog(q: KatalogSearchQuery): KatalogSearchResult {
  const start = performance.now();

  const page = Math.max(1, q.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, q.pageSize ?? 20));

  const normalizedQuery: KatalogSearchQuery = {
    ...q,
    tags: normalizeTerms(q.tags),
    capabilities: normalizeTerms(q.capabilities),
  };

  const all = getAllEntries();
  const filtered = all.filter((entry) => entryMatchesQuery(entry, normalizedQuery));
  const sorted = sortEntries(filtered, normalizedQuery.sortBy, readQueryText(normalizedQuery));

  const total = sorted.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const entries = sorted.slice(offset, offset + pageSize);

  const summary: KatalogSearchResult['summary'] = {
    models: filtered.filter((entry) => entry.type === 'model').length,
    tools: filtered.filter((entry) => entry.type === 'tool').length,
    useCases: filtered.filter((entry) => entry.type === 'use-case').length,
    activeModels: filtered.filter((entry) => entry.type === 'model' && entry.status === 'active').length,
    matchedCapabilities: Array.from(new Set(filtered.flatMap((entry) => entry.type === 'model' ? entry.capabilities : entry.type === 'use-case' ? (entry.requiredCapabilities ?? []) : []))).sort(),
    catalogMode: CHATGPT_KATALOG_CATALOG_MODE as KatalogSearchResult['summary']['catalogMode'],
    scope: CHATGPT_KATALOG_SCOPE as KatalogSearchResult['summary']['scope'],
  };

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages,
    query: normalizedQuery,
    summary,
    disclaimer: CHATGPT_KATALOG_DISCLAIMER,
    contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
    evaluationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}
