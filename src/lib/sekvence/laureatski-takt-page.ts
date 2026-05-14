import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiTakt } from '@/lib/laureatski-takt';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const takt = buildLaureatskiTakt('system');

export const laureatskiTaktSekvence: Sekvenca[] = [
  {
    id: 'laureatski-takt-hero',
    tip: 'hero',
    naslov: '🥁 LAUREATSKI TAKT — Koherentnost Metra Sistema',
    podnaslov:
      'Taktička matrica izvedena iz LAUREATSKOG RITMA i LAUREATSKOG PULSA kroz 32 segmenta',
    ikona: '🥁',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI TAKT meri metar laureatskog centra kroz ${takt.segmenti.length} taktna segmenta. Taktni indeks: ${takt.taktniIndeks}. Metar stabilnost: ${takt.metarStabilnost}. Opseg: ${takt.taktOpsegBpm} BPM. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava jedinstvenu metriku.`,
      dugmad: [
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam' },
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls', stil: 'sekundarno' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-takt-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Takta',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski takt mapira ritmičke faze u precizne segmente metra. ' +
        'Svaki segment koristi tempo, naglasak i harmonijski nivo da bi proizveo stabilnu metriku sistema. ' +
        'Dobijamo taktičku mapu indeksa, opsega i koherentnosti.',
      istaknuteStavke: [
        `Taktni indeks: ${takt.taktniIndeks}`,
        `Metar stabilnost: ${takt.metarStabilnost}`,
        `Prosečni takt: ${takt.prosecniTaktBpm} BPM`,
        `Maksimalni takt: ${takt.maksimalniTaktBpm} BPM`,
        `Minimalni takt: ${takt.minimalniTaktBpm} BPM`,
        `Ukupan broj segmenata: ${takt.segmenti.length}`,
      ],
    },
  },
  {
    id: 'laureatski-takt-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Taktički Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Taktni Indeks', vrednost: takt.taktniIndeks, ikona: '🥁' },
        { naziv: 'Metar Stabilnost', vrednost: takt.metarStabilnost, ikona: '🧭' },
        { naziv: 'Prosečni Takt', vrednost: `${takt.prosecniTaktBpm} BPM`, ikona: '🎵' },
        { naziv: 'Maksimalni Takt', vrednost: `${takt.maksimalniTaktBpm} BPM`, ikona: '⬆️' },
        { naziv: 'Minimalni Takt', vrednost: `${takt.minimalniTaktBpm} BPM`, ikona: '⬇️' },
        { naziv: 'Takt Opseg', vrednost: `${takt.taktOpsegBpm} BPM`, ikona: '📐' },
        { naziv: 'Broj Segmenata', vrednost: takt.segmenti.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-takt-tabela',
    tip: 'tabela',
    naslov: '📋 Taktni Segmenti — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Segment (BPM)', 'Naglasak'],
      redovi: takt.segmenti.slice(0, 16).map((s) => [
        String(s.t),
        String(s.sloj),
        `H${s.harmonik}`,
        String(s.metar),
        String(s.segmentBpm),
        String(s.naglasak),
      ]),
    },
  },
  {
    id: 'laureatski-takt-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Taktičku Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI TAKT aktivan: taktni indeks ${takt.taktniIndeks}, stabilnost ${takt.metarStabilnost}, opseg ${takt.taktOpsegBpm} BPM.`,
      dugmad: [
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam' },
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls', stil: 'sekundarno' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
