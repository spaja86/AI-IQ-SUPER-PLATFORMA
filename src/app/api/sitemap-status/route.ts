import { NextResponse } from 'next/server';
import { navigation } from '@/lib/navigation';
import { APP_VERSION, BASE_URL, TOTAL_PAGES, TOTAL_ROUTES, TOTAL_API_ROUTES } from '@/lib/constants';

export async function GET() {
  const sitemapRoutes = navigation.map((n) => n.href);

  return NextResponse.json({
    verzija: APP_VERSION,
    baseUrl: BASE_URL,

    sitemap: {
      ukupnoStranica: sitemapRoutes.length,
      format: 'XML',
      url: `${BASE_URL}/sitemap.xml`,
      changeFrequency: {
        daily: 1,
        weekly: sitemapRoutes.length - 1,
      },
      prioriteti: {
        highest: sitemapRoutes.filter((r) => ['/', '/dashboard', '/ekosistem'].includes(r)).length,
        high: sitemapRoutes.filter((r) => ['/platforme', '/omega-ai', '/spaja-pro', '/igrice', '/it-proizvodi'].includes(r)).length,
        default: sitemapRoutes.length - 8,
      },
    },

    robots: {
      url: `${BASE_URL}/robots.txt`,
      allowed: ['/'],
      disallowed: ['/api/cron/', '/api/auto-repair/', '/api/metrics/', '/api/security/'],
    },

    manifest: {
      url: `${BASE_URL}/manifest.webmanifest`,
      display: 'standalone',
      pwa: true,
    },

    pregled: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      navigacioniLinkovi: navigation.length,
    },

    timestamp: new Date().toISOString(),
  });
}
