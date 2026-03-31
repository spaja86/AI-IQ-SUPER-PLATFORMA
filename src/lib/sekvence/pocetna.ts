import type { Sekvenca } from '@/lib/types';
import { platforme, getUkupniProgres } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const pocetnaSekvence: Sekvenca[] = [
  {
    id: 'pocetna-hero',
    tip: 'hero',
    naslov: 'Kompanija SPAJA',
    podnaslov: 'AI IQ SUPER PLATFORMA — Digitalna Industrija sa SpajaPro Prompt Engine-om',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: `Kompanija SPAJA upravlja sa ${stats.ukupnoProizvoda} IT proizvoda na ${stats.ukupnoPlatformi} platformi. SpajaPro engine (v6-15) sa ${stats.ukupnoPromptova} Prompt-ova pokreće ceo ekosistem.`,
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
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `v6-15`, ikona: '🌟' },
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
    podnaslov: 'Pregled prvih 6 platformi — sve sa SpajaPro Prompt integracijom',
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
    podnaslov: 'Pregled prvih 4 proizvoda sa Prompt podrškom',
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
      opis: 'SpajaPro 6-15 engine zamenjuje ChatGPT i donosi Prompt u svaki aspekt platforme. 21 OMEGA AI persona × Prompt = autonomni ekosistem.',
      dugme: { tekst: 'Istrazi SpajaPro', href: '/spaja-pro' },
    },
  },
  {
    id: 'pocetna-cta',
    tip: 'cta',
    naslov: '🚀 Vercel Produkcija sa SpajaPro Prompt-om',
    redosled: 7,
    podaci: {
      opis: 'AI IQ SUPER PLATFORMA je deploirana na Vercel sa SpajaPro Prompt engine-om.',
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Prompt-ovi', vrednost: stats.ukupnoPromptova, ikona: '📝' },
        { naziv: 'SpajaPro', vrednost: `${stats.spajaProVerzija} verzija`, ikona: '🌟' },
      ],
      dugmad: [
        { tekst: 'Deploy Status', href: '/deploy' },
        { tekst: 'Prompt', href: '/prompt', stil: 'sekundarno' },
      ],
    },
  },
];
