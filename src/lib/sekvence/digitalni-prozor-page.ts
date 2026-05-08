import type { Sekvenca } from '@/lib/types';
import {
  spajaDigitalniProzor,
  kalkulisiEksponencijalniOdraz,
} from '@/lib/digitalni-prozor';
import { KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB } from '@/lib/spaja-digitalni-kompjuter';

export const digitalniProzorSekvence: Sekvenca[] = [
  {
    id: 'digitalni-prozor-hero',
    tip: 'hero',
    naslov: '🪟 DIGITALNI PROZOR — Aplikaciona Platforma',
    podnaslov: 'Startup shell za pokretanje igrica iz DIGITALNI BROUVZER-a',
    ikona: '🪟',
    redosled: 1,
    podaci: {
      opis: `${spajaDigitalniProzor.opis} Aktivnih kanala: ${spajaDigitalniProzor.statistika.aktivnihKanala}.`,
      dugmad: [
        { tekst: 'Pokreni Igrice', href: '/igrice' },
        { tekst: 'DIGITALNI BROUVZER', href: '/spaja-digitalni-brouvzer', stil: 'sekundarno' },
        { tekst: 'DIGITALNI KOMPIJUTER', href: '/spaja-digitalni-kompjuter', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalni-prozor-tekst',
    tip: 'tekst',
    naslov: 'Šta je DIGITALNI PROZOR?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'DIGITALNI PROZOR je startup aplikaciona platforma koja se aktivira pre pokretanja igrice. ' +
        'Povezan je sa DIGITALNI BROUVZER-om i DIGITALNI KOMPIJUTER-om: BROUVZER prosleđuje kontekst sesije, ' +
        'a KOMPIJUTER stimulacionim kanalima ubrizgava snagu za render i gameplay. ' +
        'Prozor formira intermedijarni sloj između taba i Gaming Endžina.',
      istaknuteStavke: [
        `BROUVZER link: ${spajaDigitalniProzor.brouvzerLink}`,
        `GPU: ${KOMPJUTER_GPU_JEZGRA.toLocaleString('sr-RS')} jezgara`,
        `RAM: ${KOMPJUTER_RAM_GB.toLocaleString('sr-RS')} GB`,
        `Startup režim: ${spajaDigitalniProzor.rezim}`,
      ],
    },
  },
  {
    id: 'digitalni-prozor-statistika',
    tip: 'statistika',
    naslov: '📊 Snaga PROZOR platforme',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Aktivne igrice', vrednost: spajaDigitalniProzor.statistika.aktivnihIgrica, ikona: '🎮' },
        { naziv: 'Aktivni kanali', vrednost: spajaDigitalniProzor.statistika.aktivnihKanala, ikona: '📡' },
        { naziv: 'Protok (Gbps)', vrednost: spajaDigitalniProzor.statistika.protokGbps, ikona: '⚡' },
        { naziv: 'Snaga index', vrednost: spajaDigitalniProzor.statistika.snagaProzora, ikona: '💥' },
      ],
    },
  },
  {
    id: 'digitalni-prozor-baner-kanali',
    tip: 'baner',
    naslov: '🔗 KOMPIJUTER → PROZOR → IGRICA',
    redosled: 4,
    podaci: {
      bedz: 'Stimulacioni kanali',
      opis:
        'DIGITALNI KOMPIJUTER protokuje stimulacionim kanalima eksponencijalni odraz retkainovanog suplementa ekstremnog kvaliteta. ' +
        `Odraz snage (5760D): ${kalkulisiEksponencijalniOdraz('5760D')}.`,
      dugme: { tekst: 'Pokreni u DIGITALNI PROZOR', href: '/spaja-digitalni-brouvzer' },
    },
  },
  {
    id: 'digitalni-prozor-kartice-platforme',
    tip: 'kartice',
    naslov: '🧩 Aplikacione platforme unutar PROZORA',
    redosled: 5,
    podaci: {
      kartice: spajaDigitalniProzor.aplikacionePlatforme.map((platforma) => ({
        naslov: `${platforma.ikona} ${platforma.naziv}`,
        opis: platforma.opis,
        ikona: platforma.ikona,
        href: platforma.href,
        oznake: platforma.kategorije,
      })),
    },
  },
  {
    id: 'digitalni-prozor-cta',
    tip: 'cta',
    naslov: '🚀 Pokreni DIGITALNI BROUVZER sa PROZOR slojem',
    redosled: 6,
    podaci: {
      opis: 'Izaberi igricu, aktiviraj dimenziju i pokreni startup shell kroz DIGITALNI PROZOR.',
      dugme: {
        tekst: 'Idi na DIGITALNI BROUVZER',
        href: '/spaja-digitalni-brouvzer',
      },
    },
  },
];

