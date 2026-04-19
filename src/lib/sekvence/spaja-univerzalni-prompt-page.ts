import type { Sekvenca } from '@/lib/types';
import {
  spajaUltraOmegaCore,
  paradigme,
  tipoviPodataka,
  operatori,
  naredbe,
  kompajlerFaze,
  omegaRuntime,
  getSpecSummary,
} from '@/lib/spaja-ultra-omega-core';
import {
  univerzalniPromptovi,
  promptKategorije,
  univerzalniPromptSistem,
  getKriticnePromptove,
  getPromptSummary,
} from '@/lib/spaja-univerzalni-prompt';
import { OMEGA_AI_PERSONA_COUNT, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';

const specSummary = getSpecSummary();
const promptSummary = getPromptSummary();
const kriticni = getKriticnePromptove();

export const spajaUniverzalniPromptSekvence: Sekvenca[] = [
  // 1. Hero
  {
    id: 'sup-hero',
    tip: 'hero',
    naslov: '🧬 SpajaUltraOmegaCore -∞Ω+∞',
    podnaslov: 'SPAJA Univerzalni Prompt — Programski Jezik',
    ikona: '🧬',
    redosled: 1,
    podaci: {
      opis: `${spajaUltraOmegaCore.opis}. Univerzalni Prompt sistem sa ${promptSummary.ukupnoPromptova} promptova u ${promptSummary.kategorija} kategorija pokriva celokupan OMEGA AI ekosistem.`,
      dugmad: [
        { tekst: 'Omega AI', href: '/omega-ai' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Mobilna Mreža', href: '/mobilna-mreza', stil: 'sekundarno' },
      ],
    },
  },

  // 2. Tekst — Šta je SpajaUltraOmegaCore
  {
    id: 'sup-tekst',
    tip: 'tekst',
    naslov: 'Šta je SpajaUltraOmegaCore -∞Ω+∞?',
    redosled: 2,
    podaci: {
      sadrzaj: `SpajaUltraOmegaCore je univerzalni programski jezik Kompanije SPAJA koji operira u beskonačnom spektru od -∞ do +∞ kroz Omega (Ω) jezgro. Svaka naredba se izvršava kroz 8 oktavnih nivoa OMEGA AI sistema — od Temelja do Evolucije. Jezik podržava ${specSummary.paradigmi} paradigmi, ${specSummary.tipovaPodataka} tipova podataka, ${specSummary.operatora} operatora i ${specSummary.naredbi} naredbi sa ${specSummary.kompajlerFaza}-faznim kompajlerom.`,
      istaknuteStavke: [
        'Omega-Oktavni izvršni model sa 8 nivoa',
        'Proksi-Signalna komunikacija kroz hipsoneurične signale',
        'Neurološko-Mrežna paradigma sa sinaptičkim vezama',
        'Samoevoluirajući kod kroz Evolucioni paradigmu',
        'Hibridno prebacivanje između svih paradigmi',
        `Runtime kapacitet: ${omegaRuntime.kapacitet}`,
        `Spektar: ${spajaUltraOmegaCore.spektar}`,
      ],
    },
  },

  // 3. Statistika — Brojevi
  {
    id: 'sup-statistika',
    tip: 'statistika',
    naslov: '📊 SpajaUltraOmegaCore u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Paradigmi', vrednost: specSummary.paradigmi, ikona: '🎵' },
        { naziv: 'Tipova', vrednost: specSummary.tipovaPodataka, ikona: '🔢' },
        { naziv: 'Operatora', vrednost: specSummary.operatora, ikona: '⚙️' },
        { naziv: 'Naredbi', vrednost: specSummary.naredbi, ikona: '📋' },
        { naziv: 'Promptova', vrednost: promptSummary.ukupnoPromptova, ikona: '💬' },
        { naziv: 'Kategorija', vrednost: promptSummary.kategorija, ikona: '📁' },
      ],
    },
  },

  // 4. Kartice — Paradigme
  {
    id: 'sup-paradigme',
    tip: 'kartice',
    naslov: '🎵 Paradigme jezika',
    podnaslov: 'SpajaUltraOmegaCore -∞Ω+∞ paradigme',
    redosled: 4,
    podaci: {
      kartice: paradigme.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [p.paradigma, `Oktava ${p.oktavniNivo}`, p.snaga],
      })),
    },
  },

  // 5. Tabela — Tipovi podataka
  {
    id: 'sup-tipovi-tabela',
    tip: 'tabela',
    naslov: '🔢 Omega Tipovi Podataka',
    redosled: 5,
    podaci: {
      zaglavlje: ['Tip', 'Naziv', 'Opseg', 'Primer'],
      redovi: tipoviPodataka.map((t) => [
        `${t.ikona} ${t.naziv}`,
        t.opis,
        t.opseg,
        t.primer,
      ]),
    },
  },

  // 6. Kartice — Operatori
  {
    id: 'sup-operatori',
    tip: 'kartice',
    naslov: '⚙️ Omega Operatori',
    podnaslov: '-∞Ω+∞ operatori za sve paradigme',
    redosled: 6,
    podaci: {
      kartice: operatori.map((o) => ({
        naslov: `${o.simbol} — ${o.naziv}`,
        opis: o.opis,
        ikona: o.simbol,
        oznake: [o.tip, o.primer],
      })),
    },
  },

  // 7. Lista — Naredbe
  {
    id: 'sup-naredbe',
    tip: 'lista',
    naslov: '📋 Omega Naredbe (Ključne reči)',
    redosled: 7,
    podaci: {
      stavke: naredbe.map((n) => ({
        ikona: n.ikona,
        naslov: `${n.kljucnaRec} — ${n.naziv}`,
        opis: `${n.opis} | Sintaksa: ${n.sintaksa}`,
      })),
    },
  },

  // 8. Tabela — Kompajler faze
  {
    id: 'sup-kompajler',
    tip: 'tabela',
    naslov: '🔧 Kompajler Faze',
    redosled: 8,
    podaci: {
      zaglavlje: ['#', 'Faza', 'Opis', 'Trajanje'],
      redovi: kompajlerFaze.map((f) => [
        `${f.ikona} ${f.redosled}`,
        f.naziv,
        f.opis,
        f.trajanje,
      ]),
    },
  },

  // 9. Kartice — Prompt Kategorije
  {
    id: 'sup-prompt-kategorije',
    tip: 'kartice',
    naslov: '💬 Univerzalni Prompt — Kategorije',
    podnaslov: `${univerzalniPromptSistem.naziv} sa ${promptSummary.ukupnoPromptova} promptova`,
    redosled: 9,
    podaci: {
      kartice: promptKategorije.map((k) => ({
        naslov: k.naziv,
        opis: k.opis,
        ikona: k.ikona,
        oznake: [`Oktava ${k.oktavniNivo}`, `${k.brojPromptova} promptova`],
      })),
    },
  },

  // 10. Tabela — Svi promptovi
  {
    id: 'sup-promptovi-tabela',
    tip: 'tabela',
    naslov: '📑 Svi Univerzalni Promptovi',
    redosled: 10,
    podaci: {
      zaglavlje: ['Prompt', 'Kategorija', 'Persona', 'Oktava', 'Prioritet'],
      redovi: univerzalniPromptovi.map((p) => [
        `${p.ikona} ${p.naziv}`,
        p.kategorija,
        p.ciljnaPersona,
        `${p.oktavniNivo}`,
        p.prioritet,
      ]),
    },
  },

  // 11. Hijerarhija — Arhitektura
  {
    id: 'sup-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura SpajaUltraOmegaCore -∞Ω+∞',
    redosled: 11,
    podaci: {
      nivoi: [
        {
          naziv: 'SpajaUltraOmegaCore -∞Ω+∞',
          ikona: '🧬',
          deca: ['Programski Jezik', 'Univerzalni Prompt', 'Runtime'],
        },
        {
          naziv: 'Programski Jezik',
          ikona: '📋',
          deca: paradigme.map((p) => p.naziv),
        },
        {
          naziv: 'Univerzalni Prompt',
          ikona: '💬',
          deca: promptKategorije.map((k) => k.naziv),
        },
        {
          naziv: 'Runtime',
          ikona: '⚡',
          deca: [`${OMEGA_AI_OKTAVA_COUNT} Oktava`, `${OMEGA_AI_PERSONA_COUNT} Persona`, 'Proksi Mreža', 'Mobilna Mreža', 'Matricno Jezgro 8×8'],
        },
      ],
    },
  },

  // 12. Progres
  {
    id: 'sup-progres',
    tip: 'progres',
    naslov: '🚀 Status SpajaUltraOmegaCore sistema',
    redosled: 12,
    podaci: {
      progres: 100,
      poruka: `Runtime: ${omegaRuntime.status} | Verzija: ${spajaUltraOmegaCore.verzija} | Spektar: ${spajaUltraOmegaCore.spektar}`,
    },
  },

  // 13. Baner — Kritični promptovi
  {
    id: 'sup-baner',
    tip: 'baner',
    naslov: '-∞Ω+∞ Beskonačni Spektar',
    redosled: 13,
    podaci: {
      bedz: '🧬 SpajaUltraOmegaCore',
      opis: `Univerzalni programski jezik sa ${specSummary.paradigmi} paradigmi i ${promptSummary.ukupnoPromptova} promptova. ${kriticni.length} kritičnih promptova za arhitekturu, bezbednost i OMEGA dispatch. Runtime kapacitet: ${omegaRuntime.kapacitet}.`,
      dugme: { tekst: 'Istraži Omega AI', href: '/omega-ai' },
    },
  },

  // 14. CTA
  {
    id: 'sup-cta',
    tip: 'cta',
    naslov: '🚀 SpajaUltraOmegaCore -∞Ω+∞ Ekosistem',
    redosled: 14,
    podaci: {
      opis: 'Univerzalni programski jezik i prompt sistem za celokupan SPAJA ekosistem.',
      dugmad: [
        { tekst: 'Omega AI', href: '/omega-ai' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Mobilna Mreža', href: '/mobilna-mreza', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
];
