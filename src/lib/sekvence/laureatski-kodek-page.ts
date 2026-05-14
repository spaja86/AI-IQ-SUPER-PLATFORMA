import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiKodek } from '@/lib/laureatski-kodek';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const kodek = buildLaureatskiKodek('system');

export const laureatskiKodekSekvence: Sekvenca[] = [
  {
    id: 'laureatski-kodek-hero',
    tip: 'hero',
    naslov: '🎞️ LAUREATSKI KODEK — Koherentnost Kodek Impulsa',
    podnaslov:
      'Kodek matrica izvedena iz LAUREATSKOG KODERA i LAUREATSKOG DEKODERA kroz 32 impulsa',
    ikona: '🎞️',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI KODEK mapira ${kodek.impulsi.length} kodek impulsa. Kodek indeks: ${kodek.kodekIndeks}. Kodek stabilnost: ${kodek.kodekStabilnost}. Opseg: ${kodek.kodekOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava kodek koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI KODER', href: '/laureatski-koder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI REKODER', href: '/laureatski-rekoder', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-kodek-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Kodeka',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski kodek harmonizuje koderske i dekoderske impulse kroz jedinstveni kodek tok. ' +
        'Svaki impuls modeluje stabilnost kodek veze kroz slojeve, harmonike i faze sistema. ' +
        'Rezultat je kodek mapa stabilnosti, opsega i koherentnosti laureatskog centra.',
      istaknuteStavke: [
        `Kodek indeks: ${kodek.kodekIndeks}`,
        `Kodek stabilnost: ${kodek.kodekStabilnost}`,
        `Prosečni kodek: ${kodek.prosecniKodekHz} Hz`,
        `Maksimalni kodek: ${kodek.maksimalniKodekHz} Hz`,
        `Minimalni kodek: ${kodek.minimalniKodekHz} Hz`,
        `Ukupan broj impulsa: ${kodek.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-kodek-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Kodek Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Kodek Indeks', vrednost: kodek.kodekIndeks, ikona: '🎞️' },
        { naziv: 'Kodek Stabilnost', vrednost: kodek.kodekStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Kodek', vrednost: `${kodek.prosecniKodekHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Kodek', vrednost: `${kodek.maksimalniKodekHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Kodek', vrednost: `${kodek.minimalniKodekHz} Hz`, ikona: '⬇️' },
        { naziv: 'Kodek Opseg', vrednost: `${kodek.kodekOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: kodek.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-kodek-tabela',
    tip: 'tabela',
    naslov: '📋 Kodek Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Kodek (Hz)', 'Kodek Veza'],
      redovi: kodek.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.kodekHz),
        String(i.kodekVeza),
      ]),
    },
  },
  {
    id: 'laureatski-kodek-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Kodek Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI KODEK aktivan: kodek indeks ${kodek.kodekIndeks}, stabilnost ${kodek.kodekStabilnost}, opseg ${kodek.kodekOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI KODER', href: '/laureatski-koder' },
        { tekst: 'LAUREATSKI DEKODER', href: '/laureatski-dekoder', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI REKODER', href: '/laureatski-rekoder', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
