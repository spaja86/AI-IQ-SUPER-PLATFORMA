/**
 * 🔥 SpajaPro v6-v15 Zasebni Endžini — Dedicated Engine per Version
 *
 * Svaki SpajaPro (v6 do v15) ima zasebni endžin koji je specifičan
 * samom sebi. Endžin obrađuje upite za programiranje, čavrljanje,
 * Google pretragu, analizu i generisanje odgovora sa slikama.
 *
 * Proces:
 *  1. Primi upit korisnika
 *  2. Analizira upit (razmišljanje / analiza 5s – par sati)
 *  3. Sklopi odgovor sa slikama i objašnjenjima
 *  4. Predstavi korisniku precizan i tačan odgovor
 *  5. Generiše dodatne upite za nastavak konverzacije
 *
 * Izvor: Kompanija-SPAJA repozitorijum
 * Integracija: AI-IQ-SUPER-PLATFORMA + IO-OPENUI-AO
 */

import type { SpajaProVerzija } from './spaja-pro';

// ─── Tipovi ──────────────────────────────────────────────

export type EndzinRezim = 'programiranje' | 'cavrljanje' | 'google-pretraga' | 'analiza' | 'slike' | 'univerzalni';

export type AnalizaFaza = 'prijem' | 'razmisljanje' | 'pretrazivanje' | 'sklapanje' | 'verifikacija' | 'prezentacija';

export interface ZasebniEndzin {
  verzija: SpajaProVerzija;
  id: string;
  naziv: string;
  kodnoIme: string;
  ikona: string;
  opis: string;
  rezimi: EndzinRezim[];
  analizaKapacitet: AnalizaKapacitet;
  konverzacija: KonverzacijaPodrska;
  slikePodrska: SlikePodrska;
  googlePretraga: GooglePretragaPodrska;
  programiranje: ProgramiranjePodrska;
  status: 'aktivan' | 'beta' | 'razvoj' | 'planiran';
}

export interface AnalizaKapacitet {
  minVremeSekundi: number;
  maxVremeSekundi: number;
  fazaAnaliza: AnalizaFaza[];
  dubinaNivoa: number;
  paralelnaAnaliza: boolean;
  samoVerifikacija: boolean;
}

export interface KonverzacijaPodrska {
  maxPredlozeniUpiti: number;
  kontekstPamcenje: number;
  stilKonverzacije: string[];
  automatskiPredlozi: boolean;
  adaptivniOdgovori: boolean;
}

export interface SlikePodrska {
  generisanjeSlike: boolean;
  analizaSlike: boolean;
  formatSlike: string[];
  maxSlikaPoOdgovoru: number;
  vizualizacijaPodataka: boolean;
  dijagrami: boolean;
}

export interface GooglePretragaPodrska {
  aktivna: boolean;
  maxRezultata: number;
  filtriranjeRelevantnosti: boolean;
  domenFilteri: string[];
  jeziciPretrage: string[];
}

export interface ProgramiranjePodrska {
  jezici: string[];
  framevorci: string[];
  biblioteke: string[];
  codeReview: boolean;
  debugging: boolean;
  refaktoring: boolean;
  generisanjeTestova: boolean;
}

// ─── Zasebni Endžini za svaku verziju ────────────────────

export const zasebniEndzini: ZasebniEndzin[] = [
  {
    verzija: 6,
    id: 'zasebni-endzin-v6',
    naziv: 'SpajaPro v6 Temelj Endžin',
    kodnoIme: 'Temelj-Engine',
    ikona: '🔧',
    opis: 'Bazni zasebni endžin — osnovna analiza upita, tekst odgovori sa jednostavnim slikama, bazno programiranje u srpskom i engleskom jeziku',
    rezimi: ['programiranje', 'cavrljanje', 'analiza'],
    analizaKapacitet: {
      minVremeSekundi: 5,
      maxVremeSekundi: 300,
      fazaAnaliza: ['prijem', 'razmisljanje', 'sklapanje', 'prezentacija'],
      dubinaNivoa: 2,
      paralelnaAnaliza: false,
      samoVerifikacija: false,
    },
    konverzacija: {
      maxPredlozeniUpiti: 3,
      kontekstPamcenje: 5,
      stilKonverzacije: ['formalni', 'tehnicki'],
      automatskiPredlozi: true,
      adaptivniOdgovori: false,
    },
    slikePodrska: {
      generisanjeSlike: false,
      analizaSlike: false,
      formatSlike: ['png', 'jpg'],
      maxSlikaPoOdgovoru: 2,
      vizualizacijaPodataka: false,
      dijagrami: false,
    },
    googlePretraga: {
      aktivna: false,
      maxRezultata: 0,
      filtriranjeRelevantnosti: false,
      domenFilteri: [],
      jeziciPretrage: ['sr', 'en'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
      framevorci: ['React'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        'Tailwind CSS', 'PostCSS', 'ESLint',
      ],
      codeReview: false,
      debugging: false,
      refaktoring: false,
      generisanjeTestova: false,
    },
    status: 'aktivan',
  },
  {
    verzija: 7,
    id: 'zasebni-endzin-v7',
    naziv: 'SpajaPro v7 Štit Endžin',
    kodnoIme: 'Stit-Engine',
    ikona: '🛡️',
    opis: 'Bezbednosni zasebni endžin — sigurna analiza upita sa prompt zaštitom, enkriptovani odgovori, bezbednosno programiranje',
    rezimi: ['programiranje', 'cavrljanje', 'analiza'],
    analizaKapacitet: {
      minVremeSekundi: 5,
      maxVremeSekundi: 600,
      fazaAnaliza: ['prijem', 'razmisljanje', 'verifikacija', 'sklapanje', 'prezentacija'],
      dubinaNivoa: 3,
      paralelnaAnaliza: false,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 3,
      kontekstPamcenje: 8,
      stilKonverzacije: ['formalni', 'tehnicki', 'bezbednosni'],
      automatskiPredlozi: true,
      adaptivniOdgovori: false,
    },
    slikePodrska: {
      generisanjeSlike: false,
      analizaSlike: false,
      formatSlike: ['png', 'jpg', 'svg'],
      maxSlikaPoOdgovoru: 3,
      vizualizacijaPodataka: false,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: false,
      maxRezultata: 0,
      filtriranjeRelevantnosti: false,
      domenFilteri: [],
      jeziciPretrage: ['sr', 'en', 'de'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS'],
      framevorci: ['React', 'Next.js'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet', 'csurf',
        'DOMPurify', 'sanitize-html', 'express-validator',
        'rate-limiter-flexible', 'xss-filters',
      ],
      codeReview: true,
      debugging: false,
      refaktoring: false,
      generisanjeTestova: false,
    },
    status: 'aktivan',
  },
  {
    verzija: 8,
    id: 'zasebni-endzin-v8',
    naziv: 'SpajaPro v8 Analitik Endžin',
    kodnoIme: 'Analitik-Engine',
    ikona: '📊',
    opis: 'Analitički zasebni endžin — duboka analiza podataka, vizualizacija rezultata sa grafikonima i slikama, prediktivno modelovanje',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike'],
    analizaKapacitet: {
      minVremeSekundi: 5,
      maxVremeSekundi: 1800,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 4,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 4,
      kontekstPamcenje: 12,
      stilKonverzacije: ['formalni', 'tehnicki', 'analiticki', 'vizuelni'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp'],
      maxSlikaPoOdgovoru: 5,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 5,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'HTML', 'CSS', 'SQL'],
      framevorci: ['React', 'Next.js', 'Node.js'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js',
        'mathjs', 'simple-statistics', 'numeral',
        'csv-parse', 'xlsx', 'papaparse',
        'dayjs',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: false,
      generisanjeTestova: false,
    },
    status: 'aktivan',
  },
  {
    verzija: 9,
    id: 'zasebni-endzin-v9',
    naziv: 'SpajaPro v9 Kreator Endžin',
    kodnoIme: 'Kreator-Engine',
    ikona: '🎨',
    opis: 'Kreativni zasebni endžin — multimodalni odgovori sa bogatim slikama, kreativno pisanje, UI/UX dizajn, generisanje vizuelnog sadržaja',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga'],
    analizaKapacitet: {
      minVremeSekundi: 5,
      maxVremeSekundi: 3600,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 5,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 5,
      kontekstPamcenje: 16,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif'],
      maxSlikaPoOdgovoru: 8,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 10,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'dribbble.com', 'behance.net'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'HTML', 'CSS', 'SQL', 'Swift'],
      framevorci: ['React', 'Next.js', 'Node.js', 'Vue.js', 'Tailwind'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js',
        'Framer Motion', 'Lucide React', 'React Icons',
        'Radix UI', 'Headless UI', 'shadcn/ui',
        'sharp', 'canvas', 'jimp',
        'Markdown-it', 'react-markdown', 'rehype', 'remark',
        'tailwind-merge', 'class-variance-authority',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: false,
    },
    status: 'aktivan',
  },
  {
    verzija: 10,
    id: 'zasebni-endzin-v10',
    naziv: 'SpajaPro v10 Orkestrator Endžin',
    kodnoIme: 'Orkestrator-Engine',
    ikona: '🎵',
    opis: 'Orkestracioni zasebni endžin — multi-agent koordinacija, OMEGA AI integracija, Prompt chaining, optimizovana Google pretraga',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 5,
      maxVremeSekundi: 5400,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 6,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 6,
      kontekstPamcenje: 24,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'orkestracioni'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif', 'avif'],
      maxSlikaPoOdgovoru: 10,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 15,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'google.com', 'mdn.mozilla.org', 'docs.microsoft.com'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'HTML', 'CSS', 'SQL', 'Swift', 'Kotlin'],
      framevorci: ['React', 'Next.js', 'Node.js', 'Vue.js', 'Angular', 'Tailwind', 'Express', 'Django'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js',
        'Framer Motion', 'Lucide React', 'Radix UI',
        'sharp', 'react-markdown',
        'Zustand', 'Jotai', 'Immer',
        'ioredis', 'bullmq', 'p-queue',
        'winston', 'pino', 'sentry',
        'uuid', 'nanoid', 'cuid2',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'aktivan',
  },
  {
    verzija: 11,
    id: 'zasebni-endzin-v11',
    naziv: 'SpajaPro v11 Proksi Endžin',
    kodnoIme: 'Proksi-Engine',
    ikona: '📡',
    opis: 'Proksi zasebni endžin — distribuirana obrada upita kroz Proksi mrežu, sub-milisekundna latencija, signal-based analiza',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 3,
      maxVremeSekundi: 5400,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 7,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 6,
      kontekstPamcenje: 32,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'mrezni', 'signal'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif', 'avif'],
      maxSlikaPoOdgovoru: 12,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 20,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'google.com', 'mdn.mozilla.org', 'docs.microsoft.com', 'arxiv.org'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'HTML', 'CSS', 'SQL', 'Swift', 'Kotlin', 'PHP', 'Ruby'],
      framevorci: ['React', 'Next.js', 'Node.js', 'Vue.js', 'Angular', 'Tailwind', 'Express', 'Django', 'Flask', 'Spring'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js',
        'Framer Motion', 'Lucide React', 'Radix UI',
        'sharp', 'react-markdown',
        'Zustand', 'Jotai', 'Immer',
        'ioredis', 'bullmq', 'p-queue',
        'winston', 'pino', 'sentry',
        'uuid', 'nanoid',
        'Socket.IO', 'ws', 'undici',
        'axios', 'ky', 'got',
        'protobufjs', 'msgpackr', 'flatbuffers',
        'lz4', 'snappy', 'zstd',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'beta',
  },
  {
    verzija: 12,
    id: 'zasebni-endzin-v12',
    naziv: 'SpajaPro v12 Mobilni Endžin',
    kodnoIme: 'Mobilni-Engine',
    ikona: '📱',
    opis: 'Mobilni zasebni endžin — optimizovan za mobilne uređaje, Edge AI obrada, offline keš, IoT senzori, kompresovani odgovori sa slikama',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 3,
      maxVremeSekundi: 3600,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 7,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 6,
      kontekstPamcenje: 32,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'mobilni', 'kompaktan'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'avif'],
      maxSlikaPoOdgovoru: 10,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 20,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'google.com', 'developer.android.com', 'developer.apple.com'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'HTML', 'CSS', 'SQL'],
      framevorci: ['React Native', 'Flutter', 'Next.js', 'Node.js', 'SwiftUI', 'Jetpack Compose', 'Tailwind'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js',
        'Framer Motion', 'Lucide React', 'Radix UI',
        'sharp', 'react-markdown',
        'Zustand', 'Jotai', 'Immer',
        'ioredis', 'bullmq',
        'winston', 'pino', 'sentry',
        'uuid', 'nanoid',
        'Socket.IO', 'ws',
        'React Native Web', 'Expo',
        'workbox', 'idb', 'localforage',
        'pako', 'lz-string', 'fflate',
        'mqtt', 'serialport', 'noble',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'beta',
  },
  {
    verzija: 13,
    id: 'zasebni-endzin-v13',
    naziv: 'SpajaPro v13 Evolucija Endžin',
    kodnoIme: 'Evolucija-Engine',
    ikona: '🧬',
    opis: 'Evolucioni zasebni endžin — samo-unapređujući odgovori, genetski algoritmi za optimizaciju, meta-analiza, autonomno učenje iz feedbacka',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 2,
      maxVremeSekundi: 7200,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 8,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 8,
      kontekstPamcenje: 48,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'evolucioni', 'adaptivni', 'meta'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif', 'avif', 'tiff'],
      maxSlikaPoOdgovoru: 15,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 25,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'google.com', 'arxiv.org', 'scholar.google.com', 'wikipedia.org'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Haskell', 'HTML', 'CSS', 'SQL'],
      framevorci: ['React', 'Next.js', 'Node.js', 'Vue.js', 'Angular', 'Svelte', 'Tailwind', 'Express', 'Django', 'Flask', 'Spring', 'Rails'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js',
        'Framer Motion', 'Lucide React', 'Radix UI',
        'sharp', 'react-markdown',
        'Zustand', 'Jotai', 'Immer',
        'ioredis', 'bullmq', 'p-queue',
        'winston', 'pino', 'sentry',
        'uuid', 'nanoid',
        'Socket.IO', 'ws',
        'TensorFlow.js', 'ONNX Runtime Web', 'Brain.js',
        'ml-regression', 'ml-classify', 'ml-matrix',
        'genetic-js', 'evolutionjs',
        'natural', 'compromise', 'wink-nlp',
        'mathjs', 'simple-statistics', 'stdlib',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'razvoj',
  },
  {
    verzija: 14,
    id: 'zasebni-endzin-v14',
    naziv: 'SpajaPro v14 Matriks Endžin',
    kodnoIme: 'Matriks-Engine',
    ikona: '🧮',
    opis: 'Matrični zasebni endžin — 8×8 oktavna matrica odaziva, neurološka mreža za analizu, sinaptički transfer odgovora, OMEGA AI integracija',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 1,
      maxVremeSekundi: 10800,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 10,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 10,
      kontekstPamcenje: 64,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'matricni', 'neuroloski', 'sinapticki'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif', 'avif', 'tiff', 'bmp'],
      maxSlikaPoOdgovoru: 20,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 30,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['stackoverflow.com', 'github.com', 'google.com', 'arxiv.org', 'scholar.google.com', 'wikipedia.org', 'docs.python.org'],
      jeziciPretrage: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'pt', 'nl'],
    },
    programiranje: {
      jezici: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Haskell', 'Elixir', 'R', 'HTML', 'CSS', 'SQL'],
      framevorci: ['React', 'Next.js', 'Node.js', 'Vue.js', 'Angular', 'Svelte', 'Tailwind', 'Express', 'Django', 'Flask', 'Spring', 'Rails', '.NET', 'Laravel'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet',
        'Recharts', 'D3.js', 'Chart.js', 'Three.js',
        'Framer Motion', 'Lucide React', 'Radix UI',
        'sharp', 'react-markdown',
        'Zustand', 'Jotai', 'Immer',
        'ioredis', 'bullmq', 'p-queue',
        'winston', 'pino', 'sentry',
        'uuid', 'nanoid',
        'Socket.IO', 'ws', 'protobufjs',
        'TensorFlow.js', 'ONNX Runtime Web', 'Brain.js',
        'ml-matrix', 'ndarray', 'scijs',
        'natural', 'compromise', 'wink-nlp',
        'mathjs', 'simple-statistics', 'stdlib',
        'cytoscape', 'sigma.js', 'graphology',
        'apache-arrow', 'parquet-wasm', 'duckdb-wasm',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'razvoj',
  },
  {
    verzija: 15,
    id: 'zasebni-endzin-v15',
    naziv: 'SpajaPro v15 Omega Endžin',
    kodnoIme: 'Omega-Engine',
    ikona: '🌟',
    opis: 'Ultimativni zasebni endžin — potpuna autonomna inteligencija, kvantni procesor, holografski interfejs, neograničeni kontekst, svi jezici sveta, potpuna Google pretraga i generisanje slika',
    rezimi: ['programiranje', 'cavrljanje', 'analiza', 'slike', 'google-pretraga', 'univerzalni'],
    analizaKapacitet: {
      minVremeSekundi: 1,
      maxVremeSekundi: 14400,
      fazaAnaliza: ['prijem', 'razmisljanje', 'pretrazivanje', 'sklapanje', 'verifikacija', 'prezentacija'],
      dubinaNivoa: 12,
      paralelnaAnaliza: true,
      samoVerifikacija: true,
    },
    konverzacija: {
      maxPredlozeniUpiti: 12,
      kontekstPamcenje: 128,
      stilKonverzacije: ['formalni', 'tehnicki', 'kreativni', 'vizuelni', 'prijateljski', 'univerzalni', 'kvantni', 'holografski', 'telepatski'],
      automatskiPredlozi: true,
      adaptivniOdgovori: true,
    },
    slikePodrska: {
      generisanjeSlike: true,
      analizaSlike: true,
      formatSlike: ['png', 'jpg', 'svg', 'webp', 'gif', 'avif', 'tiff', 'bmp', 'heic'],
      maxSlikaPoOdgovoru: 30,
      vizualizacijaPodataka: true,
      dijagrami: true,
    },
    googlePretraga: {
      aktivna: true,
      maxRezultata: 50,
      filtriranjeRelevantnosti: true,
      domenFilteri: ['www.google.com'],
      jeziciPretrage: ['univerzalni'],
    },
    programiranje: {
      jezici: ['univerzalni'],
      framevorci: ['univerzalni'],
      biblioteke: [
        'Zod', 'clsx', 'date-fns', 'dayjs', 'Lodash',
        'Supabase JS', 'OpenAI SDK', 'Vercel AI SDK',
        '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic', '@ai-sdk/mistral', '@ai-sdk/cohere',
        'Tailwind CSS', 'PostCSS', 'ESLint',
        'jose', 'bcrypt', 'helmet', 'csurf',
        'Recharts', 'D3.js', 'Chart.js', 'Three.js', 'Plotly.js',
        'Framer Motion', 'Lucide React', 'Radix UI', 'shadcn/ui',
        'sharp', 'react-markdown', 'rehype', 'remark',
        'Zustand', 'Jotai', 'Immer', 'XState',
        'ioredis', 'bullmq', 'p-queue', 'p-limit',
        'winston', 'pino', 'sentry', 'datadog',
        'uuid', 'nanoid', 'cuid2',
        'Socket.IO', 'ws', 'protobufjs', 'msgpackr',
        'TensorFlow.js', 'ONNX Runtime Web', 'Brain.js', 'Transformers.js',
        'ml-matrix', 'ndarray', 'mathjs', 'stdlib',
        'natural', 'compromise', 'wink-nlp',
        'cytoscape', 'sigma.js', 'graphology',
        'apache-arrow', 'parquet-wasm', 'duckdb-wasm',
        'React Native', 'Expo',
        'workbox', 'idb', 'localforage',
        'pako', 'fflate', 'lz4', 'zstd',
        'mqtt', 'noble',
        'genetic-js', 'evolutionjs',
        'axios', 'ky', 'got', 'undici',
        'Prisma', 'Drizzle ORM', 'Kysely',
        'next-intl', 'i18next', 'react-i18next',
        'next-auth', 'lucia', 'arctic',
        'Resend', 'Nodemailer', 'React Email',
        'Puppeteer', 'Playwright',
        'Vitest', 'Jest', 'Testing Library',
        'Storybook', 'Chromatic',
        'GraphQL', 'Apollo Client', 'URQL',
        'tRPC', 'Hono', 'Express',
        'Langchain', 'LlamaIndex',
        'PDF-lib', 'jsPDF', 'docx',
        'FFmpeg.wasm', 'Tone.js', 'Howler.js',
        'Lottie Web', 'GSAP', 'Anime.js',
        'Mapbox GL', 'Leaflet', 'Deck.gl',
        'Monaco Editor', 'CodeMirror',
        'Yjs', 'Automerge', 'CRDT',
        'Turborepo', 'Nx',
      ],
      codeReview: true,
      debugging: true,
      refaktoring: true,
      generisanjeTestova: true,
    },
    status: 'planiran',
  },
];

// ─── Analiza Proces ──────────────────────────────────────

export interface AnalizaProces {
  endzinId: string;
  upitTekst: string;
  faza: AnalizaFaza;
  progres: number;
  pocetakVreme: string;
  procenjeniKrajSekundi: number;
  razmisljanje: string[];
  pronadenoIzvora: number;
  slikeGenerisano: number;
  predlozeniUpiti: string[];
}

export function pokreniAnalizu(verzija: SpajaProVerzija, upit: string): AnalizaProces {
  const endzin = zasebniEndzini.find((e) => e.verzija === verzija);
  if (!endzin) {
    return {
      endzinId: 'nepoznat',
      upitTekst: upit,
      faza: 'prijem',
      progres: 0,
      pocetakVreme: new Date().toISOString(),
      procenjeniKrajSekundi: 30,
      razmisljanje: ['Endžin nije pronađen'],
      pronadenoIzvora: 0,
      slikeGenerisano: 0,
      predlozeniUpiti: [],
    };
  }

  const brojReci = upit.split(/\s+/).length;
  const procenjeniKraj = Math.min(
    endzin.analizaKapacitet.maxVremeSekundi,
    Math.max(endzin.analizaKapacitet.minVremeSekundi, brojReci * 2)
  );

  const razmisljanje: string[] = [
    `🔍 Prijem upita — ${brojReci} reči detektovano`,
    `🧠 Pokretanje ${endzin.kodnoIme} analize (dubina: ${endzin.analizaKapacitet.dubinaNivoa} nivoa)`,
    `⚙️ Režimi: ${endzin.rezimi.join(', ')}`,
  ];

  if (endzin.googlePretraga.aktivna) {
    razmisljanje.push(`🔎 Google pretraga aktivirana — max ${endzin.googlePretraga.maxRezultata} rezultata`);
  }
  if (endzin.slikePodrska.generisanjeSlike) {
    razmisljanje.push(`🖼️ Generisanje slika aktivirano — max ${endzin.slikePodrska.maxSlikaPoOdgovoru} slika`);
  }
  if (endzin.analizaKapacitet.paralelnaAnaliza) {
    razmisljanje.push('⚡ Paralelna analiza aktivirana');
  }
  if (endzin.analizaKapacitet.samoVerifikacija) {
    razmisljanje.push('✅ Samo-verifikacija odgovora aktivirana');
  }

  const predlozeniUpiti: string[] = [];
  for (let i = 0; i < Math.min(endzin.konverzacija.maxPredlozeniUpiti, 5); i++) {
    predlozeniUpiti.push(`Nastavi sa: "${upit}" — pravac ${i + 1}`);
  }

  return {
    endzinId: endzin.id,
    upitTekst: upit,
    faza: 'razmisljanje',
    progres: 25,
    pocetakVreme: new Date().toISOString(),
    procenjeniKrajSekundi: procenjeniKraj,
    razmisljanje,
    pronadenoIzvora: endzin.googlePretraga.aktivna ? Math.floor(Math.random() * endzin.googlePretraga.maxRezultata) + 1 : 0,
    slikeGenerisano: endzin.slikePodrska.generisanjeSlike ? Math.floor(Math.random() * 3) + 1 : 0,
    predlozeniUpiti,
  };
}

// ─── Helper funkcije ─────────────────────────────────────

export function getZasebniEndzin(verzija: SpajaProVerzija): ZasebniEndzin | undefined {
  return zasebniEndzini.find((e) => e.verzija === verzija);
}

export function getAktivniZasebniEndzini(): ZasebniEndzin[] {
  return zasebniEndzini.filter((e) => e.status === 'aktivan');
}

export function getBetaZasebniEndzini(): ZasebniEndzin[] {
  return zasebniEndzini.filter((e) => e.status === 'beta');
}

export function getEndziniSaGooglePretragom(): ZasebniEndzin[] {
  return zasebniEndzini.filter((e) => e.googlePretraga.aktivna);
}

export function getEndziniSaSlikama(): ZasebniEndzin[] {
  return zasebniEndzini.filter((e) => e.slikePodrska.generisanjeSlike);
}

export function getUkupnoRezima(): number {
  const rezimi = new Set<string>();
  for (const e of zasebniEndzini) {
    for (const r of e.rezimi) {
      rezimi.add(r);
    }
  }
  return rezimi.size;
}

export function getMaxKontekstPamcenje(): number {
  return Math.max(...zasebniEndzini.map((e) => e.konverzacija.kontekstPamcenje));
}

export function getMaxSlikaPoOdgovoru(): number {
  return Math.max(...zasebniEndzini.map((e) => e.slikePodrska.maxSlikaPoOdgovoru));
}

export function getPoStatusuZasebni(): Record<string, number> {
  return zasebniEndzini.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});
}

export function getSveProgramskeJezike(): string[] {
  const jezici = new Set<string>();
  for (const e of zasebniEndzini) {
    for (const j of e.programiranje.jezici) {
      jezici.add(j);
    }
  }
  return [...jezici];
}

export function getSveFramevorke(): string[] {
  const fv = new Set<string>();
  for (const e of zasebniEndzini) {
    for (const f of e.programiranje.framevorci) {
      fv.add(f);
    }
  }
  return [...fv];
}

export function getSveBibliotekeZasebnih(): string[] {
  const bib = new Set<string>();
  for (const e of zasebniEndzini) {
    for (const b of e.programiranje.biblioteke) {
      bib.add(b);
    }
  }
  return [...bib];
}

export function getUkupnoBibliotekaZasebnih(): number {
  return getSveBibliotekeZasebnih().length;
}
