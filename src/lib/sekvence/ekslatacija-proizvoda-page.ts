import type { Sekvenca } from '@/lib/types';
import { KOMPANIJA } from '@/lib/constants';
import {
  getEkslatacijaPregled,
  getEkslatacijaMetrike,
  getVrhunckiProizvodi,
  getUkupniKanalniPotencijal,
} from '@/lib/ekslatacija-proizvoda';

const pregled = getEkslatacijaPregled();
const metrike = getEkslatacijaMetrike();
const vrhunckiProizvodi = getVrhunckiProizvodi(6);
const ukupniKanalniPotencijal = getUkupniKanalniPotencijal();

export const ekslatacijaProizvodaSekvence: Sekvenca[] = [
  {
    id: 'ekslatacija-hero',
    tip: 'hero',
    naslov: '💸 Ekslatacija Proizvoda',
    podnaslov: `${KOMPANIJA} — Komercijalni lifecycle ${metrike.ukupnoProizvoda} IT proizvoda kroz ${metrike.aktivnihKanala} kanala ekslatacije`,
    ikona: '💸',
    redosled: 1,
    podaci: {
      opis: `Ekslatacija Proizvoda prati komercijalni lifecycle svih IT proizvoda Digitalne Industrije — od istraživanja do zrelosti. Mesečni potencijal prihoda: €${metrike.ukupanPotencijalPrihoda.toLocaleString()}, prosečni rast: ${metrike.prosecniRast}%, tržišna pokrivenost: ${metrike.prosecnaPokrivenost}%.`,
      dugmad: [
        { tekst: 'IT Proizvodi', href: '/it-proizvodi' },
        { tekst: 'Reklame & Partnerstva', href: '/reklame-i-partnerstva', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'ekslatacija-statistika',
    tip: 'statistika',
    naslov: '📊 KPI — Ekslatacija Proizvoda',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Proizvoda', vrednost: metrike.ukupnoProizvoda, ikona: '📦' },
        { naziv: 'Aktivnih', vrednost: metrike.aktivnih, ikona: '✅' },
        { naziv: 'U Pripremi', vrednost: metrike.uPripremi, ikona: '⏳' },
        { naziv: 'Planiranih', vrednost: metrike.planirani, ikona: '📋' },
        { naziv: 'Kanala Prodaje', vrednost: metrike.aktivnihKanala, ikona: '🔗' },
        {
          naziv: 'Mesečni Prihod (EUR)',
          vrednost: `€${metrike.ukupanPotencijalPrihoda.toLocaleString()}`,
          ikona: '💶',
        },
        { naziv: 'Prosečni Rast %', vrednost: `${metrike.prosecniRast}%`, ikona: '📈' },
        { naziv: 'Tržišna Pokrivenost', vrednost: `${metrike.prosecnaPokrivenost}%`, ikona: '🌍' },
        {
          naziv: 'Kanalski Potencijal (EUR)',
          vrednost: `€${ukupniKanalniPotencijal.toLocaleString()}`,
          ikona: '💰',
        },
      ],
    },
  },
  {
    id: 'ekslatacija-lifecycle-tabela',
    tip: 'tabela',
    naslov: '🔄 Lifecycle Faze Ekslatacije',
    podnaslov: 'Istraživanje → Razvoj → Pilot → Lansiranje → Skaliranje → Zrelost → Opadanje',
    redosled: 3,
    podaci: {
      zaglavlje: ['Faza', 'Broj Proizvoda', 'Opis', 'Ukupan Prihod (EUR/mes)'],
      redovi: pregled.poFazama.map((f) => [
        f.faza,
        String(f.broj),
        f.opis,
        f.ukupanPrihod > 0 ? `€${f.ukupanPrihod.toLocaleString()}` : '—',
      ]),
    },
  },
  {
    id: 'ekslatacija-vrhunckiProizvodi',
    tip: 'kartice',
    naslov: '🏆 Top Komercijalni Proizvodi',
    podnaslov: 'Sortirano po mesečnom prihodu',
    redosled: 4,
    podaci: {
      kartice: vrhunckiProizvodi.map((p) => ({
        naslov: `${p.ikona} ${p.naziv}`,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [p.fazaEkslatacije, p.komercijalnIModel, `€${p.prihod.toLocaleString()}/mes`, `+${p.rast}%`],
      })),
    },
  },
  {
    id: 'ekslatacija-modeli-tabela',
    tip: 'tabela',
    naslov: '💼 Komercijalni Modeli',
    podnaslov: 'Distribucija prihoda po modelima',
    redosled: 5,
    podaci: {
      zaglavlje: ['Model', 'Broj Proizvoda', 'Ukupan Prihod (EUR/mes)'],
      redovi: pregled.poModelima.map((m) => [
        m.model,
        String(m.broj),
        `€${m.ukupanPrihod.toLocaleString()}`,
      ]),
    },
  },
  {
    id: 'ekslatacija-kanali',
    tip: 'kartice',
    naslov: '🔗 Kanali Ekslatacije',
    podnaslov: `${metrike.aktivnihKanala} aktivnih prodajnih kanala — ukupni potencijal €${ukupniKanalniPotencijal.toLocaleString()}/mes`,
    redosled: 6,
    podaci: {
      kartice: pregled.kanali.map((k) => ({
        naslov: `${k.ikona} ${k.naziv}`,
        opis: k.opis,
        ikona: k.ikona,
        oznake: [k.tip, `${k.aktivnih} aktivnih`, `€${k.potencijalEUR.toLocaleString()}/mes`],
      })),
    },
  },
  {
    id: 'ekslatacija-cta',
    tip: 'cta',
    naslov: 'Misija: Puna Ekslatacija na 100%',
    redosled: 7,
    podaci: {
      opis: 'Svaki IT proizvod prolazi kroz komercijalni lifecycle ka punoj tržišnoj ekslataciji i maksimalnom prihodu.',
      dugmad: [
        { tekst: 'Reklame & Partnerstva', href: '/reklame-i-partnerstva' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
