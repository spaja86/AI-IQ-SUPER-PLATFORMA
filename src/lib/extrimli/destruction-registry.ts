// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI DESTRUKCIJA Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  DestructibleAsset,
  DestructibleAssetType,
  DestructibleMaterial,
  DimensionBand,
  DimensionPhysicsProfile,
} from './types';

export const DIMENSION_PHYSICS_PROFILES: DimensionPhysicsProfile[] = [
  { dimension: '360D',  fragmentationBias: 0.75, shockwaveBias: 0.7, stabilityModifier: 0.92, energyRetention: 0.68 },
  { dimension: '720D',  fragmentationBias: 0.82, shockwaveBias: 0.78, stabilityModifier: 0.88, energyRetention: 0.74 },
  { dimension: '1440D', fragmentationBias: 0.94, shockwaveBias: 0.9, stabilityModifier: 0.8, energyRetention: 0.82 },
  { dimension: '2880D', fragmentationBias: 1.08, shockwaveBias: 1.04, stabilityModifier: 0.72, energyRetention: 0.9 },
  { dimension: '5760D', fragmentationBias: 1.2, shockwaveBias: 1.18, stabilityModifier: 0.64, energyRetention: 1.02 },
];

export const DESTRUCTIBLE_ASSET_REGISTRY: DestructibleAsset[] = [
  {
    id: 'glass-dome-arena',
    name: 'Glass Dome Arena',
    type: 'arena',
    material: 'glass',
    structuralIntegrity: 4,
    maxFragments: 280,
    maxSafeFragments: 120,
    safetyRadiusM: 18,
    destructibleDimensions: ['360D', '720D', '1440D'],
    shockwaveSensitivity: 8,
    sportIds: ['skateboarding', 'bmx'],
  },
  {
    id: 'canyon-drop-bridge',
    name: 'Canyon Drop Bridge',
    type: 'bridge',
    material: 'steel',
    structuralIntegrity: 8,
    maxFragments: 120,
    maxSafeFragments: 70,
    safetyRadiusM: 34,
    destructibleDimensions: ['720D', '1440D', '2880D', '5760D'],
    shockwaveSensitivity: 6,
    sportIds: ['mountain-biking', 'motocross'],
  },
  {
    id: 'resonance-cliff-wall',
    name: 'Resonance Cliff Wall',
    type: 'wall',
    material: 'concrete',
    structuralIntegrity: 7,
    maxFragments: 220,
    maxSafeFragments: 110,
    safetyRadiusM: 26,
    destructibleDimensions: ['360D', '720D', '1440D', '2880D'],
    shockwaveSensitivity: 5,
    sportIds: ['free-climbing'],
  },
  {
    id: 'timber-obstacle-grid',
    name: 'Timber Obstacle Grid',
    type: 'obstacle',
    material: 'wood',
    structuralIntegrity: 5,
    maxFragments: 90,
    maxSafeFragments: 55,
    safetyRadiusM: 14,
    destructibleDimensions: ['360D', '720D', '1440D'],
    shockwaveSensitivity: 4,
    sportIds: ['snowboarding', 'skateboarding', 'bmx'],
  },
  {
    id: 'composite-flight-tower',
    name: 'Composite Flight Tower',
    type: 'tower',
    material: 'composite',
    structuralIntegrity: 6,
    maxFragments: 160,
    maxSafeFragments: 80,
    safetyRadiusM: 30,
    destructibleDimensions: ['1440D', '2880D', '5760D'],
    shockwaveSensitivity: 7,
    sportIds: ['paragliding', 'wingsuit', 'base-jumping'],
  },
  {
    id: 'urban-impact-vehicle',
    name: 'Urban Impact Vehicle',
    type: 'vehicle',
    material: 'steel',
    structuralIntegrity: 7,
    maxFragments: 60,
    maxSafeFragments: 35,
    safetyRadiusM: 16,
    destructibleDimensions: ['360D', '720D', '1440D', '2880D'],
    shockwaveSensitivity: 5,
    sportIds: ['motocross'],
  },
];

export function getDimensionPhysicsProfile(dimension: DimensionBand): DimensionPhysicsProfile | undefined {
  return DIMENSION_PHYSICS_PROFILES.find((profile) => profile.dimension === dimension);
}

export function getDestructibleAssetById(id: string): DestructibleAsset | undefined {
  return DESTRUCTIBLE_ASSET_REGISTRY.find((asset) => asset.id === id);
}

export function listDestructibleAssets(filters?: {
  type?: DestructibleAssetType;
  material?: DestructibleMaterial;
  dimension?: DimensionBand;
  sportId?: string;
}): DestructibleAsset[] {
  return DESTRUCTIBLE_ASSET_REGISTRY.filter((asset) => {
    if (filters?.type && asset.type !== filters.type) return false;
    if (filters?.material && asset.material !== filters.material) return false;
    if (filters?.dimension && !asset.destructibleDimensions.includes(filters.dimension)) return false;
    if (filters?.sportId && !asset.sportIds.includes(filters.sportId)) return false;
    return true;
  });
}
