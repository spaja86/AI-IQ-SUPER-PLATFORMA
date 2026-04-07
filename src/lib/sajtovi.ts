import type { Sajt, KategorijaSajta } from './types';

export const sajtovi: Sajt[] = [
  // ── Ekosistem — GitHub Repozitorijumi ─────────────────────────────────
  {
    id: 'aiiq-super-platforma-repo',
    naziv: 'AI IQ SUPER PLATFORMA (Repo)',
    url: 'https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA',
    ikona: '🏢',
    kategorija: 'ekosistem',
    opis: 'Centralna platforma — GitHub repozitorijum',
  },
  {
    id: 'io-openui-ao-repo',
    naziv: 'IO OPENUI AO (Repo)',
    url: 'https://github.com/spaja86/IO-OPENUI-AO',
    ikona: '🖥️',
    kategorija: 'ekosistem',
    opis: 'SpajaPro Engine + Laboratorija — GitHub repozitorijum',
  },
  {
    id: 'aiiq-menjacnica-repo',
    naziv: 'AI IQ Menjačnica (Repo)',
    url: 'https://github.com/spaja86/Ai-Iq-Menja-nica',
    ikona: '💱',
    kategorija: 'ekosistem',
    opis: 'Menjačnica sa AI optimizacijom — GitHub repozitorijum',
  },
  {
    id: 'ai-iq-world-bank-repo',
    naziv: 'AI IQ World Bank (Repo)',
    url: 'https://github.com/spaja86/Ai-Iq-World-Bank',
    ikona: '🏦',
    kategorija: 'ekosistem',
    opis: 'Digitalna banka sa globalnim dometom — GitHub repozitorijum',
  },
  {
    id: 'svetska-organizacija-repo',
    naziv: 'Svetska Organizacija (Repo)',
    url: 'https://github.com/spaja86/SVETSKA-ORGANIZACIJA',
    ikona: '🌍',
    kategorija: 'ekosistem',
    opis: 'Globalna organizacija za koordinaciju projekata — GitHub repozitorijum',
  },
  {
    id: 'openai-platform-repo',
    naziv: 'OpenAI Platform (Repo)',
    url: 'https://github.com/spaja86/openai-platform',
    ikona: '🤖',
    kategorija: 'ekosistem',
    opis: 'OpenAI API integracija — GitHub repozitorijum. API ključ ovde.',
  },
  {
    id: 'omega-ai-github-repo',
    naziv: 'OMEGA AI za GitHub (Repo)',
    url: 'https://github.com/spaja86/OMEGA-AI-za-GIT-HUB',
    ikona: '🧠',
    kategorija: 'ekosistem',
    opis: 'OMEGA AI za GitHub unapređenje — GitHub repozitorijum',
  },
  {
    id: 'omega-ai-vercel-repo',
    naziv: 'OMEGA AI za Vercel (Repo)',
    url: 'https://github.com/spaja86/OMEGA-AI-za-Vercel-',
    ikona: '🚀',
    kategorija: 'ekosistem',
    opis: 'OMEGA AI za Vercel unapređenje — GitHub repozitorijum',
  },
  {
    id: 'omega-ai-google-repo',
    naziv: 'OMEGA AI za Google (Repo)',
    url: 'https://github.com/spaja86/-OMEGA-AI-za-Google-',
    ikona: '🔍',
    kategorija: 'ekosistem',
    opis: 'OMEGA AI za Google unapređenje — GitHub repozitorijum',
  },
  {
    id: 'omega-ai-5-persona-repo',
    naziv: 'OMEGA AI 5 Persona (Repo)',
    url: 'https://github.com/spaja86/-OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube-',
    ikona: '👥',
    kategorija: 'ekosistem',
    opis: 'OMEGA AI 5 Persona za društvene mreže — GitHub repozitorijum',
  },
  {
    id: 'input-output-copilot-repo',
    naziv: 'Input/Output za Copilot (Repo)',
    url: 'https://github.com/spaja86/Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno',
    ikona: '⚙️',
    kategorija: 'ekosistem',
    opis: 'I/O za GitHub Copilot aktivnu komunikaciju — GitHub repozitorijum',
  },
  // ── Tehnološki Partneri ───────────────────────────────────────────────
  {
    id: 'openai',
    naziv: 'OpenAI',
    url: 'https://openai.com/',
    ikona: '🤖',
    kategorija: 'tehnoloski-partner',
    opis: 'AI istraživanje i razvoj — API integrisan u ekosistem preko spaja86/openai-platform repo',
  },
  {
    id: 'google',
    naziv: 'Google',
    url: 'https://www.google.com',
    ikona: '🔍',
    kategorija: 'tehnoloski-partner',
    opis: 'Pretraživač i Cloud platforma',
  },
  {
    id: 'vercel',
    naziv: 'Vercel',
    url: 'https://www.vercel.com',
    ikona: '🚀',
    kategorija: 'tehnoloski-partner',
    opis: 'Deploy i hosting platforma — koristimo OpenAI API za Vercel deploy',
  },
  {
    id: 'github',
    naziv: 'GitHub',
    url: 'https://www.github.com',
    ikona: '💻',
    kategorija: 'tehnoloski-partner',
    opis: 'Platforma za upravljanje kodom — svi repozitorijumi Digitalne Industrije',
  },
  // ── Društvene Mreže ───────────────────────────────────────────────────
  {
    id: 'facebook',
    naziv: 'Facebook',
    url: 'https://www.facebook.com',
    ikona: '📘',
    kategorija: 'drustvena-mreza',
    opis: 'Društvena mreža',
  },
  {
    id: 'instagram',
    naziv: 'Instagram',
    url: 'https://www.instagram.com',
    ikona: '📸',
    kategorija: 'drustvena-mreza',
    opis: 'Platforma za deljenje slika i videa',
  },
  {
    id: 'tiktok',
    naziv: 'TikTok',
    url: 'https://www.tiktok.com',
    ikona: '🎵',
    kategorija: 'drustvena-mreza',
    opis: 'Platforma za kratke video sadržaje',
  },
  {
    id: 'youtube',
    naziv: 'YouTube',
    url: 'https://www.youtube.com',
    ikona: '🎬',
    kategorija: 'drustvena-mreza',
    opis: 'Platforma za video sadržaje',
  },
  {
    id: 'threads',
    naziv: 'Threads',
    url: 'https://www.threads.net',
    ikona: '🧵',
    kategorija: 'drustvena-mreza',
    opis: 'Platforma za tekstualne objave',
  },
];

export function getSajtoviPoKategoriji(kategorija: KategorijaSajta): Sajt[] {
  return sajtovi.filter((s) => s.kategorija === kategorija);
}

export function getBrojSajtova(): number {
  return sajtovi.length;
}
