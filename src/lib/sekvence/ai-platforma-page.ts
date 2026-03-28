import type { Sekvenca } from '@/lib/types';
import { platforme } from '@/lib/platforme';

const aiPlatforme = platforme.filter((p) => p.kategorija === 'ai');

export const aiPlatformaSekvence: Sekvenca[] = [
  {
    id: 'ai-hero',
    tip: 'hero',
    naslov: '🤖 AI Platforma',
    podnaslov: 'Centralno mesto za sve AI sisteme Kompanije SPAJA',
    ikona: '🤖',
    redosled: 1,
    podaci: {
      opis: 'AI Platforma objedinjuje sve sisteme vestacke inteligencije — od OMEGA AI persona do specijalizovanih ML modela i API integracija.',
      dugmad: [
        { tekst: 'Omega AI', href: '/omega-ai' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'ai-tekst',
    tip: 'tekst',
    naslov: 'Sta je AI Platforma?',
    redosled: 2,
    podaci: {
      sadrzaj: 'AI Platforma je hub za sve servise vestacke inteligencije. Ukljucuje OMEGA AI multi-agent sistem sa 21 personom, integracije sa OpenAI, Google AI, i specijalizovane ML modele za finansije i analitiku.',
      istaknuteStavke: [
        '21 OMEGA AI persona za razlicite zadatke',
        'Integracija sa OpenAI GPT-4 i DALL-E',
        'Google Cloud AI za analitiku i SEO',
        'Specijalizovani ML modeli za finansije',
      ],
    },
  },
  {
    id: 'ai-statistika',
    tip: 'statistika',
    naslov: '📊 AI u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'AI Agenti', vrednost: 21, ikona: '🧠' },
        { naziv: 'AI Platforme', vrednost: aiPlatforme.length, ikona: '🤖' },
        { naziv: 'API pozivi/dan', vrednost: '50K+', ikona: '📡' },
        { naziv: 'Tacnost', vrednost: '96%', ikona: '🎯' },
      ],
    },
  },
  {
    id: 'ai-kartice',
    tip: 'kartice',
    naslov: '🧠 AI Platforme i servisi',
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
    naslov: '⚡ AI mogucnosti',
    redosled: 5,
    podaci: {
      stavke: [
        { ikona: '💬', naslov: 'Prirodni jezik', opis: 'Razumevanje i generisanje teksta na srpskom i engleskom' },
        { ikona: '👁️', naslov: 'Kompjuterski vid', opis: 'Analiza slika i video sadrzaja' },
        { ikona: '📊', naslov: 'Prediktivna analitika', opis: 'Predikcija trendova i anomalija' },
        { ikona: '🔄', naslov: 'Automatizacija', opis: 'Automatski code review, deploy, monitoring' },
      ],
    },
  },
  {
    id: 'ai-cta',
    tip: 'cta',
    naslov: '🚀 Istrazi AI ekosistem',
    redosled: 6,
    podaci: {
      opis: 'AI Platforma — vestacka inteligencija u sluzbi digitalnog poslovanja.',
      dugmad: [
        { tekst: 'Omega AI', href: '/omega-ai' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
