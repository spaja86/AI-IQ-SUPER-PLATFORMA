import type { Sekvenca } from '@/lib/types';
import {
  spajaDigitalniKompjuterSistem,
  digitalniKompjuteriSistem,
  spajaKonzole,
  spajaDzojstici,
  getSveKomponente,
} from '@/lib/spaja-digitalni-kompjuter';

const sistem = spajaDigitalniKompjuterSistem;
const sveKomponente = getSveKomponente();
const standardni = digitalniKompjuteriSistem[0];
const aiIq = digitalniKompjuteriSistem[1];

export const spajaDigitalniKompjuterSekvence: Sekvenca[] = [
  // ─── Hero ──────────────────────────────────────────────
  {
    id: 'dk-hero',
    tip: 'hero',
    naslov: '🖥️ SPAJA Digitalni Kompjuter',
    podnaslov: `${sistem.statistika.ukupnoKomponenti} komponenti × ${sistem.statistika.ukupnoKompjutera} tipa kompjutera × ${sistem.statistika.ukupnoKonzola} konzole — SPAJA Generator za Endzine`,
    ikona: '🖥️',
    redosled: 1,
    podaci: {
      opis: `Kompletni digitalni kompjuter sastavljen od ${sistem.statistika.ukupnoKomponenti} SPAJA komponenti — svaka pokretana od SPAJA Generator za Endzine. Dva tipa kompjutera (standardni sa Monitoring Live i sa AI IQ Monitoring), dve konzole (Virtuelna i Digitalna) sa dzojsticima. Aktivnih komponenti: ${sistem.statistika.aktivnihKomponenti}.`,
      dugmad: [
        { tekst: 'Generator Endzina', href: '/spaja-generator-engine' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  // ─── Tekst — opis sistema ──────────────────────────────
  {
    id: 'dk-tekst-uvod',
    tip: 'tekst',
    naslov: 'Arhitektura digitalnog kompjutera',
    redosled: 2,
    podaci: {
      sadrzaj: `SPAJA Digitalni Kompjuter je kompletni hardverski ekosistem koji se sastoji od svih kljucnih komponenti modernog kompjutera — Maticna Ploca, Server, dva Procesora sa cipovima, BIOS, Hard Disk, RAM (276.000 GB), GPU (8.700.000 jezgara), dve Graficke kartice (276.000 RAM), Tastatura i Mis, i Monitoring sistem. Svaka komponenta je pokretana od SPAJA Generator za Endzine.

Dva tipa kompjutera su dostupna: standardni sa SPAJA Monitoring Live za live pracenje, i napredni sa AI IQ Monitoring za AI-powered analizu i prediktivno odrzavanje. Pored toga, dostupne su dve konzole sa dzojsticima — Univerzalna Virtuelna Konzola i Univerzalna Digitalna Konzola.`,
      istaknuteStavke: [
        `Ukupno komponenti: ${sistem.statistika.ukupnoKomponenti}`,
        `Aktivnih komponenti: ${sistem.statistika.aktivnihKomponenti}`,
        `Tipovi kompjutera: ${sistem.statistika.ukupnoKompjutera}`,
        `Konzole sa dzojsticima: ${sistem.statistika.ukupnoKonzola}`,
        'SPAJA Generator za Endzine — pokretac svih komponenti',
        'Dual CPU, Dual GPU arhitektura',
      ],
    },
  },
  // ─── Statistika ────────────────────────────────────────
  {
    id: 'dk-statistika',
    tip: 'statistika',
    naslov: 'Sistem u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Komponente', vrednost: sistem.statistika.ukupnoKomponenti, ikona: '🔧' },
        { naziv: 'Aktivne', vrednost: sistem.statistika.aktivnihKomponenti, ikona: '✅' },
        { naziv: 'Kompjuteri', vrednost: sistem.statistika.ukupnoKompjutera, ikona: '🖥️' },
        { naziv: 'Konzole', vrednost: sistem.statistika.ukupnoKonzola, ikona: '🎮' },
      ],
    },
  },
  // ─── Tabela — zajednicke komponente ────────────────────
  {
    id: 'dk-tabela-komponente',
    tip: 'tabela',
    naslov: '🔧 Komponente digitalnog kompjutera',
    redosled: 4,
    podaci: {
      zaglavlje: ['Ikona', 'Naziv', 'Status', 'Opis'],
      redovi: sveKomponente.map((k) => [
        k.ikona,
        k.naziv,
        k.status === 'aktivan' ? '✅ Aktivan' : `⏳ ${k.status}`,
        k.opis.slice(0, 80) + (k.opis.length > 80 ? '...' : ''),
      ]),
    },
  },
  // ─── Kartice — mogucnosti zajednickih komponenti ───────
  {
    id: 'dk-kartice-komponente',
    tip: 'kartice',
    naslov: '⚡ Mogucnosti komponenti',
    redosled: 5,
    podaci: {
      kartice: sveKomponente.slice(0, 8).map((k) => ({
        naslov: `${k.ikona} ${k.naziv}`,
        opis: k.mogucnosti.join(', '),
      })),
    },
  },
  // ─── Kartice — ostale komponente ───────────────────────
  {
    id: 'dk-kartice-komponente-2',
    tip: 'kartice',
    naslov: '⚡ Mogucnosti komponenti (nastavak)',
    redosled: 6,
    podaci: {
      kartice: sveKomponente.slice(8).map((k) => ({
        naslov: `${k.ikona} ${k.naziv}`,
        opis: k.mogucnosti.join(', '),
      })),
    },
  },
  // ─── Tabela — Tip 1: Standardni kompjuter ─────────────
  {
    id: 'dk-tabela-standardni',
    tip: 'tabela',
    naslov: '🖥️ Tip 1: Digitalni Kompjuter sa Monitoring Live',
    redosled: 7,
    podaci: {
      zaglavlje: ['Komponenta', 'Status', 'Monitoring'],
      redovi: [
        ...standardni.komponente.map((k) => [
          `${k.ikona} ${k.naziv}`,
          '✅ Aktivan',
          'SPAJA Generator za Endzine',
        ]),
        [
          `${standardni.monitoringKomponenta.ikona} ${standardni.monitoringKomponenta.naziv}`,
          '✅ Aktivan',
          'SPAJA Monitoring Live',
        ],
      ],
    },
  },
  // ─── Tabela — Tip 2: AI IQ Monitoring kompjuter ───────
  {
    id: 'dk-tabela-ai-iq',
    tip: 'tabela',
    naslov: '🔍 Tip 2: Digitalni Kompjuter sa AI IQ Monitoring',
    redosled: 8,
    podaci: {
      zaglavlje: ['Komponenta', 'Status', 'Monitoring'],
      redovi: [
        ...aiIq.komponente.map((k) => [
          `${k.ikona} ${k.naziv}`,
          '✅ Aktivan',
          'SPAJA Generator za Endzine',
        ]),
        [
          `${aiIq.monitoringKomponenta.ikona} ${aiIq.monitoringKomponenta.naziv}`,
          '✅ Aktivan',
          'AI IQ Monitoring Live',
        ],
      ],
    },
  },
  // ─── Hijerarhija — struktura ──────────────────────────
  {
    id: 'dk-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura sistema',
    redosled: 9,
    podaci: {
      cvorovi: [
        {
          naziv: '🖥️ SPAJA Digitalni Kompjuter',
          deca: [
            {
              naziv: '🔌 Maticna Ploca',
              deca: [
                { naziv: '⚙️ Procesor + Cip' },
                { naziv: '⚙️ Procesor "2" + Cip "2"' },
                { naziv: '🧮 RAM (276.000 GB)' },
                { naziv: '🎮 GPU (8.700.000 jezgara)' },
                { naziv: '🎨 Graficka + Graficka "1"' },
                { naziv: '💿 Hard Disk' },
                { naziv: '💾 BIOS' },
              ],
            },
            { naziv: '🖧 Server' },
            { naziv: '⌨️ Tastatura i Mis' },
            {
              naziv: '📺 Monitoring',
              deca: [
                { naziv: '🎥 SPAJA Monitoring Live' },
                { naziv: '🔍 AI IQ Monitoring Live' },
              ],
            },
          ],
        },
        {
          naziv: '🎮 Konzole',
          deca: [
            { naziv: '🎮 Univerzalna Virtuelna Konzola + Dzojstici' },
            { naziv: '🕹️ Univerzalna Digitalna Konzola + Dzojstici' },
          ],
        },
      ],
    },
  },
  // ─── Tabela — Konzole ─────────────────────────────────
  {
    id: 'dk-tabela-konzole',
    tip: 'tabela',
    naslov: '🎮 Konzole sa dzojsticima',
    redosled: 10,
    podaci: {
      zaglavlje: ['Ikona', 'Naziv', 'Tip', 'Status', 'Mogucnosti'],
      redovi: spajaKonzole.map((k) => [
        k.ikona,
        k.naziv,
        k.tip === 'virtuelna' ? 'Virtuelna' : 'Digitalna',
        '✅ Aktivan',
        k.mogucnosti.slice(0, 3).join(', '),
      ]),
    },
  },
  // ─── Kartice — dzojstici ──────────────────────────────
  {
    id: 'dk-kartice-dzojstici',
    tip: 'kartice',
    naslov: '🕹️ SPAJA Dzojstici',
    redosled: 11,
    podaci: {
      kartice: [
        {
          naslov: `${spajaDzojstici.ikona} ${spajaDzojstici.naziv}`,
          opis: spajaDzojstici.mogucnosti.join(', '),
        },
        {
          naslov: '🎮 Virtuelna Konzola + Dzojstici',
          opis: spajaKonzole[0].mogucnosti.join(', '),
        },
        {
          naslov: '🕹️ Digitalna Konzola + Dzojstici',
          opis: spajaKonzole[1].mogucnosti.join(', '),
        },
      ],
    },
  },
  // ─── Lista — linkovi ──────────────────────────────────
  {
    id: 'dk-lista-linkovi',
    tip: 'lista',
    naslov: '🔗 Linkovi ka SPAJA Generator za Endzine',
    redosled: 12,
    podaci: {
      stavke: [
        `Generator za Endzine: ${sistem.generatorLink}`,
        ...sveKomponente.map((k) => `${k.ikona} ${k.naziv}: ${k.link}`),
        ...spajaKonzole.map((k) => `${k.ikona} ${k.naziv}: ${k.link}`),
        `${spajaDzojstici.ikona} ${spajaDzojstici.naziv}: ${spajaDzojstici.link}`,
      ],
    },
  },
  // ─── CTA ──────────────────────────────────────────────
  {
    id: 'dk-cta',
    tip: 'cta',
    naslov: 'Istrazite digitalni kompjuter',
    redosled: 13,
    podaci: {
      opis: `SPAJA Digitalni Kompjuter — ${sistem.statistika.ukupnoKomponenti} komponenti, ${sistem.statistika.ukupnoKompjutera} tipa kompjutera, ${sistem.statistika.ukupnoKonzola} konzole sa dzojsticima. Sve pokretano od SPAJA Generator za Endzine.`,
      dugmad: [
        { tekst: 'Generator Endzina', href: '/spaja-generator-engine' },
        { tekst: 'Gaming Platforma', href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Pocetna', href: '/', stil: 'sekundarno' },
      ],
    },
  },
];
