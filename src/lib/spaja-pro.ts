/**
 * SpajaPro Engine — Verzije 6-15
 *
 * SpajaPro je AI engine Kompanije SPAJA koji zamenjuje ChatGPT
 * u celom ekosistemu. Svaka verzija donosi nove mogućnosti.
 *
 * Izvor: Kompanija-SPAJA repozitorijum
 * Integracija: IO-OPENUI-AO + AI IQ SUPER PLATFORMA
 */

export type SpajaProVerzija = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface SpajaProEngine {
  verzija: SpajaProVerzija;
  naziv: string;
  kodnoIme: string;
  opis: string;
  ikona: string;
  mogucnosti: string[];
  biblioteke: string[];
  promptPodrska: SpajaProPromptPodrska;
  status: 'aktivna' | 'beta' | 'razvoj' | 'planirana';
  datumIzdanja: string;
  kompatibilnost: string[];
}

export interface SpajaProPromptPodrska {
  maxTokena: number;
  jezici: string[];
  kontekstProzor: number;
  promptTipovi: string[];
  finetuning: boolean;
}

/**
 * Sve verzije SpajaPro engine-a (6-15).
 *
 * Svaka verzija je nadogradnja prethodne sa novim mogućnostima
 * za Prompt obradu, AI inteligenciju i ekosistem integraciju.
 */
export const spajaProVerzije: SpajaProEngine[] = [
  {
    verzija: 6,
    naziv: 'SpajaPro 6',
    kodnoIme: 'Temelj',
    opis: 'Osnovna verzija — bazni AI engine sa Prompt podrškom',
    ikona: '🔧',
    mogucnosti: [
      'Bazna Prompt obrada',
      'Tekst generisanje',
      'Srpski i engleski jezik',
      'Osnovna analiza koda',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
    ],
    promptPodrska: {
      maxTokena: 4096,
      jezici: ['sr', 'en'],
      kontekstProzor: 4096,
      promptTipovi: ['tekst', 'kod'],
      finetuning: false,
    },
    status: 'aktivna',
    datumIzdanja: '2024-01-15',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA'],
  },
  {
    verzija: 7,
    naziv: 'SpajaPro 7',
    kodnoIme: 'Štit',
    opis: 'Bezbednosna verzija — napredna Prompt zaštita i filtriranje',
    ikona: '🛡️',
    mogucnosti: [
      'Napredna Prompt zaštita',
      'Injection prevention',
      'Prompt sanitizacija',
      'Bezbednosna analiza',
      'Enkriptovani Prompt kanal',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
      'jose', 'bcrypt', 'helmet',
      'csurf', 'rate-limiter-flexible', 'xss-filters',
      'DOMPurify', 'sanitize-html', 'express-validator',
    ],
    promptPodrska: {
      maxTokena: 8192,
      jezici: ['sr', 'en', 'de'],
      kontekstProzor: 8192,
      promptTipovi: ['tekst', 'kod', 'bezbednost'],
      finetuning: false,
    },
    status: 'aktivna',
    datumIzdanja: '2024-03-20',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'AI-IQ-World-Bank'],
  },
  {
    verzija: 8,
    naziv: 'SpajaPro 8',
    kodnoIme: 'Analitik',
    opis: 'Analitička verzija — duboka analiza podataka kroz Prompt',
    ikona: '📊',
    mogucnosti: [
      'Prompt-based analitika',
      'Prediktivno modelovanje',
      'Trendovi i anomalije',
      'Vizualizacija rezultata',
      'Napredni Prompt šabloni',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
      'jose', 'bcrypt', 'helmet',
      'Recharts', 'D3.js', 'Chart.js',
      'Lodash', 'mathjs', 'simple-statistics',
      'csv-parse', 'xlsx', 'papaparse',
      'dayjs', 'numeral',
    ],
    promptPodrska: {
      maxTokena: 16384,
      jezici: ['sr', 'en', 'de', 'fr'],
      kontekstProzor: 16384,
      promptTipovi: ['tekst', 'kod', 'analitika', 'podaci'],
      finetuning: true,
    },
    status: 'aktivna',
    datumIzdanja: '2024-06-10',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'AI-IQ-Menjacnica'],
  },
  {
    verzija: 9,
    naziv: 'SpajaPro 9',
    kodnoIme: 'Kreator',
    opis: 'Kreativna verzija — multimodalni Prompt za kreaciju sadržaja',
    ikona: '🎨',
    mogucnosti: [
      'Multimodalni Prompt',
      'Generisanje slika',
      'Kreativno pisanje',
      'UI/UX Prompt dizajn',
      'Prompt za generisanje koda',
      'Šabloni za content creation',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
      'jose', 'bcrypt', 'helmet',
      'Recharts', 'D3.js', 'Chart.js',
      'Framer Motion', 'Lucide React', 'React Icons',
      'Radix UI', 'Headless UI', 'shadcn/ui',
      'sharp', 'canvas', 'jimp',
      'Markdown-it', 'react-markdown', 'rehype', 'remark',
      'tailwind-merge', 'class-variance-authority',
    ],
    promptPodrska: {
      maxTokena: 32768,
      jezici: ['sr', 'en', 'de', 'fr', 'es'],
      kontekstProzor: 32768,
      promptTipovi: ['tekst', 'kod', 'slika', 'dizajn', 'kreativno'],
      finetuning: true,
    },
    status: 'aktivna',
    datumIzdanja: '2024-09-01',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'SVETSKA-ORGANIZACIJA'],
  },
  {
    verzija: 10,
    naziv: 'SpajaPro 10',
    kodnoIme: 'Orkestrator',
    opis: 'Orkestracija — multi-agent Prompt koordinacija sa OMEGA AI',
    ikona: '🎵',
    mogucnosti: [
      'Multi-agent Prompt dispatch',
      'OMEGA AI integracija',
      'Oktavni Prompt sistem',
      'Persona-specifični Prompt-ovi',
      'Prompt chaining',
      'Automatska Prompt optimizacija',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
      'jose', 'bcrypt', 'helmet',
      'Recharts', 'D3.js', 'Chart.js',
      'Framer Motion', 'Lucide React', 'Radix UI',
      'sharp', 'react-markdown',
      'Zustand', 'Jotai', 'Immer',
      'ioredis', 'bullmq', 'p-queue',
      'winston', 'pino', 'sentry',
      'uuid', 'nanoid', 'cuid2',
    ],
    promptPodrska: {
      maxTokena: 65536,
      jezici: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru'],
      kontekstProzor: 65536,
      promptTipovi: ['tekst', 'kod', 'slika', 'agent', 'orkestracija', 'dispatch'],
      finetuning: true,
    },
    status: 'aktivna',
    datumIzdanja: '2024-12-01',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'OMEGA-AI-GitHub', 'OMEGA-AI-Vercel'],
  },
  {
    verzija: 11,
    naziv: 'SpajaPro 11',
    kodnoIme: 'Proksi',
    opis: 'Proksi integracija — Prompt kroz egzotičnu mrežu signala',
    ikona: '📡',
    mogucnosti: [
      'Proksi Prompt distribucija',
      'Egzotični signal Prompt',
      'Hibridna topologija Prompt-ova',
      'Sub-milisekundna latencija',
      'Prompt replikacija preko čvorova',
      'Kapacitet 10²²⁸ TB Prompt skladište',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
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
    promptPodrska: {
      maxTokena: 131072,
      jezici: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja'],
      kontekstProzor: 131072,
      promptTipovi: ['tekst', 'kod', 'slika', 'agent', 'signal', 'proksi', 'mrezni'],
      finetuning: true,
    },
    status: 'beta',
    datumIzdanja: '2025-03-15',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'Proksi-Mreza'],
  },
  {
    verzija: 12,
    naziv: 'SpajaPro 12',
    kodnoIme: 'Mobilni',
    opis: 'Mobilna verzija — Prompt optimizovan za SPAJA Mobilnu Mrežu',
    ikona: '📱',
    mogucnosti: [
      'Mobilni Prompt engine',
      'Edge AI Prompt obrada',
      'Offline Prompt keš',
      'IoT Prompt senzori',
      'Prompt preko SPAJA mreže',
      'Kompresija Prompt-ova za mobilne',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
      'jose', 'bcrypt', 'helmet',
      'Recharts', 'D3.js',
      'Framer Motion', 'Lucide React', 'Radix UI',
      'sharp', 'react-markdown',
      'Zustand', 'Jotai', 'Immer',
      'ioredis', 'bullmq',
      'winston', 'pino', 'sentry',
      'uuid', 'nanoid',
      'Socket.IO', 'ws',
      'React Native', 'Expo', 'React Native Web',
      'workbox', 'idb', 'localforage',
      'pako', 'lz-string', 'fflate',
      'mqtt', 'serialport', 'noble',
    ],
    promptPodrska: {
      maxTokena: 65536,
      jezici: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko'],
      kontekstProzor: 65536,
      promptTipovi: ['tekst', 'kod', 'mobilni', 'iot', 'edge', 'kompresovani'],
      finetuning: true,
    },
    status: 'beta',
    datumIzdanja: '2025-06-01',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'SPAJA-Mobilna-Mreza'],
  },
  {
    verzija: 13,
    naziv: 'SpajaPro 13',
    kodnoIme: 'Evolucija',
    opis: 'Autonomna evolucija — Prompt koji se samo-unapređuje',
    ikona: '🧬',
    mogucnosti: [
      'Samo-evolucioni Prompt',
      'Automatska Prompt optimizacija',
      'Genetski Prompt algoritmi',
      'Prompt mutacija i selekcija',
      'Autonomno učenje iz feedback-a',
      'Meta-Prompt generisanje',
      'Prompt verzionisanje',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
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
    promptPodrska: {
      maxTokena: 262144,
      jezici: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
      kontekstProzor: 262144,
      promptTipovi: ['tekst', 'kod', 'slika', 'agent', 'meta', 'evolucioni', 'genetski'],
      finetuning: true,
    },
    status: 'razvoj',
    datumIzdanja: '2025-09-01',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'Evolucija-Motor'],
  },
  {
    verzija: 14,
    naziv: 'SpajaPro 14',
    kodnoIme: 'Matriks',
    opis: 'Matrično jezgro — Prompt sa 8×8 oktavnom matricom odaziva',
    ikona: '🧮',
    mogucnosti: [
      'Matrični Prompt dispatch',
      '8×8 Prompt matrica odaziva',
      'Ekscitatorni/inhibitorni/modulatorni Prompt',
      'Neurološka Prompt mreža',
      'Sinaptički Prompt transfer',
      'Klaster Prompt obrada',
      'Potpuna OMEGA AI Prompt integracija',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
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
    promptPodrska: {
      maxTokena: 524288,
      jezici: ['sr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'pt', 'nl'],
      kontekstProzor: 524288,
      promptTipovi: ['tekst', 'kod', 'slika', 'agent', 'matricni', 'neuroloski', 'sinapticki', 'oktavni'],
      finetuning: true,
    },
    status: 'razvoj',
    datumIzdanja: '2025-12-01',
    kompatibilnost: ['IO-OPENUI-AO', 'AI-IQ-SUPER-PLATFORMA', 'OMEGA-AI-5-Persona', 'Matricno-Jezgro'],
  },
  {
    verzija: 15,
    naziv: 'SpajaPro 15',
    kodnoIme: 'Omega',
    opis: 'Ultimativna verzija — potpuni AI ekosistem sa univerzalnim Prompt engine-om',
    ikona: '🌟',
    mogucnosti: [
      'Univerzalni Prompt engine',
      'Potpuna autonomna inteligencija',
      'Kvantni Prompt procesor',
      'Holografski Prompt interfejs',
      'Telepatska Prompt sinhronizacija',
      'Neograničeni kontekst prozor',
      'Potpuna Kompanija SPAJA integracija',
      'Svi jezici sveta',
    ],
    biblioteke: [
      'React', 'React DOM', 'Next.js', 'TypeScript',
      'Tailwind CSS', 'PostCSS', 'ESLint',
      'Zod', 'clsx', 'date-fns', 'dayjs',
      'Supabase JS', 'Supabase SSR',
      'OpenAI SDK', 'Vercel AI SDK',
      '@ai-sdk/openai', '@ai-sdk/google', '@ai-sdk/anthropic', '@ai-sdk/mistral', '@ai-sdk/cohere',
      'Stripe', 'Vercel Analytics', 'Vercel Speed Insights',
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
      'zod-to-json-schema', 'openapi-typescript',
      'Turborepo', 'Nx',
    ],
    promptPodrska: {
      maxTokena: 1048576,
      jezici: ['univerzalni'],
      kontekstProzor: 1048576,
      promptTipovi: ['univerzalni', 'kvantni', 'holografski', 'telepatski', 'autonomni'],
      finetuning: true,
    },
    status: 'planirana',
    datumIzdanja: '2026-06-01',
    kompatibilnost: ['svi-sistemi'],
  },
];

// ─── Helpers ───────────────────────────────────────────────

export function getAktivneVerzije(): SpajaProEngine[] {
  return spajaProVerzije.filter((v) => v.status === 'aktivna');
}

export function getBetaVerzije(): SpajaProEngine[] {
  return spajaProVerzije.filter((v) => v.status === 'beta');
}

export function getVerziju(verzija: SpajaProVerzija): SpajaProEngine | undefined {
  return spajaProVerzije.find((v) => v.verzija === verzija);
}

export function getNajnovijuAktivnu(): SpajaProEngine {
  const aktivne = getAktivneVerzije();
  return aktivne[aktivne.length - 1];
}

export function getUkupnoMogucnosti(): number {
  return spajaProVerzije.reduce((acc, v) => acc + v.mogucnosti.length, 0);
}

export function getPoStatusu(): Record<string, number> {
  return spajaProVerzije.reduce<Record<string, number>>((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1;
    return acc;
  }, {});
}

export function getSvePromptTipove(): string[] {
  const tipovi = new Set<string>();
  for (const v of spajaProVerzije) {
    for (const tip of v.promptPodrska.promptTipovi) {
      tipovi.add(tip);
    }
  }
  return [...tipovi];
}

export function getMaxTokena(): number {
  return Math.max(...spajaProVerzije.map((v) => v.promptPodrska.maxTokena));
}

export function getSveBiblioteke(): string[] {
  const biblioteke = new Set<string>();
  for (const v of spajaProVerzije) {
    for (const b of v.biblioteke) {
      biblioteke.add(b);
    }
  }
  return [...biblioteke];
}

export function getUkupnoBiblioteka(): number {
  return getSveBiblioteke().length;
}
