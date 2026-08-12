// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { ReputationScore, ReputationTier } from '@/lib/extrimli-cuz';

interface ReputationBadgeProps {
  score: ReputationScore;
}

const TIER_STYLE: Record<ReputationTier, { bg: string; text: string; icon: string }> = {
  Bronze:   { bg: 'bg-orange-100',  text: 'text-orange-800',  icon: '🥉' },
  Silver:   { bg: 'bg-gray-100',    text: 'text-gray-700',    icon: '🥈' },
  Gold:     { bg: 'bg-yellow-100',  text: 'text-yellow-800',  icon: '🥇' },
  Platinum: { bg: 'bg-blue-100',    text: 'text-blue-800',    icon: '💎' },
  Diamond:  { bg: 'bg-purple-100',  text: 'text-purple-800',  icon: '🔮' },
};

export function ReputationBadge({ score }: ReputationBadgeProps) {
  const style = TIER_STYLE[score.tier];

  return (
    <div className={`rounded-xl ${style.bg} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{style.icon}</span>
        <div>
          <p className={`text-sm font-bold ${style.text}`}>{score.tier}</p>
          <p className="text-xs text-gray-500">{score.totalRatings} rating{score.totalRatings !== 1 ? 's' : ''}</p>
        </div>
        <span className={`ml-auto text-lg font-bold ${style.text}`}>{score.overallScore.toFixed(1)}</span>
      </div>

      {score.totalRatings > 0 && (
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div>
            <p className="text-gray-500">Sportsmanship</p>
            <p className={`font-semibold ${style.text}`}>{score.avgSportsmanship.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-gray-500">Skill</p>
            <p className={`font-semibold ${style.text}`}>{score.avgSkill.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-gray-500">Reliability</p>
            <p className={`font-semibold ${style.text}`}>{score.avgReliability.toFixed(1)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
