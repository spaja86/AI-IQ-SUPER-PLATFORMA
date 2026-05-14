import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiTranskoder } from '@/lib/laureatski-transkoder';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const transkoder = buildLaureatskiTranskoder('system');

export const laureatskiTranskoderSekvence: Sekvenca[] = [
  {
    id: 'laureatski-transkoder-hero',
    tip: 'hero',
    naslov: '🔄 LAUREATSKI TRANSKODER — Koherentnost Transkoderskih Impulsa',
    podnaslov:
      'Transkoderska matrica izvedena iz LAUREATSKOG ENKODERA i LAUREATSKOG DEKODERA kroz 32 impulsa',
    ikona: '🔄',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI TRANSKODER mapira ${transkoder.impulsi.length} transkoderska impulsa. Transkoderski indeks: ${transkoder.transkoderskiIndeks}. Transkoderska stabilnost: ${transkoder.transkoderskaStabilnost}. Opseg: ${transkoder.transkoderskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava transkodersku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI ENKODER', href: '/laureatski-enkoder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-transkoder-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Transkodera',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski transkoder prevodi enkoderske impulse u transkoderski odgovor kombinovanjem transkoderske veze, dekoderske veze i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet transkoderskog toka kroz slojeve i harmonike. ' +
        'Rezultat je transkoderska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Transkoderski indeks: ${transkoder.transkoderskiIndeks}`,
        `Transkoderska stabilnost: ${transkoder.transkoderskaStabilnost}`,
        `Prosečni transkoder: ${transkoder.prosecniTranskoderHz} Hz`,
        `Maksimalni transkoder: ${transkoder.maksimalniTranskoderHz} Hz`,
        `Minimalni transkoder: ${transkoder.minimalniTranskoderHz} Hz`,
        `Ukupan broj impulsa: ${transkoder.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-transkoder-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Transkoderski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Transkoderski Indeks', vrednost: transkoder.transkoderskiIndeks, ikona: '🔄' },
        { naziv: 'Transkoderska Stabilnost', vrednost: transkoder.transkoderskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Transkoder', vrednost: `${transkoder.prosecniTranskoderHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Transkoder', vrednost: `${transkoder.maksimalniTranskoderHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Transkoder', vrednost: `${transkoder.minimalniTranskoderHz} Hz`, ikona: '⬇️' },
        { naziv: 'Transkoderski Opseg', vrednost: `${transkoder.transkoderskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: transkoder.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-transkoder-tabela',
    tip: 'tabela',
    naslov: '📋 Transkoderski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Transkoder (Hz)', 'Transkoderska Veza'],
      redovi: transkoder.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.transkoderHz),
        String(i.transkoderskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-transkoder-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Transkodersku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI TRANSKODER aktivan: transkoderski indeks ${transkoder.transkoderskiIndeks}, stabilnost ${transkoder.transkoderskaStabilnost}, opseg ${transkoder.transkoderskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI ENKODER', href: '/laureatski-enkoder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
