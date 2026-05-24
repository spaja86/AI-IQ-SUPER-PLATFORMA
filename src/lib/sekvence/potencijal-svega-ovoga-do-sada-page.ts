import type { Sekvenca } from '@/lib/types';
import {
  buildPotencijalSvegaOvogaDoSada,
  type PotencijalBloker,
  type PotencijalTrendDirection,
} from '@/lib/potencijal-svega-ovoga-do-sada';
import { KOMPANIJA, AUTOFINISH_COUNT, TOTAL_API_ROUTES } from '@/lib/constants';

const potencijal = buildPotencijalSvegaOvogaDoSada();
const domenNazivi: Record<string, string> = {
  ekosistem: '🌐 Ekosistem',
  infrastruktura: '🏗️ Infrastruktura',
  finansije: '💰 Finansije',
  bezbednost: '🔒 Bezbednost',
  operativa: '⚙️ Operativa',
  autofinish: '♻️ Autofinish',
  aiProizvod: '🧠 AI/Proizvod',
};

function trendIkona(direction: PotencijalTrendDirection): string {
  switch (direction) {
    case 'up':
      return '🟢';
    case 'down':
      return '🔴';
    default:
      return '🟡';
  }
}

function blokerIkona(klasa: PotencijalBloker['klasa'], prioritet: PotencijalBloker['prioritet']): string {
  if (klasa === 'blocking') return '🚨';
  if (prioritet === 'visok') return '⚠️';
  return 'ℹ️';
}

function formatPreviousScore(score: number | null): string {
  return score === null ? 'N/A' : `${score}%`;
}

export const potencijalSvegaOvogaDoSadaSekvence: Sekvenca[] = [
  {
    id: 'potencijal-svega-hero',
    tip: 'hero',
    naslov: '🧭 POTENCIJAL SVEGA OVOGA DO SADA',
    podnaslov: `${KOMPANIJA} — ostvareno ${potencijal.ostvarenoDoSada}% • potencijal ${potencijal.ukupniPotencijal}%`,
    ikona: '🧭',
    redosled: 1,
    podaci: {
      opis: `Ova agregacija odvaja trenutno stanje od potencijala posle sledećih koraka. Najbliži rast: +${potencijal.najbliziRast}% uz ${potencijal.blokiranoUkupno} aktivna blokera. Contract: ${potencijal.meta.contractVersion}, model: ${potencijal.meta.modelVersion}.`,
      dugmad: [
        { tekst: 'API: Potencijal Svega', href: '/api/potencijal-svega-ovoga-do-sada' },
        { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
        { tekst: 'Procesuiranje Svega', href: '/procesuiranje-svega', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'potencijal-svega-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Potencijala',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Potencijal', vrednost: `${potencijal.ukupniPotencijal}%`, ikona: '🎯' },
        { naziv: 'Ostvareno', vrednost: `${potencijal.ostvarenoDoSada}%`, ikona: '✅' },
        { naziv: 'Najbliži rast', vrednost: `+${potencijal.najbliziRast}%`, ikona: '📈' },
        { naziv: 'Konačna ocena', vrednost: potencijal.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
        { naziv: 'Aktivni blokeri', vrednost: potencijal.blokiranoUkupno, ikona: '🚧' },
        { naziv: 'API ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
        { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
        { naziv: 'Contract', vrednost: potencijal.meta.contractVersion, ikona: '🧾' },
      ],
    },
  },
  {
    id: 'potencijal-svega-domeni',
    tip: 'tabela',
    naslov: '📋 Domeni: stanje sada vs potencijal',
    redosled: 3,
    podaci: {
      zaglavlje: ['Domen', 'Ostvareno', 'Potencijal', 'Uplift', 'Confidence', 'Freshness'],
      redovi: Object.entries(potencijal.domeni).map(([kljuc, domen]) => [
        domenNazivi[kljuc] ?? domen.naziv,
        `${domen.ostvareniScore}%`,
        `${domen.potencijalScore}%`,
        `+${domen.uplift}%`,
        `${domen.confidence}%`,
        domen.freshness,
      ]),
    },
  },
  {
    id: 'potencijal-svega-leverage',
    tip: 'kartice',
    naslov: '🚀 Najveći leverage faktori',
    redosled: 4,
    podaci: {
      kartice: potencijal.unlockFaktori.slice(0, 6).map((faktor) => ({
        naslov: `${domenNazivi[faktor.domen] ?? faktor.domen} • +${faktor.expectedUplift}%`,
        opis: faktor.naslov,
        ikona: blokerIkona(faktor.klasa, faktor.prioritet),
        oznake: [faktor.prioritet, faktor.klasa, faktor.domen],
      })),
    },
  },
  {
    id: 'potencijal-svega-blokeri',
    tip: 'lista',
    naslov: '🚧 Blokeri i unlock akcije',
    redosled: 5,
    podaci: {
      stavke: potencijal.blokeri.map((bloker) => ({
        ikona: blokerIkona(bloker.klasa, bloker.prioritet),
        naslov: `${bloker.naslov} (+${bloker.expectedUplift}% potencijal)`,
        opis: `${bloker.opis} • unlock: ${bloker.unlockAkcije.join(' | ')}`,
      })),
    },
  },
  {
    id: 'potencijal-svega-preporuke',
    tip: 'lista',
    naslov: '📌 Preporuke sledećih koraka',
    redosled: 6,
    podaci: {
      stavke: potencijal.preporukeDetaljno.map((preporuka) => ({
        ikona: blokerIkona(preporuka.klasa, preporuka.prioritet),
        naslov: `${preporuka.poruka} (+${preporuka.expectedUplift}% expected uplift)`,
        opis: `${preporuka.klasa.toUpperCase()} • prioritet ${preporuka.prioritet} • domeni: ${preporuka.domeni.join(', ')}`,
      })),
    },
  },
  {
    id: 'potencijal-svega-trend',
    tip: 'kartice',
    naslov: '📈 Trend i scenario',
    redosled: 7,
    podaci: {
      kartice: [
        {
          naslov: `Trend: ${potencijal.trend.direction}`,
          opis: `Promena: ${potencijal.trend.deltaScore >= 0 ? '+' : ''}${potencijal.trend.deltaScore}%`,
          ikona: trendIkona(potencijal.trend.direction),
          oznake: ['trend'],
        },
        {
          naslov: `Prethodni potencijal: ${formatPreviousScore(potencijal.trend.previousScore)}`,
          opis: `Aktuelni potencijal: ${potencijal.trend.currentScore}% • pouzdanost: ${potencijal.trend.reliable ? 'visoka' : 'ograničena'}`,
          ikona: '🧮',
          oznake: ['history'],
        },
        {
          naslov: `Kritični domeni: ${potencijal.kriticniDomeni.length}`,
          opis: potencijal.kriticniDomeni.length > 0 ? potencijal.kriticniDomeni.join(', ') : 'Nema kritičnih domena',
          ikona: '🚨',
          oznake: ['critical'],
        },
        {
          naslov: `Degradacija izvora: ${potencijal.meta.degraded ? 'DA' : 'NE'}`,
          opis: potencijal.meta.degradedSources.length > 0 ? potencijal.meta.degradedSources.join(', ') : 'Svi izvori aktivni',
          ikona: potencijal.meta.degraded ? '⚠️' : '✅',
          oznake: ['source-health'],
        },
      ],
    },
  },
  {
    id: 'potencijal-svega-cta',
    tip: 'cta',
    naslov: '🎯 Kanonski API potencijala',
    redosled: 99,
    podaci: {
      opis: `Koristite /api/potencijal-svega-ovoga-do-sada kao source-of-truth za stanje potencijala i planiranje sledećih koraka.`,
      stavke: [
        { naziv: 'Potencijal', vrednost: `${potencijal.ukupniPotencijal}%`, ikona: '🎯' },
        { naziv: 'Ostvareno', vrednost: `${potencijal.ostvarenoDoSada}%`, ikona: '✅' },
        { naziv: 'Rast', vrednost: `+${potencijal.najbliziRast}%`, ikona: '📈' },
        { naziv: 'Blokeri', vrednost: potencijal.blokiranoUkupno, ikona: '🚧' },
      ],
      dugmad: [
        { tekst: 'Pokreni API potencijala', href: '/api/potencijal-svega-ovoga-do-sada' },
        { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
      ],
    },
  },
];
