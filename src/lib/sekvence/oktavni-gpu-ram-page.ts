import type { Sekvenca } from '@/lib/types';
import {
  oktavniGPURAMSistem,
  UKUPNO_GPU_JEZGARA,
  UKUPNO_RAM_GB,
} from '@/lib/oktavni-gpu-ram-sistem';

const sistem = oktavniGPURAMSistem;
const stat = sistem.statistika;

export const oktavniGPURAMSekvence: Sekvenca[] = [
  // ─── Hero ──────────────────────────────────────────────
  {
    id: 'okt-gpu-hero',
    tip: 'hero',
    naslov: '🎮 Oktavni GPU/RAM Sistem',
    podnaslov: `Ekvalaturni Galaksipozni Sektor u Matričnom Jedinjenju — ${UKUPNO_GPU_JEZGARA.toLocaleString('sr')} GPU jezgara × ${UKUPNO_RAM_GB.toLocaleString('sr')} GB RAM`,
    ikona: '🎮',
    redosled: 1,
    podaci: {
      opis: sistem.opis,
      dugmad: [
        { tekst: 'Digitalni Kompjuter', href: '/spaja-digitalni-kompjuter' },
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  // ─── Tekst — objašnjenje ──────────────────────────────
  {
    id: 'okt-gpu-tekst',
    tip: 'tekst',
    naslov: 'Oktavni sistem izražen kroz GPU i RAM',
    redosled: 2,
    podaci: {
      sadrzaj: `Digitalni Kompjuter ima veliki GPU sa ${UKUPNO_GPU_JEZGARA.toLocaleString('sr')} jezgara i RAM od ${UKUPNO_RAM_GB.toLocaleString('sr')} GB. Da bi igrice postigle što veći GPU učinak, oktavni sistem u rasponu ekvalaturnog galaksipoznog sektora u matričnom jedinjenju izražava se kroz grafičnu jedinicu GPU i RAM.

Svaka od 8 oktava OMEGA AI sistema dobija svoj deo GPU jezgara i RAM memorije prema galaksipoznom faktoru i matričnom koeficijentu. Više oktave (Koordinacija, Evolucija) dobijaju veći deo resursa jer upravljaju kompleksnijim rendering pipeline-ovima i prediktivnom alokacijom za igrice.

Matričino jedinjenje 8×8 definiše sinergiju između oktava — kako GPU i RAM resursi jedne oktave pojačavaju performanse druge. Dijagonala matrice predstavlja samoodrživu snagu svake oktave, dok van-dijagonalni elementi predstavljaju inter-oktavnu sinergiju.`,
      istaknuteStavke: [
        `GPU jezgara: ${UKUPNO_GPU_JEZGARA.toLocaleString('sr')}`,
        `RAM memorija: ${UKUPNO_RAM_GB.toLocaleString('sr')} GB`,
        `Oktava: ${stat.brojOktava}`,
        `Maks. matrična snaga: ${stat.maksimalnaMatricnaSnaga.toLocaleString('sr')}`,
        `Prosečna matrična snaga: ${stat.prosecnaMatricnaSnaga.toLocaleString('sr')}`,
        `Trag matrice: ${sistem.matricnoJedinjenje.trag.toLocaleString('sr')}`,
      ],
    },
  },
  // ─── Statistika ────────────────────────────────────────
  {
    id: 'okt-gpu-stat',
    tip: 'statistika',
    naslov: 'GPU/RAM sistem u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'GPU jezgara', vrednost: `${(UKUPNO_GPU_JEZGARA / 1_000_000).toFixed(1)}M`, ikona: '🎮' },
        { naziv: 'RAM (GB)', vrednost: `${(UKUPNO_RAM_GB / 1000).toFixed(0)}K`, ikona: '🧮' },
        { naziv: 'Oktava', vrednost: stat.brojOktava, ikona: '🔢' },
        { naziv: 'Matrična snaga', vrednost: stat.maksimalnaMatricnaSnaga.toLocaleString('sr'), ikona: '⚡' },
      ],
    },
  },
  // ─── Tabela — GPU raspodela po oktavama ────────────────
  {
    id: 'okt-gpu-tabela-raspodela',
    tip: 'tabela',
    naslov: '🎮 GPU/RAM raspodela po oktavama — Galaksipozni Sektor',
    redosled: 4,
    podaci: {
      zaglavlje: ['Okt.', 'Naziv', 'GPU jezgara', 'GPU %', 'RAM (GB)', 'RAM %', 'Matrično jedinjenje'],
      redovi: sistem.raspodele.map((r) => [
        `${r.ikona} ${r.oktava}`,
        r.naziv,
        r.gpuJezgara.toLocaleString('sr'),
        `${r.gpuProcenat}%`,
        r.ramGB.toLocaleString('sr'),
        `${r.ramProcenat}%`,
        r.matricnoJedinjenje.toLocaleString('sr'),
      ]),
    },
  },
  // ─── Progres — GPU raspodela ──────────────────────────
  {
    id: 'okt-gpu-progres',
    tip: 'progres',
    naslov: '📊 GPU raspodela po oktavama (%)',
    redosled: 5,
    podaci: {
      stavke: sistem.raspodele.map((r) => ({
        naziv: `${r.ikona} Oktava ${r.oktava} — GPU`,
        vrednost: r.gpuProcenat,
        maksimum: 100,
      })),
    },
  },
  // ─── Progres — RAM raspodela ──────────────────────────
  {
    id: 'okt-ram-progres',
    tip: 'progres',
    naslov: '📊 RAM raspodela po oktavama (%)',
    redosled: 6,
    podaci: {
      stavke: sistem.raspodele.map((r) => ({
        naziv: `${r.ikona} Oktava ${r.oktava} — RAM`,
        vrednost: r.ramProcenat,
        maksimum: 100,
      })),
    },
  },
  // ─── Kartice — galaksipozni sektori ───────────────────
  {
    id: 'okt-gpu-kartice-sektori',
    tip: 'kartice',
    naslov: '🌌 Galaksipozni Sektori — GPU/RAM uloge po oktavama',
    redosled: 7,
    podaci: {
      kartice: sistem.raspodele.map((r) => ({
        naslov: `${r.ikona} Oktava ${r.oktava} — ${r.naziv.split(' — ')[1] ?? r.naziv}`,
        opis: `${r.opis}\n\nGPU: ${r.gpuJezgara.toLocaleString('sr')} jezgara (${r.gpuProcenat}%) | RAM: ${r.ramGB.toLocaleString('sr')} GB (${r.ramProcenat}%) | Matrično jedinjenje: ${r.matricnoJedinjenje.toLocaleString('sr')}`,
      })),
    },
  },
  // ─── Tabela — galaksipozni parametri ──────────────────
  {
    id: 'okt-gpu-tabela-parametri',
    tip: 'tabela',
    naslov: '🌐 Parametri ekvalaturnog galaksipoznog sektora',
    redosled: 8,
    podaci: {
      zaglavlje: ['Okt.', 'Galaksipozni faktor', 'Matrični koef.', 'Ekvalaturni raspon', 'Sektorski množilac'],
      redovi: sistem.raspodele.map((r) => [
        `${r.ikona} ${r.oktava}`,
        r.sektor.galaksipozniFaktor.toFixed(1),
        r.sektor.matricniKoeficijent.toFixed(1),
        r.sektor.ekvalaturniRaspon.toFixed(2),
        r.sektor.sektorskiMnozilac.toFixed(2),
      ]),
    },
  },
  // ─── Tabela — 8×8 matrično jedinjenje ─────────────────
  {
    id: 'okt-gpu-tabela-matrica',
    tip: 'tabela',
    naslov: '🔢 8×8 Matrično jedinjenje GPU × RAM (sinergija između oktava)',
    podnaslov: `Trag matrice: ${sistem.matricnoJedinjenje.trag.toLocaleString('sr')} | Ukupna snaga: ${sistem.matricnoJedinjenje.ukupnaSnaga.toLocaleString('sr')}`,
    redosled: 9,
    podaci: {
      zaglavlje: ['', 'Okt 1', 'Okt 2', 'Okt 3', 'Okt 4', 'Okt 5', 'Okt 6', 'Okt 7', 'Okt 8'],
      redovi: sistem.matricnoJedinjenje.matrica.map((red, i) => [
        `Okt ${i + 1}`,
        ...red.map((v) => v.toLocaleString('sr')),
      ]),
    },
  },
  // ─── Hijerarhija — arhitektura ─────────────────────────
  {
    id: 'okt-gpu-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Oktavnog GPU/RAM Sistema',
    redosled: 10,
    podaci: {
      cvorovi: [
        {
          naziv: '🖥️ Digitalni Kompjuter',
          deca: [
            {
              naziv: `🎮 SPAJA GPU (${UKUPNO_GPU_JEZGARA.toLocaleString('sr')} jezgara)`,
              deca: sistem.raspodele.slice(0, 4).map((r) => ({
                naziv: `${r.ikona} Oktava ${r.oktava}: ${r.gpuJezgara.toLocaleString('sr')} jezgara (${r.gpuProcenat}%)`,
              })),
            },
            {
              naziv: `🎮 GPU Višje Oktave`,
              deca: sistem.raspodele.slice(4).map((r) => ({
                naziv: `${r.ikona} Oktava ${r.oktava}: ${r.gpuJezgara.toLocaleString('sr')} jezgara (${r.gpuProcenat}%)`,
              })),
            },
            {
              naziv: `🧮 SPAJA RAM (${UKUPNO_RAM_GB.toLocaleString('sr')} GB)`,
              deca: sistem.raspodele.map((r) => ({
                naziv: `${r.ikona} Oktava ${r.oktava}: ${r.ramGB.toLocaleString('sr')} GB (${r.ramProcenat}%)`,
              })),
            },
            {
              naziv: '🔢 Matrično Jedinjenje 8×8',
              deca: [
                { naziv: `Trag: ${sistem.matricnoJedinjenje.trag.toLocaleString('sr')}` },
                { naziv: `Ukupna snaga: ${sistem.matricnoJedinjenje.ukupnaSnaga.toLocaleString('sr')}` },
              ],
            },
          ],
        },
      ],
    },
  },
  // ─── Lista — formula i objašnjenja ────────────────────
  {
    id: 'okt-gpu-lista-formule',
    tip: 'lista',
    naslov: '📐 Formule Oktavnog GPU/RAM Sistema',
    redosled: 11,
    podaci: {
      stavke: [
        'GPU_oktava(n) = bazniGPU × galaksipozniFaktor(n) × matričniKoeficijent(n)',
        'RAM_oktava(n) = bazniRAM × ekvalaturniRaspon(n) × sektorskiMnožilac(n)',
        'MatričnoJedinjenje(i,j) = sqrt(GPU_i × RAM_j) / 1000 — za i ≠ j',
        'MatričnoJedinjenje(i,i) = GPU_i × RAM_i / 1.000.000 — dijagonala',
        'Galaksipozni faktor: eksponencijalni rast kapaciteta kroz oktave (1.0 → 5.0)',
        'Ekvalaturni raspon: ravnomerna temperacija po oktavama (1.0 → 3.0)',
        'Matrični koeficijent: preslikavanje 8×8 matrice na GPU jezgra',
        'Sektorski množilac: pojačanje unutar galaksipoznog sektora',
      ],
    },
  },
  // ─── CTA ──────────────────────────────────────────────
  {
    id: 'okt-gpu-cta',
    tip: 'cta',
    naslov: 'Istražite Oktavni GPU/RAM Sistem',
    redosled: 12,
    podaci: {
      opis: `Oktavni sistem u rasponu ekvalaturnog galaksipoznog sektora u matričnom jedinjenju izražen kroz GPU (${UKUPNO_GPU_JEZGARA.toLocaleString('sr')} jezgara) i RAM (${UKUPNO_RAM_GB.toLocaleString('sr')} GB) — za maksimalne performanse ${stat.brojOktava} oktava igrica na Digitalnom Kompjuteru.`,
      dugmad: [
        { tekst: 'Digitalni Kompjuter', href: '/spaja-digitalni-kompjuter' },
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Početna', href: '/', stil: 'sekundarno' },
      ],
    },
  },
];
