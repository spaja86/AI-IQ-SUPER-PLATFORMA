'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI: ZlatniTierBadge
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniTierName } from '@/lib/zlatni-racuni';

interface ZlatniTierBadgeProps {
  tier: ZlatniTierName;
  className?: string;
}

const TIER_STYLES: Record<ZlatniTierName, string> = {
  BRONZE: 'bg-amber-700 text-white',
  SILVER: 'bg-slate-400 text-white',
  GOLD: 'bg-yellow-400 text-yellow-900',
  PLATINUM: 'bg-violet-600 text-white',
};

const TIER_LABELS: Record<ZlatniTierName, string> = {
  BRONZE: '🥉 Bronze',
  SILVER: '🥈 Silver',
  GOLD: '🥇 Gold',
  PLATINUM: '💎 Platinum',
};

export function ZlatniTierBadge({ tier, className = '' }: ZlatniTierBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TIER_STYLES[tier]} ${className}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
