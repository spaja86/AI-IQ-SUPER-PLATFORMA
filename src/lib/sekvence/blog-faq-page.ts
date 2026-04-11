import type { Sekvenca } from '@/lib/types';

export const blogFaqSekvence: Sekvenca[] = [
  {
    id: 'blog-faq-hero',
    tip: 'hero',
    naslov: '📝 Blog & FAQ',
    podnaslov: 'SPAJA Blog & FAQ — Clanci, vodiči i odgovori na pitanja',
    ikona: '📝',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Blog & FAQ platforma sadrzi strucne clanke, tehnicke vodice i sveobuhvatan FAQ odeljak koji pokriva sva pitanja o platformi i njenim mogucnostima.',
      dugmad: [
        { tekst: 'Citaj blog', href: '/blog' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'blog-faq-statistika',
    tip: 'statistika',
    naslov: '📊 Blog & FAQ u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Clanaka', vrednost: '8', ikona: '📝' },
        { naziv: 'FAQ pitanja', vrednost: '10', ikona: '❓' },
        { naziv: 'Citanja', vrednost: '15K+', ikona: '👁️' },
        { naziv: 'Kategorija', vrednost: '4', ikona: '📂' },
      ],
    },
  },
  {
    id: 'blog-faq-kartice',
    tip: 'kartice',
    naslov: '📝 Top clanci',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'AI u produkciji', opis: 'Kako koristiti AI za optimizaciju produkcijskog okruzenja', ikona: '🤖', oznake: ['AI', 'Produkcija', 'Vodic'] },
        { naslov: 'SPAJA arhitektura', opis: 'Detaljan pregled arhitekture SPAJA platforme', ikona: '🏗️', oznake: ['Arhitektura', 'Tehnicki', 'Napredno'] },
        { naslov: 'Pocetni vodic', opis: 'Korak-po-korak vodic za nove korisnike', ikona: '📖', oznake: ['Pocetnici', 'Vodic', 'Tutorial'] },
        { naslov: 'API integracija', opis: 'Kako integrisati SPAJA API u vas projekat', ikona: '🔌', oznake: ['API', 'Integracija', 'Developers'] },
      ],
    },
  },
  {
    id: 'blog-faq-tekst',
    tip: 'tekst',
    naslov: 'O sadrzaju i content marketingu',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA Blog & FAQ platforma je centralno mesto za sve informacije o SPAJA ekosistemu. Redovno objavljujemo strucne clanke, tehnicke vodice i odgovore na najcesca pitanja korisnika. Sadrzaj pokriva teme od osnova platforme do naprednih tehnickih integracija.',
      istaknuteStavke: [
        'Strucni clanci o AI i tehnologijama',
        'Tehnicke vodice za developere',
        'Sveobuhvatan FAQ sa 10+ odgovora',
        'Redovno azuriran sadrzaj sa najnovijim informacijama',
      ],
    },
  },
];
