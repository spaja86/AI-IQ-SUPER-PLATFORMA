import type { Sekvenca } from '@/lib/types';

export const unitTestoviSekvence: Sekvenca[] = [
  {
    id: 'unit-testovi-hero',
    tip: 'hero',
    naslov: '🧪 Unit Testovi',
    podnaslov: 'SPAJA Unit Testovi — Automatizovano testiranje i kvalitet koda',
    ikona: '🧪',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Unit Testovi sistem pokriva 14 test suita sa 746 testova i 92.1% pokrivenosti koda. Automatizovano testiranje osigurava kvalitet i pouzdanost celokupne platforme.',
      dugmad: [
        { tekst: 'Pogledaj testove', href: '/unit-testovi' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'unit-testovi-statistika',
    tip: 'statistika',
    naslov: '📊 Testovi u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Test suita', vrednost: '14', ikona: '📦' },
        { naziv: 'Testova', vrednost: '746', ikona: '🧪' },
        { naziv: 'Pokrivenost', vrednost: '92.1%', ikona: '📊' },
        { naziv: 'Prolaznost', vrednost: '99.7%', ikona: '✅' },
      ],
    },
  },
  {
    id: 'unit-testovi-kartice',
    tip: 'kartice',
    naslov: '🧪 Test kategorije',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Komponente', opis: 'Testovi za UI komponente i rendering', ikona: '🧩', oznake: ['React', 'Rendering', 'Snapshots'] },
        { naslov: 'API', opis: 'Testovi za API rute i endpointe', ikona: '🔌', oznake: ['REST', 'Validacija', 'Auth'] },
        { naslov: 'Integracija', opis: 'Integracioni testovi za sistemske tokove', ikona: '🔗', oznake: ['E2E', 'Database', 'Services'] },
        { naslov: 'Performanse', opis: 'Testovi performansi i optimizacije', ikona: '⚡', oznake: ['Benchmark', 'Load', 'Memory'] },
      ],
    },
  },
  {
    id: 'unit-testovi-tekst',
    tip: 'tekst',
    naslov: 'O testiranju',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA platforma koristi sveobuhvatan sistem automatizovanog testiranja koji pokriva sve kriticne delove sistema. Od unit testova za pojedinacne komponente do integracionih testova za celokupne tokove — svaki deo koda prolazi kroz stroge provere kvaliteta.',
      istaknuteStavke: [
        '14 test suita pokriva sve module platforme',
        '746 pojedinacnih testova za maksimalnu pokrivenost',
        '92.1% pokrivenosti koda auth modula (c8 izveštaj)',
        'Automatsko pokretanje testova pri svakom deploy-u',
      ],
    },
  },
];
