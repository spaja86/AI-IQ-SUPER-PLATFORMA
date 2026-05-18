import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const highPriority = ['/', '/dashboard', '/ekosistem'];
  const mediumHighPriority = ['/platforme', '/omega-ai', '/spaja-pro', '/igrice', '/gejming-industrija', '/it-proizvodi'];

  // Dynamic lastModified dates per page category
  const recentlyUpdated = new Date('2026-04-20');
  const corePages = new Date('2026-04-19');
  const standardPages = new Date('2026-04-14');

  const recentRoutes = ['/', '/dashboard', '/omega-projekat-plasiranje', '/omega-projekat-zvanicno-otvaranje', '/oktavne-eksponencijalne-funkcije', '/blog', '/glavni-endzin', '/mozak-logika', '/glavni-sistem-nabavka', '/reklame-i-partnerstva', '/dnevna-raspodela-zarade', '/spaja-ultra-repl', '/digitalna-platforma', '/login', '/zaboravljena-lozinka', '/oktavni-gpu-ram', '/spaja-digitalni-kompjuter', '/digitalni-prozor', '/eksponat-glavnog-jezgra', '/digitalni-vorteks', '/generator-za-poslovne-racune', '/validator-poslovnih-racuna', '/ai-iq-world-bank-licencna-analiza'];
  const coreRoutes = ['/ekosistem', '/omega-ai', '/spaja-pro', '/industrija', '/platforme', '/pricing', '/it-proizvodi', '/igrice', '/gejming-industrija', '/omega-ai-suport', '/spaja-digitalni-brouvzer'];

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
    '/call-centar',
    '/igrice',
    '/gejming-industrija',
    '/dimenzije',
    '/proizvodi',
    '/spaja-generator-engine',
    '/spaja-digitalni-brouvzer',
    '/digitalni-prozor',
    '/io-openui-ao-laboratorija',
    '/spaja-render-medija',
    '/io-openui-ao-gaming-platforma',
    '/io-openui-ao-analitika',
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
     '/oktavni-gpu-ram',
     '/glavni-endzin',
     '/mozak-logika',
     '/glavni-sistem-nabavka',
      '/generator-za-poslovne-racune',
      '/validator-poslovnih-racuna',
      '/ai-iq-world-bank-licencna-analiza',
    '/reklame-i-partnerstva',
    '/dnevna-raspodela-zarade',
    '/spaja-ultra-repl',
    '/digitalna-platforma',
    '/registracija',
    '/security',
    '/login',
    '/zaboravljena-lozinka',
    '/eksponat-glavnog-jezgra',
    '/digitalni-vorteks',
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
      },
    },
  }));
}
