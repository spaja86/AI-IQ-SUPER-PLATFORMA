// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { GearCatalogEntry, GearCategory } from '@/lib/extrimli';
import { useState } from 'react';

interface GearCatalogProps {
  items: GearCatalogEntry[];
}

const CATEGORY_LABELS: Record<GearCategory, string> = {
  helmet:  '⛑ Helmet',
  harness: '🪝 Harness',
  board:   '🏂 Board',
  bike:    '🚲 Bike',
  chute:   '🪂 Chute',
  wing:    '🪁 Wing',
  wetsuit: '🏄 Wetsuit',
  pads:    '🛡 Pads',
  boots:   '👢 Boots',
  goggles: '🥽 Goggles',
  other:   '📦 Other',
};

export function GearCatalog({ items }: GearCatalogProps) {
  const [filterCategory, setFilterCategory] = useState<GearCategory | 'all'>('all');

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const filtered   = filterCategory === 'all' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterCategory('all')}
          className={`text-xs px-3 py-1 rounded-full border transition ${filterCategory === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-xs px-3 py-1 rounded-full border transition ${filterCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.sku} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
              <span className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">{item.sku}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{item.brand} · {CATEGORY_LABELS[item.category] ?? item.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">€{item.price.toFixed(2)}</span>
              <span className="text-xs text-gray-400">{item.stock > 0 ? `${item.stock} in stock` : '⚠ Out of stock'}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < item.safetyRating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                ))}
              </div>
              <span className="text-xs text-green-600">+{item.affiliateCommissionPct}% commission</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
