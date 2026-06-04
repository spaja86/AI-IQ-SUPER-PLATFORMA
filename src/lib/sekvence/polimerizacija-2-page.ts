import type { Sekvenca } from '@/lib/types';
import { buildPolimerizacija2Report } from '@/lib/polimerizacija-2';

const polimerizacija2 = buildPolimerizacija2Report('sekvence');

export const polimerizacija2Sekvence: Sekvenca[] = [
  {
    id: 'polimerizacija-2-hero',
    tip: 'hero',
    naslov: '🧬 POLIMERIZACIJA 2 — V2 Lančana Analitika',
    podnaslov: 'Prošireni katalog lanaca, scan istorija i trend analiza',
    ikona: '🧬',
    redosled: 1,
    podaci: {
      opis: `POLIMERIZACIJA 2 prati ${polimerizacija2.lanci.length} lanaca kroz indeks kohezije ${polimerizacija2.indeksKohezije} i stabilnost ${polimerizacija2.stabilnost}.`,
      dugmad: [
        { tekst: 'Polimerizacija 2 API', href: '/api/polimerizacija-2' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'polimerizacija-2-statistika',
    tip: 'statistika',
    naslov: '📊 V2 KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks kohezije', vrednost: polimerizacija2.indeksKohezije, ikona: '🔗' },
        { naziv: 'Stabilnost', vrednost: polimerizacija2.stabilnost, ikona: '🛡️' },
        { naziv: 'Ukupna stopa', vrednost: polimerizacija2.ukupnaStopa, ikona: '⚗️' },
        { naziv: 'Prosek stepena', vrednost: polimerizacija2.prosekStepena, ikona: '🎚️' },
        { naziv: 'Prosek iskorišćenosti', vrednost: `${Math.round(polimerizacija2.prosekIskoriscenosti * 100)}%`, ikona: '📈' },
        { naziv: 'Kritičnih', vrednost: polimerizacija2.kriticnih, ikona: '🚨' },
      ],
    },
  },
  {
    id: 'polimerizacija-2-kartice',
    tip: 'kartice',
    naslov: '🧩 Faze procesa V2',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Inicijacija', opis: 'Aktivacija procesa i početak lančane reakcije.', ikona: '🔬', oznake: ['Start', 'Aktivacija'] },
        { naslov: 'Propagacija', opis: 'Rast lanaca kroz kontinuirano vezivanje jedinica.', ikona: '🔗', oznake: ['Rast', 'Throughput'] },
        { naslov: 'Terminacija', opis: 'Kontrolisano zatvaranje reaktivnih sekvenci.', ikona: '⛔', oznake: ['Stop', 'Kontrola'] },
        { naslov: 'Kroslink', opis: 'Umrežavanje lanaca radi jače strukturalne kohezije.', ikona: '🧱', oznake: ['Mreža', 'Čvrstina'] },
        { naslov: 'Umrežavanje', opis: 'Fino povezivanje procesa u stabilnu operativnu matricu.', ikona: '🕸️', oznake: ['Matrica', 'Stabilnost'] },
        { naslov: 'Purifikacija', opis: 'Finalna filtracija i kvalitet izlaznog toka.', ikona: '✨', oznake: ['Kvalitet', 'Final'] },
      ],
    },
  },
  {
    id: 'polimerizacija-2-tabela',
    tip: 'tabela',
    naslov: '📋 V2 pregled lanaca',
    redosled: 4,
    podaci: {
      zaglavlje: ['Lanac', 'Faza', 'Reakciona stopa', 'Iskorišćenost', 'Stepen', 'Status'],
      redovi: polimerizacija2.lanci.map((lanac) => [
        lanac.naziv,
        lanac.fazaProcesa,
        String(lanac.reakcionaStopa),
        `${Math.round(lanac.iskoriscenost * 100)}%`,
        String(lanac.stepen),
        lanac.status,
      ]),
    },
  },
  {
    id: 'polimerizacija-2-cta',
    tip: 'cta',
    naslov: '🚀 Pokreni Polimerizacija 2 sken',
    redosled: 5,
    podaci: {
      opis: `Poslednji scan je ${polimerizacija2.scanId}. Pokretanje: /api/polimerizacija-2/sken, trendovi: /api/polimerizacija-2/trendovi.`,
      dugmad: [
        { tekst: 'Pokreni sken', href: '/api/polimerizacija-2/sken' },
        { tekst: 'Trendovi', href: '/api/polimerizacija-2/trendovi', stil: 'sekundarno' },
      ],
    },
  },
];
