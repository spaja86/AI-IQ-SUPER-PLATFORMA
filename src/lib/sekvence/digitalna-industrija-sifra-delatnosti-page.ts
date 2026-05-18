import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaSifraDelatnosti } from '@/lib/digitalna-industrija-sifra-delatnosti';

const r = buildDigitalnaIndustrijaSifraDelatnosti('system');

export const digitalnaIndustrijaSifraDelatnostiSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-sifra-delatnosti-hero',
    tip: 'hero',
    naslov: '🏷️ Digitalna Industrija — Šifra Delatnosti',
    podnaslov: 'Centralni pregled šifara delatnosti za ključne entitete',
    ikona: '🏷️',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno delatnosti: ${r.kpi.ukupnoDelatnosti}.`,
      dugmad: [
        { tekst: 'PIB/MB registar', href: '/digitalna-industrija-pib-mb' },
        {
          tekst: 'Licencni Budžet Srbija',
          href: '/licencni-budzet-srbija',
          stil: 'sekundarno',
        },
      ],
    },
  },
  {
    id: 'digitalna-industrija-sifra-delatnosti-kpi',
    tip: 'statistika',
    naslov: '📊 KPI šifara delatnosti',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno delatnosti', vrednost: r.kpi.ukupnoDelatnosti, ikona: '📋' },
        { naziv: 'Primarne', vrednost: r.kpi.primarnih, ikona: '✅' },
        { naziv: 'Sekundarne', vrednost: r.kpi.sekundarnih, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-sifra-delatnosti-tabela',
    tip: 'tabela',
    naslov: '🧾 Registar šifara delatnosti',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Šifra', 'Delatnost', 'Oblast', 'Status', 'Opis'],
      redovi: r.delatnosti.map((stavka) => [
        stavka.entitet,
        stavka.sifraDelatnosti,
        stavka.nazivDelatnosti,
        stavka.oblast,
        stavka.status,
        stavka.opis,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-sifra-delatnosti-cta',
    tip: 'cta',
    naslov: '🚀 Operativni pristup registru',
    redosled: 4,
    podaci: {
      opis:
        'Registar šifara delatnosti omogućava centralizovanu proveru poslovnih klasifikacija za compliance i operativu.',
      dugmad: [
        { tekst: 'Šifre delatnosti API', href: '/api/digitalna-industrija-sifra-delatnosti' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
