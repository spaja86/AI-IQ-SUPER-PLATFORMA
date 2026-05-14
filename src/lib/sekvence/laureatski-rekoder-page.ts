import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiRekoder } from '@/lib/laureatski-rekoder';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const rekoder = buildLaureatskiRekoder('system');

export const laureatskiRekoderSekvence: Sekvenca[] = [
  {
    id: 'laureatski-rekoder-hero',
    tip: 'hero',
    naslov: '♻️ LAUREATSKI REKODER — Koherentnost Rekoderskih Impulsa',
    podnaslov:
      'Rekoderska matrica izvedena iz LAUREATSKOG TRANSKODERA i LAUREATSKOG ENKODERA kroz 32 impulsa',
    ikona: '♻️',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI REKODER mapira ${rekoder.impulsi.length} rekoderska impulsa. Rekoderski indeks: ${rekoder.rekoderskiIndeks}. Rekoderska stabilnost: ${rekoder.rekoderskaStabilnost}. Opseg: ${rekoder.rekoderskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava rekodersku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI TRANSKODER', href: '/laureatski-transkoder' },
        { tekst: 'LAUREATSKI ENKODER', href: '/laureatski-enkoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-rekoder-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Rekodera',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski rekoder prevodi transkoderske impulse u rekoderski odgovor kombinovanjem rekoderske veze, enkoderske veze i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet rekoderskog toka kroz slojeve i harmonike. ' +
        'Rezultat je rekoderska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Rekoderski indeks: ${rekoder.rekoderskiIndeks}`,
        `Rekoderska stabilnost: ${rekoder.rekoderskaStabilnost}`,
        `Prosečni rekoder: ${rekoder.prosecniRekoderHz} Hz`,
        `Maksimalni rekoder: ${rekoder.maksimalniRekoderHz} Hz`,
        `Minimalni rekoder: ${rekoder.minimalniRekoderHz} Hz`,
        `Ukupan broj impulsa: ${rekoder.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-rekoder-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Rekoderski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Rekoderski Indeks', vrednost: rekoder.rekoderskiIndeks, ikona: '♻️' },
        { naziv: 'Rekoderska Stabilnost', vrednost: rekoder.rekoderskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Rekoder', vrednost: `${rekoder.prosecniRekoderHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Rekoder', vrednost: `${rekoder.maksimalniRekoderHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Rekoder', vrednost: `${rekoder.minimalniRekoderHz} Hz`, ikona: '⬇️' },
        { naziv: 'Rekoderski Opseg', vrednost: `${rekoder.rekoderskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: rekoder.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '��' },
      ],
    },
  },
  {
    id: 'laureatski-rekoder-tabela',
    tip: 'tabela',
    naslov: '📋 Rekoderski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Rekoder (Hz)', 'Rekoderska Veza'],
      redovi: rekoder.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.rekoderHz),
        String(i.rekoderskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-rekoder-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Rekodersku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI REKODER aktivan: rekoderski indeks ${rekoder.rekoderskiIndeks}, stabilnost ${rekoder.rekoderskaStabilnost}, opseg ${rekoder.rekoderskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI TRANSKODER', href: '/laureatski-transkoder' },
        { tekst: 'LAUREATSKI ENKODER', href: '/laureatski-enkoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
