import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiKoder } from '@/lib/laureatski-koder';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const koder = buildLaureatskiKoder('system');

export const laureatskiKoderSekvence: Sekvenca[] = [
  {
    id: 'laureatski-koder-hero',
    tip: 'hero',
    naslov: '🧬 LAUREATSKI KODER — Koherentnost Koderskih Impulsa',
    podnaslov:
      'Koderska matrica izvedena iz LAUREATSKOG REKODERA i LAUREATSKOG DEKODERA kroz 32 impulsa',
    ikona: '🧬',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI KODER mapira ${koder.impulsi.length} koderska impulsa. Koderski indeks: ${koder.koderskiIndeks}. Koderska stabilnost: ${koder.koderskaStabilnost}. Opseg: ${koder.koderskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava kodersku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI REKODER', href: '/laureatski-rekoder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TRANSKODER', href: '/laureatski-transkoder', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-koder-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Kodera',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski koder objedinjavanjem rekoderskih i dekoderskih impulsa formira centralni koderski tok. ' +
        'Svaki impuls modeluje stabilnost koderske veze kroz slojeve, harmonike i faze sistema. ' +
        'Rezultat je koderska mapa stabilnosti, opsega i koherentnosti laureatskog centra.',
      istaknuteStavke: [
        `Koderski indeks: ${koder.koderskiIndeks}`,
        `Koderska stabilnost: ${koder.koderskaStabilnost}`,
        `Prosečni koder: ${koder.prosecniKoderHz} Hz`,
        `Maksimalni koder: ${koder.maksimalniKoderHz} Hz`,
        `Minimalni koder: ${koder.minimalniKoderHz} Hz`,
        `Ukupan broj impulsa: ${koder.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-koder-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Koderski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Koderski Indeks', vrednost: koder.koderskiIndeks, ikona: '🧬' },
        { naziv: 'Koderska Stabilnost', vrednost: koder.koderskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Koder', vrednost: `${koder.prosecniKoderHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Koder', vrednost: `${koder.maksimalniKoderHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Koder', vrednost: `${koder.minimalniKoderHz} Hz`, ikona: '⬇️' },
        { naziv: 'Koderski Opseg', vrednost: `${koder.koderskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: koder.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-koder-tabela',
    tip: 'tabela',
    naslov: '📋 Koderski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Koder (Hz)', 'Koderska Veza'],
      redovi: koder.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.koderHz),
        String(i.koderskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-koder-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Kodersku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI KODER aktivan: koderski indeks ${koder.koderskiIndeks}, stabilnost ${koder.koderskaStabilnost}, opseg ${koder.koderskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI REKODER', href: '/laureatski-rekoder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TRANSKODER', href: '/laureatski-transkoder', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
