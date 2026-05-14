import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiRitam } from '@/lib/laureatski-ritam';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const ritam = buildLaureatskiRitam('system');

export const laureatskiRitamSekvence: Sekvenca[] = [
  {
    id: 'laureatski-ritam-hero',
    tip: 'hero',
    naslov: '🥁 LAUREATSKI RITAM — Metronomska Koherentnost Sistema',
    podnaslov:
      'Ritmička matrica izvedena iz LAUREATSKOG PULSA i LAUCENTRICNOG SPEKTRA kroz 32 faze',
    ikona: '🥁',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI RITAM meri metronomski tok laureatskog centra kroz ${ritam.faze.length} ritmičke faze. Metronomski indeks: ${ritam.metronomskiIndeks}. Ritam stabilnost: ${ritam.ritamStabilnost}. Opseg: ${ritam.ritamOpsegBpm} BPM. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava sinhronizovan takt.`,
      dugmad: [
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-ritam-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Ritma',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski ritam preslikava pulsne otkucaje u metronomske faze i tempo spektar. ' +
        'Svaka faza kombinuje akcenat frekvencije, intenzitet rezonance i normalizovani tempo. ' +
        'Na taj način sistem dobija ritmičku mapu stabilnosti, raspona i koherentnosti.',
      istaknuteStavke: [
        `Metronomski indeks: ${ritam.metronomskiIndeks}`,
        `Ritam stabilnost: ${ritam.ritamStabilnost}`,
        `Prosečni tempo: ${ritam.prosecniTempoBpm} BPM`,
        `Maksimalni tempo: ${ritam.maksimalniTempoBpm} BPM`,
        `Minimalni tempo: ${ritam.minimalniTempoBpm} BPM`,
        `Ukupan broj faza: ${ritam.faze.length}`,
      ],
    },
  },
  {
    id: 'laureatski-ritam-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Ritmički Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Metronomski Indeks', vrednost: ritam.metronomskiIndeks, ikona: '🥁' },
        { naziv: 'Ritam Stabilnost', vrednost: ritam.ritamStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Tempo', vrednost: `${ritam.prosecniTempoBpm} BPM`, ikona: '🎵' },
        { naziv: 'Maksimalni Tempo', vrednost: `${ritam.maksimalniTempoBpm} BPM`, ikona: '⬆️' },
        { naziv: 'Minimalni Tempo', vrednost: `${ritam.minimalniTempoBpm} BPM`, ikona: '⬇️' },
        { naziv: 'Ritam Opseg', vrednost: `${ritam.ritamOpsegBpm} BPM`, ikona: '📐' },
        { naziv: 'Broj Faza', vrednost: ritam.faze.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-ritam-tabela',
    tip: 'tabela',
    naslov: '📋 Ritmičke Faze — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Faza (rad)', 'Akcenat', 'Tempo (BPM)'],
      redovi: ritam.faze.slice(0, 16).map((f) => [
        String(f.t),
        String(f.sloj),
        `H${f.harmonik}`,
        String(f.fazaRad),
        String(f.akcenat),
        String(f.tempoBpm),
      ]),
    },
  },
  {
    id: 'laureatski-ritam-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Ritmičku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI RITAM aktivan: metronomski indeks ${ritam.metronomskiIndeks}, stabilnost ${ritam.ritamStabilnost}, opseg ${ritam.ritamOpsegBpm} BPM.`,
      dugmad: [
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
