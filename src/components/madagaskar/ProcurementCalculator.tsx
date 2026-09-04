'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR ProcurementCalculator
// Kompanija SPAJA — Digitalna Industrija

import React, { useState } from 'react';
import type { ExoticGood, ProcurementResult } from '@/lib/madagaskar';

interface ProcurementCalculatorProps {
  preselectedGood?: ExoticGood;
  className?: string;
}

/** Form for procurement calculation: goodId + quantity → cost breakdown + warnings. */
export function ProcurementCalculator({ preselectedGood, className = '' }: ProcurementCalculatorProps) {
  const [goodId, setGoodId] = useState(preselectedGood?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [buyerSegment, setBuyerSegment] = useState<string>('business');
  const [result, setResult] = useState<ProcurementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const currency = preselectedGood?.currency ?? 'EUR';
      const res = await fetch('/api/madagaskar/procure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goodId, quantityUnits: quantity, buyerSegment, currency }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult(json.data ?? json);
      } else {
        setError(json.message ?? json.error ?? 'Procurement failed.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-xl border border-gray-700 bg-gray-900 ${className}`}>
      <div className="text-sm font-semibold text-white uppercase tracking-wide">Procurement Calculator</div>

      <form onSubmit={handleCalculate} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Good ID</label>
          <input
            className="px-3 py-1.5 rounded bg-gray-800 text-white text-sm border border-gray-600 focus:border-indigo-500 outline-none"
            value={goodId}
            onChange={(e) => setGoodId(e.target.value)}
            placeholder="e.g. mdg-vanilla-001"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Quantity (units)</label>
          <input
            type="number"
            min={1}
            step={1}
            className="px-3 py-1.5 rounded bg-gray-800 text-white text-sm border border-gray-600 focus:border-indigo-500 outline-none"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Buyer Segment</label>
          <select
            className="px-2 py-1.5 rounded bg-gray-800 text-white text-sm border border-gray-600"
            value={buyerSegment}
            onChange={(e) => setBuyerSegment(e.target.value)}
          >
            <option value="consumer">Consumer</option>
            <option value="business">Business</option>
            <option value="industrial">Industrial</option>
            <option value="research">Research</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
        >
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
      </form>

      {error && <div className="text-sm text-red-400">⚠️ {error}</div>}

      {result && (
        <div className="flex flex-col gap-2 mt-1">
          <div className={`text-xs font-semibold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
            {result.valid ? '✅ Valid' : '❌ Invalid'}
          </div>
          <div className="text-sm text-gray-300 font-medium">{result.goodName}</div>

          {/* Price breakdown */}
          <div className="flex flex-col gap-1 text-xs text-gray-400 border-t border-gray-700 pt-2">
            <div className="flex justify-between">
              <span>Base price/unit</span>
              <span>{(result.basePriceCents / 100).toFixed(2)} {result.currency}</span>
            </div>
            {result.appliedModifiers.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span className="capitalize">{m.description}</span>
                <span className={m.valuePercent < 0 ? 'text-green-400' : 'text-orange-400'}>
                  {m.valuePercent > 0 ? '+' : ''}{m.valuePercent}%
                </span>
              </div>
            ))}
            {result.appliedModifiers.length > 0 && (
              <div className="flex justify-between font-semibold text-gray-300">
                <span>Total modifier</span>
                <span>{result.totalModifierPercent > 0 ? '+' : ''}{result.totalModifierPercent}%</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-gray-300">
              <span>Net price/unit</span>
              <span>{(result.netPricePerUnitCents / 100).toFixed(2)} {result.currency}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-sm border-t border-gray-700 pt-1 mt-1">
              <span>Total ({result.quantityUnits} units)</span>
              <span>{result.totalNetPriceMajor.toFixed(2)} {result.currency}</span>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1">
              {result.warnings.map((w, i) => (
                <li key={i} className="text-xs text-yellow-400">⚠️ {w}</li>
              ))}
            </ul>
          )}
          <div className="text-xs text-gray-600 mt-1">Calculated in {result.durationMs}ms</div>
        </div>
      )}
    </div>
  );
}
