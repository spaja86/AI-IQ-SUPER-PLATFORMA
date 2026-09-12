import type { Sekvenca } from '@/lib/types';
import { getDiktorCommandCenter } from '@/lib/diktor-command-center';

const cc = getDiktorCommandCenter();

export const diktorCommandCenterSekvence: Sekvenca[] = [
  {
    id: 'diktor-brand',
    tip: 'slika',
    naslov: '🧠 Premium command-center template',
    podnaslov: 'DIKTOR / DURM / EKSICION / SUSTRAS / DEKORATOR',
    redosled: 0,
    podaci: {
      opis: cc.slogan,
      raspored: 'kolona',
      slike: [{ url: cc.heroSlika, alt: 'DIKTOR komandni centar — dark cyber glass vizual', sirina: 1600, visina: 900 }],
    },
  },
  {
    id: 'diktor-hero',
    tip: 'hero',
    naslov: 'DIKTOR Command Center',
    podnaslov: 'WOTERMELOW · DIGON · OKEN · DIKTAR',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'Futuristički poslovni komandni centar sa SPAJA identitetom, KPI signalima, partnerstvima, projektima, aktivnostima, obaveštenjima i jasnim CTA tokovima.',
      dugmad: [
        { tekst: 'Start Pretplate', href: '/start-pretplate' },
        { tekst: 'Go-Live Digitalna Industrija', href: '/go-live-digitalna-industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'diktor-kpi',
    tip: 'statistika',
    naslov: '📊 Komandni centar KPI',
    redosled: 2,
    podaci: {
      stavke: cc.kpi,
    },
  },
  {
    id: 'diktor-moduli',
    tip: 'kartice',
    naslov: '🧩 Četiri centralna modula',
    redosled: 3,
    podaci: {
      kartice: cc.moduli.map((modul) => ({
        naslov: modul.naziv,
        opis: modul.opis,
        ikona: modul.status === 'aktivan' ? '✅' : modul.status === 'pilot' ? '🟡' : '⏳',
        href: modul.cta.href,
        oznake: [...modul.identitet, modul.status],
      })),
    },
  },
  {
    id: 'diktor-layer-table',
    tip: 'tabela',
    naslov: '🪟 Template slojevi',
    redosled: 4,
    podaci: {
      zaglavlje: ['Sloj', 'Funkcija'],
      redovi: [
        ['DIKTOR', 'Centralna vizija, slogan i identitet komandnog centra'],
        ['DURM', 'Operativni raspored, aktivnosti i ritam rada'],
        ['EKSICION', 'KPI, analitika i live signal mreža'],
        ['SUSTRAS', 'Partnerstva, projekti i strateške veze'],
        ['DEKORATOR', 'Vizuelni polish, glass UI i reusable brand sloj'],
      ],
    },
  },
  {
    id: 'diktor-operations',
    tip: 'lista',
    naslov: '📣 Aktivnosti i obaveštenja',
    redosled: 5,
    podaci: {
      stavke: [...cc.aktivnosti, ...cc.obavestenja].map((opis) => ({
        ikona: '⚡',
        naslov: 'Signal',
        opis,
      })),
    },
  },
  {
    id: 'diktor-cta',
    tip: 'cta',
    naslov: '🚀 Reuse template za druge B2B površine',
    redosled: 6,
    podaci: {
      opis: 'Template ostaje generički: navigacija, KPI, partnerstva, projekti, analitika, aktivnosti i obaveštenja mogu se presložiti za druge komandne centre.',
      dugmad: [
        { tekst: 'EXTRIMLI Priče', href: '/extrimli-price' },
        { tekst: 'Editorial Mediji', href: '/editorial-mediji', stil: 'sekundarno' },
      ],
    },
  },
];
