import type { Sekvenca } from '@/lib/types';
import { platforme, getUkupniProgres } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';

const stats = getStatistike();
const dijagnostika = runDiagnostics();

export const dashboardSekvence: Sekvenca[] = [
  {
    id: 'dashboard-hero',
    tip: 'hero',
    naslov: '📊 Dashboard',
    podnaslov: 'Kontrolna tabla ekosistema — AI IQ SUPER PLATFORMA v6.6.0',
    ikona: '📊',
    redosled: 1,
    podaci: {
      opis: `Centralni pregled stanja svih ${stats.ukupnoPlatformi} platformi, ${stats.ukupnoProizvoda} IT proizvoda, ${stats.ukupnoIgrica} igrica i ${stats.ukupnoOmegaPersona} OMEGA AI persona. Zdravlje sistema: ${dijagnostika.zdravlje}%.`,
      dugmad: [
        { tekst: 'Auto-Popravka', href: '/auto-popravka' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'dashboard-zdravlje',
    tip: 'statistika',
    naslov: '💚 Zdravlje sistema',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Provere', vrednost: dijagnostika.ukupnoProvera, ikona: '🔍' },
        { naziv: 'Uspešnih', vrednost: dijagnostika.uspesnih, ikona: '✅' },
        { naziv: 'Upozorenja', vrednost: dijagnostika.upozorenja, ikona: '⚠️' },
        { naziv: 'Autofinish', vrednost: stats.autofinishBroj, ikona: '🔄' },
        { naziv: 'Verzija', vrednost: stats.verzija, ikona: '📋' },
      ],
    },
  },
  {
    id: 'dashboard-progres',
    tip: 'progres',
    naslov: 'Ukupni progres',
    redosled: 3,
    podaci: { progres: getUkupniProgres(), poruka: `Progres svih ${stats.ukupnoPlatformi} platformi zajedno. SpajaPro engine pokreće automatizaciju.` },
  },
  {
    id: 'dashboard-statistika',
    tip: 'statistika',
    naslov: 'Pregled ekosistema',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Spremne', vrednost: stats.spremnihPlatformi, ikona: '✅' },
        { naziv: 'U razvoju', vrednost: stats.platformeURazvoju, ikona: '🔨' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'Kategorija', vrednost: stats.kategorijaIgrica, ikona: '📁' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'Dimenzije', vrednost: stats.ukupnoDimenzija, ikona: '🌀' },
        { naziv: 'Sajtovi', vrednost: stats.ukupnoSajtova, ikona: '🌍' },
        { naziv: 'Centrale', vrednost: stats.ukupnoMobilnihCentrala, ikona: '📱' },
        { naziv: 'Proksi Čvorovi', vrednost: stats.ukupnoProksiCvorova, ikona: '📡' },
        { naziv: 'Stranice', vrednost: stats.ukupnoStranica, ikona: '📄' },
        { naziv: 'Rute', vrednost: stats.ukupnoRuta, ikona: '🗺️' },
      ],
    },
  },
  {
    id: 'dashboard-platforme',
    tip: 'kartice',
    naslov: '🌐 Sve platforme',
    redosled: 5,
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
    redosled: 6,
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
    naslov: '✅ Vercel & Sistem Readiness',
    redosled: 7,
    podaci: {
      stavke: [
        { naslov: 'TypeScript Strict', opis: 'Sav kod je striktno tipiziran — 0 grešaka', ikona: '✅' },
        { naslov: 'Security Headers', opis: 'CSP, HSTS, X-Frame-Options, Permissions-Policy', ikona: '🛡️' },
        { naslov: 'SEO Optimized', opis: `Sitemap sa ${stats.ukupnoStranica} stranica, robots.txt, OG metadata`, ikona: '🔍' },
        { naslov: 'Edge Caching', opis: 'Statičke stranice sa optimizovanim build-om', ikona: '⚡' },
        { naslov: 'Responsive Design', opis: 'Mobile-first dizajn sa 26 navigacionih linkova', ikona: '📱' },
        { naslov: 'Auto-Popravka', opis: `${dijagnostika.ukupnoProvera} dijagnostičkih provera, zdravlje ${dijagnostika.zdravlje}%`, ikona: '🔧' },
        { naslov: 'OMEGA AI Evolucija', opis: 'Autonomna evolucija svakih 6 sati', ikona: '🧬' },
        { naslov: 'Autofinish ×9', opis: '9 kompletnih Autofinish ciklusa', ikona: '🔄' },
      ],
    },
  },
];
