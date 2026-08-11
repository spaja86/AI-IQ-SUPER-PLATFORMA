'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR ExoticGoodCard
// Kompanija SPAJA — Digitalna Industrija

import React from 'react';
import type { ExoticGood } from '@/lib/madagaskar';
import { SustainabilityWidget } from './SustainabilityWidget';

interface ExoticGoodCardProps {
  good: ExoticGood;
  onSelect?: (good: ExoticGood) => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  spice: '🌶️',
  mineral: '💎',
  botanical: '🌿',
  textile: '🧵',
  artisan: '🏺',
  'tech-material': '⚙️',
  'fauna-derivative': '🦎',
};

function rarityColor(rarity: number): string {
  if (rarity >= 9) return '#f97316'; // orange
  if (rarity >= 7) return '#a855f7'; // purple
  if (rarity >= 5) return '#3b82f6'; // blue
  return '#6b7280';                  // gray
}

/** Card displaying a single exotic good: name, origin, rarity badge, sustainability bar, price. */
export function ExoticGoodCard({ good, onSelect, className = '' }: ExoticGoodCardProps) {
  const icon = CATEGORY_ICONS[good.category] ?? '📦';
  const rColor = rarityColor(good.rarity);
  const priceMajor = (good.pricePerUnitCents / 100).toFixed(2);

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border border-gray-700 bg-gray-900 hover:border-gray-500 transition-colors ${className}`}
      aria-label={`Exotic good: ${good.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">{good.name}</div>
            <div className="text-xs text-gray-400">{good.originRegion}</div>
          </div>
        </div>
        {/* Rarity badge */}
        <div
          className="shrink-0 px-2 py-0.5 rounded text-xs font-bold"
          style={{ backgroundColor: rColor, color: '#fff' }}
          title={`Rarity ${good.rarity}/10`}
        >
          ★ {good.rarity}/10
        </div>
      </div>

      {/* Category tag */}
      <div className="flex gap-1 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 text-xs capitalize">
          {good.category.replace('-', ' ')}
        </span>
        {good.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Sustainability */}
      <SustainabilityWidget score={good.sustainabilityScore} />

      {/* Price & stock */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-bold text-white">{priceMajor}</span>
          <span className="text-xs text-gray-400 ml-1">{good.currency}/unit</span>
        </div>
        <div className="text-xs text-gray-500">
          {good.stock > 0 ? `${good.stock} in stock` : <span className="text-red-400">Out of stock</span>}
        </div>
      </div>

      {/* Select button */}
      {onSelect && (
        <button
          className="mt-1 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          onClick={() => onSelect(good)}
        >
          Select for Procurement
        </button>
      )}
    </div>
  );
}
