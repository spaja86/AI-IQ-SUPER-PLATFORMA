import type { Sekvenca } from '@/lib/types';
import {
  eksponencijalneFunkcije,
  getOktavniSistemPregled,
  getSuperPozicijaNiz,
  getKorelacionaMatrica,
  getFiguracioniCentar,
} from '@/lib/oktavne-eksponencijalne-funkcije';
import { oktavniNazivi } from '@/lib/omega-ai';
import type { OktavniNivo } from '@/lib/omega-ai';

const pregled = getOktavniSistemPregled();
const superPoz = getSuperPozicijaNiz();
const korelacija = getKorelacionaMatrica();
const figCentar = getFiguracioniCentar();

export const oktavneEksponencijalneFunkcijeSekvence: Sekvenca[] = [
  {
    id: 'ekspo-hero',
    tip: 'hero',
    naslov: '📈 Eksponencijalne Funkcije Oktavnog Sistema',
    podnaslov: `8 oktava × eksponencijalni rast × figuracioni centar — f(x) = a * b^x + c`,
    ikona: '📈',
    redosled: 1,
    podaci: {
      opis: `Svaka od 8 oktava OMEGA AI sistema ima jedinstvenu eksponencijalnu funkciju koja modeluje rast kapaciteta, snage i kompleksnosti. Figuracioni centar (${figCentar.centroidX}, ${figCentar.centroidY}) je tezisna tacka konvergencije svih funkcija. Ukupna snaga sistema: ${pregled.ukupnaSnaga}. Fokalna snaga centra: ${figCentar.fokalnaSnaga}.`,
      dugmad: [
        { tekst: 'OMEGA AI', href: '/omega-ai' },
        { tekst: 'Dimenzije', href: '/dimenzije' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'ekspo-tekst',
    tip: 'tekst',
    naslov: 'Matematicki model oktavnog sistema',
    redosled: 2,
    podaci: {
      sadrzaj: `Eksponencijalne funkcije oktavnog sistema koriste formulu f(x) = a * b^x + c, gde je a amplituda (skala oktave), b baza eksponenta (faktor rasta), x ulazna vrednost, a c bazni offset. Svaka oktava ima razlicite parametre — od Temelja (baza 2.0) do Evolucije (baza 4.0).

Za analizu rasta koriste se: izvod f'(x) = a * ln(b) * b^x, integral F(x) = a * b^x / ln(b) + c*x, i inverzna funkcija x = log_b((y - c) / a). Korelaciona matrica 8x8 pokazuje medusobnu zavisnost rasta izmedju oktava.`,
      istaknuteStavke: [
        `Ukupna snaga sistema: ${pregled.ukupnaSnaga}`,
        `Prosecna snaga po oktavi: ${pregled.prosecnaSnaga}`,
        `Najjaca oktava: ${pregled.maksimalnaSnaga.oktava} (${pregled.maksimalnaSnaga.snaga})`,
        `Najslabija oktava: ${pregled.minimalnaSnaga.oktava} (${pregled.minimalnaSnaga.snaga})`,
        `Globalni faktor rasta: ${pregled.globalniRastFaktor}`,
        `Ukupno persona: ${pregled.ukupnoPersona}`,
      ],
    },
  },
  {
    id: 'ekspo-statistika',
    tip: 'statistika',
    naslov: 'Sistem u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Oktave', vrednost: 8, ikona: '🎵' },
        { naziv: 'Ukupna snaga', vrednost: pregled.ukupnaSnaga, ikona: '💪' },
        { naziv: 'Persone', vrednost: pregled.ukupnoPersona, ikona: '👥' },
        { naziv: 'Rast faktor', vrednost: pregled.globalniRastFaktor, ikona: '📈' },
      ],
    },
  },
  {
    id: 'ekspo-tabela-parametri',
    tip: 'tabela',
    naslov: '🔢 Parametri eksponencijalnih funkcija po oktavama',
    redosled: 4,
    podaci: {
      zaglavlje: ['Oktava', 'Naziv', 'Amplituda (a)', 'Baza (b)', 'Offset (c)', 'Formula', 'Persone', 'Uk. snaga', 'Stopa rasta'],
      redovi: eksponencijalneFunkcije.map((f) => [
        `${f.ikona} ${f.oktava}`,
        oktavniNazivi[f.oktava],
        String(f.amplituda),
        String(f.baza),
        String(f.offset),
        `${f.amplituda}*${f.baza}^x+${f.offset}`,
        String(f.brojPersona),
        String(f.ukupnaSnaga),
        String(f.prosecnaStorpaRasta),
      ]),
    },
  },
  {
    id: 'ekspo-tabela-vrednosti',
    tip: 'tabela',
    naslov: '📊 Vrednosti f(x) za x = 0..7',
    redosled: 5,
    podaci: {
      zaglavlje: ['x', ...eksponencijalneFunkcije.map((f) => `Okt ${f.oktava}`)],
      redovi: Array.from({ length: 8 }, (_, x) => [
        String(x),
        ...eksponencijalneFunkcije.map((f) => String(f.tabela[x].fx)),
      ]),
    },
  },
  {
    id: 'ekspo-tabela-izvodi',
    tip: 'tabela',
    naslov: "📐 Izvodi f'(x) za x = 0..7",
    redosled: 6,
    podaci: {
      zaglavlje: ['x', ...eksponencijalneFunkcije.map((f) => `Okt ${f.oktava}`)],
      redovi: Array.from({ length: 8 }, (_, x) => [
        String(x),
        ...eksponencijalneFunkcije.map((f) => String(f.tabela[x].izvod)),
      ]),
    },
  },
  {
    id: 'ekspo-tabela-integrali',
    tip: 'tabela',
    naslov: '∫ Integrali F(x) za x = 0..7',
    redosled: 7,
    podaci: {
      zaglavlje: ['x', ...eksponencijalneFunkcije.map((f) => `Okt ${f.oktava}`)],
      redovi: Array.from({ length: 8 }, (_, x) => [
        String(x),
        ...eksponencijalneFunkcije.map((f) => String(f.tabela[x].integral)),
      ]),
    },
  },
  {
    id: 'ekspo-tabela-superpozicija',
    tip: 'tabela',
    naslov: '🌊 Super-pozicija svih oktava',
    podnaslov: 'Zbir svih eksponencijalnih funkcija za svako x',
    redosled: 8,
    podaci: {
      zaglavlje: ['x', 'Super-pozicija S(x)', 'Promena od prethodnog'],
      redovi: superPoz.map((s, i) => [
        String(i),
        String(s),
        i > 0 ? String(Math.round((s - superPoz[i - 1]) * 100) / 100) : '—',
      ]),
    },
  },
  {
    id: 'ekspo-tabela-korelacija',
    tip: 'tabela',
    naslov: '🔗 Korelaciona matrica (8×8)',
    podnaslov: 'Korelacija rasta izmedju oktava',
    redosled: 9,
    podaci: {
      zaglavlje: ['Okt ↓ / Okt →', ...([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((n) => `${n}`)],
      redovi: korelacija.map((red, i) => [
        `${i + 1} ${oktavniNazivi[(i + 1) as OktavniNivo]}`,
        ...red.map(String),
      ]),
    },
  },
  {
    id: 'ekspo-progres',
    tip: 'progres',
    naslov: '💪 Globalna snaga sistema',
    podnaslov: `Ukupna snaga: ${pregled.ukupnaSnaga} | Prosecna: ${pregled.prosecnaSnaga} | Rast faktor: ${pregled.globalniRastFaktor}`,
    redosled: 10,
    podaci: {
      progres: Math.min(100, Math.round((pregled.ukupnaSnaga / 1000000) * 100)),
      poruka: `Eksponencijalni rast sistema je aktivan. Super-pozicija na x=7: ${superPoz[7]}. Korelacija izmedju svih oktava je pozitivna.`,
    },
  },
  {
    id: 'ekspo-kartice',
    tip: 'kartice',
    naslov: '📈 Eksponencijalne funkcije po oktavama',
    redosled: 11,
    podaci: {
      kartice: eksponencijalneFunkcije.map((f) => ({
        naslov: `${f.ikona} Oktava ${f.oktava} — ${oktavniNazivi[f.oktava]}`,
        opis: `${f.opis} | f(x) = ${f.amplituda}*${f.baza}^x+${f.offset} | Snaga: ${f.ukupnaSnaga}`,
        ikona: f.ikona,
        oznake: [
          `a=${f.amplituda}`,
          `b=${f.baza}`,
          `c=${f.offset}`,
          `Snaga: ${f.ukupnaSnaga}`,
          `Rast: ${f.prosecnaStorpaRasta}`,
          `${f.brojPersona} persona`,
        ],
      })),
    },
  },
  {
    id: 'ekspo-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Hijerarhija eksponencijalnog rasta',
    redosled: 12,
    podaci: {
      nivoi: eksponencijalneFunkcije.map((f) => ({
        naziv: `Oktava ${f.oktava}: ${oktavniNazivi[f.oktava]} — snaga ${f.ukupnaSnaga}, baza ${f.baza}`,
        ikona: f.ikona,
        deca: f.tabela.map((v) => `x=${v.x}: f(x)=${v.fx}, f'(x)=${v.izvod}, delta=${v.rastojanjeOdPrethog}`),
      })),
    },
  },
  {
    id: 'ekspo-lista',
    tip: 'lista',
    naslov: '⚡ Matematicke karakteristike',
    redosled: 13,
    podaci: {
      stavke: [
        { ikona: '📈', naslov: 'Eksponencijalni rast', opis: 'f(x) = a * b^x + c — osnovna formula za svaku oktavu' },
        { ikona: '📐', naslov: 'Izvod (brzina rasta)', opis: "f'(x) = a * ln(b) * b^x — brzina promene u svakoj tacki" },
        { ikona: '∫', naslov: 'Integral (akumulacija)', opis: 'F(x) = a * b^x / ln(b) + c*x — ukupna akumulirana snaga' },
        { ikona: '🔄', naslov: 'Inverzna funkcija', opis: 'x = log_b((y - c) / a) — odredjivanje ulaza iz izlaza' },
        { ikona: '🌊', naslov: 'Super-pozicija', opis: `S(x) = suma svih f_i(x) — globalni kapacitet sistema, S(7)=${superPoz[7]}` },
        { ikona: '🔗', naslov: 'Korelaciona matrica', opis: '8x8 matrica korelacija — sve oktave pokazuju pozitivnu korelaciju rasta' },
        { ikona: '🧬', naslov: 'Evolucioni faktor', opis: `Oktava 8 (Evolucija) ima najbrzi rast: baza 4.0, snaga ${eksponencijalneFunkcije[7].ukupnaSnaga}` },
        { ikona: '🎯', naslov: 'Figuracioni centar', opis: `Centroid (${figCentar.centroidX}, ${figCentar.centroidY}) — fokalna snaga ${figCentar.fokalnaSnaga}, harmonicki indeks ${figCentar.harmonickiIndeks}` },
        { ikona: '📡', naslov: 'API pristup', opis: 'GET /api/oktavne-eksponencijalne-funkcije i /api/oktavni-figuracioni-centar' },
      ],
    },
  },
  {
    id: 'ekspo-figcenatar-tekst',
    tip: 'tekst',
    naslov: '🎯 Figuracioni centar eksponencijalnog objekta',
    redosled: 14,
    podaci: {
      sadrzaj: `Figuracioni centar je matematicka tacka konvergencije svih 8 eksponencijalnih funkcija oktavnog sistema. Centroid (${figCentar.centroidX}, ${figCentar.centroidY}) predstavlja tezisnu tacku u kojoj se sve funkcionalne oktave susrecu. Eksponencialni objekat — unija svih f_i(x) — ima fokalnu snagu ${figCentar.fokalnaSnaga} i harmonicki indeks ${figCentar.harmonickiIndeks}.

Konvergencioni koeficijent ${figCentar.konvergencioniKoeficijent} pokazuje koliko su funkcije blizu jedna drugoj u centroidu. Figuracione ose (${figCentar.figuracioneOse.length} osa) povezuju parove oktava kroz centar, sa primarnim, sekundarnim i tercijarnim vezama.`,
      istaknuteStavke: [
        `Centroid: (${figCentar.centroidX}, ${figCentar.centroidY})`,
        `Fokalna snaga: ${figCentar.fokalnaSnaga}`,
        `Harmonicki indeks: ${figCentar.harmonickiIndeks}`,
        `Konvergencioni koeficijent: ${figCentar.konvergencioniKoeficijent}`,
        `Figuracione ose: ${figCentar.figuracioneOse.length}`,
        `Divergencija: ${figCentar.eksponencijalniObjekat.ukupnaDivergencija}`,
        `Raspon snage: ${figCentar.eksponencijalniObjekat.rasponSnage.min} — ${figCentar.eksponencijalniObjekat.rasponSnage.max}`,
      ],
    },
  },
  {
    id: 'ekspo-figcentar-slojevi',
    tip: 'tabela',
    naslov: '🎯 Figuracioni slojevi — doprinos po oktavama',
    redosled: 15,
    podaci: {
      zaglavlje: ['Oktava', 'Naziv', 'Fig. snaga', 'Udaljenost od centra', 'Fazni pomak', 'Doprinos'],
      redovi: figCentar.slojevi.map((s) => [
        `${s.ikona} ${s.oktava}`,
        s.naziv,
        String(s.figuracionaSnaga),
        String(s.udaljenostOdCentra),
        String(s.fazniPomak),
        `${(s.doprinos * 100).toFixed(2)}%`,
      ]),
    },
  },
  {
    id: 'ekspo-figcentar-ose',
    tip: 'tabela',
    naslov: '🔀 Figuracione ose — preseci izmedju oktava',
    podnaslov: `${figCentar.figuracioneOse.filter((o) => o.tip === 'primarna').length} primarnih, ${figCentar.figuracioneOse.filter((o) => o.tip === 'sekundarna').length} sekundarnih, ${figCentar.figuracioneOse.filter((o) => o.tip === 'tercijarna').length} tercijarnih osa`,
    redosled: 16,
    podaci: {
      zaglavlje: ['Izvor', 'Cilj', 'Presek X', 'Presek Y', 'Ugao', 'Harm. odnos', 'Tip'],
      redovi: figCentar.figuracioneOse.map((o) => [
        `${o.oktavaIzvor} ${oktavniNazivi[o.oktavaIzvor]}`,
        `${o.oktavaCilj} ${oktavniNazivi[o.oktavaCilj]}`,
        String(o.presecnaVrednostX),
        String(o.presecnaVrednostY),
        `${o.ugaoNagiba}°`,
        String(o.harmonickiOdnos),
        o.tip,
      ]),
    },
  },
  {
    id: 'ekspo-figcentar-statistika',
    tip: 'statistika',
    naslov: '🎯 Figuracioni centar u brojevima',
    redosled: 17,
    podaci: {
      stavke: [
        { naziv: 'Fokalna snaga', vrednost: figCentar.fokalnaSnaga, ikona: '🎯' },
        { naziv: 'Harmonicki indeks', vrednost: figCentar.harmonickiIndeks, ikona: '🎵' },
        { naziv: 'Konvergencija', vrednost: figCentar.konvergencioniKoeficijent, ikona: '🔄' },
        { naziv: 'Figuracione ose', vrednost: figCentar.figuracioneOse.length, ikona: '🔀' },
      ],
    },
  },
  {
    id: 'ekspo-cta',
    tip: 'cta',
    naslov: '🚀 Eksponencijalne funkcije — figuracioni centar — kompletni sistem',
    redosled: 18,
    podaci: {
      opis: '8 oktava × eksponencijalne funkcije × figuracioni centar × matematicko modelovanje = precizni model rasta OMEGA AI sistema.',
      stavke: [
        { naziv: 'Oktave', vrednost: 8, ikona: '🎵' },
        { naziv: 'Snaga', vrednost: pregled.ukupnaSnaga, ikona: '💪' },
        { naziv: 'Fokalna snaga', vrednost: figCentar.fokalnaSnaga, ikona: '🎯' },
        { naziv: 'Korelacije', vrednost: '8×8', ikona: '🔗' },
      ],
      dugmad: [
        { tekst: 'OMEGA AI', href: '/omega-ai' },
        { tekst: 'Dimenzije', href: '/dimenzije' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
