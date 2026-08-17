'use client';
// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI: ZlatniPerksList
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniPerk } from '@/lib/zlatni-racuni';

interface ZlatniPerksListProps {
  perks: ZlatniPerk[];
}

function getDaysRemaining(validTo: string): number {
  const now = Date.now();
  const end = new Date(validTo).getTime();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

export function ZlatniPerksList({ perks }: ZlatniPerksListProps) {
  if (perks.length === 0) {
    return (
      <div className="text-center text-amber-500 py-6 text-sm">
        Nema aktivnih beneficija za ovaj tier.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {perks.map((perk) => {
        const daysLeft = getDaysRemaining(perk.validTo);
        const isExpiringSoon = daysLeft <= 30;

        return (
          <li
            key={perk.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50"
          >
            <span className="mt-0.5 text-amber-500">✦</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900 text-sm">{perk.name}</p>
              <p className="text-xs text-amber-600 mt-0.5">{perk.description}</p>
            </div>
            <span
              className={`text-xs font-medium shrink-0 ${isExpiringSoon ? 'text-red-500' : 'text-amber-400'}`}
            >
              {daysLeft > 365 ? '∞' : `${daysLeft}d`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
