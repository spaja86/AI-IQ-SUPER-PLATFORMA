import type { Sekvenca } from '@/lib/types';
import { runDiagnostics } from '@/lib/auto-repair';

const dijagnostika = runDiagnostics();

export const autoPopravkaSekvence: Sekvenca[] = [
  {
    id: 'auto-hero',
    tip: 'hero',
    naslov: '🔧 Auto-Popravka',
    podnaslov: 'Sistem za automatsku dijagnostiku i popravku platforme',
    ikona: '🔧',
    redosled: 1,
    podaci: {
      opis: `Auto-Popravka je samoiscelujući sistem koji automatski detektuje probleme, dijagnostikuje uzroke i primenjuje popravke. Trenutno: ${dijagnostika.ukupnoProvera} provera, zdravlje ${dijagnostika.zdravlje}%.`,
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
      sadrzaj: `Sistem Auto-Popravka kontinuirano nadgleda zdravlje platforme kroz ${dijagnostika.ukupnoProvera} dijagnostičkih provera. Kada detektuje problem, automatski pokreće odgovarajuću popravku ili eskalira OMEGA AI personama.`,
      istaknuteStavke: [
        `${dijagnostika.ukupnoProvera} automatskih dijagnostičkih provera (platforme, proizvodi, igrice, OMEGA AI, SpajaPro, prompt)`,
        'Automatsko čišćenje keša i regeneracija tipova',
        'CSP, HSTS, Permissions-Policy provera',
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
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Provere', vrednost: dijagnostika.ukupnoProvera, ikona: '🔍' },
        { naziv: 'Uspešnih', vrednost: dijagnostika.uspesnih, ikona: '✅' },
        { naziv: 'Upozorenja', vrednost: dijagnostika.upozorenja, ikona: '⚠️' },
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
      progres: dijagnostika.zdravlje,
      poruka: dijagnostika.zdravlje === 100
        ? 'Sve dijagnostičke provere prolaze. Sistem je zdrav.'
        : `Zdravlje: ${dijagnostika.zdravlje}%. ${dijagnostika.upozorenja} upozorenja, ${dijagnostika.gresaka} grešaka.`,
    },
  },
  {
    id: 'auto-tabela',
    tip: 'tabela',
    naslov: '📋 Dijagnostičke provere',
    redosled: 5,
    podaci: {
      zaglavlje: ['Provera', 'Status', 'Poruka'],
      redovi: dijagnostika.provere.map((p) => [
        p.naziv,
        p.status === 'ok' ? '✅ OK' : p.status === 'warning' ? '⚠️ Upozorenje' : '❌ Greška',
        p.poruka,
      ]),
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
        { naziv: 'GET', vrednost: '/api/health', ikona: '💚' },
      ],
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
];
