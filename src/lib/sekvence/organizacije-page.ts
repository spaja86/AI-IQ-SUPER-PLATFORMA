import type { Sekvenca } from '@/lib/types';
import { organizations, getActiveOrganizations } from '@/lib/organizations';

const active = getActiveOrganizations();

export const organizacijeSekvence: Sekvenca[] = [
  {
    id: 'organizacije-hero',
    tip: 'hero',
    naslov: '🏢 Organizacije',
    podnaslov: `${organizations.length} organizacionih jedinica u ekosistemu`,
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: `Organizaciona struktura Digitalne Industrije — ${organizations.length} jedinica, ${active.length} aktivnih. Hijerarhija od centrala do timova i laboratorija.`,
      dugmad: [
        { tekst: 'Kompanije', href: '/kompanije' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'organizacije-statistika',
    tip: 'statistika',
    naslov: '📊 Organizacije u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno', vrednost: organizations.length, ikona: '🏢' },
        { naziv: 'Aktivnih', vrednost: active.length, ikona: '✅' },
        { naziv: 'Tipova', vrednost: [...new Set(organizations.map((o) => o.type))].length, ikona: '📋' },
        { naziv: 'Root', vrednost: organizations.filter((o) => !o.parentId).length, ikona: '🌲' },
      ],
    },
  },
  {
    id: 'organizacije-kartice',
    tip: 'kartice',
    naslov: '🏗️ Sve organizacije',
    redosled: 3,
    podaci: {
      kartice: organizations.map((o) => ({
        naslov: o.name,
        opis: o.description,
        ikona: o.icon,
        oznake: [o.type, o.status, ...o.capabilities.slice(0, 2)],
      })),
    },
  },
];
