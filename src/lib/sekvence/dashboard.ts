import type { Sekvenca } from '@/lib/types';
import { platforme, getUkupniProgres } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const dashboardSekvence: Sekvenca[] = [
  {
    id: 'dashboard-hero',
    tip: 'hero',
    naslov: '📊 Dashboard',
    podnaslov: 'Kontrolna tabla ekosistema',
    ikona: '📊',
    redosled: 1,
    podaci: { opis: 'Centralni pregled stanja svih platformi i IT proizvoda.' },
  },
  {
    id: 'dashboard-progres',
    tip: 'progres',
    naslov: 'Ukupni progres',
    redosled: 2,
    podaci: { progres: getUkupniProgres(), poruka: 'Progres svih platformi zajedno.' },
  },
  {
    id: 'dashboard-statistika',
    tip: 'statistika',
    naslov: 'Pregled statusa',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Spremne', vrednost: platforme.filter((p) => p.status === 'spremna').length, ikona: '✅' },
        { naziv: 'U razvoju', vrednost: platforme.filter((p) => p.status === 'razvoj').length, ikona: '🔨' },
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
      ],
    },
  },
  {
    id: 'dashboard-platforme',
    tip: 'kartice',
    naslov: '🌐 Sve platforme',
    redosled: 4,
    podaci: {
      kartice: platforme.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        progres: p.progres,
        oznake: [p.kategorija, p.status],
      })),
    },
  },
  {
    id: 'dashboard-proizvodi',
    tip: 'kartice',
    naslov: '⚡ IT Proizvodi',
    redosled: 5,
    podaci: {
      kartice: itProizvodi.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [p.kategorija, p.uticaj],
      })),
    },
  },
  {
    id: 'dashboard-lista',
    tip: 'lista',
    naslov: '✅ Vercel Readiness',
    redosled: 6,
    podaci: {
      stavke: [
        { naslov: 'TypeScript Strict', opis: 'Sav kod je striktno tipiziran', ikona: '✅' },
        { naslov: 'Security Headers', opis: 'CSP, HSTS, X-Frame-Options', ikona: '🛡️' },
        { naslov: 'SEO Optimized', opis: 'Sitemap, robots.txt, meta tags', ikona: '🔍' },
        { naslov: 'Edge Caching', opis: 'Staticke stranice sa ISR', ikona: '⚡' },
        { naslov: 'Responsive Design', opis: 'Mobile-first dizajn', ikona: '📱' },
      ],
    },
  },
];
