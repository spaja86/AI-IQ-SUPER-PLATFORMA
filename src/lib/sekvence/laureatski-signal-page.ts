import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiSignal } from '@/lib/laureatski-signal';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const signal = buildLaureatskiSignal('system');

export const laureatskiSignalSekvence: Sekvenca[] = [
  {
    id: 'laureatski-signal-hero',
    tip: 'hero',
    naslov: '📡 LAUREATSKI SIGNAL — Koherentnost Impulsa Sistema',
    podnaslov:
      'Signalna matrica izvedena iz LAUREATSKOG TAKTA i LAUREATSKOG RITMA kroz 32 impulsa',
    ikona: '📡',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI SIGNAL meri impulse laureatskog centra kroz ${signal.impulsi.length} signalnih impulsa. Signalni indeks: ${signal.signalniIndeks}. Signal stabilnost: ${signal.signalStabilnost}. Opseg: ${signal.signalOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona emituje sinhronizovani signal.`,
      dugmad: [
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt' },
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-signal-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Signala',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski signal pretvara taktne segmente u signalne impulse merenjem sinusoidnog faktora metra. ' +
        'Svaki impuls kombinuje amplitudu akcenta, naglasak i sinusoidno fazno kretanje. ' +
        'Rezultat je signalna mapa stabilnosti, opsega i koherentnosti laureatskog centra.',
      istaknuteStavke: [
        `Signalni indeks: ${signal.signalniIndeks}`,
        `Signal stabilnost: ${signal.signalStabilnost}`,
        `Prosecni impuls: ${signal.prosecniImpulsHz} Hz`,
        `Maksimalni impuls: ${signal.maksimalniImpulsHz} Hz`,
        `Minimalni impuls: ${signal.minimalniImpulsHz} Hz`,
        `Ukupan broj impulsa: ${signal.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-signal-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Signalni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Signalni Indeks', vrednost: signal.signalniIndeks, ikona: '📡' },
        { naziv: 'Signal Stabilnost', vrednost: signal.signalStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Impuls', vrednost: `${signal.prosecniImpulsHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Impuls', vrednost: `${signal.maksimalniImpulsHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Impuls', vrednost: `${signal.minimalniImpulsHz} Hz`, ikona: '⬇️' },
        { naziv: 'Signal Opseg', vrednost: `${signal.signalOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: signal.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-signal-tabela',
    tip: 'tabela',
    naslov: '📋 Signalni Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Impuls (Hz)', 'Amplituda'],
      redovi: signal.impulsi.slice(0, 16).map((s) => [
        String(s.t),
        String(s.sloj),
        `H${s.harmonik}`,
        String(s.metar),
        String(s.impulsHz),
        String(s.amplituda),
      ]),
    },
  },
  {
    id: 'laureatski-signal-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Signalnu Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI SIGNAL aktivan: signalni indeks ${signal.signalniIndeks}, stabilnost ${signal.signalStabilnost}, opseg ${signal.signalOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt' },
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI PULS', href: '/laureatski-puls', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
