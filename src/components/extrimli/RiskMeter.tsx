// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { RiskLevel } from '@/lib/extrimli';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW:     'bg-green-500',
  MEDIUM:  'bg-yellow-400',
  HIGH:    'bg-orange-500',
  EXTREME: 'bg-red-600',
};

const LEVEL_TEXT_COLORS: Record<RiskLevel, string> = {
  LOW:     'text-green-700',
  MEDIUM:  'text-yellow-700',
  HIGH:    'text-orange-700',
  EXTREME: 'text-red-700',
};

export function RiskMeter({ score, level }: RiskMeterProps) {
  const pct = Math.max(0, Math.min(100, score));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-600">Risk Score</span>
        <span className={`text-sm font-bold ${LEVEL_TEXT_COLORS[level]}`}>
          {score.toFixed(1)} — {level}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${LEVEL_COLORS[level]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}
