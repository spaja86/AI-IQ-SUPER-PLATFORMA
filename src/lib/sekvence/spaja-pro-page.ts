import type { Sekvenca } from '@/lib/types';
import { spajaProVerzije, getAktivneVerzije, getBetaVerzije, getUkupnoMogucnosti, getSvePromptTipove } from '@/lib/spaja-pro';

const aktivne = getAktivneVerzije();
const beta = getBetaVerzije();
const ukupnoMogucnosti = getUkupnoMogucnosti();
const sviPromptTipovi = getSvePromptTipove();

export const spajaProSekvence: Sekvenca[] = [
  {
    id: 'spajapro-hero',
    tip: 'hero',
    naslov: '🌟 SpajaPro Engine 6-15',
    podnaslov: 'AI Engine Kompanije SPAJA — Zamena za ChatGPT sa naprednim Prompt sistemom',
    ikona: '🌟',
    redosled: 1,
    podaci: {
      opis: `SpajaPro je AI engine sa ${spajaProVerzije.length} verzija (6-15) koji zamenjuje ChatGPT u celom ekosistemu. Svaka verzija donosi nove Prompt mogućnosti — od baznog teksta do univerzalnog kvantnog procesora.`,
      dugmad: [
        { tekst: 'Prompt Sistem', href: '/prompt' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'IO-OPENUI-AO', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'spajapro-tekst',
    tip: 'tekst',
    naslov: 'SpajaPro zamenjuje ChatGPT',
    redosled: 2,
    podaci: {
      sadrzaj: `SpajaPro engine iz repozitorijuma Kompanija-SPAJA potpuno zamenjuje ChatGPT u IO-OPENUI-AO i celom ekosistemu. Verzije 6-15 pokrivaju svaki aspekt AI obrade — od baznog Prompt-a (v6) do univerzalnog kvantnog procesora (v15).

Svaka OMEGA AI persona koristi SpajaPro Prompt engine za svoje zadatke. IO-OPENUI-AO frontend koristi SpajaPro umesto ChatGPT-a za svu AI komunikaciju.`,
      istaknuteStavke: [
        `${aktivne.length} aktivnih verzija: ${aktivne.map((v) => v.naziv).join(', ')}`,
        `${beta.length} beta verzija: ${beta.map((v) => v.naziv).join(', ')}`,
        `${ukupnoMogucnosti} ukupnih mogućnosti kroz sve verzije`,
        `${sviPromptTipovi.length} tipova Prompt-a: ${sviPromptTipovi.slice(0, 8).join(', ')}...`,
        'Izvor: Kompanija-SPAJA repozitorijum',
      ],
    },
  },
  {
    id: 'spajapro-statistika',
    tip: 'statistika',
    naslov: 'SpajaPro u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Verzije', vrednost: spajaProVerzije.length, ikona: '🔢' },
        { naziv: 'Aktivnih', vrednost: aktivne.length, ikona: '✅' },
        { naziv: 'Mogućnosti', vrednost: ukupnoMogucnosti, ikona: '⚡' },
        { naziv: 'Prompt tipovi', vrednost: sviPromptTipovi.length, ikona: '📝' },
      ],
    },
  },
  {
    id: 'spajapro-tabela',
    tip: 'tabela',
    naslov: '🔢 Sve SpajaPro verzije (6-15)',
    redosled: 4,
    podaci: {
      zaglavlje: ['Verzija', 'Kodno ime', 'Status', 'Max tokena', 'Jezici', 'Prompt tipovi', 'Fine-tuning'],
      redovi: spajaProVerzije.map((v) => [
        `${v.ikona} ${v.naziv}`,
        v.kodnoIme,
        v.status,
        String(v.promptPodrska.maxTokena.toLocaleString()),
        String(v.promptPodrska.jezici.length),
        String(v.promptPodrska.promptTipovi.length),
        v.promptPodrska.finetuning ? '✅' : '❌',
      ]),
    },
  },
  {
    id: 'spajapro-kartice',
    tip: 'kartice',
    naslov: '🌟 SpajaPro verzije — detalji',
    redosled: 5,
    podaci: {
      kartice: spajaProVerzije.map((v) => ({
        naslov: `${v.ikona} ${v.naziv} — ${v.kodnoIme}`,
        opis: v.opis,
        ikona: v.ikona,
        oznake: [v.status, `${v.promptPodrska.maxTokena.toLocaleString()} tokena`, ...v.mogucnosti.slice(0, 3)],
      })),
    },
  },
  {
    id: 'spajapro-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ SpajaPro evolucija verzija',
    redosled: 6,
    podaci: {
      nivoi: [
        {
          naziv: 'Aktivne verzije (Produkcija)',
          ikona: '✅',
          deca: aktivne.map((v) => `${v.ikona} ${v.naziv} — ${v.kodnoIme}: ${v.opis}`),
        },
        {
          naziv: 'Beta verzije (Testiranje)',
          ikona: '🧪',
          deca: beta.map((v) => `${v.ikona} ${v.naziv} — ${v.kodnoIme}: ${v.opis}`),
        },
        {
          naziv: 'U razvoju',
          ikona: '🔨',
          deca: spajaProVerzije.filter((v) => v.status === 'razvoj').map((v) => `${v.ikona} ${v.naziv} — ${v.kodnoIme}: ${v.opis}`),
        },
        {
          naziv: 'Planirane',
          ikona: '📋',
          deca: spajaProVerzije.filter((v) => v.status === 'planirana').map((v) => `${v.ikona} ${v.naziv} — ${v.kodnoIme}: ${v.opis}`),
        },
      ],
    },
  },
  {
    id: 'spajapro-lista',
    tip: 'lista',
    naslov: '⚡ Ključne karakteristike SpajaPro engine-a',
    redosled: 7,
    podaci: {
      stavke: [
        { ikona: '🔄', naslov: 'Zamena za ChatGPT', opis: 'SpajaPro potpuno zamenjuje ChatGPT u IO-OPENUI-AO i celom ekosistemu Kompanije SPAJA' },
        { ikona: '📝', naslov: 'Univerzalni Prompt', opis: `${sviPromptTipovi.length} tipova Prompt-a: od teksta i koda do kvantnog i telepatskog` },
        { ikona: '🧠', naslov: 'OMEGA AI integracija', opis: 'Svaka od 21 OMEGA AI persone koristi SpajaPro Prompt za svoje zadatke' },
        { ikona: '📡', naslov: 'Proksi distribucija', opis: 'SpajaPro 11+ distribuira Prompt-ove kroz Proksi mrežu egzotičnih signala' },
        { ikona: '📱', naslov: 'Mobilna optimizacija', opis: 'SpajaPro 12 optimizuje Prompt-ove za SPAJA Mobilnu Mrežu' },
        { ikona: '🧬', naslov: 'Samo-evolucija', opis: 'SpajaPro 13+ koristi genetske algoritme za autonomnu evoluciju Prompt-ova' },
      ],
    },
  },
  {
    id: 'spajapro-cta',
    tip: 'cta',
    naslov: '🚀 SpajaPro — AI budućnost Kompanije SPAJA',
    redosled: 8,
    podaci: {
      opis: 'SpajaPro 6-15 engine zamenjuje ChatGPT i donosi Prompt svuda u ekosistemu.',
      stavke: [
        { naziv: 'Verzije', vrednost: spajaProVerzije.length, ikona: '🔢' },
        { naziv: 'Aktivnih', vrednost: aktivne.length, ikona: '✅' },
        { naziv: 'Mogućnosti', vrednost: ukupnoMogucnosti, ikona: '⚡' },
        { naziv: 'Prompt tipovi', vrednost: sviPromptTipovi.length, ikona: '📝' },
      ],
      dugmad: [
        { tekst: 'Prompt Sistem', href: '/prompt' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
];
