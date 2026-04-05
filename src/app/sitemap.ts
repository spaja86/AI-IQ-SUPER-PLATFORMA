import type { MetadataRoute } from 'next';

const BASE_URL = 'https://ai-iq-super-platforma.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : route === '/dashboard' ? 0.9 : 0.8,
  }));
}
