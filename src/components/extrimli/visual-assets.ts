// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI Visual Assets
// Kompanija SPAJA — Digitalna Industrija

export type ExtrimliVisualDomain = 'dashboard' | 'sport' | 'risk' | 'gear' | 'event' | 'performance';

export interface ExtrimliVisualAsset {
  icon: string;
  imageDataUri: string;
  alt: string;
  format: 'svg';
  width: number;
  height: number;
}

export const EXTRIMLI_VISUAL_ASSET_RULES = {
  allowedFormats: ['svg'] as const,
  minSizePx: 16,
  maxSizePx: 48,
  recommendedSizePx: 24,
};

function createCircleSvgDataUri(primary: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="${primary}"/><circle cx="12" cy="12" r="4" fill="${accent}"/><circle cx="18" cy="6" r="2" fill="${accent}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const FALLBACK_ASSET: ExtrimliVisualAsset = {
  icon: '🌀',
  imageDataUri: createCircleSvgDataUri('#1e293b', '#38bdf8'),
  alt: 'EXTRIMLI fallback visual',
  format: 'svg',
  width: 24,
  height: 24,
};

const VISUAL_ASSETS: Record<ExtrimliVisualDomain, ExtrimliVisualAsset> = {
  dashboard: {
    icon: '🏔',
    imageDataUri: createCircleSvgDataUri('#1d4ed8', '#bfdbfe'),
    alt: 'EXTRIMLI dashboard axis visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
  sport: {
    icon: '🎯',
    imageDataUri: createCircleSvgDataUri('#0891b2', '#67e8f9'),
    alt: 'EXTRIMLI sport visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
  risk: {
    icon: '⚠️',
    imageDataUri: createCircleSvgDataUri('#b91c1c', '#fecaca'),
    alt: 'EXTRIMLI risk visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
  gear: {
    icon: '🛡️',
    imageDataUri: createCircleSvgDataUri('#15803d', '#86efac'),
    alt: 'EXTRIMLI gear visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
  event: {
    icon: '🏁',
    imageDataUri: createCircleSvgDataUri('#7c3aed', '#ddd6fe'),
    alt: 'EXTRIMLI event visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
  performance: {
    icon: '📈',
    imageDataUri: createCircleSvgDataUri('#ea580c', '#fed7aa'),
    alt: 'EXTRIMLI performance visual',
    format: 'svg',
    width: 24,
    height: 24,
  },
};

export function getExtrimliVisualAsset(domain: ExtrimliVisualDomain | string): ExtrimliVisualAsset {
  if (domain in VISUAL_ASSETS) {
    return VISUAL_ASSETS[domain as ExtrimliVisualDomain];
  }

  return FALLBACK_ASSET;
}
