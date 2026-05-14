import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiModulator } from '@/lib/laureatski-modulator';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const modulator = buildLaureatskiModulator('system');

export const laureatskiModulatorSekvence: Sekvenca[] = [
  {
    id: 'laureatski-modulator-hero',
    tip: 'hero',
    naslov: '🎚️ LAUREATSKI MODULATOR — Koherentnost Modulatorskih Impulsa',
    podnaslov:
      'Modulatorska matrica izvedena iz LAUREATSKOG OSCILATORA i LAUREATSKOG REZONATORA kroz 32 impulsa',
    ikona: '🎚️',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI MODULATOR mapira ${modulator.impulsi.length} modulatorska impulsa. Modulatorski indeks: ${modulator.modulatorskiIndeks}. Modulatorska stabilnost: ${modulator.modulatorskaStabilnost}. Opseg: ${modulator.modulatorskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava modulatorsku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI OSCILATOR', href: '/laureatski-oscilator' },
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-modulator-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Modulatora',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski modulator pretvara oscilatorske impulse u modulatorski odgovor kombinovanjem modulatorske veze, rezonatorske sprege i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet modulatorskog toka kroz slojeve i harmonike. ' +
        'Rezultat je modulatorska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Modulatorski indeks: ${modulator.modulatorskiIndeks}`,
        `Modulatorska stabilnost: ${modulator.modulatorskaStabilnost}`,
        `Prosecni modulator: ${modulator.prosecniModulatorHz} Hz`,
        `Maksimalni modulator: ${modulator.maksimalniModulatorHz} Hz`,
        `Minimalni modulator: ${modulator.minimalniModulatorHz} Hz`,
        `Ukupan broj impulsa: ${modulator.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-modulator-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Modulatorski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Modulatorski Indeks', vrednost: modulator.modulatorskiIndeks, ikona: '🎚️' },
        { naziv: 'Modulatorska Stabilnost', vrednost: modulator.modulatorskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Modulator', vrednost: `${modulator.prosecniModulatorHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Modulator', vrednost: `${modulator.maksimalniModulatorHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Modulator', vrednost: `${modulator.minimalniModulatorHz} Hz`, ikona: '⬇️' },
        { naziv: 'Modulatorski Opseg', vrednost: `${modulator.modulatorskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: modulator.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-modulator-tabela',
    tip: 'tabela',
    naslov: '📋 Modulatorski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Modulator (Hz)', 'Modulatorska Veza'],
      redovi: modulator.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.modulatorHz),
        String(i.modulatorskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-modulator-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Modulatorsku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI MODULATOR aktivan: modulatorski indeks ${modulator.modulatorskiIndeks}, stabilnost ${modulator.modulatorskaStabilnost}, opseg ${modulator.modulatorskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI OSCILATOR', href: '/laureatski-oscilator' },
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
