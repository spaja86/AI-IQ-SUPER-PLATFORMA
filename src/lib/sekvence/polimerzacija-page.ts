import type { Sekvenca } from '@/lib/types';
import { buildPolimerzacija } from '@/lib/polimerzacija';

const polimerzacija = buildPolimerzacija('system');

export const polimerzacijaSekvence: Sekvenca[] = [
  {
    id: 'polimerzacija-hero',
    tip: 'hero',
    naslov: '🧬 POLIMERZACIJA — Lančano Vezivanje Procesnih Jedinica',
    podnaslov: 'Kanonizovani pregled inicijacije, propagacije, terminacije i kroslink lanci',
    ikona: '🧬',
    redosled: 1,
    podaci: {
      opis: `POLIMERZACIJA prati ${polimerzacija.lanci.length} ključna lanca kroz indeks kohezije ${polimerzacija.indeksKohezije}, stabilnost ${polimerzacija.stabilnost} i prosečnu reakcionu stopu ${polimerzacija.ukupnaStopa}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'polimerzacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks kohezije', vrednost: polimerzacija.indeksKohezije, ikona: '🔗' },
        { naziv: 'Stabilnost', vrednost: polimerzacija.stabilnost, ikona: '🛡️' },
        { naziv: 'Prosek iskoriscenosti', vrednost: `${Math.round(polimerzacija.prosekIskoriscenosti * 100)}%`, ikona: '📈' },
        { naziv: 'Prosek stepena', vrednost: polimerzacija.prosekStepena, ikona: '🎚️' },
        { naziv: 'Ukupna stopa', vrednost: polimerzacija.ukupnaStopa, ikona: '⚗️' },
        { naziv: 'Broj lanci', vrednost: polimerzacija.lanci.length, ikona: '🧬' },
      ],
    },
  },
  {
    id: 'polimerzacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Polimerzacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Inicijacija',
          opis: 'Pokretanje lančane reakcije kroz aktivaciju inicijalnih procesnih jedinica.',
          ikona: '🔬',
          oznake: ['Start', 'Aktivacija', 'Energija'],
        },
        {
          naslov: 'Propagacija',
          opis: 'Lančano širenje i vezivanje monomernih jedinica u rastuće strukture.',
          ikona: '🔗',
          oznake: ['Rast', 'Vezivanje', 'Throughput'],
        },
        {
          naslov: 'Terminacija & Kroslink',
          opis: 'Završetak lanca i umrežavanje za maksimalnu koheziju i čvrstinu strukture.',
          ikona: '🧱',
          oznake: ['Završetak', 'Kroslink', 'Kohezija'],
        },
      ],
    },
  },
  {
    id: 'polimerzacija-tabela',
    tip: 'tabela',
    naslov: '📋 Lanci — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Lanac', 'Reakciona stopa', 'Iskoriscenost', 'Stepen', 'Temperatura (°C)', 'Status'],
      redovi: polimerzacija.lanci.map((lanac) => [
        lanac.naziv,
        String(lanac.reakcionaStopa),
        `${Math.round(lanac.iskoriscenost * 100)}%`,
        String(lanac.stepen),
        String(lanac.temperaturaProcesa),
        lanac.status,
      ]),
    },
  },
  {
    id: 'polimerzacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Polimerzacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks kohezije je ${polimerzacija.indeksKohezije}. Prati API izvor istine na /api/polimerzacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Polimerzacija API', href: '/api/polimerzacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
