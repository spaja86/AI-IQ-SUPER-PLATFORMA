import { BASE_URL } from './constants';

export const BRAND_ASSETS = {
  favicon: '/brand/favicon.svg',
  navLogo: '/brand/spaja-brand-mark.svg',
  heroLogo: '/brand/og-fallback.svg',
  ogFallback: '/brand/og-fallback.svg',
  diktorHero: '/brand/diktor-template-source.svg',
  appIcon: `${BASE_URL}/icon`,
  appleTouchIcon: `${BASE_URL}/apple-icon`,
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSETS;
