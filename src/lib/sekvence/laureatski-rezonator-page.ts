import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiRezonator } from '@/lib/laureatski-rezonator';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const rezonator = buildLaureatskiRezonator('system');

export const laureatskiRezonatorSekvence: Sekvenca[] = [
  {
    id: 'laureatski-rezonator-hero',
    tip: 'hero',
    naslov: '🎛️ LAUREATSKI REZONATOR — Koherentnost Rezonatorskih Impulsa',
    podnaslov:
      'Rezonatorska matrica izvedena iz LAUREATSKOG EHA i LAUREATSKOG ODJEKA kroz 32 impulsa',
    ikona: '🎛️',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI REZONATOR mapira ${rezonator.impulsi.length} rezonatorska impulsa. Rezonatorski indeks: ${rezonator.rezonatorskiIndeks}. Rezonatorska stabilnost: ${rezonator.rezonatorskaStabilnost}. Opseg: ${rezonator.rezonatorskiOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava rezonatorsku koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho' },
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-rezonator-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Rezonatora',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski rezonator pretvara eho impulse u rezonatorski odgovor kombinovanjem povratne sprege, rezonance i normalizovanog spektra. ' +
        'Svaki impuls modeluje stabilnost i intenzitet rezonatorske veze kroz slojeve i harmonike. ' +
        'Rezultat je rezonatorska mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Rezonatorski indeks: ${rezonator.rezonatorskiIndeks}`,
        `Rezonatorska stabilnost: ${rezonator.rezonatorskaStabilnost}`,
        `Prosecni rezonator: ${rezonator.prosecniRezonatorHz} Hz`,
        `Maksimalni rezonator: ${rezonator.maksimalniRezonatorHz} Hz`,
        `Minimalni rezonator: ${rezonator.minimalniRezonatorHz} Hz`,
        `Ukupan broj impulsa: ${rezonator.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-rezonator-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Rezonatorski Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Rezonatorski Indeks', vrednost: rezonator.rezonatorskiIndeks, ikona: '🎛️' },
        { naziv: 'Rezonatorska Stabilnost', vrednost: rezonator.rezonatorskaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Rezonator', vrednost: `${rezonator.prosecniRezonatorHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Rezonator', vrednost: `${rezonator.maksimalniRezonatorHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Rezonator', vrednost: `${rezonator.minimalniRezonatorHz} Hz`, ikona: '⬇️' },
        { naziv: 'Rezonatorski Opseg', vrednost: `${rezonator.rezonatorskiOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: rezonator.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-rezonator-tabela',
    tip: 'tabela',
    naslov: '📋 Rezonatorski Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Rezonator (Hz)', 'Rezonatorska Veza'],
      redovi: rezonator.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.rezonatorHz),
        String(i.rezonatorskaVeza),
      ]),
    },
  },
  {
    id: 'laureatski-rezonator-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Rezonatorsku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI REZONATOR aktivan: rezonatorski indeks ${rezonator.rezonatorskiIndeks}, stabilnost ${rezonator.rezonatorskaStabilnost}, opseg ${rezonator.rezonatorskiOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI EHO', href: '/laureatski-eho' },
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
