import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiPuls } from '@/lib/laureatski-puls';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const puls = buildLaureatskiPuls('system');

export const laureatskiPulsSekvence: Sekvenca[] = [
  {
    id: 'laureatski-puls-hero',
    tip: 'hero',
    naslov: '🫀 LAUREATSKI PULS — Dinamika Laureatskog Centra',
    podnaslov:
      'Pulsna analiza harmonijske rezonance izvedena iz LAUCENTRICNOG SPEKTRA i DIGATALNE EUREKE',
    ikona: '🫀',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI PULS meri ritam laureatskog centra kroz 32 otkucaja (8 vremenskih faza × 4 sloja). Pulsni koeficijent: ${puls.pulsniKoeficijent}. Pulsna stabilnost: ${puls.pulsnaStabilnost}. Opseg pulsa: ${puls.pulsniOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona rezonuje u jedinstvenom ritmu.`,
      dugmad: [
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-puls-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Pulsa',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski puls predstavlja vremensku projekciju dominantnih harmonika svakog laucentričnog sloja. ' +
        'U svakom trenutku t, sistem kombinuje bazni laureatski harmonik sa sinusnom oscilacijom sin(2πt/8), ' +
        'ponderisan eureka sinergijom i rezonantnom gustinom sloja. Time dobijamo pulsnu mapu sistema: ' +
        'otkucaje, amplitudu, stabilnost i opseg oscilacija.',
      istaknuteStavke: [
        `Pulsni koeficijent: ${puls.pulsniKoeficijent}`,
        `Pulsna stabilnost: ${puls.pulsnaStabilnost}`,
        `Prosečan puls: ${puls.prosecanPulsHz} Hz`,
        `Maksimalni puls: ${puls.maksimalniPulsHz} Hz`,
        `Minimalni puls: ${puls.minimalniPulsHz} Hz`,
        `Ukupan broj otkucaja: ${puls.otkucaji.length}`,
      ],
    },
  },
  {
    id: 'laureatski-puls-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Pokazatelji Pulsa',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Pulsni Koeficijent', vrednost: puls.pulsniKoeficijent, ikona: '🫀' },
        { naziv: 'Pulsna Stabilnost', vrednost: puls.pulsnaStabilnost, ikona: '🧭' },
        { naziv: 'Prosečan Puls', vrednost: `${puls.prosecanPulsHz} Hz`, ikona: '🎵' },
        { naziv: 'Maksimalni Puls', vrednost: `${puls.maksimalniPulsHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Puls', vrednost: `${puls.minimalniPulsHz} Hz`, ikona: '⬇️' },
        { naziv: 'Pulsni Opseg', vrednost: `${puls.pulsniOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Otkucaja', vrednost: puls.otkucaji.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-puls-tabela',
    tip: 'tabela',
    naslov: '📋 Pulsni Otkucaji — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Frekvencija (Hz)', 'Intenzitet', 'Normalizovano'],
      redovi: puls.otkucaji.slice(0, 16).map((o) => [
        String(o.t),
        String(o.sloj),
        `H${o.harmonik}`,
        String(o.frekvencija),
        String(o.intenzitet),
        String(o.normalizovano),
      ]),
    },
  },
  {
    id: 'laureatski-puls-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Spektralnu Analizu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI PULS aktivan: koeficijent ${puls.pulsniKoeficijent}, stabilnost ${puls.pulsnaStabilnost}, opseg ${puls.pulsniOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
