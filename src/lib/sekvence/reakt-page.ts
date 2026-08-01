import type { Sekvenca } from '@/lib/types';
import { igrice, getDimenzionalnoPitanje } from '@/lib/igrice';

const reaktIgrica = igrice.find((i) => i.id === 'igrica-reakt');

export const reaktSekvence: Sekvenca[] = [
  {
    id: 'reakt-hero',
    tip: 'hero',
    naslov: '⚡ REAKT — Igra Refleksa',
    podnaslov: 'Dimenzionalni stimulusi • Streak sistem • Distraktori • 360D–5760D',
    ikona: '⚡',
    redosled: 1,
    podaci: {
      opis: 'Igra refleksa i reakcionog vremena integrisana u SPAJA Gaming ekosistem. Klikni stimuluse što brže možeš — svaka dimenzija povećava brzinu, broj simultanih stimulusa i vizuelnu kompleksnost. Od 1440D naviše pojavljuju se distraktori koje ne smeš kliknuti!',
      dugmad: [
        { tekst: '▶ Pokreni REAKT', href: `/spaja-digitalni-brouvzer?igricaId=igrica-reakt` },
        { tekst: 'Sve igrice', href: '/igrice', stil: 'sekundarno' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'reakt-statistika',
    tip: 'statistika',
    naslov: '📊 REAKT u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Dimenzija', vrednost: 5, ikona: '🌀' },
        { naziv: 'Max Stimulusi', vrednost: 5, ikona: '⚡' },
        { naziv: 'Max Streak', vrednost: 8, ikona: '🔥' },
        { naziv: 'HP životi', vrednost: 5, ikona: '♥' },
        { naziv: 'Prag Streak', vrednost: 400, ikona: '⏱️' },
        { naziv: 'Status', vrednost: 'Beta', ikona: '🚀' },
      ],
    },
  },
  {
    id: 'reakt-tekst',
    tip: 'tekst',
    naslov: 'Kako igrati REAKT?',
    redosled: 3,
    podaci: {
      sadrzaj: 'Dimenzionalni stimulusi (plave/zlatne elipsoide) pojavljuju se na ekranu. Klikni ih što brže možeš — brža reakcija donosi više bodova! Svaki uzastopni brzi hit povećava streak multiplikator (do 8×). Od 1440D nadalje pojavljuju se crveni distraktori (×) — klik na distraktor oduzima HP i ruši streak. Ako ostaneš bez HP ili propustiš previše stimulusa, igra se završava.',
      istaknuteStavke: [
        '⚡ Bodovi = (1000 / reakcionoVreme_ms) × dimenzionalniBonus × streakMultiplikator',
        '🔥 Streak: uzastopni brzi hitovi daju bonus do 8× multiplikator',
        '❌ Distraktori (crveni ×): od 1440D naviše, nemoj kliknuti!',
        '♥ HP: imaš 5 života — gube se propuštenim stimulusima i klikom na distrektore',
        '🌀 360D — 1 stimulus, sporo nestajanje, bez distraktora',
        '🌀 720D — 2 simultana stimulusa, brži nestanak',
        '🌀 1440D — 3 simultana + distraktori pojavljuju se',
        '🌀 2880D — 4 simultana + pokretni stimulusi + distraktori',
        '🌀 5760D — 5 simultana + sve vizualne smetnje + rotacija oblika',
      ],
    },
  },
  {
    id: 'reakt-dimenzije',
    tip: 'tabela',
    naslov: '🌀 Dimenzionalni efekti u REAKT-u',
    redosled: 4,
    podaci: {
      zaglavlje: ['Dimenzija', 'Max stimulusi', 'Brzina nestajanja', 'Distraktori', 'Kretanje', 'Bonus'],
      redovi: [
        ['🔵 360D', '1', '2200ms', '—', '—', '×1.0'],
        ['🟣 720D', '2', '1600ms', '—', '—', '×1.3'],
        ['🟡 1440D', '3', '1200ms', '✓', '—', '×1.7'],
        ['🟠 2880D', '4', '900ms', '✓', '✓', '×2.2'],
        ['🔴 5760D', '5', '700ms', '✓', '✓ + rotacija', '×3.0'],
      ],
    },
  },
  {
    id: 'reakt-igrica-info',
    tip: 'lista',
    naslov: '🎮 Funkcije REAKT igrice',
    redosled: 5,
    podaci: {
      stavke: reaktIgrica
        ? reaktIgrica.funkcije.map((f) => ({ ikona: '⚡', naslov: f, opis: '' }))
        : [],
    },
  },
  {
    id: 'reakt-dimenzionalno-pitanje',
    tip: 'tekst',
    naslov: '🎮 Dimenzionalno pitanje pri pokretanju',
    redosled: 6,
    podaci: {
      sadrzaj: reaktIgrica ? getDimenzionalnoPitanje('igrica-reakt') : 'Izaberi dimenziju (D) pre starta.',
    },
  },
  {
    id: 'reakt-cta',
    tip: 'baner',
    naslov: '⚡ Spreman za REAKT?',
    redosled: 7,
    podaci: {
      bedz: '🎮 BETA',
      opis: 'Pokreni REAKT u SPAJA Digitalnom Brauzeru i testiraj svoja reakciona vremena u dimenzionalnom prostoru. Izaberi dimenziju (D) i počni odmah!',
      dugme: { tekst: '▶ Pokreni REAKT', href: '/spaja-digitalni-brouvzer?igricaId=igrica-reakt' },
    },
  },
];
