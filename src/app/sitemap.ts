import type { MetadataRoute } from 'next';

const BASE_URL = 'https://ai-iq-super-platforma.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/dashboard',
    '/banka',
    '/menjacnica',
    '/kompanija',
    '/ai-platforma',
    '/organizacija',
    '/omega-ai',
    '/ekosistem',
    '/deploy',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
