import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiDekoder } from '@/lib/laureatski-dekoder';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const dekoder = buildLaureatskiDekoder('system');

export const laureatskiDekoderSekvence: Sekvenca[] = [
  {
    id: 'laureatski-dekoder-hero',
    tip: 'hero',
    naslov: '🧩 LAUREATSKI DEKODER — Koherentnost Dekoderskih Impulsa',
    podnaslov:
      'Dekoderska matrica izvedena iz LAUREATSKOG DEMODULATORA i LAUREATSKOG SIGNALA kroz 32 impulsa',
    ikona: '🧩',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI DEKODER mapira ${dekoder.impulsi.length} dekoderska impulsa. Dekoderski indeks: ${dekoder.dekoderskiIndeks}. Dekoderska stabilnost: ${dekoder.dekoderskaStabilnost}. Opseg: ${dekoder.dekoderskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava dekodersku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator' },
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-dekoder-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Dekodera',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski dekoder pretvara demodulatorske impulse u dekoderski odgovor kombinovanjem dekoderske veze, signalne amplitude i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet dekoderskog toka kroz slojeve i harmonike. ' +
        'Rezultat je dekoderska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Dekoderski indeks: ${dekoder.dekoderskiIndeks}`,
        `Dekoderska stabilnost: ${dekoder.dekoderskaStabilnost}`,
        `Prosecni dekoder: ${dekoder.prosecniDekoderHz} Hz`,
        `Maksimalni dekoder: ${dekoder.maksimalniDekoderHz} Hz`,
        `Minimalni dekoder: ${dekoder.minimalniDekoderHz} Hz`,
        `Ukupan broj impulsa: ${dekoder.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-dekoder-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Dekoderski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Dekoderski Indeks', vrednost: dekoder.dekoderskiIndeks, ikona: '🧩' },
        { naziv: 'Dekoderska Stabilnost', vrednost: dekoder.dekoderskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Dekoder', vrednost: `${dekoder.prosecniDekoderHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Dekoder', vrednost: `${dekoder.maksimalniDekoderHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Dekoder', vrednost: `${dekoder.minimalniDekoderHz} Hz`, ikona: '⬇️' },
        { naziv: 'Dekoderski Opseg', vrednost: `${dekoder.dekoderskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: dekoder.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-dekoder-tabela',
    tip: 'tabela',
    naslov: '📋 Dekoderski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Dekoder (Hz)', 'Dekoderska Veza'],
      redovi: dekoder.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.dekoderHz),
        String(i.dekoderskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-dekoder-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Dekodersku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI DEKODER aktivan: dekoderski indeks ${dekoder.dekoderskiIndeks}, stabilnost ${dekoder.dekoderskaStabilnost}, opseg ${dekoder.dekoderskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator' },
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
