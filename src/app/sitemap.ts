import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const highPriority = ['/', '/dashboard', '/ekosistem'];
  const mediumHighPriority = ['/platforme', '/omega-ai', '/spaja-pro', '/igrice', '/it-proizvodi'];

  // Dynamic lastModified dates per page category
  const recentlyUpdated = new Date('2026-04-12');
  const corePages = new Date('2026-04-10');
  const standardPages = new Date('2026-04-08');

  const recentRoutes = ['/', '/dashboard', '/omega-projekat-plasiranje', '/omega-projekat-zvanicno-otvaranje', '/oktavne-eksponencijalne-funkcije', '/blog'];
  const coreRoutes = ['/ekosistem', '/omega-ai', '/spaja-pro', '/industrija', '/platforme', '/pricing', '/it-proizvodi', '/igrice', '/omega-ai-suport'];

  const routes = [
    '/',
    '/dashboard',
    '/industrija',
    '/platforme',
    '/it-proizvodi',
    '/banka',
    '/menjacnica',
    '/kompanija',
    '/kompanije',
    '/ai-platforma',
    '/organizacija',
    '/organizacije',
    '/deploy',
    '/ekosistem',
    '/omega-ai',
    '/prompt',
    '/spaja-pro',
    '/spaja-univerzalni-prompt',
    '/auto-popravka',
    '/proksi',
    '/proksi-github-deploy',
    '/proksi-wifi-antena',
    '/mobilna-mreza',
    '/igrice',
    '/dimenzije',
    '/proizvodi',
    '/spaja-generator-engine',
    '/spaja-digitalni-brouvzer',
    '/io-openui-ao-laboratorija',
    '/spaja-render-medija',
    '/io-openui-ao-gaming-platforma',
    '/pricing',
    '/digitalni-televizor',
    '/monitoring-live',
    '/ai-iq-monitoring',
    '/blog',
    '/unit-testovi',
    '/omega-ai-suport',
    '/omega-projekat-plasiranje',
    '/oktavne-eksponencijalne-funkcije',
    '/omega-projekat-zvanicno-otvaranje',
    '/spaja-digitalni-kompjuter',
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: recentRoutes.includes(route)
      ? recentlyUpdated
      : coreRoutes.includes(route)
        ? corePages
        : standardPages,
    changeFrequency: route === '/' ? 'daily' as const : 'weekly' as const,
    priority: highPriority.includes(route)
      ? 1
      : mediumHighPriority.includes(route)
        ? 0.9
        : 0.8,
    alternates: {
      languages: {
        'sr-Latn': `${BASE_URL}${route}`,
        'en': `${BASE_URL}/en${route}`,
      },
    },
  }));
}
