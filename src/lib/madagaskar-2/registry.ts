// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2: Extended Catalog Registry
// Kompanija SPAJA — Digitalna Industrija
//
// Extends v1 seed catalog with v2 goods: fungal, crystal, algae categories
// and Central-Africa, Himalaya, Arctic regions.

import type { ExoticGood } from '../madagaskar/types';
import { SEED_GOODS as V1_SEED_GOODS } from '../madagaskar/registry';
import type { ExoticGoodCategory, OriginRegion } from './types';

/** ExoticGood with v2-extended category and originRegion unions. */
interface ExoticGoodV2 extends Omit<ExoticGood, 'category' | 'originRegion'> {
  category: ExoticGoodCategory;
  originRegion: OriginRegion;
}

// ─── v2 Seed Goods ────────────────────────────────────────────────────────────

const V2_NEW_GOODS: ExoticGoodV2[] = [
  // ─── Central-Africa ───────────────────────────────────────────────────────
  {
    id: 'caf-malachite-001',
    name: 'Congolese Malachite Crystal (Gem Grade)',
    category: 'crystal',
    originRegion: 'Central-Africa',
    rarity: 8,
    sustainabilityScore: 45,
    pricePerUnitCents: 42000,
    currency: 'USD',
    stock: 60,
    tags: ['malachite', 'crystal', 'gemstone', 'congo'],
    active: true,
  },
  {
    id: 'caf-gorilla-resin-001',
    name: 'Cameroon Forest Copal Resin (Artisan Grade)',
    category: 'artisan',
    originRegion: 'Central-Africa',
    rarity: 7,
    sustainabilityScore: 68,
    pricePerUnitCents: 8800,
    currency: 'EUR',
    stock: 120,
    tags: ['copal', 'resin', 'artisan', 'cameroon'],
    active: true,
  },
  {
    id: 'caf-moringa-001',
    name: 'Chad Moringa Leaf Powder (Sun-Dried)',
    category: 'botanical',
    originRegion: 'Central-Africa',
    rarity: 3,
    sustainabilityScore: 92,
    pricePerUnitCents: 650,
    currency: 'USD',
    stock: 1500,
    tags: ['moringa', 'botanical', 'superfood', 'chad'],
    active: true,
  },
  // ─── Himalaya ─────────────────────────────────────────────────────────────
  {
    id: 'him-saffron-001',
    name: 'Kashmiri Saffron (Mongra Grade, Hand-Picked)',
    category: 'spice',
    originRegion: 'Himalaya',
    rarity: 10,
    sustainabilityScore: 78,
    pricePerUnitCents: 950000,
    currency: 'USD',
    stock: 8,
    tags: ['saffron', 'kashmiri', 'mongra', 'spice', 'premium'],
    active: true,
  },
  {
    id: 'him-cordyceps-001',
    name: 'Tibetan Cordyceps Sinensis (Wild, Grade A)',
    category: 'fungal',
    originRegion: 'Himalaya',
    rarity: 9,
    sustainabilityScore: 55,
    pricePerUnitCents: 350000,
    currency: 'USD',
    stock: 20,
    tags: ['cordyceps', 'fungal', 'medicinal', 'tibet'],
    active: true,
  },
  {
    id: 'him-shilajit-001',
    name: 'Himalayan Shilajit Resin (Purified, Fulvic Acid 60%+)',
    category: 'mineral',
    originRegion: 'Himalaya',
    rarity: 8,
    sustainabilityScore: 70,
    pricePerUnitCents: 28000,
    currency: 'USD',
    stock: 100,
    tags: ['shilajit', 'mineral', 'ayurveda', 'himalaya'],
    active: true,
  },
  // ─── Arctic ───────────────────────────────────────────────────────────────
  {
    id: 'arc-algae-spirulina-001',
    name: 'Arctic Spirulina (Cold-Water Cultivated, Freeze-Dried)',
    category: 'algae',
    originRegion: 'Arctic',
    rarity: 7,
    sustainabilityScore: 96,
    pricePerUnitCents: 12000,
    currency: 'EUR',
    stock: 300,
    tags: ['spirulina', 'algae', 'arctic', 'superfood', 'freeze-dried'],
    active: true,
  },
  {
    id: 'arc-chlorella-001',
    name: 'Norwegian Arctic Chlorella (Cracked-Cell, Organic)',
    category: 'algae',
    originRegion: 'Arctic',
    rarity: 6,
    sustainabilityScore: 94,
    pricePerUnitCents: 8500,
    currency: 'EUR',
    stock: 500,
    tags: ['chlorella', 'algae', 'organic', 'norway'],
    active: true,
  },
  {
    id: 'arc-sea-crystal-salt-001',
    name: 'Arctic Sea Crystal Salt (Svalbard, Hand-Harvested)',
    category: 'crystal',
    originRegion: 'Arctic',
    rarity: 5,
    sustainabilityScore: 88,
    pricePerUnitCents: 3500,
    currency: 'EUR',
    stock: 800,
    tags: ['salt', 'crystal', 'svalbard', 'arctic', 'hand-harvested'],
    active: true,
  },
  {
    id: 'arc-chaga-001',
    name: 'Siberian Arctic Chaga Mushroom (Wild, Chunked)',
    category: 'fungal',
    originRegion: 'Arctic',
    rarity: 6,
    sustainabilityScore: 80,
    pricePerUnitCents: 7200,
    currency: 'EUR',
    stock: 350,
    tags: ['chaga', 'mushroom', 'fungal', 'siberia', 'wild'],
    active: true,
  },
];

// ─── Combined catalog ─────────────────────────────────────────────────────────

/** Full v2 catalog: all v1 goods + v2 new goods. */
export const SEED_GOODS_V2: ExoticGood[] = [
  ...V1_SEED_GOODS,
  // ExoticGoodV2 is structurally compatible with ExoticGood at runtime;
  // the cast is needed because the v2 category/region unions are wider.
  ...(V2_NEW_GOODS as unknown as ExoticGood[]),
];

// ─── In-memory store ──────────────────────────────────────────────────────────

let _catalog: Map<string, ExoticGood> = new Map(SEED_GOODS_V2.map((g) => [g.id, g]));

/** @internal — reset catalog to seed state (for tests). */
export function _resetCatalogV2(): void {
  _catalog = new Map(SEED_GOODS_V2.map((g) => [g.id, g]));
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export function getGoodByIdV2(id: string): ExoticGood | undefined {
  return _catalog.get(id);
}

export function listGoodsV2(filter?: { category?: string; region?: string; rarityMin?: number; activeOnly?: boolean }): ExoticGood[] {
  let goods = Array.from(_catalog.values());

  if (filter?.activeOnly !== false) {
    goods = goods.filter((g) => g.active);
  }
  if (filter?.category) {
    goods = goods.filter((g) => (g.category as string) === filter.category);
  }
  if (filter?.region) {
    goods = goods.filter((g) => (g.originRegion as string) === filter.region);
  }
  if (filter?.rarityMin !== undefined) {
    goods = goods.filter((g) => g.rarity >= (filter.rarityMin as number));
  }

  return goods;
}

export function upsertGoodV2(good: ExoticGood): void {
  _catalog.set(good.id, good);
}

export function removeGoodV2(id: string): boolean {
  return _catalog.delete(id);
}
