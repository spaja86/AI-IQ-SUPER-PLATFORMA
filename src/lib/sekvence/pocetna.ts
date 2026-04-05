import type { Sekvenca } from '@/lib/types';
import { platforme, getUkupniProgres } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';

const stats = getStatistike();
const dijagnostika = runDiagnostics();

export const pocetnaSekvence: Sekvenca[] = [
  {
    id: 'pocetna-hero',
    tip: 'hero',
    naslov: 'Kompanija SPAJA',
    podnaslov: 'AI IQ SUPER PLATFORMA — Digitalna Industrija sa SpajaPro Prompt Engine-om',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: `Kompanija SPAJA upravlja sa ${stats.ukupnoProizvoda} IT proizvoda na ${stats.ukupnoPlatformi} platformi. SpajaPro engine (v6-15) sa ${stats.ukupnoPromptova} Prompt-ova pokreće ceo ekosistem. Zdravlje: ${dijagnostika.zdravlje}%. Autofinish ×${stats.autofinishBroj}.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Prompt', href: '/prompt', stil: 'sekundarno' },
        { tekst: 'SpajaPro', href: '/spaja-pro', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pocetna-statistika',
    tip: 'statistika',
    naslov: '📊 Ekosistem u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Aktivne', vrednost: stats.aktivnihPlatformi, ikona: '✅' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `v6-15`, ikona: '🌟' },
        { naziv: 'Dimenzije', vrednost: stats.ukupnoDimenzija, ikona: '🌀' },
        { naziv: 'Stranice', vrednost: stats.ukupnoStranica, ikona: '📄' },
        { naziv: 'Rute', vrednost: stats.ukupnoRuta, ikona: '🗺️' },
        { naziv: 'Kompanije', vrednost: stats.ukupnoKompanija, ikona: '🏛️' },
        { naziv: 'Organizacije', vrednost: stats.ukupnoOrganizacija, ikona: '🏢' },
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
      ],
    },
  },
  {
    id: 'pocetna-progres',
    tip: 'progres',
    naslov: '🚀 Ukupni progres ekosistema',
    redosled: 3,
    podaci: {
      progres: getUkupniProgres(),
      poruka: 'Kada svi projekti dostignu 100%, sve se plasira na Vercel. SpajaPro Prompt engine pokreće automatizaciju.',
    },
  },
  {
    id: 'pocetna-platforme',
    tip: 'kartice',
    naslov: '🌐 Platforme u ekosistemu',
    podnaslov: `Pregled prvih 6 od ${stats.ukupnoPlatformi} platformi — sve sa SpajaPro Prompt integracijom`,
    redosled: 4,
    podaci: {
      kartice: platforme.slice(0, 6).map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        progres: p.progres,
        oznake: p.tehnologije,
        href: '/platforme',
      })),
    },
  },
  {
    id: 'pocetna-proizvodi',
    tip: 'kartice',
    naslov: '⚡ IT Proizvodi Kompanije SPAJA',
    podnaslov: `Pregled prvih 4 od ${stats.ukupnoProizvoda} proizvoda sa Prompt podrškom`,
    redosled: 5,
    podaci: {
      kartice: itProizvodi.slice(0, 4).map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: p.funkcije,
        href: '/it-proizvodi',
      })),
    },
  },
  {
    id: 'pocetna-baner',
    tip: 'baner',
    naslov: 'SpajaPro Prompt Engine — Svuda u ekosistemu',
    redosled: 6,
    podaci: {
      bedz: '🌟 SpajaPro',
      opis: `SpajaPro 6-15 engine zamenjuje ChatGPT i donosi Prompt u svaki aspekt platforme. ${stats.ukupnoOmegaPersona} OMEGA AI persona × Prompt = autonomni ekosistem. Autofinish ×${stats.autofinishBroj} završen.`,
      dugme: { tekst: 'Istraži SpajaPro', href: '/spaja-pro' },
    },
  },
  {
    id: 'pocetna-cta',
    tip: 'cta',
    naslov: '🚀 Vercel Produkcija sa SpajaPro Prompt-om',
    redosled: 7,
    podaci: {
      opis: `AI IQ SUPER PLATFORMA v${stats.verzija} je deploirana na Vercel sa SpajaPro Prompt engine-om. ${dijagnostika.ukupnoProvera} dijagnostika, zdravlje ${dijagnostika.zdravlje}%.`,
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `${stats.spajaProVerzija} verzija`, ikona: '🌟' },
        { naziv: 'Zdravlje', vrednost: `${dijagnostika.zdravlje}%`, ikona: '💚' },
        { naziv: 'Dijagnostike', vrednost: dijagnostika.ukupnoProvera, ikona: '🔍' },
      ],
      dugmad: [
        { tekst: 'Deploy Status', href: '/deploy' },
        { tekst: 'Auto-Popravka', href: '/auto-popravka', stil: 'sekundarno' },
      ],
    },
  },
];
