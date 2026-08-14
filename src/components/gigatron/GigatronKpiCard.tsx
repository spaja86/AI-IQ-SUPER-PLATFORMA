'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — GIGATRON KPI Card Component
// Kompanija SPAJA — Digitalna Industrija

import { useCallback, useEffect, useState } from 'react';

interface GigatronCatalogItem {
  sku: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface GigatronKpiData {
  totalItems: number;
  inStockItems: number;
  outOfStockItems: number;
  lastUpdated: string;
  topItem?: GigatronCatalogItem;
}

interface GigatronKpiCardProps {
  className?: string;
}

export function GigatronKpiCard({ className = '' }: GigatronKpiCardProps) {
  const [data, setData] = useState<GigatronKpiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/gigatron/catalog');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json() as { data?: GigatronCatalogItem[]; items?: GigatronCatalogItem[] };
      const items: GigatronCatalogItem[] = json.data ?? json.items ?? [];
      const inStock = items.filter(i => i.inStock).length;
      setData({
        totalItems: items.length,
        inStockItems: inStock,
        outOfStockItems: items.length - inStock,
        lastUpdated: new Date().toISOString(),
        topItem: items[0],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Greška');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchCatalog(); }, [fetchCatalog]);

  return (
    <section className={`rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold tracking-wide uppercase">GIGATRON KPI</h3>
      {loading && <p className="mt-2 text-xs text-slate-400">Učitavanje...</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {data && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <p>Ukupno: <strong>{data.totalItems}</strong></p>
          <p>Na stanju: <strong>{data.inStockItems}</strong></p>
          <p>Nedostupno: <strong>{data.outOfStockItems}</strong></p>
          {data.topItem && (
            <p className="col-span-2 truncate text-xs text-slate-400">Top: {data.topItem.name}</p>
          )}
        </div>
      )}
    </section>
  );
}
