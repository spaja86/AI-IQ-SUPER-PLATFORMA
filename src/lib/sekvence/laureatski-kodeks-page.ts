import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiKodeks } from '@/lib/laureatski-kodeks';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const kodeks = buildLaureatskiKodeks('system');

export const laureatskiKodeksSekvence: Sekvenca[] = [
  {
    id: 'laureatski-kodeks-hero',
    tip: 'hero',
    naslov: '📜 LAUREATSKI KODEKS — Koherentnost Kodeks Impulsa',
    podnaslov:
      'Kodeks matrica izvedena iz LAUREATSKOG KODEKA i LAUREATSKOG KODERA kroz 32 impulsa',
    ikona: '📜',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI KODEKS mapira ${kodeks.impulsi.length} kodeks impulsa. Kodeks indeks: ${kodeks.kodeksIndeks}. Kodeks stabilnost: ${kodeks.kodeksStabilnost}. Opseg: ${kodeks.kodeksOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava kodeks koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI KODEK', href: '/laureatski-kodek' },
        { tekst: 'LAUREATSKI KODER', href: '/laureatski-koder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-kodeks-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Kodeksa',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski kodeks harmonizuje kodek i koder impulse kroz jedinstveni kodeks tok. ' +
        'Svaki impuls modeluje stabilnost kodeks veze kroz slojeve, harmonike i faze sistema. ' +
        'Rezultat je kodeks mapa stabilnosti, opsega i koherentnosti laureatskog centra.',
      istaknuteStavke: [
        `Kodeks indeks: ${kodeks.kodeksIndeks}`,
        `Kodeks stabilnost: ${kodeks.kodeksStabilnost}`,
        `Prosečni kodeks: ${kodeks.prosecniKodeksHz} Hz`,
        `Maksimalni kodeks: ${kodeks.maksimalniKodeksHz} Hz`,
        `Minimalni kodeks: ${kodeks.minimalniKodeksHz} Hz`,
        `Ukupan broj impulsa: ${kodeks.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-kodeks-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Kodeks Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Kodeks Indeks', vrednost: kodeks.kodeksIndeks, ikona: '📜' },
        { naziv: 'Kodeks Stabilnost', vrednost: kodeks.kodeksStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Kodeks', vrednost: `${kodeks.prosecniKodeksHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Kodeks', vrednost: `${kodeks.maksimalniKodeksHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Kodeks', vrednost: `${kodeks.minimalniKodeksHz} Hz`, ikona: '⬇️' },
        { naziv: 'Kodeks Opseg', vrednost: `${kodeks.kodeksOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: kodeks.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-kodeks-tabela',
    tip: 'tabela',
    naslov: '📋 Kodeks Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Kodeks (Hz)', 'Kodeks Veza'],
      redovi: kodeks.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.kodeksHz),
        String(i.kodeksVeza),
      ]),
    },
  },
  {
    id: 'laureatski-kodeks-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Kodeks Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI KODEKS aktivan: kodeks indeks ${kodeks.kodeksIndeks}, stabilnost ${kodeks.kodeksStabilnost}, opseg ${kodeks.kodeksOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI KODEK', href: '/laureatski-kodek' },
        { tekst: 'LAUREATSKI KODER', href: '/laureatski-koder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
