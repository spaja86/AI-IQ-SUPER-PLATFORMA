import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const highPriority = ['/', '/dashboard', '/ekosistem'];
  const mediumHighPriority = ['/platforme', '/omega-ai', '/spaja-pro', '/igrice', '/it-proizvodi'];
  const lastModified = new Date('2026-04-05');
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
    '/spaja-digitalni-kompjuter',
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'daily' as const : 'weekly' as const,
    priority: highPriority.includes(route)
      ? 1
      : mediumHighPriority.includes(route)
        ? 0.9
        : 0.8,
  }));
}
