'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Components
// Kompanija SPAJA — Digitalna Industrija

import React, { useState } from 'react';
import type { GPTModel, GPTTool, GPTUseCase, KatalogEntry } from '@/lib/chatgpt-katalog';

// ─── ModelCard ────────────────────────────────────────────────────────────────

export function ModelCard({ model }: { model: GPTModel }) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    deprecated: 'bg-red-100 text-red-800',
    preview: 'bg-yellow-100 text-yellow-800',
    legacy: 'bg-gray-100 text-gray-600',
  };
  const speedColors: Record<string, string> = {
    fast: 'bg-blue-100 text-blue-800',
    medium: 'bg-orange-100 text-orange-800',
    slow: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{model.name}</h3>
        <div className="flex gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[model.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {model.status}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${speedColors[model.speedTier] ?? 'bg-gray-100 text-gray-600'}`}>
            {model.speedTier}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {model.capabilities.map((cap) => (
          <span key={cap} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
            {cap}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Context: <strong>{model.contextWindow.toLocaleString()}</strong> tokens</span>
        <span>Input: <strong>${model.pricing.inputPer1kTokens}/1k</strong></span>
        <span>Output: <strong>${model.pricing.outputPer1kTokens}/1k</strong></span>
      </div>
    </div>
  );
}

// ─── ToolCard ─────────────────────────────────────────────────────────────────

export function ToolCard({ tool }: { tool: GPTTool }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium border border-teal-200">
          {tool.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
      {tool.apiEndpoint && (
        <div className="text-xs font-mono bg-gray-50 border border-gray-200 rounded p-2 mb-2 text-gray-700">
          {tool.apiEndpoint}
        </div>
      )}
      <p className="text-xs text-gray-500">{tool.integrationGuide}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {tool.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── UseCaseCard ──────────────────────────────────────────────────────────────

export function UseCaseCard({ useCase }: { useCase: GPTUseCase }) {
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-base">{useCase.title}</h3>
        <div className="flex gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[useCase.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
            {useCase.difficulty}
          </span>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
            {useCase.domain}
          </span>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-2">
        <p className="text-xs text-gray-600 font-mono line-clamp-3">{useCase.prompt}</p>
      </div>
      <p className="text-xs text-gray-500 mb-2">Expected: {useCase.expectedOutput}</p>
      <div className="flex flex-wrap gap-1">
        {useCase.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── CompareTable ─────────────────────────────────────────────────────────────

import type { KatalogCompareResult } from '@/lib/chatgpt-katalog';

export function CompareTable({ result }: { result: KatalogCompareResult }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Context</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Input $/1k</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Output $/1k</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Speed</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capabilities</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {result.models.map((row) => (
            <tr key={row.modelId} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {row.name}
                {row.modelId === result.cheapestModelId && (
                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">cheapest</span>
                )}
                {row.modelId === result.largestContextModelId && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">largest ctx</span>
                )}
                {row.modelId === result.fastestModelId && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">fastest</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.contextWindow.toLocaleString()}</td>
              <td className="px-4 py-3 text-gray-700">${row.inputPricePer1k}</td>
              <td className="px-4 py-3 text-gray-700">${row.outputPricePer1k}</td>
              <td className="px-4 py-3 text-gray-600">{row.speedTier}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {row.capabilities.map((cap) => (
                    <span key={cap} className={`text-xs px-1.5 py-0.5 rounded-full ${row.uniqueCapabilities.includes(cap) ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                      {cap}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 px-4 py-2 bg-gray-50 border-t">{result.disclaimer}</p>
    </div>
  );
}

// ─── RecommendationPanel ──────────────────────────────────────────────────────

export function RecommendationPanel() {
  const [domain, setDomain] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [preferSpeed, setPreferSpeed] = useState(false);
  const [result, setResult] = useState<import('@/lib/chatgpt-katalog').KatalogRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) { setError('Domain is required'); return; }
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum < 0) { setError('Budget must be a non-negative number'); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chatgpt-katalog/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), budget: budgetNum, preferSpeed }),
      });
      const json = await res.json() as { data?: import('@/lib/chatgpt-katalog').KatalogRecommendation; error?: { message: string } };
      if (!res.ok || !json.data) {
        setError(json.error?.message ?? 'Recommendation failed');
      } else {
        setResult(json.data);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. customer-service, code, analytics"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget (USD per 1M input tokens)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 5"
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="preferSpeed"
            checked={preferSpeed}
            onChange={(e) => setPreferSpeed(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="preferSpeed" className="text-sm text-gray-700">Prefer speed over cost</label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Finding best model…' : 'Get Recommendation'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm font-medium text-indigo-900 mb-1">Recommendation</p>
            <p className="text-sm text-indigo-800">{result.reasoning}</p>
          </div>
          {result.recommendedModel && <ModelCard model={result.recommendedModel} />}
          {result.alternativeModels.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Alternatives</p>
              <div className="space-y-2">
                {result.alternativeModels.map((m) => <ModelCard key={m.id} model={m} />)}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

// ─── ChatGPTKatalogBrowser ─────────────────────────────────────────────────────

export function ChatGPTKatalogBrowser() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'' | 'model' | 'tool' | 'use-case'>('');
  const [results, setResults] = useState<KatalogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/chatgpt-katalog/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query || undefined, type: type || undefined, pageSize: 30 }),
      });
      const json = await res.json() as { data?: { entries: KatalogEntry[]; total: number } };
      setResults(json.data?.entries ?? []);
      setTotal(json.data?.total ?? 0);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">ChatGPT Katalog</h1>
        <p className="text-indigo-100">Explore GPT models, tools, and use-case templates for your platform.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models, tools, use cases…"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="model">Models</option>
          <option value="tool">Tools</option>
          <option value="use-case">Use Cases</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {searched && (
        <p className="text-sm text-gray-500">{total} result{total !== 1 ? 's' : ''} found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((entry) => {
          if (entry.type === 'model') return <ModelCard key={entry.id} model={entry} />;
          if (entry.type === 'tool') return <ToolCard key={entry.id} tool={entry} />;
          return <UseCaseCard key={entry.id} useCase={entry} />;
        })}
      </div>
    </div>
  );
}
