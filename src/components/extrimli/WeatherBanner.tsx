// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { WeatherRiskFactors } from '@/lib/extrimli';

interface WeatherBannerProps {
  factors: WeatherRiskFactors;
}

function riskColor(score: number): string {
  if (score >= 7.5) return 'bg-red-100 border-red-300 text-red-800';
  if (score >= 5)   return 'bg-orange-100 border-orange-300 text-orange-800';
  if (score >= 2.5) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  return 'bg-green-100 border-green-300 text-green-800';
}

export function WeatherBanner({ factors }: WeatherBannerProps) {
  const colorClass = riskColor(factors.overallWeatherScore);

  return (
    <div className={`rounded-xl border px-4 py-3 ${colorClass}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold">⛅ Weather Conditions</span>
        <span className="text-xs font-bold">Score: {factors.overallWeatherScore.toFixed(1)} / 10</span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs mb-2">
        <span>💨 Wind risk: {factors.windRiskModifier.toFixed(1)}</span>
        <span>🌧 Terrain risk: {factors.terrainRiskModifier.toFixed(1)}</span>
      </div>
      <p className="text-xs italic">{factors.gearRecommendation}</p>
      {factors.warnings.length > 0 && (
        <ul className="mt-1 text-xs opacity-75 list-disc list-inside">
          {factors.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      )}
    </div>
  );
}
