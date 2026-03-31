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
    '/ai-platforma',
    '/organizacija',
    '/deploy',
    '/ekosistem',
    '/omega-ai',
    '/auto-popravka',
    '/proksi',
    '/mobilna-mreza',
    '/spaja-univerzalni-prompt',
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
