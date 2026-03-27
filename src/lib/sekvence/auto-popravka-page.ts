import type { Sekvenca } from '@/lib/types';

export const autoPopravkaSekvence: Sekvenca[] = [
  {
    id: 'auto-hero',
    tip: 'hero',
    naslov: '🔧 Auto-Popravka',
    podnaslov: 'Sistem za automatsku dijagnostiku i popravku platforme',
    ikona: '🔧',
    redosled: 1,
    podaci: {
      opis: 'Auto-Popravka je samoiscelujuci sistem koji automatski detektuje probleme, dijagnostikuje uzroke i primenjuje popravke bez manuelne intervencije.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'auto-tekst',
    tip: 'tekst',
    naslov: 'Kako radi Auto-Popravka?',
    redosled: 2,
    podaci: {
      sadrzaj: 'Sistem Auto-Popravka kontinuirano nadgleda zdravlje platforme kroz 11 dijagnostickih provera. Kada detektuje problem, automatski pokrece odgovarajucu popravku ili eskalira OMEGA AI personama.',
      istaknuteStavke: [
        '11 automatskih dijagnostickih provera',
        'Automatsko ciscenje kesha i regeneracija tipova',
        'Eskalacija ka OMEGA AI personama za kompleksne probleme',
        'Istorija svih popravki za audit i analizu',
      ],
    },
  },
  {
    id: 'auto-statistika',
    tip: 'statistika',
    naslov: '📊 Zdravlje sistema',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Zdravlje', vrednost: '100%', ikona: '💚' },
        { naziv: 'Provere', vrednost: 11, ikona: '🔍' },
        { naziv: 'Popravke', vrednost: 3, ikona: '🔧' },
        { naziv: 'Nadogradnje', vrednost: 0, ikona: '⬆️' },
      ],
    },
  },
  {
    id: 'auto-progres',
    tip: 'progres',
    naslov: '💚 Zdravlje platforme',
    redosled: 4,
    podaci: {
      progres: 100,
      poruka: 'Sve dijagnosticke provere prolaze. Sistem je zdrav.',
    },
  },
  {
    id: 'auto-tabela',
    tip: 'tabela',
    naslov: '📋 Dijagnosticke provere',
    redosled: 5,
    podaci: {
      zaglavlje: ['Provera', 'Status', 'Poruka'],
      redovi: [
        ['Next.js Build', '✅ OK', 'Build uspesno zavrsen'],
        ['TypeScript', '✅ OK', '0 gresaka u tipovima'],
        ['ESLint', '✅ OK', '0 upozorenja'],
        ['Zavisnosti', '✅ OK', 'Sve zavisnosti azurne'],
        ['Security Headers', '✅ OK', 'CSP, HSTS konfigurisani'],
        ['API Health', '✅ OK', '/api/health odgovara'],
        ['API Status', '✅ OK', '/api/status odgovara'],
        ['Sitemap', '✅ OK', 'sitemap.xml generisan'],
        ['Robots', '✅ OK', 'robots.txt konfigurisan'],
        ['Vercel Config', '✅ OK', 'vercel.json validan'],
        ['Sekvence Integritet', '✅ OK', 'Sve sekvence validne'],
      ],
    },
  },
  {
    id: 'auto-cta',
    tip: 'cta',
    naslov: '🚀 Auto-Popravka API',
    redosled: 6,
    podaci: {
      opis: 'Koristite API za programski pristup dijagnostici i popravkama.',
      stavke: [
        { naziv: 'GET', vrednost: '/api/auto-repair', ikona: '📡' },
        { naziv: 'POST', vrednost: '/api/auto-repair', ikona: '🔧' },
        { naziv: 'GET', vrednost: '/api/auto-repair/history', ikona: '📜' },
      ],
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
];
