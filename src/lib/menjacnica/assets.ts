// SpajaUltraOmegaCore -∞Ω+∞ — Asset Catalog
// Kompanija SPAJA — Digitalna Industrija

import type { Asset } from './types';

export const ASSETS: Asset[] = [
  {
    id: 'BTC',
    naziv: 'Bitcoin',
    tip: 'crypto',
    decimals: 8,
    minOrderQty: 0.00001,
    maxOrderQty: 10,
    mreza: 'bitcoin',
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'ETH',
    naziv: 'Ethereum',
    tip: 'crypto',
    decimals: 18,
    minOrderQty: 0.001,
    maxOrderQty: 100,
    mreza: 'ethereum',
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'USDT',
    naziv: 'Tether USD',
    tip: 'stablecoin',
    decimals: 6,
    minOrderQty: 1,
    maxOrderQty: 100_000,
    mreza: 'ethereum',
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'SOL',
    naziv: 'Solana',
    tip: 'crypto',
    decimals: 9,
    minOrderQty: 0.01,
    maxOrderQty: 10_000,
    mreza: 'solana',
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'MATIC',
    naziv: 'Polygon',
    tip: 'crypto',
    decimals: 18,
    minOrderQty: 1,
    maxOrderQty: 500_000,
    mreza: 'polygon',
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'SPAJA',
    naziv: 'SPAJA Bitkoin',
    tip: 'crypto',
    decimals: 8,
    minOrderQty: 0.00001,
    maxOrderQty: 1_000,
    mreza: 'polygon',
    isSpajaBtc: true,
    enabled: true,
  },
  {
    id: 'EUR',
    naziv: 'Euro',
    tip: 'fiat',
    decimals: 2,
    minOrderQty: 1,
    maxOrderQty: 100_000,
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'RSD',
    naziv: 'Srpski dinar',
    tip: 'fiat',
    decimals: 2,
    minOrderQty: 100,
    maxOrderQty: 10_000_000,
    isSpajaBtc: false,
    enabled: true,
  },
  {
    id: 'USD',
    naziv: 'US Dollar',
    tip: 'fiat',
    decimals: 2,
    minOrderQty: 1,
    maxOrderQty: 100_000,
    isSpajaBtc: false,
    enabled: true,
  },
];

const ASSET_MAP = new Map<string, Asset>(ASSETS.map((a) => [a.id, a]));

export function getAsset(id: string): Asset | undefined {
  return ASSET_MAP.get(id.toUpperCase());
}

export function getEnabledAssets(): Asset[] {
  return ASSETS.filter((a) => a.enabled);
}

export function getCryptoAssets(): Asset[] {
  return ASSETS.filter((a) => (a.tip === 'crypto' || a.tip === 'stablecoin') && a.enabled);
}

export function getFiatAssets(): Asset[] {
  return ASSETS.filter((a) => a.tip === 'fiat' && a.enabled);
}

export function getSpajaAsset(): Asset {
  const a = ASSET_MAP.get('SPAJA');
  if (!a) throw new Error('SPAJA asset nije pronađen u katalogu');
  return a;
}
