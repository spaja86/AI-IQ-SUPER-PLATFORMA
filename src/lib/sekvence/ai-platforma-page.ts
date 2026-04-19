import type { Sekvenca } from '@/lib/types';
import { platforme } from '@/lib/platforme';
import { OMEGA_AI_PERSONA_COUNT, SPAJA_PRO_RANGE } from '@/lib/constants';

const aiPlatforme = platforme.filter((p) => p.kategorija === 'ai');

export const aiPlatformaSekvence: Sekvenca[] = [
  {
    id: 'ai-hero',
    tip: 'hero',
    naslov: '🤖 AI Platforma — SpajaPro Prompt Engine',
    podnaslov: 'Centralno mesto za sve AI sisteme sa SpajaPro Prompt-om',
    ikona: '🤖',
    redosled: 1,
    podaci: {
      opis: `AI Platforma objedinjuje sve sisteme vestacke inteligencije — od OMEGA AI persona sa Prompt-ovima do SpajaPro engine-a (v${SPAJA_PRO_RANGE}) koji zamenjuje ChatGPT.`,
      dugmad: [
        { tekst: 'Omega AI', href: '/omega-ai' },
        { tekst: 'Prompt', href: '/prompt' },
        { tekst: 'SpajaPro', href: '/spaja-pro', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'ai-tekst',
    tip: 'tekst',
    naslov: 'AI Platforma sa SpajaPro Prompt Engine-om',
    redosled: 2,
    podaci: {
      sadrzaj: 'AI Platforma koristi SpajaPro engine (verzije 6-15) umesto ChatGPT-a. Svaka OMEGA AI persona ima Prompt koji se obradjuje kroz SpajaPro. Prompt je integrisana svuda — u IO-OPENUI-AO, Proksi mrezi, Mobilnoj mrezi, i svakom aspektu ekosistema.',
      istaknuteStavke: [
        `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona — svaka sa SpajaPro Prompt-om`,
        'SpajaPro 6-15 engine zamenjuje ChatGPT',
        'Prompt integrisana u IO-OPENUI-AO frontend',
        'SpajaPro Prompt za Google AI, Vercel i GitHub',
        'Izvor: Kompanija-SPAJA repozitorijum',
      ],
    },
  },
  {
    id: 'ai-statistika',
    tip: 'statistika',
    naslov: '📊 AI + Prompt u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'AI Persone', vrednost: 21, ikona: '🧠' },
        { naziv: 'AI Platforme', vrednost: aiPlatforme.length, ikona: '🤖' },
        { naziv: 'SpajaPro verzije', vrednost: '6-15', ikona: '🌟' },
        { naziv: 'Prompt engine', vrednost: 'SpajaPro', ikona: '📝' },
      ],
    },
  },
  {
    id: 'ai-kartice',
    tip: 'kartice',
    naslov: '🧠 AI Platforme sa SpajaPro Prompt-om',
    redosled: 4,
    podaci: {
      kartice: aiPlatforme.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        progres: p.progres,
        oznake: p.tehnologije,
        href: '/platforme',
      })),
    },
  },
  {
    id: 'ai-lista',
    tip: 'lista',
    naslov: '⚡ AI + Prompt mogucnosti',
    redosled: 5,
    podaci: {
      stavke: [
        { ikona: '📝', naslov: 'SpajaPro Prompt', opis: 'Svaka AI persona koristi SpajaPro Prompt za razumevanje i generisanje sadrzaja' },
        { ikona: '🌟', naslov: 'SpajaPro 6-15', opis: 'Od baznog Prompt-a (v6) do univerzalnog kvantnog procesora (v15)' },
        { ikona: '🖥️', naslov: 'IO-OPENUI-AO Prompt', opis: 'SpajaPro Prompt zamenjuje ChatGPT u frontend komunikaciji' },
        { ikona: '🔄', naslov: 'Prompt Automatizacija', opis: 'Automatski code review, deploy, monitoring — sve kroz Prompt' },
      ],
    },
  },
  {
    id: 'ai-cta',
    tip: 'cta',
    naslov: '🚀 Istrazi AI + Prompt ekosistem',
    redosled: 6,
    podaci: {
      opis: 'AI Platforma sa SpajaPro Prompt engine-om — vestacka inteligencija u sluzbi digitalnog poslovanja.',
      dugmad: [
        { tekst: 'Prompt Sistem', href: '/prompt' },
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
];
