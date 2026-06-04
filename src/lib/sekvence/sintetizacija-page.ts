import type { Sekvenca } from '@/lib/types';
import { buildSintetizacija } from '@/lib/sintetizacija';

const sintetizacija = buildSintetizacija('system');

export const sintetizacijaSekvence: Sekvenca[] = [
  {
    id: 'sintetizacija-hero',
    tip: 'hero',
    naslov: '🔬 SINTETIZACIJA — Integracija Procesnih Entiteta',
    podnaslov: 'Kanonizovani pregled prikupljanja, spajanja, validacije i emisije',
    ikona: '🔬',
    redosled: 1,
    podaci: {
      opis: `SINTETIZACIJA prati ${sintetizacija.komponente.length} komponente kroz indeks sinteze ${sintetizacija.indeksSinteze}, stabilnost sinteze ${sintetizacija.stabilnostSinteze} i prosečan stepen ${sintetizacija.prosekStepenaSinteze}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'sintetizacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks sinteze', vrednost: sintetizacija.indeksSinteze, ikona: '🔬' },
        { naziv: 'Stabilnost sinteze', vrednost: sintetizacija.stabilnostSinteze, ikona: '🛡️' },
        { naziv: 'Efikasnost integracije', vrednost: sintetizacija.efikasnostIntegracije, ikona: '⚙️' },
        { naziv: 'Prosek stepena', vrednost: `${Math.round(sintetizacija.prosekStepenaSinteze * 100)}%`, ikona: '📏' },
        { naziv: 'Prosek integriteta', vrednost: `${Math.round(sintetizacija.prosekIntegriteta * 100)}%`, ikona: '🔗' },
        { naziv: 'Broj komponenti', vrednost: sintetizacija.komponente.length, ikona: '🧩' },
      ],
    },
  },
  {
    id: 'sintetizacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Sintetizacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Prikupljanje Signala',
          opis: 'Akvizicija ulaznih signala iz distribuiranih izvora za pripremu sinteze.',
          ikona: '📡',
          oznake: ['Akvizicija', 'Signali', 'Ulaz'],
        },
        {
          naslov: 'Spajanje & Validacija',
          opis: 'Integracija entiteta uz validaciju koherentnosti i strukturalnog integriteta.',
          ikona: '🔗',
          oznake: ['Integracija', 'Validacija', 'Koherentnost'],
        },
        {
          naslov: 'Emisija Rezultata',
          opis: 'Finalna emisija sintetizovanih entiteta kao koherentnih procesnih struktura.',
          ikona: '🚀',
          oznake: ['Emisija', 'Struktura', 'Izlaz'],
        },
      ],
    },
  },
  {
    id: 'sintetizacija-tabela',
    tip: 'tabela',
    naslov: '📋 Komponente — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Komponenta', 'Ulazni signali', 'Stepen', 'Koherentnost', 'Integritet', 'Status'],
      redovi: sintetizacija.komponente.map((k) => [
        k.naziv,
        String(k.ulazniSignali),
        `${Math.round(k.stepen * 100)}%`,
        `${Math.round(k.koherentnost * 100)}%`,
        `${Math.round(k.integritet * 100)}%`,
        k.status,
      ]),
    },
  },
  {
    id: 'sintetizacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Sintetizacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks sinteze je ${sintetizacija.indeksSinteze}. Prati API izvor istine na /api/sintetizacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Sintetizacija API', href: '/api/sintetizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
