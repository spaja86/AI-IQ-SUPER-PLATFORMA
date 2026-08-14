'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI: ZlatniRacunCard
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniRacun, ZlatniTierResult } from '@/lib/zlatni-racuni';
import { ZlatniTierBadge } from './ZlatniTierBadge';

interface ZlatniRacunCardProps {
  racun: ZlatniRacun;
  tierResult: ZlatniTierResult;
}

export function ZlatniRacunCard({ racun, tierResult }: ZlatniRacunCardProps) {
  const { current, next, pointsToNextTier, progressPercent } = tierResult;

  return (
    <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-amber-900">Zlatni Račun</h2>
        <ZlatniTierBadge tier={racun.tier} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-amber-600 uppercase tracking-wide">Balans</p>
          <p className="text-2xl font-bold text-amber-900">{racun.balance.toLocaleString()} pts</p>
        </div>
        <div>
          <p className="text-xs text-amber-600 uppercase tracking-wide">Ukupno bodova</p>
          <p className="text-2xl font-bold text-amber-900">{racun.pointsAccrued.toLocaleString()}</p>
        </div>
      </div>

      {next && (
        <div>
          <div className="flex justify-between text-xs text-amber-700 mb-1">
            <span>{current.name}</span>
            <span>
              {pointsToNextTier !== null
                ? `${pointsToNextTier.toLocaleString()} pts do ${next.name}`
                : next.name}
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-amber-500">
        Popust: {(current.discountRate * 100).toFixed(0)}% · Status: {racun.status}
      </p>
    </div>
  );
}
