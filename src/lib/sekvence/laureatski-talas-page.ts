import type { Sekvenca } from '@/lib/types';
import { buildLaureatskiTalas } from '@/lib/laureatski-talas';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const talas = buildLaureatskiTalas('system');

export const laureatskiTalasSekvence: Sekvenca[] = [
  {
    id: 'laureatski-talas-hero',
    tip: 'hero',
    naslov: '🌊 LAUREATSKI TALAS — Koherentnost Frekvencijskih Čvorova',
    podnaslov:
      'Talasna matrica izvedena iz LAUREATSKOG SIGNALA i LAUREATSKOG TAKTA kroz 32 čvora',
    ikona: '🌊',
    redosled: 1,
    podaci: {
      opis: `LAUREATSKI TALAS mapira ${talas.cvorovi.length} talasna čvora. Talasni indeks: ${talas.talasniIndeks}. Talasna stabilnost: ${talas.talasnaStabilnost}. Opseg: ${talas.talasniOpsegHz} Hz. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona održava koherentnu talasnu mrežu.`,
      dugmad: [
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal' },
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laureatski-talas-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laureatskog Talasa',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laureatski talas transformiše signalne impulse u frekvencijske čvorove kroz fazni pomeraj i amplitudnu modulaciju. ' +
        'Svaki čvor kombinuje metar, amplitudu i signalni impuls u stabilnu frekvenciju. ' +
        'Rezultat je talasna mapa stabilnosti, opsega i koherentnosti laureatskog centra.',
      istaknuteStavke: [
        `Talasni indeks: ${talas.talasniIndeks}`,
        `Talasna stabilnost: ${talas.talasnaStabilnost}`,
        `Prosecna frekvencija: ${talas.prosecnaFrekvencijaHz} Hz`,
        `Maksimalna frekvencija: ${talas.maksimalnaFrekvencijaHz} Hz`,
        `Minimalna frekvencija: ${talas.minimalnaFrekvencijaHz} Hz`,
        `Ukupan broj cvorova: ${talas.cvorovi.length}`,
      ],
    },
  },
  {
    id: 'laureatski-talas-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni Talasni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Talasni Indeks', vrednost: talas.talasniIndeks, ikona: '🌊' },
        { naziv: 'Talasna Stabilnost', vrednost: talas.talasnaStabilnost, ikona: '🧭' },
        { naziv: 'Prosecna Frekvencija', vrednost: `${talas.prosecnaFrekvencijaHz} Hz`, ikona: '📶' },
        { naziv: 'Maksimalna Frekvencija', vrednost: `${talas.maksimalnaFrekvencijaHz} Hz`, ikona: '⬆️' },
        { naziv: 'Minimalna Frekvencija', vrednost: `${talas.minimalnaFrekvencijaHz} Hz`, ikona: '⬇️' },
        { naziv: 'Talasni Opseg', vrednost: `${talas.talasniOpsegHz} Hz`, ikona: '📐' },
        { naziv: 'Broj Cvorova', vrednost: talas.cvorovi.length, ikona: '🔢' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laureatski-talas-tabela',
    tip: 'tabela',
    naslov: '📋 Talasni Čvorovi — Pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['t', 'Sloj', 'Harmonik', 'Metar', 'Faza', 'Frekvencija (Hz)', 'Amplituda'],
      redovi: talas.cvorovi.slice(0, 16).map((c) => [
        String(c.t),
        String(c.sloj),
        `H${c.harmonik}`,
        String(c.metar),
        String(c.faza),
        String(c.frekvencijaHz),
        String(c.amplituda),
      ]),
    },
  },
  {
    id: 'laureatski-talas-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi Talasnu Sintezu',
    redosled: 5,
    podaci: {
      opis: `LAUREATSKI TALAS aktivan: talasni indeks ${talas.talasniIndeks}, stabilnost ${talas.talasnaStabilnost}, opseg ${talas.talasniOpsegHz} Hz.`,
      dugmad: [
        { tekst: 'LAUREATSKI SIGNAL', href: '/laureatski-signal' },
        { tekst: 'LAUREATSKI TAKT', href: '/laureatski-takt', stil: 'sekundarno' },
        { tekst: 'LAUREATSKI RITAM', href: '/laureatski-ritam', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
