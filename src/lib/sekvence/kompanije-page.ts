import type { Sekvenca } from '@/lib/types';
import { companies, getActiveCompanies, getSubsidiaries } from '@/lib/companies';

const active = getActiveCompanies();
const subsidiaries = getSubsidiaries();

export const kompanijeSekvence: Sekvenca[] = [
  {
    id: 'kompanije-hero',
    tip: 'hero',
    naslov: '🏛️ Kompanije',
    podnaslov: `${companies.length} kompanija u ekosistemu Digitalne Industrije`,
    ikona: '🏛️',
    redosled: 1,
    podaci: {
      opis: `Korporativna struktura sa ${companies.length} kompanija — ${active.length} aktivnih, ${subsidiaries.length} subsidiary. Matična kompanija SPAJA upravlja celim ekosistemom.`,
      dugmad: [
        { tekst: 'Organizacije', href: '/organizacije' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'kompanije-statistika',
    tip: 'statistika',
    naslov: '📊 Kompanije u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno', vrednost: companies.length, ikona: '🏛️' },
        { naziv: 'Aktivnih', vrednost: active.length, ikona: '✅' },
        { naziv: 'Subsidiary', vrednost: subsidiaries.length, ikona: '🏢' },
        { naziv: 'Tipova', vrednost: [...new Set(companies.map((c) => c.type))].length, ikona: '📋' },
      ],
    },
  },
  {
    id: 'kompanije-kartice',
    tip: 'kartice',
    naslov: '🏢 Sve kompanije',
    redosled: 3,
    podaci: {
      kartice: companies.map((c) => ({
        naslov: c.name,
        opis: c.description,
        ikona: c.icon,
        oznake: [c.type, c.industry, c.status],
      })),
    },
  },
];
