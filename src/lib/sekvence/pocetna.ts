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
    podnaslov: 'AI IQ SUPER PLATFORMA — Digitalna Industrija',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: `Kompanija SPAJA upravlja sa ${stats.ukupnoProizvoda} IT proizvoda na ${stats.ukupnoPlatformi} platformi. Centralno mesto za nadzor i orkestraciju celokupnog digitalnog ekosistema.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
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
        { naziv: 'Ukupni progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
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
      poruka: 'Kada svi projekti dostignu 100%, sve se plasira na Vercel.',
    },
  },
  {
    id: 'pocetna-platforme',
    tip: 'kartice',
    naslov: '🌐 Platforme u ekosistemu',
    podnaslov: 'Pregled prvih 6 platformi',
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
    podnaslov: 'Pregled prvih 4 proizvoda',
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
    naslov: 'SPAJA Ekosistem Hub',
    redosled: 6,
    podaci: {
      bedz: '🔗 Ekosistem',
      opis: 'Centralizovani hub za upravljanje svim platformama, AI agentima i IT proizvodima Kompanije SPAJA.',
      dugme: { tekst: 'Istrazi Ekosistem', href: '/ekosistem' },
    },
  },
  {
    id: 'pocetna-cta',
    tip: 'cta',
    naslov: '🚀 Vercel Produkcija',
    redosled: 7,
    podaci: {
      opis: 'AI IQ SUPER PLATFORMA je deploirana na Vercel produkcijsku infrastrukturu.',
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
      ],
      dugmad: [
        { tekst: 'Deploy Status', href: '/deploy' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
