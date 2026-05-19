import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const highPriority = ['/', '/dashboard', '/ekosistem'];
  const mediumHighPriority = ['/platforme', '/omega-ai', '/spaja-pro', '/igrice', '/gejming-industrija', '/it-proizvodi'];

  // Dynamic lastModified dates per page category
  const recentlyUpdated = new Date('2026-04-20');
  const corePages = new Date('2026-04-19');
  const standardPages = new Date('2026-04-14');

  const recentRoutes = ['/', '/dashboard', '/ai-iq-world-bank', '/omega-projekat-plasiranje', '/omega-projekat-zvanicno-otvaranje', '/oktavne-eksponencijalne-funkcije', '/blog', '/glavni-endzin', '/mozak-logika', '/glavni-sistem-nabavka', '/reklame-i-partnerstva', '/dnevna-raspodela-zarade', '/spaja-ultra-repl', '/digitalna-platforma', '/login', '/zaboravljena-lozinka', '/oktavni-gpu-ram', '/spaja-digitalni-kompjuter', '/digitalni-prozor', '/eksponat-glavnog-jezgra', '/digitalni-vorteks', '/generator-za-poslovne-racune', '/validator-poslovnih-racuna', '/licencni-budzet-srbija', '/digitalna-industrija-pib-mb', '/digitalna-industrija-sifra-delatnosti', '/digitalna-industrija-regulatorni-rokovi', '/digitalna-industrija-izvoz-faktura', '/digitalna-industrija-devizni-prilivi', '/digitalna-industrija-devizni-odlivi', '/digitalna-industrija-devizni-saldo', '/digitalna-industrija-kursna-lista', '/digitalna-industrija-kursne-razlike', '/digitalna-industrija-valutni-rizik', '/digitalna-industrija-hedzing', '/digitalna-industrija-kamatni-rizik', '/digitalna-industrija-kreditni-rizik', '/digitalna-industrija-likvidnosni-rizik', '/digitalna-industrija-operativni-rizik', '/bar-kod', '/digitalna-industrija-strateski-rizik', '/digitalna-industrija-pravni-rizik', '/digitalna-industrija-poreski-rizik', '/digitalna-industrija-compliance-rizik', '/digitalna-industrija-esg-rizik', '/digitalna-industrija-sajber-rizik', '/digitalna-industrija-pozicije'];
  const coreRoutes = ['/ekosistem', '/omega-ai', '/spaja-pro', '/industrija', '/platforme', '/pricing', '/it-proizvodi', '/igrice', '/gejming-industrija', '/omega-ai-suport', '/spaja-digitalni-brouvzer'];

  const routes = [
    '/',
    '/dashboard',
    '/industrija',
    '/platforme',
    '/it-proizvodi',
    '/banka',
    '/ai-iq-world-bank',
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
       '/licencni-budzet-srbija',
       '/digitalna-industrija-pib-mb',
       '/digitalna-industrija-sifra-delatnosti',
       '/digitalna-industrija-regulatorni-rokovi',
        '/digitalna-industrija-izvoz-faktura',
        '/digitalna-industrija-devizni-prilivi',
        '/digitalna-industrija-devizni-odlivi',
        '/digitalna-industrija-devizni-saldo',
         '/digitalna-industrija-kursna-lista',
         '/digitalna-industrija-kursne-razlike',
         '/digitalna-industrija-valutni-rizik',
         '/digitalna-industrija-hedzing',
         '/digitalna-industrija-kamatni-rizik',
         '/api/digitalna-industrija-hedzing',
         '/api/digitalna-industrija-kamatni-rizik',
         '/digitalna-industrija-kreditni-rizik',
         '/api/digitalna-industrija-kreditni-rizik',
          '/digitalna-industrija-likvidnosni-rizik',
          '/api/digitalna-industrija-likvidnosni-rizik',
          '/digitalna-industrija-operativni-rizik',
          '/api/digitalna-industrija-operativni-rizik',
          '/bar-kod',
          '/api/bar-kod',
          '/digitalna-industrija-strateski-rizik',
          '/api/digitalna-industrija-strateski-rizik',
          '/digitalna-industrija-pravni-rizik',
          '/api/digitalna-industrija-pravni-rizik',
          '/digitalna-industrija-poreski-rizik',
          '/api/digitalna-industrija-poreski-rizik',
          '/digitalna-industrija-compliance-rizik',
          '/api/digitalna-industrija-compliance-rizik',
          '/digitalna-industrija-esg-rizik',
          '/api/digitalna-industrija-esg-rizik',
          '/digitalna-industrija-sajber-rizik',
          '/api/digitalna-industrija-sajber-rizik',
          '/digitalna-industrija-pozicije',
          '/api/digitalna-industrija-pozicije',
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
