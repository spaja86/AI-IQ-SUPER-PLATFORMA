import type { Sekvenca } from '@/lib/types';

export const digitalniTelevizorSekvence: Sekvenca[] = [
  {
    id: 'digitalni-televizor-hero',
    tip: 'hero',
    naslov: '📺 Digitalni Televizor',
    podnaslov: 'SPAJA Digitalni Televizor — Streaming kanali u najvišem kvalitetu',
    ikona: '📺',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Digitalni Televizor platforma pruza pristup premium kanalima uzivo sa podrskom za rezolucije do 8K, naprednim programskim vodicem i 99.9% garancijom dostupnosti.',
      dugmad: [
        { tekst: 'Pregledaj kanale', href: '/digitalni-televizor' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalni-televizor-statistika',
    tip: 'statistika',
    naslov: '📊 TV platforma u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Kanala', vrednost: '12', ikona: '📺' },
        { naziv: 'Programa', vrednost: '8', ikona: '📋' },
        { naziv: 'Max rezolucija', vrednost: '8K', ikona: '🖥️' },
        { naziv: 'Uptime', vrednost: '99.9%', ikona: '✅' },
      ],
    },
  },
  {
    id: 'digitalni-televizor-kartice',
    tip: 'kartice',
    naslov: '📺 Top kanali',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'SPAJA News', opis: 'Najnovije vesti i analize 24/7', ikona: '📰', oznake: ['Uzivo', '4K', 'Informativni'] },
        { naslov: 'SPAJA Sport', opis: 'Sportski prenosi i highlights', ikona: '⚽', oznake: ['Uzivo', '8K', 'Sport'] },
        { naslov: 'SPAJA Film', opis: 'Premium filmovi i serije', ikona: '🎬', oznake: ['HD', '4K', 'Zabava'] },
        { naslov: 'SPAJA Edukacija', opis: 'Obrazovni sadrzaj i kursevi', ikona: '🎓', oznake: ['1080p', 'Edukacija', 'AI'] },
      ],
    },
  },
  {
    id: 'digitalni-televizor-tekst',
    tip: 'tekst',
    naslov: 'O TV platformi',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA Digitalni Televizor je moderna streaming platforma koja kombinuje tradicionalnu televiziju sa naprednom AI tehnologijom. Uzivajte u premium sadrzaju u rezolucijama do 8K sa garantovanim uptime-om od 99.9%.',
      istaknuteStavke: [
        'Podrska za rezolucije od 720p do 8K',
        'Programski vodic sa AI preporukama',
        'Snimanje i gledanje repriza',
        '99.9% garantovana dostupnost servisa',
      ],
    },
  },
];
