import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiOscilator } from '@/lib/laureatski-oscilator';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const oscilator = buildLaureatskiOscilator('system');

export const laureatskiOscilatorSekvence: Sekvenca[] = [
  {
    id: 'laureatski-oscilator-hero',
    tip: 'hero',
    naslov: '🌀 LAUREATSKI OSCILATOR — Koherentnost Oscilatorskih Impulsa',
    podnaslov:
      'Oscilatorska matrica izvedena iz LAUREATSKOG REZONATORA i LAUREATSKOG EHA kroz 32 impulsa',
    ikona: '🌀',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI OSCILATOR mapira ${oscilator.impulsi.length} oscilatorska impulsa. Oscilatorski indeks: ${oscilator.oscilatorskiIndeks}. Oscilatorska stabilnost: ${oscilator.oscilatorskaStabilnost}. Opseg: ${oscilator.oscilatorskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava oscilatorsku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator' },
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-oscilator-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Oscilatora',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski oscilator pretvara rezonatorske impulse u oscilatorski odgovor kombinovanjem oscilatorske veze, povratne sprege i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet oscilatorskog toka kroz slojeve i harmonike. ' +
        'Rezultat je oscilatorska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Oscilatorski indeks: ${oscilator.oscilatorskiIndeks}`,
        `Oscilatorska stabilnost: ${oscilator.oscilatorskaStabilnost}`,
        `Prosecni oscilator: ${oscilator.prosecniOscilatorHz} Hz`,
        `Maksimalni oscilator: ${oscilator.maksimalniOscilatorHz} Hz`,
        `Minimalni oscilator: ${oscilator.minimalniOscilatorHz} Hz`,
        `Ukupan broj impulsa: ${oscilator.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-oscilator-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Oscilatorski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Oscilatorski Indeks', vrednost: oscilator.oscilatorskiIndeks, ikona: '🌀' },
        { naziv: 'Oscilatorska Stabilnost', vrednost: oscilator.oscilatorskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Oscilator', vrednost: `${oscilator.prosecniOscilatorHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Oscilator', vrednost: `${oscilator.maksimalniOscilatorHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Oscilator', vrednost: `${oscilator.minimalniOscilatorHz} Hz`, ikona: '⬇️' },
        { naziv: 'Oscilatorski Opseg', vrednost: `${oscilator.oscilatorskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: oscilator.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-oscilator-tabela',
    tip: 'tabela',
    naslov: '📋 Oscilatorski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Oscilator (Hz)', 'Oscilatorska Veza'],
      redovi: oscilator.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.oscilatorHz),
        String(i.oscilatorskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-oscilator-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Oscilatorsku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI OSCILATOR aktivan: oscilatorski indeks ${oscilator.oscilatorskiIndeks}, stabilnost ${oscilator.oscilatorskaStabilnost}, opseg ${oscilator.oscilatorskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI REZONATOR', href: '/laureatski-rezonator' },
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
