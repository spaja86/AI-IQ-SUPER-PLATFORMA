import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPibMb } from '@/lib/digitalna-industrija-pib-mb';

const r = buildDigitalnaIndustrijaPibMb('system');

export const digitalnaIndustrijaPibMbSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-pib-mb-hero',
    tip: 'hero',
    naslov: '🧾 Digitalna Industrija — PIB i M/B registar',
    podnaslov: 'Centralni registar identiteta + HITNA PROCEDURA za APR i Poresku upravu',
    ikona: '🧾',
    redosled: 1,
    podaci: {
      opis:
        'PIB i M/B za Digitalnu Industriju kao celinu i posebni PIB/M/B za sve entitete unutar ekosistema, uz status hitne procedure.',
      dugmad: [
        { tekst: 'API endpoint', href: '/api/digitalna-industrija-pib-mb' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-krovni',
    tip: 'statistika',
    naslov: '🏛️ Krovni identitet Digitalne Industrije',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Naziv', vrednost: r.digitalnaIndustrija.naziv, ikona: '🏛️' },
        { naziv: 'PIB', vrednost: r.digitalnaIndustrija.pib, ikona: '🧾' },
        { naziv: 'M/B', vrednost: r.digitalnaIndustrija.maticniBroj, ikona: '🏷️' },
        { naziv: 'Status', vrednost: 'HITNA PROCEDURA', ikona: '🚨' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-entiteti',
    tip: 'tabela',
    naslov: '🏢 Posebni PIB/M/B po entitetu',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Tip', 'PIB', 'M/B', 'Status'],
      redovi: r.entiteti.map((entitet) => [
        entitet.naziv,
        entitet.tip,
        entitet.pib,
        entitet.maticniBroj,
        'HITNA PROCEDURA',
      ]),
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-zahtevi',
    tip: 'tabela',
    naslov: '📨 Status zahteva — APR + Poreska uprava',
    redosled: 4,
    podaci: {
      zaglavlje: ['Entitet', 'Instanca', 'Tip zahteva', 'Prioritet', 'Status'],
      redovi: r.zahtevi.map((zahtev) => [
        zahtev.entitetNaziv,
        zahtev.instanca,
        zahtev.tip,
        zahtev.prioritet,
        'HITNA PROCEDURA',
      ]),
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-preporuke',
    tip: 'lista',
    naslov: '📌 Sledeći koraci',
    redosled: 5,
    podaci: {
      stavke: r.preporuke.map((preporuka) => ({ tekst: preporuka })),
    },
  },
];
