'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  status: 'healthy' | 'warning' | 'critical';
  totals: {
    sources: number;
    documents: number;
    chunks: number;
    jobs24h: number;
    failedJobs24h: number;
  };
}

interface MetricsResponse {
  metrics24h: {
    retrievalCount: number;
    citationRate: number;
    averageLatencyMs: number;
    averageQualityScore: number;
  };
}

interface SourceItem {
  id: string;
  name: string;
  domain: string;
  status: string;
  trust_score: number;
  updated_at: string;
}

interface IndexStatusResponse {
  status: {
    queue: {
      notIndexed: number;
      indexed: number;
      indexedV1: number;
      indexedV2: number;
      indexedV3: number;
      failed: number;
    };
    jobs24h: {
      total: number;
      successful: number;
      failed: number;
      averageLatencyMs: number;
      throughputPerMinute: number;
    };
  };
}

export default function SpajaBazaControlPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [indexStatus, setIndexStatus] = useState<IndexStatusResponse | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [healthRes, metricsRes, sourcesRes, indexRes] = await Promise.all([
          fetch('/api/spaja-baza-knowledge/health', { cache: 'no-store' }),
          fetch('/api/spaja-baza-knowledge/metrics', { cache: 'no-store' }),
          fetch('/api/spaja-baza-knowledge/sources', { cache: 'no-store' }),
          fetch('/api/spaja-baza-knowledge/index', { cache: 'no-store' }),
        ]);

        if (!healthRes.ok || !metricsRes.ok || !sourcesRes.ok || !indexRes.ok) {
          throw new Error('Neuspešno učitavanje kontrolnog panela.');
        }

        const healthJson = await healthRes.json();
        const metricsJson = await metricsRes.json();
        const sourcesJson = await sourcesRes.json();
        const indexJson = await indexRes.json();

        setHealth(healthJson as HealthResponse);
        setMetrics(metricsJson as MetricsResponse);
        setIndexStatus(indexJson as IndexStatusResponse);
        setSources((sourcesJson.sources ?? []) as SourceItem[]);
      } catch {
        setError('Greška pri učitavanju SPAJA BAZA panela.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-gray-100">
      <h1 className="mb-2 text-3xl font-bold">💾 SPAJA BAZA Control</h1>
      <p className="mb-6 text-sm text-gray-400">
        Operativni pregled ingest/retrieval pipeline-a, kvaliteta i pokrivenosti izvora.
      </p>

      {loading && <p className="text-sm text-gray-400">Učitavanje...</p>}
      {!loading && error && <p className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Status" value={health?.status ?? 'unknown'} />
            <StatCard label="Izvori" value={String(health?.totals.sources ?? 0)} />
            <StatCard label="Dokumenti" value={String(health?.totals.documents ?? 0)} />
            <StatCard label="Chunk-ovi" value={String(health?.totals.chunks ?? 0)} />
            <StatCard label="Jobovi 24h" value={String(health?.totals.jobs24h ?? 0)} />
            <StatCard label="Neuspešni 24h" value={String(health?.totals.failedJobs24h ?? 0)} />
            <StatCard label="Retrieval 24h" value={String(metrics?.metrics24h.retrievalCount ?? 0)} />
            <StatCard label="Citation rate" value={String(metrics?.metrics24h.citationRate ?? 0)} />
            <StatCard label="Prosečna latencija" value={`${metrics?.metrics24h.averageLatencyMs ?? 0} ms`} />
            <StatCard label="Quality score" value={String(metrics?.metrics24h.averageQualityScore ?? 0)} />
            <StatCard label="Pending indexing" value={String(indexStatus?.status.queue.notIndexed ?? 0)} />
            <StatCard label="Indexed chunks" value={String(indexStatus?.status.queue.indexed ?? 0)} />
            <StatCard label="Indexed v1" value={String(indexStatus?.status.queue.indexedV1 ?? 0)} />
            <StatCard label="Indexed v2" value={String(indexStatus?.status.queue.indexedV2 ?? 0)} />
            <StatCard label="Indexed v3" value={String(indexStatus?.status.queue.indexedV3 ?? 0)} />
            <StatCard label="Failed chunks" value={String(indexStatus?.status.queue.failed ?? 0)} />
            <StatCard label="Index jobs 24h" value={String(indexStatus?.status.jobs24h.total ?? 0)} />
            <StatCard label="Index throughput/min" value={String(indexStatus?.status.jobs24h.throughputPerMinute ?? 0)} />
            <StatCard label="Index avg latency" value={`${indexStatus?.status.jobs24h.averageLatencyMs ?? 0} ms`} />
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
            <h2 className="mb-3 text-lg font-semibold">Top izvori</h2>
            <div className="space-y-2">
              {sources.slice(0, 20).map((source) => (
                <div key={source.id} className="rounded-lg border border-gray-800 bg-gray-950/60 p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{source.name}</span>
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs">{source.domain}</span>
                    <span className="rounded bg-blue-900/50 px-2 py-0.5 text-xs">{source.status}</span>
                    <span className="rounded bg-emerald-900/50 px-2 py-0.5 text-xs">
                      trust {source.trust_score}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ažurirano: {new Date(source.updated_at).toLocaleString('sr-RS')}
                  </p>
                </div>
              ))}
              {sources.length === 0 && <p className="text-sm text-gray-500">Nema registrovanih izvora.</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
