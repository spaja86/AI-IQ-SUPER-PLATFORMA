import type { Sekvenca } from '@/lib/types';
import { buildRezonancija } from '@/lib/rezonancija';

const rezonancija = buildRezonancija('system');

export const rezonancijaSekvence: Sekvenca[] = [
  {
    id: 'rezonancija-hero',
    tip: 'hero',
    naslov: '🎛️ REZONANCIJA — Usklađivanje Frekvencijskih Tokova',
    podnaslov: 'Kanonizovani pregled pobude, usklađivanja, stabilizacije i emitovanja',
    ikona: '🎛️',
    redosled: 1,
    podaci: {
      opis: `REZONANCIJA prati ${rezonancija.cvorovi.length} čvora kroz indeks rezonancije ${rezonancija.indeksRezonancije}, koherentnost mreže ${rezonancija.koherentnostMreze} i prosečnu amplitudu ${rezonancija.prosekAmplitude}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'rezonancija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks rezonancije', vrednost: rezonancija.indeksRezonancije, ikona: '🎛️' },
        { naziv: 'Koherentnost mreže', vrednost: rezonancija.koherentnostMreze, ikona: '🛡️' },
        { naziv: 'Efikasnost tjuninga', vrednost: rezonancija.efikasnostTjuninga, ikona: '⚙️' },
        { naziv: 'Prosek amplitude', vrednost: `${Math.round(rezonancija.prosekAmplitude * 100)}%`, ikona: '📏' },
        { naziv: 'Prosek stabilnosti', vrednost: `${Math.round(rezonancija.prosekStabilnosti * 100)}%`, ikona: '🔗' },
        { naziv: 'Broj čvorova', vrednost: rezonancija.cvorovi.length, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'rezonancija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Rezonancije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Pobuda Mreže',
          opis: 'Aktivacija osnovnih frekvencijskih nosilaca i pokretanje rezonantnog ciklusa.',
          ikona: '📡',
          oznake: ['Pobuda', 'Nosilac', 'Start'],
        },
        {
          naslov: 'Usklađivanje & Stabilizacija',
          opis: 'Fazno usklađivanje čvorova uz stabilizaciju oscilatornih tokova.',
          ikona: '🔗',
          oznake: ['Faza', 'Stabilnost', 'Koherentnost'],
        },
        {
          naslov: 'Emitovanje Izlaza',
          opis: 'Emisija harmonizovanog izlaza sa optimizovanom amplitudom.',
          ikona: '🚀',
          oznake: ['Emisija', 'Harmonija', 'Izlaz'],
        },
      ],
    },
  },
  {
    id: 'rezonancija-tabela',
    tip: 'tabela',
    naslov: '📋 Čvorovi — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Čvor', 'Frekvencija (Hz)', 'Amplituda', 'Koherentnost', 'Stabilnost', 'Status'],
      redovi: rezonancija.cvorovi.map((cvor) => [
        cvor.naziv,
        String(cvor.frekvencijaHz),
        `${Math.round(cvor.amplituda * 100)}%`,
        `${Math.round(cvor.koherentnost * 100)}%`,
        `${Math.round(cvor.stabilnost * 100)}%`,
        cvor.status,
      ]),
    },
  },
  {
    id: 'rezonancija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Rezonancija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks rezonancije je ${rezonancija.indeksRezonancije}. Prati API izvor istine na /api/rezonancija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Rezonancija API', href: '/api/rezonancija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
