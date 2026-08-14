// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Perk Engine
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniPerk, ZlatniTierName } from './types';

// ─── In-memory perk catalog ───────────────────────────────────────────────────

let perkCatalog: ZlatniPerk[] = [
  {
    id: 'bronze-welcome',
    name: 'Bronze Welcome Discount',
    description: '1% popust na sve kupovine',
    eligibleTiers: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'silver-discount',
    name: 'Silver Discount',
    description: '3% popust na sve kupovine',
    eligibleTiers: ['SILVER', 'GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'silver-support',
    name: 'Silver Priority Support',
    description: 'Prioritetna korisnička podrška',
    eligibleTiers: ['SILVER', 'GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'gold-discount',
    name: 'Gold Discount',
    description: '7% popust na sve kupovine',
    eligibleTiers: ['GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'gold-support',
    name: 'Gold Premium Support',
    description: '24/7 premium korisnička podrška',
    eligibleTiers: ['GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'gold-early-access',
    name: 'Gold Early Access',
    description: 'Rani pristup novim funkcionalnostima',
    eligibleTiers: ['GOLD', 'PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'platinum-discount',
    name: 'Platinum Discount',
    description: '12% popust na sve kupovine',
    eligibleTiers: ['PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'platinum-support',
    name: 'Platinum Dedicated Support',
    description: 'Dedicirani account menadžer',
    eligibleTiers: ['PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'platinum-early-access',
    name: 'Platinum Early Access',
    description: 'Beta pristup svim novim funkcionalnostima',
    eligibleTiers: ['PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
  {
    id: 'platinum-vip',
    name: 'Platinum VIP',
    description: 'VIP status na svim platformama',
    eligibleTiers: ['PLATINUM'],
    validFrom: '2024-01-01T00:00:00.000Z',
    validTo: '2099-12-31T23:59:59.999Z',
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

export function getActivePerksForTier(tier: ZlatniTierName): ZlatniPerk[] {
  const now = new Date().toISOString();
  return perkCatalog.filter(
    (p) =>
      p.eligibleTiers.includes(tier) &&
      p.validFrom <= now &&
      p.validTo >= now,
  );
}

export function isPerkEligible(perkId: string, tier: ZlatniTierName): boolean {
  const perk = perkCatalog.find((p) => p.id === perkId);
  if (!perk) return false;
  const now = new Date().toISOString();
  return perk.eligibleTiers.includes(tier) && perk.validFrom <= now && perk.validTo >= now;
}

export function getAllPerks(): ZlatniPerk[] {
  return [...perkCatalog];
}

export function _resetPerkCatalog(catalog?: ZlatniPerk[]): void {
  perkCatalog = catalog ?? [];
}
