import type { Sekvenca } from '@/lib/types';
import { buildModulacija } from '@/lib/modulacija';

const modulacija = buildModulacija('system');

export const modulacijaSekvence: Sekvenca[] = [
  {
    id: 'modulacija-hero',
    tip: 'hero',
    naslov: '📡 MODULACIJA — Adaptivno Kodovanje Signalnih Tokova',
    podnaslov: 'Kanonizovani pregled kodovanja, prenosa, dekodovanja i verifikacije integriteta',
    ikona: '📡',
    redosled: 1,
    podaci: {
      opis: `MODULACIJA prati ${modulacija.kanali.length} kanala kroz indeks modulacije ${modulacija.indeksModulacije}, efikasnost prenosa ${modulacija.efikasnostPrenosa} i ukupnu propusnost ${modulacija.ukupnaBandwidth} kHz.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'modulacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks modulacije', vrednost: modulacija.indeksModulacije, ikona: '📡' },
        { naziv: 'Efikasnost prenosa', vrednost: modulacija.efikasnostPrenosa, ikona: '🛡️' },
        { naziv: 'Prosek integriteta', vrednost: modulacija.prosekIntegriteta, ikona: '⚙️' },
        { naziv: 'Prosek snage', vrednost: `${Math.round(modulacija.prosekSnage * 100)}%`, ikona: '📏' },
        { naziv: 'Ukupna bandwidth', vrednost: `${modulacija.ukupnaBandwidth} kHz`, ikona: '🔗' },
        { naziv: 'Broj kanala', vrednost: modulacija.kanali.length, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'modulacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Modulacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Kodovanje Signala',
          opis: 'Adaptivno kodovanje ulaznih signala za optimalan prenos kroz prenosni kanal.',
          ikona: '🔐',
          oznake: ['Kodovanje', 'Adaptivno', 'Signal'],
        },
        {
          naslov: 'Prenosni Kanal',
          opis: 'Višekanalni prenos modulisanih signala sa praćenjem bandwidtha i snage.',
          ikona: '📶',
          oznake: ['Prenos', 'Bandwidth', 'Kanal'],
        },
        {
          naslov: 'Verifikacija Integriteta',
          opis: 'Dekodovanje i verifikacija integriteta primljenih signala sa detekcijom grešaka.',
          ikona: '✅',
          oznake: ['Verifikacija', 'Integritet', 'Dekodovanje'],
        },
      ],
    },
  },
  {
    id: 'modulacija-tabela',
    tip: 'tabela',
    naslov: '📋 Kanali — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Kanal', 'Frekvencija (kHz)', 'Bandwidth (kHz)', 'Snaga', 'Modulacioni Indeks', 'Integritet', 'Status'],
      redovi: modulacija.kanali.map((kanal) => [
        kanal.naziv,
        String(kanal.frekvencijaKHz),
        String(kanal.bandwidthKHz),
        `${Math.round(kanal.snaga * 100)}%`,
        `${Math.round(kanal.modulacioniIndeks * 100)}%`,
        `${Math.round(kanal.integritet * 100)}%`,
        kanal.status,
      ]),
    },
  },
  {
    id: 'modulacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Modulacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks modulacije je ${modulacija.indeksModulacije}. Prati API izvor istine na /api/modulacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Modulacija API', href: '/api/modulacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
