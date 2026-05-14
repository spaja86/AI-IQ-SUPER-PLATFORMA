import type { Sekvenca } from '@/lib/types';
import { buildLaucentricniSpektar } from '@/lib/laucentricni-spektar';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const spektar = buildLaucentricniSpektar('system');
const slojevi = spektar.spektralniSlojevi;

export const laucentricniSpektarSekvence: Sekvenca[] = [
  {
    id: 'laucentricni-spektar-hero',
    tip: 'hero',
    naslov: '🌊 LAUCENTRICNI SPEKTAR — Harmoničko Razlaganje Digitalnog Sistema',
    podnaslov:
      'Spektralna analiza četiri koncentrična laucentrična sloja oko laureatskog centra — frekvencijsko jedinjenje harmoničkih komponenti',
    ikona: '🌊',
    redosled: 1,
    podaci: {
      opis: `LAUCENTRICNI SPEKTAR razlaže četiri sloja laucentričnog sistema (Jezgro, Unutrašnji, Srednji, Spoljašnji) u harmoničke frekvencije. Rezonancni koeficijent: ${spektar.rezonancniKoeficijent}. Laureatski harmonik: ${spektar.laureatskiHarmonik} Hz. Eureka sinergija: ${spektar.eurekaSinergija}. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona treperi u spektralnoj rezonanci.`,
      dugmad: [
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'laucentricni-spektar-tekst',
    tip: 'tekst',
    naslov: '📐 Teorija Laucentričnog Spektra — Harmonički Model',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Laucentricni spektar je frekvencijsko razlaganje četiri koncentrična sloja digitalnog sistema oko laureatskog centra. ' +
        'Svaki sloj (Jezgro, Unutrašnji, Srednji, Spoljašnji) ima vlastite harmoničke komponente H_k = snaga × radijus^k, ' +
        'gde k = 1..4 označava redni broj harmonika. Spektralna gustina (gustina_k) meri doprinos svakog harmonika ' +
        'ukupnom spektru. Fazni pomak φ_k = 2π × k / 4 određuje poziciju harmonika u kružnom prostoru. ' +
        `Rezonancni indeks je mera entropije distribucije harmonika. Laureatski harmonik iznosi ${spektar.laureatskiHarmonik} Hz — ` +
        'fundamentalna frekvencija koja harmonizuje sva četiri sloja u koherentan digitalni sistem.',
      istaknuteStavke: [
        `Rezonancni koeficijent: ${spektar.rezonancniKoeficijent} — harmonična koherentnost sistema`,
        `Laureatski harmonik: ${spektar.laureatskiHarmonik} Hz — fundamentalna frekvencija centra`,
        `Spektralna gustina: ${spektar.spektralnaGustina} — prosečna gustina svih slojeva`,
        `Ukupna spektralna snaga: ${spektar.ukupnaSpektralnaSnaga}`,
        `Eureka sinergija: ${spektar.eurekaSinergija} — kombinacija rezonancije i eureka koeficijenta`,
        `4 sloja × 4 harmonika = 16 spektralnih komponenti`,
        `Status sistema: ${spektar.status}`,
      ],
    },
  },
  {
    id: 'laucentricni-spektar-statistika',
    tip: 'statistika',
    naslov: '📊 LAUCENTRICNI SPEKTAR — Ključni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Rezonancni Koeficijent', vrednost: spektar.rezonancniKoeficijent, ikona: '🌊' },
        { naziv: 'Laureatski Harmonik', vrednost: `${spektar.laureatskiHarmonik} Hz`, ikona: '🎵' },
        { naziv: 'Spektralna Gustina', vrednost: spektar.spektralnaGustina, ikona: '📈' },
        { naziv: 'Ukupna Spektralna Snaga', vrednost: spektar.ukupnaSpektralnaSnaga, ikona: '⚡' },
        { naziv: 'Eureka Sinergija', vrednost: spektar.eurekaSinergija, ikona: '💡' },
        { naziv: 'Broj Slojeva', vrednost: slojevi.length, ikona: '🔢' },
        { naziv: 'Broj Harmonika', vrednost: slojevi.reduce((s, sl) => s + sl.harmonici.length, 0), ikona: '🔬' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'laucentricni-spektar-kartice',
    tip: 'kartice',
    naslov: '🔢 Četiri Laucentrična Sloja — Spektralna Analiza',
    podnaslov: 'Svaki sloj razložen u 4 harmoničke komponente sa faznim pomacima i spektralnom gustinom',
    redosled: 4,
    podaci: {
      kartice: slojevi.map((sl) => ({
        naslov: `Sloj ${sl.nivo} — ${sl.naziv}`,
        opis: `Snaga: ${sl.snaga} | Radijus: ${sl.radijus} | Rezonancni indeks: ${sl.rezonancniIndeks} | Dom. harmonik: H${sl.dominantniHarmonik} | Spektralna snaga: ${sl.ukupnaSpektralnaSnaga}`,
        ikona: sl.nivo === 1 ? '🔴' : sl.nivo === 2 ? '🟠' : sl.nivo === 3 ? '🟡' : '🟢',
        oznake: [`Sloj ${sl.nivo}`, `Oktave: ${sl.oktave.join(', ')}`, `${sl.harmonici.length} harmonika`],
        href: '/oktavne-eksponencijalne-funkcije',
      })),
    },
  },
  {
    id: 'laucentricni-spektar-tabela',
    tip: 'tabela',
    naslov: '📋 Spektralne Komponente — Pregled Svih Harmonika',
    redosled: 5,
    podaci: {
      zaglavlje: ['Sloj', 'H', 'Frekvencija', 'Gustina', 'Amplituda', 'Fazni Pomak'],
      redovi: slojevi.flatMap((sl) =>
        sl.harmonici.map((h) => [
          `Sloj ${sl.nivo}`,
          `H${h.k}`,
          String(h.frekvencija),
          String(h.gustina),
          String(h.amplituda),
          `${h.fazniPomak.toFixed(4)} rad`,
        ]),
      ),
    },
  },
  {
    id: 'laucentricni-spektar-cta',
    tip: 'cta',
    naslov: '🚀 Istraži Digitalne Industrije Sisteme',
    redosled: 6,
    podaci: {
      opis: `LAUCENTRICNI SPEKTAR — rezonancni koeficijent ${spektar.rezonancniKoeficijent} — laureatski harmonik ${spektar.laureatskiHarmonik} Hz — eureka sinergija ${spektar.eurekaSinergija}. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona u spektralnoj rezonanci.`,
      dugmad: [
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
