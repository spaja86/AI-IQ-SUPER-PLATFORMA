import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiOdjek } from '@/lib/laureatski-odjek';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const odjek = buildLaureatskiOdjek('system');

export const laureatskiOdjekSekvence: Sekvenca[] = [
  {
    id: 'laureatski-odjek-hero',
    tip: 'hero',
    naslov: '🔊 LAUREATSKI ODJEK — Koherentnost Rezonantnih Impulsa',
    podnaslov:
      'Odječna matrica izvedena iz LAUREATSKOG TALASA i LAUREATSKOG SIGNALA kroz 32 impulsa',
    ikona: '🔊',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI ODJEK mapira ${odjek.impulsi.length} rezonantna impulsa. Odjecni indeks: ${odjek.odjecniIndeks}. Odjecna stabilnost: ${odjek.odjecnaStabilnost}. Opseg: ${odjek.odjecniOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava odječnu koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-odjek-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Odjeka',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski odjek pretvara talasne čvorove u rezonantne impulse kombinovanjem faze, amplitude i normalizovanog odjeka. ' +
        'Svaki impuls modeluje stabilnost odziva laureatskog centra u vremenu. ' +
        'Rezultat je odječna mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Odjecni indeks: ${odjek.odjecniIndeks}`,
        `Odjecna stabilnost: ${odjek.odjecnaStabilnost}`,
        `Prosecni odjek: ${odjek.prosecniOdjekHz} Hz`,
        `Maksimalni odjek: ${odjek.maksimalniOdjekHz} Hz`,
        `Minimalni odjek: ${odjek.minimalniOdjekHz} Hz`,
        `Ukupan broj impulsa: ${odjek.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-odjek-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Odječni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Odjecni Indeks', vrednost: odjek.odjecniIndeks, ikona: '🔊' },
        { naziv: 'Odjecna Stabilnost', vrednost: odjek.odjecnaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Odjek', vrednost: `${odjek.prosecniOdjekHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Odjek', vrednost: `${odjek.maksimalniOdjekHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Odjek', vrednost: `${odjek.minimalniOdjekHz} Hz`, ikona: '⬇️' },
        { naziv: 'Odjecni Opseg', vrednost: `${odjek.odjecniOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: odjek.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-odjek-tabela',
    tip: 'tabela',
    naslov: '📋 Odječni Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Odjek (Hz)', 'Rezonanca'],
      redovi: odjek.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.odjekHz),
        String(i.rezonanca),
      ]),
    },
  },
  {
    id: 'laureatski-odjek-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Odječnu Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI ODJEK aktivan: odjecni indeks ${odjek.odjecniIndeks}, stabilnost ${odjek.odjecnaStabilnost}, opseg ${odjek.odjecniOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
