import type { Sekvenca } from '@/lib/types';
import { getMikiMausIPajaPatakData } from '@/lib/miki-maus-i-paja-patak';

const data = getMikiMausIPajaPatakData();

export const mikiMausIPajaPatakSekvence: Sekvenca[] = [
  {
    id: 'miki-paja-hero',
    tip: 'hero',
    naslov: '🐭🦆 MIKI MAUS I PAJA PATAK',
    podnaslov: 'Narativ o partnerstvu, tempu i zajedničkom rešavanju izazova',
    ikona: '🐭',
    redosled: 1,
    podaci: {
      opis: `${data.opis} Verzija modula: v${data.verzija}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Story of Life', href: '/story-of-life', stil: 'sekundarno' },
        { tekst: 'API modula', href: '/api/miki-maus-i-paja-patak', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'miki-paja-statistika',
    tip: 'statistika',
    naslov: '📊 Modul KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Likovi', vrednost: data.statistika.brojLikova, ikona: '👥' },
        { naziv: 'Scene', vrednost: data.statistika.brojScena, ikona: '🎬' },
        { naziv: 'Ton', vrednost: data.statistika.ton, ikona: '🎭' },
        { naziv: 'Tip', vrednost: data.statistika.tipModula, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'miki-paja-likovi',
    tip: 'kartice',
    naslov: '🎭 Profili likova',
    redosled: 3,
    podaci: {
      kartice: data.likovi.map((lik) => ({
        naslov: lik.ime,
        opis: `${lik.uloga}. ${lik.osobina}.`,
        ikona: '✨',
        oznake: ['tim', 'koordinacija'],
      })),
    },
  },
  {
    id: 'miki-paja-scene',
    tip: 'tabela',
    naslov: '🗺️ Tok narativa',
    redosled: 4,
    podaci: {
      zaglavlje: ['Korak', 'Fokus', 'Ishod'],
      redovi: data.scene.map((scena) => [scena.korak, scena.fokus, scena.ishod]),
    },
  },
  {
    id: 'miki-paja-tekst',
    tip: 'tekst',
    naslov: '🧭 Ključne poruke',
    redosled: 5,
    podaci: {
      sadrzaj:
        'Modul prikazuje kako kombinacija planiranja i operativne energije vodi ka stabilnom rezultatu u svakoj iteraciji.',
      istaknuteStavke: data.poruke,
    },
  },
  {
    id: 'miki-paja-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi kroz ekosistem',
    redosled: 6,
    podaci: {
      opis: 'Pređi na povezane module i API izlaz za dalju integraciju.',
      dugmad: [
        { tekst: 'Otvorite API', href: '/api/miki-maus-i-paja-patak' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
