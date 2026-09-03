'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Components
// Kompanija SPAJA — Digitalna Industrija

import React, { useEffect, useMemo, useState } from 'react';
import type {
  GPTModel,
  GPTTool,
  GPTUseCase,
  KatalogCompareResult,
  KatalogEntry,
  KatalogHealth,
  KatalogRecommendation,
} from '@/lib/chatgpt-katalog';

const CAPABILITY_OPTIONS = ['text', 'vision', 'reasoning', 'function-calling', 'structured-outputs', 'audio'] as const;

type EntryTypeFilter = '' | 'model' | 'tool' | 'use-case';
type StatusFilter = '' | 'active' | 'deprecated' | 'preview' | 'legacy';
type SortFilter = 'relevance' | 'name-asc' | 'price-asc' | 'price-desc' | 'context-window-desc';

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'info' | 'warning' }) {
  const classes = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    info: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${classes[tone]}`}>{children}</span>;
}

export function ModelCard({
  model,
  selectedForCompare = false,
  onToggleCompare,
  compareDisabled = false,
}: {
  model: GPTModel;
  selectedForCompare?: boolean;
  onToggleCompare?: (modelId: string) => void;
  compareDisabled?: boolean;
}) {
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
    <div className={`rounded-2xl border p-4 transition-shadow ${selectedForCompare ? 'border-indigo-400 shadow-md shadow-indigo-100' : 'border-gray-200 bg-white hover:shadow-md'}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
          <p className="text-xs text-gray-500">{model.id}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[model.status] ?? 'bg-gray-100 text-gray-600'}`}>{model.status}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${speedColors[model.speedTier] ?? 'bg-gray-100 text-gray-600'}`}>{model.speedTier}</span>
        </div>
      </div>
      <p className="mb-3 text-sm text-gray-600">{model.description}</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {model.capabilities.map((capability) => (
          <Pill key={capability} tone="info">{capability}</Pill>
        ))}
      </div>
      {model.strengths && model.strengths.length > 0 && (
        <ul className="mb-3 list-disc space-y-1 pl-5 text-xs text-gray-500">
          {model.strengths.slice(0, 3).map((strength) => <li key={strength}>{strength}</li>)}
        </ul>
      )}
      <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
        <span>Context: <strong>{model.contextWindow.toLocaleString()}</strong></span>
        <span>Input: <strong>${model.pricing.inputPer1kTokens}/1k</strong></span>
        <span>Output: <strong>${model.pricing.outputPer1kTokens}/1k</strong></span>
      </div>
      {onToggleCompare && (
        <button
          type="button"
          onClick={() => onToggleCompare(model.id)}
          disabled={compareDisabled && !selectedForCompare}
          className="mt-4 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedForCompare ? 'Remove from compare' : 'Add to compare'}
        </button>
      )}
    </div>
  );
}

export function ToolCard({ tool }: { tool: GPTTool }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
        <Pill tone="success">{tool.category}</Pill>
      </div>
      <p className="mb-3 text-sm text-gray-600">{tool.description}</p>
      {tool.apiEndpoint && <div className="mb-2 rounded border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-700">{tool.apiEndpoint}</div>}
      <p className="text-xs text-gray-500">{tool.integrationGuide}</p>
      {tool.recommendedDomains && tool.recommendedDomains.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tool.recommendedDomains.map((domain) => <Pill key={domain}>{domain}</Pill>)}
        </div>
      )}
    </div>
  );
}

export function UseCaseCard({
  useCase,
  onUseForRecommendation,
}: {
  useCase: GPTUseCase;
  onUseForRecommendation?: (useCase: GPTUseCase) => void;
}) {
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">{useCase.title}</h3>
        <div className="flex gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[useCase.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>{useCase.difficulty}</span>
          <Pill tone="info">{useCase.domain}</Pill>
        </div>
      </div>
      <div className="mb-2 rounded border border-gray-200 bg-gray-50 p-2">
        <p className="line-clamp-3 font-mono text-xs text-gray-600">{useCase.prompt}</p>
      </div>
      <p className="mb-2 text-xs text-gray-500">Expected: {useCase.expectedOutput}</p>
      {useCase.requiredCapabilities && useCase.requiredCapabilities.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {useCase.requiredCapabilities.map((capability) => <Pill key={capability}>{capability}</Pill>)}
        </div>
      )}
      {onUseForRecommendation && (
        <button
          type="button"
          onClick={() => onUseForRecommendation(useCase)}
          className="w-full rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100"
        >
          Use as recommendation template
        </button>
      )}
    </div>
  );
}

export function CompareTable({ result }: { result: KatalogCompareResult }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Comparison summary</h3>
        {result.sharedCapabilities.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">Shared capabilities: {result.sharedCapabilities.join(', ')}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Model</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Context</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Input $/1k</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Output $/1k</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Speed</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Capabilities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {result.models.map((row) => (
              <tr key={row.modelId} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {row.name}
                  {row.modelId === result.cheapestModelId && <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700">cheapest</span>}
                  {row.modelId === result.largestContextModelId && <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">largest ctx</span>}
                  {row.modelId === result.fastestModelId && <span className="ml-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-xs text-orange-700">fastest</span>}
                </td>
                <td className="px-4 py-3 text-gray-700">{row.contextWindow.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">${row.inputPricePer1k}</td>
                <td className="px-4 py-3 text-gray-700">${row.outputPricePer1k}</td>
                <td className="px-4 py-3 text-gray-600">{row.speedTier}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.capabilities.map((capability) => (
                      <span key={capability} className={`rounded-full px-1.5 py-0.5 text-xs ${row.uniqueCapabilities.includes(capability) ? 'bg-indigo-100 font-medium text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                        {capability}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.tradeoffs.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Tradeoffs</p>
          <ul className="space-y-1 text-sm text-gray-600">
            {result.tradeoffs.map((tradeoff) => <li key={tradeoff}>• {tradeoff}</li>)}
          </ul>
        </div>
      )}
      <p className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-400">{result.disclaimer}</p>
    </div>
  );
}

export function RecommendationPanel({
  initialDomain = '',
  initialCapabilities = [],
  onQueueModelForCompare,
}: {
  initialDomain?: string;
  initialCapabilities?: string[];
  onQueueModelForCompare?: (modelId: string) => void;
}) {
  const [domain, setDomain] = useState(initialDomain);
  const [budget, setBudget] = useState<string>('10');
  const [preferSpeed, setPreferSpeed] = useState(false);
  const [requiredCapabilities, setRequiredCapabilities] = useState<string[]>(initialCapabilities);
  const [result, setResult] = useState<KatalogRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDomain(initialDomain);
    setRequiredCapabilities(initialCapabilities);
  }, [initialCapabilities, initialDomain]);

  const toggleCapability = (capability: string) => {
    setRequiredCapabilities((current) => current.includes(capability)
      ? current.filter((entry) => entry !== capability)
      : [...current, capability]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Domain is required');
      return;
    }

    const budgetNum = parseFloat(budget);
    if (Number.isNaN(budgetNum) || budgetNum < 0) {
      setError('Budget must be a non-negative number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chatgpt-katalog/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.trim(),
          budget: budgetNum,
          preferSpeed,
          requiredCapabilities,
        }),
      });
      const json = await res.json() as { data?: KatalogRecommendation; error?: { message: string } };
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recommendation flow</h2>
          <p className="text-sm text-gray-500">Match a domain, budget, and capability set against the static ChatGPT catalog.</p>
        </div>
        <Pill tone="warning">Static reference catalog</Pill>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. customer-service, software-development, analytics"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Budget (USD per 1M input tokens)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 10"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Required capabilities</p>
          <div className="flex flex-wrap gap-2">
            {CAPABILITY_OPTIONS.map((capability) => {
              const active = requiredCapabilities.includes(capability);
              return (
                <button
                  key={capability}
                  type="button"
                  onClick={() => toggleCapability(capability)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  {capability}
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={preferSpeed} onChange={(e) => setPreferSpeed(e.target.checked)} className="rounded" />
          Prefer speed over cost
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Calculating…' : 'Get recommendation'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-4 ${result.budgetFit ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <p className="mb-1 text-sm font-medium text-gray-900">Recommendation summary</p>
            <p className="text-sm text-gray-700">{result.reasoning}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
              <Pill tone={result.budgetFit ? 'success' : 'warning'}>{result.budgetFit ? 'Budget fit' : 'Fallback outside budget'}</Pill>
              <Pill>{result.catalogMode}</Pill>
              <Pill>{result.scope}</Pill>
              <Pill>{result.candidateCount} candidates</Pill>
            </div>
          </div>

          {result.recommendedModel && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Recommended model</p>
              <ModelCard model={result.recommendedModel} onToggleCompare={onQueueModelForCompare} />
            </div>
          )}

          {result.alternativeModels.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Alternatives</p>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {result.alternativeModels.map((model) => <ModelCard key={model.id} model={model} onToggleCompare={onQueueModelForCompare} />)}
              </div>
            </div>
          )}

          {result.recommendedTools.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Recommended tools</p>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {result.recommendedTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </div>
          )}

          {result.relevantUseCases.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Matched use cases</p>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {result.relevantUseCases.map((useCase) => <UseCaseCard key={useCase.id} useCase={useCase} />)}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export function ChatGPTKatalogBrowser() {
  const [health, setHealth] = useState<KatalogHealth | null>(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<EntryTypeFilter>('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [sortBy, setSortBy] = useState<SortFilter>('relevance');
  const [maxInputCostPer1k, setMaxInputCostPer1k] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [results, setResults] = useState<KatalogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<{ models: number; tools: number; useCases: number; activeModels: number; matchedCapabilities: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<KatalogCompareResult | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [recommendationSeed, setRecommendationSeed] = useState<{ domain: string; capabilities: string[] }>({
    domain: 'software-development',
    capabilities: ['text', 'function-calling'],
  });

  const grouped = useMemo(() => ({
    models: results.filter((entry): entry is GPTModel => entry.type === 'model'),
    tools: results.filter((entry): entry is GPTTool => entry.type === 'tool'),
    useCases: results.filter((entry): entry is GPTUseCase => entry.type === 'use-case'),
  }), [results]);

  const loadHealth = async () => {
    try {
      const res = await fetch('/api/chatgpt-katalog/health');
      const json = await res.json() as { data?: KatalogHealth };
      if (json.data) setHealth(json.data);
    } catch {
      // non-critical
    }
  };

  const runSearch = async (override?: Partial<{ query: string; type: EntryTypeFilter; status: StatusFilter; sortBy: SortFilter; maxInputCostPer1k: string; capabilities: string[] }>) => {
    const costText = override?.maxInputCostPer1k ?? maxInputCostPer1k;
    const costValue = costText ? parseFloat(costText) : undefined;
    const payload = {
      query: override?.query ?? query || undefined,
      type: override?.type ?? type || undefined,
      status: override?.status ?? status || undefined,
      sortBy: override?.sortBy ?? sortBy,
      maxInputCostPer1k: Number.isFinite(costValue) ? costValue : undefined,
      capabilities: override?.capabilities ?? capabilities,
      pageSize: 30,
    };

    setLoading(true);
    setSearchError(null);
    try {
      const res = await fetch('/api/chatgpt-katalog/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { data?: { entries: KatalogEntry[]; total: number; summary?: { models: number; tools: number; useCases: number; activeModels: number; matchedCapabilities: string[] } }; error?: { message: string } };
      if (!res.ok || !json.data) {
        setResults([]);
        setTotal(0);
        setSummary(null);
        setSearchError(json.error?.message ?? 'Search failed');
      } else {
        setResults(json.data.entries ?? []);
        setTotal(json.data.total ?? 0);
        setSummary(json.data.summary ?? null);
        setSearched(true);
      }
    } catch {
      setResults([]);
      setTotal(0);
      setSummary(null);
      setSearchError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHealth();
    void runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch();
  };

  const toggleCapability = (capability: string) => {
    setCapabilities((current) => current.includes(capability)
      ? current.filter((entry) => entry !== capability)
      : [...current, capability]);
  };

  const toggleCompareModel = (modelId: string) => {
    setSelectedCompareIds((current) => {
      if (current.includes(modelId)) return current.filter((entry) => entry !== modelId);
      if (current.length >= 4) return current;
      return [...current, modelId];
    });
  };

  const queueModelForCompare = (modelId: string) => {
    setSelectedCompareIds((current) => current.includes(modelId) || current.length >= 4 ? current : [...current, modelId]);
  };

  const runCompare = async () => {
    if (selectedCompareIds.length < 2) {
      setCompareError('Select at least 2 models to compare.');
      return;
    }

    setCompareLoading(true);
    setCompareError(null);
    try {
      const res = await fetch('/api/chatgpt-katalog/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelIds: selectedCompareIds }),
      });
      const json = await res.json() as { data?: KatalogCompareResult; error?: { message: string } };
      if (!res.ok || !json.data) {
        setCompareResult(null);
        setCompareError(json.error?.message ?? 'Compare failed');
      } else {
        setCompareResult(json.data);
      }
    } catch {
      setCompareResult(null);
      setCompareError('Network error');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold">ChatGPT Katalog</h1>
            <p className="text-indigo-100">Primary discovery surface for ChatGPT model browsing, comparison, and recommendation inside AI-IQ-SUPER-PLATFORMA.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Pill tone="info">scope: discovery-and-recommendation</Pill>
              <Pill tone="warning">catalog mode: static-reference</Pill>
              {health?.linkedModules.map((moduleName) => <Pill key={moduleName}>{moduleName}</Pill>)}
            </div>
          </div>
          {health && (
            <div className="grid min-w-[260px] grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-sm backdrop-blur-sm">
              <div>
                <p className="text-indigo-100">Models</p>
                <p className="text-xl font-semibold">{health.modelCount}</p>
              </div>
              <div>
                <p className="text-indigo-100">Tools</p>
                <p className="text-xl font-semibold">{health.toolCount}</p>
              </div>
              <div>
                <p className="text-indigo-100">Use cases</p>
                <p className="text-xl font-semibold">{health.useCaseCount}</p>
              </div>
              <div>
                <p className="text-indigo-100">Active models</p>
                <p className="text-xl font-semibold">{health.activeModelCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Browse and filter</h2>
                <p className="text-sm text-gray-500">Search the catalog, narrow by capabilities, and stage models for comparison.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setType('');
                  setStatus('');
                  setSortBy('relevance');
                  setMaxInputCostPer1k('');
                  setCapabilities([]);
                  void runSearch({ query: '', type: '', status: '', sortBy: 'relevance', maxInputCostPer1k: '', capabilities: [] });
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Reset filters
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search models, tools, use cases…"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select value={type} onChange={(e) => setType(e.target.value as EntryTypeFilter)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All types</option>
                    <option value="model">Models</option>
                    <option value="tool">Tools</option>
                    <option value="use-case">Use cases</option>
                  </select>
                  <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="preview">Preview</option>
                    <option value="legacy">Legacy</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortFilter)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="relevance">Relevance</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="price-asc">Price ascending</option>
                  <option value="price-desc">Price descending</option>
                  <option value="context-window-desc">Largest context</option>
                </select>
                <input
                  type="number"
                  value={maxInputCostPer1k}
                  onChange={(e) => setMaxInputCostPer1k(e.target.value)}
                  min="0"
                  step="0.0001"
                  placeholder="Max input $/1k"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Searching…' : 'Search catalog'}
                </button>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {CAPABILITY_OPTIONS.map((capability) => {
                    const active = capabilities.includes(capability);
                    return (
                      <button
                        key={capability}
                        type="button"
                        onClick={() => toggleCapability(capability)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                      >
                        {capability}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              {searched && <span>{total} result{total !== 1 ? 's' : ''} found</span>}
              {summary && (
                <>
                  <span>{summary.models} models</span>
                  <span>{summary.tools} tools</span>
                  <span>{summary.useCases} use cases</span>
                  <span>{summary.activeModels} active models</span>
                </>
              )}
            </div>
            {summary?.matchedCapabilities && summary.matchedCapabilities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {summary.matchedCapabilities.map((capability) => <Pill key={capability}>{capability}</Pill>)}
              </div>
            )}
            {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}
          </section>

          {total === 0 && searched ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-900">No matching catalog entries</h3>
              <p className="mt-2 text-sm text-gray-500">Try relaxing the capability or cost filters, or switch to recommendation mode.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.models.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Models</h3>
                    <p className="text-xs text-gray-500">Select up to 4 for side-by-side comparison.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {grouped.models.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        selectedForCompare={selectedCompareIds.includes(model.id)}
                        onToggleCompare={toggleCompareModel}
                        compareDisabled={selectedCompareIds.length >= 4}
                      />
                    ))}
                  </div>
                </section>
              )}

              {grouped.tools.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {grouped.tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                  </div>
                </section>
              )}

              {grouped.useCases.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Use cases</h3>
                    <p className="text-xs text-gray-500">Jump directly into recommendation mode from a template.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {grouped.useCases.map((useCase) => (
                      <UseCaseCard
                        key={useCase.id}
                        useCase={useCase}
                        onUseForRecommendation={(selectedUseCase) => setRecommendationSeed({
                          domain: selectedUseCase.domain,
                          capabilities: selectedUseCase.requiredCapabilities ?? [],
                        })}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Compare flow</h2>
                <p className="text-sm text-gray-500">Selected models: {selectedCompareIds.length}/4</p>
              </div>
              <button type="button" onClick={() => void runCompare()} disabled={compareLoading || selectedCompareIds.length < 2} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50">
                {compareLoading ? 'Comparing…' : 'Compare selected'}
              </button>
            </div>
            {selectedCompareIds.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCompareIds.map((modelId) => (
                  <button key={modelId} type="button" onClick={() => toggleCompareModel(modelId)} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {modelId} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-500">Pick models from the results list or recommendation flow.</p>
            )}
            {compareError && <p className="mb-4 text-sm text-red-600">{compareError}</p>}
            {compareResult && <CompareTable result={compareResult} />}
          </section>

          <RecommendationPanel
            initialDomain={recommendationSeed.domain}
            initialCapabilities={recommendationSeed.capabilities}
            onQueueModelForCompare={queueModelForCompare}
          />

          {health && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Governance snapshot</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600">
                <p><strong>Contract:</strong> {health.contractVersion} · <strong>Module:</strong> {health.moduleVersion}</p>
                <p><strong>Persona:</strong> {health.personaId} · <strong>Node:</strong> {health.hipermrezaNode}</p>
                <p><strong>Linked modules:</strong> {health.linkedModules.join(', ')}</p>
                <p><strong>Linked repos:</strong> {health.linkedRepos.join(', ')}</p>
                <p><strong>KPI:</strong> search ≤ {health.kpi.searchMaxMs}ms · compare ≤ {health.kpi.compareMaxMs}ms · API ≤ {health.kpi.apiResponseMaxMs}ms</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
