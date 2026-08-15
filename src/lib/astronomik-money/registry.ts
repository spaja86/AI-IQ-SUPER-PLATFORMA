// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Registry
// Kompanija SPAJA — Digitalna Industrija

import type { CelestialClass, CelestialClassDescriptor } from './types';

// ─── Celestial class registry ────────────────────────────────────────────────

const CELESTIAL_REGISTRY: Record<CelestialClass, CelestialClassDescriptor> = {
  STAR: {
    class: 'STAR',
    risk: 'HIGH',
    liquidity: 'MEDIUM',
    returnProfile: 'Very High',
    example: 'Growth stocks, crypto',
    gravityMultiplier: 1.4,
    darkMatterFactor: 0.1,
  },
  PLANET: {
    class: 'PLANET',
    risk: 'LOW',
    liquidity: 'HIGH',
    returnProfile: 'Medium',
    example: 'Bonds, blue chips',
    gravityMultiplier: 1.0,
    darkMatterFactor: 0.0,
  },
  MOON: {
    class: 'MOON',
    risk: 'MEDIUM',
    liquidity: 'MEDIUM',
    returnProfile: 'Medium',
    example: 'REITs, ETFs',
    gravityMultiplier: 0.9,
    darkMatterFactor: 0.05,
  },
  ASTEROID: {
    class: 'ASTEROID',
    risk: 'VERY_HIGH',
    liquidity: 'LOW',
    returnProfile: 'Speculative',
    example: 'Meme coins, penny stocks',
    gravityMultiplier: 1.6,
    darkMatterFactor: 0.25,
  },
  BLACK_HOLE: {
    class: 'BLACK_HOLE',
    risk: 'EXTREME',
    liquidity: 'VERY_LOW',
    returnProfile: 'Unknown',
    example: 'Illiquid alts, leveraged traps',
    gravityMultiplier: 2.0,
    darkMatterFactor: 0.6,
  },
  NEBULA: {
    class: 'NEBULA',
    risk: 'HIGH',
    liquidity: 'LOW',
    returnProfile: 'Emerging',
    example: 'Pre-seed startups, new markets',
    gravityMultiplier: 1.3,
    darkMatterFactor: 0.35,
  },
  COMET: {
    class: 'COMET',
    risk: 'MEDIUM',
    liquidity: 'HIGH',
    returnProfile: 'Short-term',
    example: 'Seasonal trades, arbitrage',
    gravityMultiplier: 1.1,
    darkMatterFactor: 0.08,
  },
  PULSAR: {
    class: 'PULSAR',
    risk: 'MEDIUM',
    liquidity: 'HIGH',
    returnProfile: 'Rhythmic',
    example: 'Dividend stocks, staking rewards',
    gravityMultiplier: 1.05,
    darkMatterFactor: 0.04,
  },
};

export function getCelestialDescriptor(cls: CelestialClass): CelestialClassDescriptor {
  return CELESTIAL_REGISTRY[cls];
}

export function listAllClasses(): CelestialClassDescriptor[] {
  return Object.values(CELESTIAL_REGISTRY);
}

export function isValidCelestialClass(cls: string): cls is CelestialClass {
  return cls in CELESTIAL_REGISTRY;
}
