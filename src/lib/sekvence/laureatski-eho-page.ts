import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiEho } from '@/lib/laureatski-eho';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const eho = buildLaureatskiEho('system');

export const laureatskiEhoSekvence: Sekvenca[] = [
  {
    id: 'laureatski-eho-hero',
    tip: 'hero',
    naslov: '📣 LAUREATSKI EHO — Koherentnost Povratne Sprege',
    podnaslov:
      'Eho matrica izvedena iz LAUREATSKOG ODJEKA i LAUREATSKOG TALASA kroz 32 impulsa',
    ikona: '📣',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI EHO mapira ${eho.impulsi.length} eho impulsa. Eho indeks: ${eho.ehoIndeks}. Eho stabilnost: ${eho.ehoStabilnost}. Opseg: ${eho.ehoOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava eho koherentnost sistema.`,
      dugmad: [
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek' },
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-eho-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Eha',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski eho transformiše odječne impulse u model povratne sprege kombinovanjem rezonance, amplitude i normalizovanog odziva. ' +
        'Svaki impuls meri stabilnost eho odgovora laureatskog centra kroz slojeve i harmonike. ' +
        'Rezultat je eho mapa stabilnosti, opsega i koherentnosti sistema.',
      istaknuteStavke: [
        `Eho indeks: ${eho.ehoIndeks}`,
        `Eho stabilnost: ${eho.ehoStabilnost}`,
        `Prosecni eho: ${eho.prosecniEhoHz} Hz`,
        `Maksimalni eho: ${eho.maksimalniEhoHz} Hz`,
        `Minimalni eho: ${eho.minimalniEhoHz} Hz`,
        `Ukupan broj impulsa: ${eho.impulsi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-eho-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Eho Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Eho Indeks', vrednost: eho.ehoIndeks, ikona: '📣' },
        { naziv: 'Eho Stabilnost', vrednost: eho.ehoStabilnost, ikona: '🧭' },
        { naziv: 'Prosecni Eho', vrednost: `${eho.prosecniEhoHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalni Eho', vrednost: `${eho.maksimalniEhoHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalni Eho', vrednost: `${eho.minimalniEhoHz} Hz`, ikona: '⬇️' },
        { naziv: 'Eho Opseg', vrednost: `${eho.ehoOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Impulsa', vrednost: eho.impulsi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-eho-tabela',
    tip: 'tabela',
    naslov: '📋 Eho Impulsi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Eho (Hz)', 'Povratna Sprega'],
      redovi: eho.impulsi.slice(0, 16).map((i) => [
        String(i.t),
        String(i.sloj),
        `H${i.harmonik}`,
        String(i.metar),
        String(i.faza),
        String(i.ehoHz),
        String(i.povratnaSprega),
      ]),
    },
  },
  {
    id: 'laureatski-eho-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Eho Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI EHO aktivan: eho indeks ${eho.ehoIndeks}, stabilnost ${eho.ehoStabilnost}, opseg ${eho.ehoOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI ODJEK', href: '/laureatski-odjek' },
        { tekst: 'LAUREATSKI TALAS', href: '/laureatski-talas', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
