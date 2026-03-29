import type { Sekvenca } from '@/lib/types';

export const bankaSekvence: Sekvenca[] = [
  {
    id: 'banka-hero',
    tip: 'hero',
    naslov: '🏦 Digitalna Banka',
    podnaslov: 'AI IQ World Bank — Globalna digitalna banka sa AI optimizacijom',
    ikona: '🏦',
    redosled: 1,
    podaci: {
      opis: 'AI IQ World Bank je digitalna banka koja koristi vestacku inteligenciju za optimizaciju finansijskih operacija, globalnih transfera i investicionih odluka.',
      dugmad: [
        { tekst: 'Menjacnica', href: '/menjacnica' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'banka-tekst',
    tip: 'tekst',
    naslov: 'O digitalnom bankarstvu',
    redosled: 2,
    podaci: {
      sadrzaj: 'AI IQ World Bank kombinuje tradicionalno bankarstvo sa naprednom AI tehnologijom. Globalni transferi, kripto integracija i pametne investicione odluke — sve na jednom mestu.',
      istaknuteStavke: [
        'Globalni transferi u realnom vremenu',
        'AI-optimizovane investicione odluke',
        'Kripto i fiat racuni na jednoj platformi',
        'Napredna bezbednost sa viseslojnom enkripcijom',
      ],
    },
  },
  {
    id: 'banka-statistika',
    tip: 'statistika',
    naslov: '📊 Banka u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Racuni', vrednost: '5K+', ikona: '👤' },
        { naziv: 'Transferi/dan', vrednost: '12K', ikona: '💸' },
        { naziv: 'Krediti', vrednost: '2.5K', ikona: '📋' },
        { naziv: 'Investicije', vrednost: '800+', ikona: '📈' },
      ],
    },
  },
  {
    id: 'banka-kartice',
    tip: 'kartice',
    naslov: '💳 Bankarski servisi',
    redosled: 4,
    podaci: {
      kartice: [
        { naslov: 'Racuni', opis: 'Digitalni racuni sa multi-valutnom podrskom', ikona: '👤', oznake: ['Fiat', 'Kripto', 'Multi-valuta'] },
        { naslov: 'Transferi', opis: 'Globalni transferi u realnom vremenu', ikona: '💸', oznake: ['Instant', 'SWIFT', 'Blockchain'] },
        { naslov: 'Krediti', opis: 'AI-optimizovani kreditni proizvodi', ikona: '📋', oznake: ['AI scoring', 'Fleksibilno', 'Niski kamati'] },
        { naslov: 'Investicije', opis: 'Pametno investiranje sa AI preporukama', ikona: '📈', oznake: ['Akcije', 'Kripto', 'Fondovi'] },
      ],
    },
  },
  {
    id: 'banka-lista',
    tip: 'lista',
    naslov: '🔒 Bezbednosne funkcije',
    redosled: 5,
    podaci: {
      stavke: [
        { ikona: '🛡️', naslov: 'Viseslojna enkripcija', opis: 'E2E enkripcija za sve transakcije' },
        { ikona: '🌍', naslov: 'Globalni pristup', opis: 'Pristup iz bilo kog dela sveta 24/7' },
        { ikona: '🧠', naslov: 'AI optimizacija', opis: 'Vestacka inteligencija za bolje odluke' },
        { ikona: '🔐', naslov: 'Biometricka autentifikacija', opis: 'Sigurno logovanje sa biometrijom' },
      ],
    },
  },
  {
    id: 'banka-cta',
    tip: 'cta',
    naslov: '🚀 Zapocnite sa digitalnim bankarstvom',
    redosled: 6,
    podaci: {
      opis: 'AI IQ World Bank — vasa digitalna banka za globalno poslovanje.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Menjacnica', href: '/menjacnica', stil: 'sekundarno' },
      ],
    },
  },
];
