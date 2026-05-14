import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiDemodulator } from '@/lib/laureatski-demodulator';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const demodulator = buildLaureatskiDemodulator('system');

export const laureatskiDemodulatorSekvence: Sekvenca[] = [
  {
    id: 'laureatski-demodulator-hero',
    tip: 'hero',
    naslov: '📻 LAUREATSKI DEMODULATOR — Koherentnost Demodulatorskih Impulsa',
    podnaslov:
      'Demodulatorska matrica izvedena iz LAUREATSKOG MODULATORA i LAUREATSKOG OSCILATORA kroz 32 impulsa',
    ikona: '📻',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI DEMODULATOR mapira ${demodulator.impulsi.length} demodulatorska impulsa. Demodulatorski indeks: ${demodulator.demodulatorskiIndeks}. Demodulatorska stabilnost: ${demodulator.demodulatorskaStabilnost}. Opseg: ${demodulator.demodulatorskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava demodulatorsku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator' },
        { tekst: 'LAUREATSKI OSCILATOR', href: '/laureatski-oscilator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-demodulator-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Demodulatora',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski demodulator pretvara modulatorske impulse u demodulatorski odgovor kombinovanjem demodulatorske veze, oscilatorske sprege i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet demodulatorskog toka kroz slojeve i harmonike. ' +
        'Rezultat je demodulatorska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Demodulatorski indeks: ${demodulator.demodulatorskiIndeks}`,
        `Demodulatorska stabilnost: ${demodulator.demodulatorskaStabilnost}`,
        `Prosecni demodulator: ${demodulator.prosecniDemodulatorHz} Hz`,
        `Maksimalni demodulator: ${demodulator.maksimalniDemodulatorHz} Hz`,
        `Minimalni demodulator: ${demodulator.minimalniDemodulatorHz} Hz`,
        `Ukupan broj impulsa: ${demodulator.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-demodulator-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Demodulatorski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Demodulatorski Indeks', vrednost: demodulator.demodulatorskiIndeks, ikona: '📻' },
        { naziv: 'Demodulatorska Stabilnost', vrednost: demodulator.demodulatorskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Demodulator', vrednost: `${demodulator.prosecniDemodulatorHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Demodulator', vrednost: `${demodulator.maksimalniDemodulatorHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Demodulator', vrednost: `${demodulator.minimalniDemodulatorHz} Hz`, ikona: '⬇️' },
        { naziv: 'Demodulatorski Opseg', vrednost: `${demodulator.demodulatorskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: demodulator.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-demodulator-tabela',
    tip: 'tabela',
    naslov: '📋 Demodulatorski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Demodulator (Hz)', 'Demodulatorska Veza'],
      redovi: demodulator.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.demodulatorHz),
        String(i.demodulatorskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-demodulator-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Demodulatorsku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI DEMODULATOR aktivan: demodulatorski indeks ${demodulator.demodulatorskiIndeks}, stabilnost ${demodulator.demodulatorskaStabilnost}, opseg ${demodulator.demodulatorskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI MODULATOR', href: '/laureatski-modulator' },
        { tekst: 'LAUREATSKI OSCILATOR', href: '/laureatski-oscilator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
