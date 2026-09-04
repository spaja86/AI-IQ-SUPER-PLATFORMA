// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR Registry
// Kompanija SPAJA — Digitalna Industrija
//
// In-memory catalog of exotic goods with seed data and CRUD helpers.

import type { ExoticGood, ExoticGoodCategory, OriginRegion, GoodFilter } from './types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_GOODS: ExoticGood[] = [
  // ─── Madagascar ───────────────────────────────────────────────────────────
  {
    id: 'mdg-vanilla-001',
    name: 'Madagaskar Bourbon Vanilla (Grade A)',
    category: 'spice',
    originRegion: 'Madagascar',
    rarity: 6,
    sustainabilityScore: 72,
    pricePerUnitCents: 1500,
    currency: 'EUR',
    stock: 500,
    tags: ['vanilla', 'spice', 'organic', 'bourbon'],
    active: true,
  },
  {
    id: 'mdg-sapphire-001',
    name: 'Madagaskar Blue Sapphire (Raw)',
    category: 'mineral',
    originRegion: 'Madagascar',
    rarity: 9,
    sustainabilityScore: 40,
    pricePerUnitCents: 85000,
    currency: 'EUR',
    stock: 30,
    tags: ['sapphire', 'gemstone', 'blue', 'raw'],
    active: true,
  },
  {
    id: 'mdg-baobab-oil-001',
    name: 'Madagaskar Baobab Oil (Cold-Pressed)',
    category: 'botanical',
    originRegion: 'Madagascar',
    rarity: 7,
    sustainabilityScore: 85,
    pricePerUnitCents: 3200,
    currency: 'EUR',
    stock: 200,
    tags: ['baobab', 'oil', 'botanical', 'cold-pressed'],
    active: true,
  },
  {
    id: 'mdg-lemur-resin-001',
    name: 'Madagaskar Lemur-Zone Aromatic Resin',
    category: 'fauna-derivative',
    originRegion: 'Madagascar',
    rarity: 10,
    sustainabilityScore: 22,
    pricePerUnitCents: 120000,
    currency: 'EUR',
    stock: 10,
    tags: ['resin', 'aromatic', 'rare', 'fauna-zone'],
    active: true,
  },
  {
    id: 'mdg-raffia-001',
    name: 'Madagaskar Raffia Artisan Textile',
    category: 'textile',
    originRegion: 'Madagascar',
    rarity: 5,
    sustainabilityScore: 90,
    pricePerUnitCents: 4500,
    currency: 'EUR',
    stock: 150,
    tags: ['raffia', 'textile', 'artisan', 'handmade'],
    active: true,
  },
  {
    id: 'mdg-kaolin-001',
    name: 'Madagaskar Premium Kaolin Clay',
    category: 'mineral',
    originRegion: 'Madagascar',
    rarity: 4,
    sustainabilityScore: 78,
    pricePerUnitCents: 800,
    currency: 'EUR',
    stock: 1000,
    tags: ['kaolin', 'clay', 'mineral', 'industrial'],
    active: true,
  },
  // ─── Indonesia ────────────────────────────────────────────────────────────
  {
    id: 'idn-clove-001',
    name: 'Maluku Clove (Whole, Sun-Dried)',
    category: 'spice',
    originRegion: 'Indonesia',
    rarity: 5,
    sustainabilityScore: 80,
    pricePerUnitCents: 950,
    currency: 'USD',
    stock: 800,
    tags: ['clove', 'spice', 'maluku', 'sun-dried'],
    active: true,
  },
  {
    id: 'idn-sandalwood-001',
    name: 'East Nusa Tenggara Sandalwood Oil',
    category: 'botanical',
    originRegion: 'Indonesia',
    rarity: 8,
    sustainabilityScore: 55,
    pricePerUnitCents: 25000,
    currency: 'USD',
    stock: 60,
    tags: ['sandalwood', 'oil', 'botanical', 'aromatic'],
    active: true,
  },
  {
    id: 'idn-batik-001',
    name: 'Javanese Batik Silk — Hand-Drawn Motif',
    category: 'textile',
    originRegion: 'Indonesia',
    rarity: 7,
    sustainabilityScore: 82,
    pricePerUnitCents: 18000,
    currency: 'USD',
    stock: 40,
    tags: ['batik', 'silk', 'textile', 'java', 'handmade'],
    active: true,
  },
  {
    id: 'idn-nickel-ore-001',
    name: 'Sulawesi High-Grade Nickel Ore',
    category: 'tech-material',
    originRegion: 'Indonesia',
    rarity: 6,
    sustainabilityScore: 35,
    pricePerUnitCents: 5500,
    currency: 'USD',
    stock: 2000,
    tags: ['nickel', 'ore', 'tech-material', 'battery'],
    active: true,
  },
  // ─── Amazon ───────────────────────────────────────────────────────────────
  {
    id: 'amz-acai-001',
    name: 'Amazonian Açaí Powder (Freeze-Dried)',
    category: 'botanical',
    originRegion: 'Amazon',
    rarity: 4,
    sustainabilityScore: 88,
    pricePerUnitCents: 1200,
    currency: 'USD',
    stock: 600,
    tags: ['acai', 'botanical', 'freeze-dried', 'superfood'],
    active: true,
  },
  {
    id: 'amz-cacao-001',
    name: 'Wild Amazonian Cacao Paste (Raw)',
    category: 'spice',
    originRegion: 'Amazon',
    rarity: 6,
    sustainabilityScore: 91,
    pricePerUnitCents: 2800,
    currency: 'USD',
    stock: 300,
    tags: ['cacao', 'chocolate', 'raw', 'wild-harvest'],
    active: true,
  },
  {
    id: 'amz-rubber-001',
    name: 'Amazonian Natural Rubber (Latex Grade AA)',
    category: 'tech-material',
    originRegion: 'Amazon',
    rarity: 5,
    sustainabilityScore: 65,
    pricePerUnitCents: 3400,
    currency: 'USD',
    stock: 700,
    tags: ['rubber', 'latex', 'natural', 'tech-material'],
    active: true,
  },
  {
    id: 'amz-mahogany-craft-001',
    name: 'Amazonian Mahogany Artisan Box (FSC Certified)',
    category: 'artisan',
    originRegion: 'Amazon',
    rarity: 7,
    sustainabilityScore: 70,
    pricePerUnitCents: 9500,
    currency: 'USD',
    stock: 80,
    tags: ['mahogany', 'artisan', 'fsc', 'handmade'],
    active: true,
  },
  // ─── Sahel ────────────────────────────────────────────────────────────────
  {
    id: 'shl-shea-001',
    name: 'Sahel Shea Butter (Unrefined, Village Co-op)',
    category: 'botanical',
    originRegion: 'Sahel',
    rarity: 3,
    sustainabilityScore: 93,
    pricePerUnitCents: 700,
    currency: 'EUR',
    stock: 1200,
    tags: ['shea', 'butter', 'botanical', 'unrefined', 'co-op'],
    active: true,
  },
  {
    id: 'shl-indigo-001',
    name: 'Malian Indigo-Dyed Bogolan Textile',
    category: 'textile',
    originRegion: 'Sahel',
    rarity: 6,
    sustainabilityScore: 88,
    pricePerUnitCents: 6500,
    currency: 'EUR',
    stock: 120,
    tags: ['indigo', 'bogolan', 'textile', 'mali', 'handmade'],
    active: true,
  },
  {
    id: 'shl-phosphate-001',
    name: 'Sahelian Phosphate Rock (High-Purity)',
    category: 'mineral',
    originRegion: 'Sahel',
    rarity: 4,
    sustainabilityScore: 48,
    pricePerUnitCents: 1100,
    currency: 'USD',
    stock: 3000,
    tags: ['phosphate', 'mineral', 'fertilizer', 'high-purity'],
    active: true,
  },
  // ─── Patagonia ────────────────────────────────────────────────────────────
  {
    id: 'pat-wool-001',
    name: 'Patagonian Merino Wool (Superfine, Raw)',
    category: 'textile',
    originRegion: 'Patagonia',
    rarity: 6,
    sustainabilityScore: 84,
    pricePerUnitCents: 8800,
    currency: 'USD',
    stock: 250,
    tags: ['merino', 'wool', 'superfine', 'patagonia'],
    active: true,
  },
  {
    id: 'pat-lithium-brine-001',
    name: 'Patagonian Lithium Brine Concentrate',
    category: 'tech-material',
    originRegion: 'Patagonia',
    rarity: 9,
    sustainabilityScore: 28,
    pricePerUnitCents: 95000,
    currency: 'USD',
    stock: 50,
    tags: ['lithium', 'brine', 'tech-material', 'battery-grade'],
    active: true,
  },
  {
    id: 'pat-rose-hip-001',
    name: 'Patagonian Rose Hip Oil (Wild-Harvest)',
    category: 'botanical',
    originRegion: 'Patagonia',
    rarity: 5,
    sustainabilityScore: 87,
    pricePerUnitCents: 5200,
    currency: 'USD',
    stock: 180,
    tags: ['rosehip', 'oil', 'botanical', 'wild-harvest'],
    active: true,
  },
  // ─── Siberia ──────────────────────────────────────────────────────────────
  {
    id: 'sib-amber-001',
    name: 'Siberian Baltic Amber (Gem Grade)',
    category: 'mineral',
    originRegion: 'Siberia',
    rarity: 8,
    sustainabilityScore: 60,
    pricePerUnitCents: 35000,
    currency: 'EUR',
    stock: 90,
    tags: ['amber', 'gem', 'mineral', 'baltic', 'siberia'],
    active: true,
  },
  {
    id: 'sib-pine-resin-001',
    name: 'Siberian Pine Oleoresin (Pharmaceutical Grade)',
    category: 'botanical',
    originRegion: 'Siberia',
    rarity: 5,
    sustainabilityScore: 82,
    pricePerUnitCents: 4100,
    currency: 'EUR',
    stock: 400,
    tags: ['pine', 'resin', 'oleoresin', 'pharma'],
    active: true,
  },
  {
    id: 'sib-mammoth-ivory-001',
    name: 'Siberian Mammoth Ivory Artifact (Fossil)',
    category: 'artisan',
    originRegion: 'Siberia',
    rarity: 10,
    sustainabilityScore: 95,
    pricePerUnitCents: 500000,
    currency: 'EUR',
    stock: 5,
    tags: ['mammoth', 'ivory', 'fossil', 'artifact', 'legal'],
    active: true,
  },
  // ─── Oceania ──────────────────────────────────────────────────────────────
  {
    id: 'ocn-black-pearl-001',
    name: 'Tahitian Black Pearl (AAA Grade)',
    category: 'artisan',
    originRegion: 'Oceania',
    rarity: 9,
    sustainabilityScore: 76,
    pricePerUnitCents: 75000,
    currency: 'USD',
    stock: 25,
    tags: ['pearl', 'black', 'tahitian', 'artisan', 'jewelry'],
    active: true,
  },
  {
    id: 'ocn-sea-sponge-001',
    name: 'Pacific Natural Sea Sponge (Cosmetic Grade)',
    category: 'fauna-derivative',
    originRegion: 'Oceania',
    rarity: 6,
    sustainabilityScore: 72,
    pricePerUnitCents: 2200,
    currency: 'USD',
    stock: 350,
    tags: ['sponge', 'natural', 'cosmetic', 'pacific'],
    active: true,
  },
  {
    id: 'ocn-manuka-honey-001',
    name: 'New Zealand Manuka Honey (UMF 20+)',
    category: 'botanical',
    originRegion: 'Oceania',
    rarity: 7,
    sustainabilityScore: 90,
    pricePerUnitCents: 8500,
    currency: 'NZD',
    stock: 200,
    tags: ['manuka', 'honey', 'botanical', 'umf', 'new-zealand'],
    active: true,
  },
  {
    id: 'ocn-titanium-ore-001',
    name: 'Australian Titanium Ilmenite Ore',
    category: 'tech-material',
    originRegion: 'Oceania',
    rarity: 5,
    sustainabilityScore: 55,
    pricePerUnitCents: 4800,
    currency: 'AUD',
    stock: 1500,
    tags: ['titanium', 'ilmenite', 'ore', 'tech-material'],
    active: true,
  },
];

// ─── In-memory store ──────────────────────────────────────────────────────────

let _catalog: Map<string, ExoticGood> = new Map(SEED_GOODS.map((g) => [g.id, g]));

/** @internal — reset catalog to seed state (for tests). */
export function _resetCatalog(): void {
  _catalog = new Map(SEED_GOODS.map((g) => [g.id, g]));
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export function getGoodById(id: string): ExoticGood | undefined {
  return _catalog.get(id);
}

export function listGoods(filter?: GoodFilter): ExoticGood[] {
  let goods = Array.from(_catalog.values());

  if (filter?.activeOnly !== false) {
    goods = goods.filter((g) => g.active);
  }
  if (filter?.category) {
    goods = goods.filter((g) => g.category === filter.category);
  }
  if (filter?.region) {
    goods = goods.filter((g) => g.originRegion === filter.region);
  }
  if (filter?.rarityMin !== undefined) {
    goods = goods.filter((g) => g.rarity >= (filter.rarityMin as number));
  }

  return goods;
}

export function upsertGood(good: ExoticGood): void {
  _catalog.set(good.id, good);
}

export function removeGood(id: string): boolean {
  return _catalog.delete(id);
}

export { SEED_GOODS };
