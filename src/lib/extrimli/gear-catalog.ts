// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { GearCatalogEntry, GearItem } from './types';
import { isValidSku, round } from './utils';

const CATALOG: Map<string, GearItem> = new Map();

function calcEntry(item: GearItem): GearCatalogEntry {
  return {
    ...item,
    affiliateCommission: round((item.price * item.affiliateCommissionPct) / 100, 2),
  };
}

function validateGearItem(item: GearItem): string | null {
  if (!isValidSku(item.sku)) return `invalid SKU: ${item.sku}`;
  if (!item.brand || typeof item.brand !== 'string') return 'brand must be a non-empty string';
  if (!item.name  || typeof item.name  !== 'string') return 'name must be a non-empty string';
  if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) return 'price must be a finite non-negative number';
  if (typeof item.stock !== 'number' || !Number.isFinite(item.stock) || item.stock < 0) return 'stock must be a finite non-negative number';
  if (typeof item.safetyRating !== 'number' || item.safetyRating < 1 || item.safetyRating > 5) return 'safetyRating must be in [1, 5]';
  if (typeof item.affiliateCommissionPct !== 'number' || item.affiliateCommissionPct < 0 || item.affiliateCommissionPct > 100) return 'affiliateCommissionPct must be in [0, 100]';
  return null;
}

export function addGearItem(item: GearItem): void {
  const err = validateGearItem(item);
  if (err) throw new Error(err);
  CATALOG.set(item.sku, { ...item });
}

export function getGearItem(sku: string): GearCatalogEntry | undefined {
  const item = CATALOG.get(sku);
  return item ? calcEntry(item) : undefined;
}

export function listGearItems(filter?: { category?: GearItem['category']; sportId?: string }): GearCatalogEntry[] {
  return Array.from(CATALOG.values())
    .filter((item) => {
      if (filter?.category && item.category !== filter.category) return false;
      if (filter?.sportId && !item.sportIds.includes(filter.sportId)) return false;
      return true;
    })
    .map(calcEntry);
}

export function updateStock(sku: string, delta: number): void {
  const item = CATALOG.get(sku);
  if (!item) throw new Error(`gear item not found: ${sku}`);
  const newStock = item.stock + delta;
  if (newStock < 0) throw new Error(`stock cannot go below 0 for SKU: ${sku}`);
  CATALOG.set(sku, { ...item, stock: newStock });
}

export function _resetGearCatalog(): void {
  CATALOG.clear();
}

// ─── Seed catalog with common gear items ──────────────────────────────────────

const SEED_ITEMS: GearItem[] = [
  { sku: 'HLM-001', brand: 'SkullGuard', name: 'Pro Helmet X1', category: 'helmet', safetyRating: 5, price: 89.99, stock: 100, affiliateCommissionPct: 8, sportIds: ['skateboarding', 'bmx', 'mountain-biking', 'motocross'] },
  { sku: 'HRN-001', brand: 'VertexGear', name: 'Alpine Harness V2', category: 'harness', safetyRating: 5, price: 149.0, stock: 50, affiliateCommissionPct: 10, sportIds: ['free-climbing', 'paragliding'] },
  { sku: 'BRD-001', brand: 'SnowPeak', name: 'FreeRide Snowboard 158', category: 'board', safetyRating: 4, price: 399.0, stock: 30, affiliateCommissionPct: 6, sportIds: ['snowboarding'] },
  { sku: 'CHT-001', brand: 'AirForce', name: 'BASE Chute Pro', category: 'chute', safetyRating: 5, price: 1299.0, stock: 15, affiliateCommissionPct: 5, sportIds: ['base-jumping', 'wingsuit'] },
  { sku: 'WNG-001', brand: 'SkyWing', name: 'Paraglider Wing M', category: 'wing', safetyRating: 5, price: 2499.0, stock: 10, affiliateCommissionPct: 4, sportIds: ['paragliding', 'wingsuit'] },
  { sku: 'WST-001', brand: 'AquaFlex', name: 'Surfing Wetsuit 3/2', category: 'wetsuit', safetyRating: 4, price: 189.0, stock: 60, affiliateCommissionPct: 7, sportIds: ['surfing'] },
];

for (const item of SEED_ITEMS) {
  addGearItem(item);
}
