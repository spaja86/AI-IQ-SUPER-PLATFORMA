// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Search Engine
// Kompanija SPAJA — Digitalna Industrija

import type { KatalogEntry, KatalogSearchQuery, KatalogSearchResult, GPTModel } from './types';
import { CHATGPT_KATALOG_CONTRACT_VERSION, CHATGPT_KATALOG_DISCLAIMER } from './types';
import { getAllEntries } from './registry';

function matchesText(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function entryMatchesQuery(entry: KatalogEntry, q: KatalogSearchQuery): boolean {
  if (q.type && entry.type !== q.type) return false;

  if (q.status && entry.type === 'model') {
    if ((entry as GPTModel).status !== q.status) return false;
  }

  if (q.category && entry.type === 'tool') {
    const tool = entry as Extract<KatalogEntry, { type: 'tool' }>;
    if (!matchesText(tool.category, q.category)) return false;
  }

  if (q.domain && entry.type === 'use-case') {
    const uc = entry as Extract<KatalogEntry, { type: 'use-case' }>;
    if (!matchesText(uc.domain, q.domain)) return false;
  }

  if (q.tags && q.tags.length > 0) {
    const entryTags = entry.tags;
    const hasTag = q.tags.some((tag) => entryTags.some((t) => matchesText(t, tag)));
    if (!hasTag) return false;
  }

  if (q.query && q.query.trim().length > 0) {
    const term = q.query.trim();
    const searchable = buildSearchableText(entry);
    if (!matchesText(searchable, term)) return false;
  }

  return true;
}

function buildSearchableText(entry: KatalogEntry): string {
  if (entry.type === 'model') {
    return [entry.name, entry.description, ...entry.capabilities, ...entry.tags].join(' ');
  }
  if (entry.type === 'tool') {
    return [entry.name, entry.description, entry.category, entry.integrationGuide, ...entry.tags].join(' ');
  }
  return [entry.title, entry.domain, entry.prompt, entry.expectedOutput, ...entry.tags].join(' ');
}

function sortEntries(entries: KatalogEntry[], sortBy: KatalogSearchQuery['sortBy']): KatalogEntry[] {
  if (!sortBy || sortBy === 'relevance') return entries;

  return [...entries].sort((a, b) => {
    if (sortBy === 'name-asc') {
      const nameA = a.type === 'use-case' ? a.title : a.name;
      const nameB = b.type === 'use-case' ? b.title : b.name;
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'context-window-desc') {
      const cwA = a.type === 'model' ? a.contextWindow : 0;
      const cwB = b.type === 'model' ? b.contextWindow : 0;
      return cwB - cwA;
    }
    if (sortBy === 'price-asc' || sortBy === 'price-desc') {
      const priceA = a.type === 'model' ? a.pricing.inputPer1kTokens : 0;
      const priceB = b.type === 'model' ? b.pricing.inputPer1kTokens : 0;
      return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
    }
    return 0;
  });
}

export function searchKatalog(q: KatalogSearchQuery): KatalogSearchResult {
  const start = performance.now();

  const page = Math.max(1, q.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, q.pageSize ?? 20));

  const all = getAllEntries();
  const filtered = all.filter((entry) => entryMatchesQuery(entry, q));
  const sorted = sortEntries(filtered, q.sortBy);

  const total = sorted.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const entries = sorted.slice(offset, offset + pageSize);

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages,
    query: q,
    disclaimer: CHATGPT_KATALOG_DISCLAIMER,
    contractVersion: CHATGPT_KATALOG_CONTRACT_VERSION,
    evaluationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}
