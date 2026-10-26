'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR MadagaskarCatalog
// Kompanija SPAJA — Digitalna Industrija

import React, { useEffect, useState } from 'react';
import type { ExoticGood, ExoticGoodCategory, OriginRegion } from '@/lib/madagaskar';
import { ExoticGoodCard } from './ExoticGoodCard';

interface MadagaskarCatalogProps {
  onSelectGood?: (good: ExoticGood) => void;
  className?: string;
}

const CATEGORIES: (ExoticGoodCategory | '')[] = [
  '', 'spice', 'mineral', 'botanical', 'textile', 'artisan', 'tech-material', 'fauna-derivative',
];

const REGIONS: (OriginRegion | '')[] = [
  '', 'Madagascar', 'Indonesia', 'Amazon', 'Sahel', 'Patagonia', 'Siberia', 'Oceania',
];

/** Grid catalog with filter/sort controls for exotic goods. */
export function MadagaskarCatalog({ onSelectGood, className = '' }: MadagaskarCatalogProps) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [goods, setGoods] = useState<ExoticGood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<ExoticGoodCategory | ''>('');
  const [region, setRegion] = useState<OriginRegion | ''>('');
  const [rarityMin, setRarityMin] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'rarity' | 'sustainability' | 'price'>('rarity');

  useEffect(() => {
    let cancelled = false;
    async function fetchGoods() {
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (region) params.set('region', region);
        if (rarityMin > 1) params.set('rarity_min', String(rarityMin));

        const res = await fetch(`/api/madagaskar/catalog?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        setError(null);
        setGoods(json.data?.goods ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load catalog.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void fetchGoods();
    return () => { cancelled = true; };
  }, [category, region, rarityMin, refreshVersion]);

  const sorted = [...goods].sort((a, b) => {
    if (sortBy === 'rarity') return b.rarity - a.rarity;
    if (sortBy === 'sustainability') return b.sustainabilityScore - a.sustainabilityScore;
    return a.pricePerUnitCents - b.pricePerUnitCents;
  });

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end p-4 rounded-xl border border-gray-700 bg-gray-900">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Category</label>
          <select
            className="px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600"
            value={category}
            onChange={(e) => { setLoading(true); setError(null); setCategory(e.target.value as ExoticGoodCategory | ''); }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c || 'All Categories'}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Region</label>
          <select
            className="px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600"
            value={region}
            onChange={(e) => { setLoading(true); setError(null); setRegion(e.target.value as OriginRegion | ''); }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r || 'All Regions'}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Min Rarity: {rarityMin}</label>
          <input
            type="range"
            min={1}
            max={10}
            value={rarityMin}
            onChange={(e) => { setLoading(true); setError(null); setRarityMin(Number(e.target.value)); }}
            className="accent-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Sort By</label>
          <select
            className="px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="rarity">Rarity ↓</option>
            <option value="sustainability">Sustainability ↓</option>
            <option value="price">Price ↑</option>
          </select>
        </div>
        <button
          className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          onClick={() => { setLoading(true); setError(null); setRefreshVersion((value) => value + 1); }}
        >
          Refresh
        </button>
      </div>

      {/* Status */}
      {loading && <div className="text-sm text-gray-400">Loading catalog…</div>}
      {error && <div className="text-sm text-red-400">Error: {error}</div>}
      {!loading && !error && (
        <div className="text-xs text-gray-500">{sorted.length} goods found</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((good) => (
          <ExoticGoodCard key={good.id} good={good} onSelect={onSelectGood} />
        ))}
      </div>
    </div>
  );
}
