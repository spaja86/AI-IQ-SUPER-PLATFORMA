import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiEnkoder } from '@/lib/laureatski-enkoder';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const enkoder = buildLaureatskiEnkoder('system');

export const laureatskiEnkoderSekvence: Sekvenca[] = [
  {
    id: 'laureatski-enkoder-hero',
    tip: 'hero',
    naslov: '🔐 LAUREATSKI ENKODER — Koherentnost Enkoderskih Impulsa',
    podnaslov:
      'Enkoderska matrica izvedena iz LAUREATSKOG DEKODERA i LAUREATSKOG MODULATORA kroz 32 impulsa',
    ikona: '🔐',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI ENKODER mapira ${enkoder.impulsi.length} enkoderska impulsa. Enkoderski indeks: ${enkoder.enkoderskiIndeks}. Enkoderska stabilnost: ${enkoder.enkoderskaStabilnost}. Opseg: ${enkoder.enkoderskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava enkodersku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder' },
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-enkoder-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Enkodera',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski enkoder pretvara dekoderske impulse u enkoderski odgovor kombinovanjem enkoderske veze, modulatorske veze i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet enkoderskog toka kroz slojeve i harmonike. ' +
        'Rezultat je enkoderska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Enkoderski indeks: ${enkoder.enkoderskiIndeks}`,
        `Enkoderska stabilnost: ${enkoder.enkoderskaStabilnost}`,
        `Prosečni enkoder: ${enkoder.prosecniEnkoderskiHz} Hz`,
        `Maksimalni enkoder: ${enkoder.maksimalniEnkoderskiHz} Hz`,
        `Minimalni enkoder: ${enkoder.minimalniEnkoderskiHz} Hz`,
        `Ukupan broj impulsa: ${enkoder.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-enkoder-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Enkoderski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Enkoderski Indeks', vrednost: enkoder.enkoderskiIndeks, ikona: '🔐' },
        { naziv: 'Enkoderska Stabilnost', vrednost: enkoder.enkoderskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Enkoder', vrednost: `${enkoder.prosecniEnkoderskiHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Enkoder', vrednost: `${enkoder.maksimalniEnkoderskiHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Enkoder', vrednost: `${enkoder.minimalniEnkoderskiHz} Hz`, ikona: '⬇️' },
        { naziv: 'Enkoderski Opseg', vrednost: `${enkoder.enkoderskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: enkoder.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-enkoder-tabela',
    tip: 'tabela',
    naslov: '📋 Enkoderski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Enkoder (Hz)', 'Enkoderska Veza'],
      redovi: enkoder.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.enkoderskiHz),
        String(i.enkoderskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-enkoder-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Enkodersku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI ENKODER aktivan: enkoderski indeks ${enkoder.enkoderskiIndeks}, stabilnost ${enkoder.enkoderskaStabilnost}, opseg ${enkoder.enkoderskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder' },
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEMODULATOR', href: '/laureatski-demodulator', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
