import type { Sekvenca } from '@/lib/types';
import { buildDemodulacija } from '@/lib/demodulacija';

const demodulacija = buildDemodulacija('system');

export const demodulacijaSekvence: Sekvenca[] = [
  {
    id: 'demodulacija-hero',
    tip: 'hero',
    naslov: '📶 DEMODULACIJA — Rekonstrukcija Signalnih Tokova',
    podnaslov: 'Kanonizovani pregled filtracije, dekodovanja i kontrole kvaliteta izlaza',
    ikona: '📶',
    redosled: 1,
    podaci: {
      opis: `DEMODULACIJA prati ${demodulacija.kanali.length} kanala kroz indeks demodulacije ${demodulacija.indeksDemodulacije}, pouzdanost dekodovanja ${demodulacija.pouzdanostDekodovanja} i prosek kvaliteta ${demodulacija.prosekKvaliteta}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'demodulacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks demodulacije', vrednost: demodulacija.indeksDemodulacije, ikona: '📶' },
        { naziv: 'Pouzdanost dekodovanja', vrednost: demodulacija.pouzdanostDekodovanja, ikona: '🛡️' },
        { naziv: 'Prosek kvaliteta', vrednost: demodulacija.prosekKvaliteta, ikona: '⚙️' },
        { naziv: 'Prosek SNR', vrednost: `${demodulacija.prosekSNR} dB`, ikona: '📏' },
        { naziv: 'Broj kanala', vrednost: demodulacija.kanali.length, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'demodulacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Demodulacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Ulazna Filtracija',
          opis: 'Čišćenje i priprema modulisanog signala pre dekodovanja kroz adaptivne filtere.',
          ikona: '🧹',
          oznake: ['Filter', 'Ulaz', 'SNR'],
        },
        {
          naslov: 'Dekodovanje Kanala',
          opis: 'Rekonstrukcija originalnog sadržaja uz kontrolu stope greške i koherentnosti.',
          ikona: '🔓',
          oznake: ['Dekoder', 'Rekonstrukcija', 'Integritet'],
        },
        {
          naslov: 'Kontrola Kvaliteta',
          opis: 'Finalna verifikacija izlaza i klasifikacija statusa po kanalima.',
          ikona: '✅',
          oznake: ['QA', 'Status', 'Izlaz'],
        },
      ],
    },
  },
  {
    id: 'demodulacija-tabela',
    tip: 'tabela',
    naslov: '📋 Kanali — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Kanal', 'Ulazna frekvencija (kHz)', 'SNR (dB)', 'Stopa greške', 'Verovatnoća rekonstrukcije', 'Kvalitet izlaza', 'Status'],
      redovi: demodulacija.kanali.map((kanal) => [
        kanal.naziv,
        String(kanal.ulaznaFrekvencijaKHz),
        String(kanal.signalNoiseRatioDb),
        `${Math.round(kanal.stopaGreske * 10000) / 100}%`,
        `${Math.round(kanal.verovatnocaRekonstrukcije * 100)}%`,
        `${Math.round(kanal.kvalitetIzlaza * 100)}%`,
        kanal.status,
      ]),
    },
  },
  {
    id: 'demodulacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Demodulacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks demodulacije je ${demodulacija.indeksDemodulacije}. Prati API izvor istine na /api/demodulacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Demodulacija API', href: '/api/demodulacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
