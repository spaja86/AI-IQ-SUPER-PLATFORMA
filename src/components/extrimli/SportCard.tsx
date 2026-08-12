// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { Sport } from '@/lib/extrimli';

interface SportCardProps {
  sport: Sport;
}

const RISK_CLASS_COLOR: Record<string, string> = {
  I:   'bg-green-100 text-green-800',
  II:  'bg-yellow-100 text-yellow-800',
  III: 'bg-orange-100 text-orange-800',
  IV:  'bg-red-100 text-red-700',
  V:   'bg-red-200 text-red-900 font-bold',
};

export function SportCard({ sport }: SportCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-800">{sport.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_CLASS_COLOR[sport.riskClass] ?? 'bg-gray-100 text-gray-600'}`}>
          Risk Class {sport.riskClass}
        </span>
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{sport.category}</p>
      <div className="flex flex-wrap gap-1">
        {sport.requiredGear.map((gear) => (
          <span key={gear} className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 capitalize">
            {gear}
          </span>
        ))}
      </div>
      {sport.weatherSensitive && (
        <p className="text-xs text-blue-500 mt-2">⛅ Weather sensitive</p>
      )}
    </div>
  );
}
