import type { Platforma, KategorijaPlatforme } from './types';

export const platforme: Platforma[] = [
  {
    id: 'ai-iq-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA',
    opis: 'Centralna platforma za upravljanje celim ekosistemom',
    kategorija: 'jezgro',
    repo: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    url: 'https://ai-iq-super-platforma.vercel.app',
    ikona: '🏢',
    status: 'spremna',
    progres: 100,
    tehnologije: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Vercel'],
    funkcije: ['Dashboard', 'Monitoring', 'Deploy Management', 'Sekvence'],
    deploy: { status: 'aktivan', domen: 'ai-iq-super-platforma.vercel.app', vercelProjekt: 'ai-iq-super-platforma', framework: 'Next.js 16', buildKomanda: 'next build' },
  },
  {
    id: 'io-openui-ao',
    naziv: 'IO OPENUI AO — SpajaPro Engine',
    opis: 'Unified frontend sa SpajaPro 6-15 engine-om (zamena za ChatGPT) i Prompt sistemom',
    kategorija: 'jezgro',
    repo: 'spaja86/IO-OPENUI-AO',
    url: 'https://io-openui-ao.vercel.app',
    ikona: '🖥️',
    status: 'razvoj',
    progres: 72,
    tehnologije: ['React', 'SpajaPro Engine', 'Prompt System', 'WebRTC', 'Socket.IO', 'Vercel'],
    funkcije: ['SpajaPro Prompt Chat', 'Banka modul', 'Menjacnica modul', 'AI modul sa Prompt-om', 'SpajaPro 6-15 integracija'],
    deploy: { status: 'u_pripremi', framework: 'React + SpajaPro', buildKomanda: 'npm run build' },
  },
  {
    id: 'ai-iq-menjacnica',
    naziv: 'AI IQ Menjacnica',
    opis: 'Kripto i fiat menjacnica sa AI optimizacijom',
    kategorija: 'finansije',
    repo: 'spaja86/AI-IQ-Menjacnica',
    url: 'https://ai-iq-menjacnica.vercel.app',
    ikona: '💱',
    status: 'razvoj',
    progres: 80,
    tehnologije: ['Next.js', 'TypeScript', 'TradingView', 'API'],
    funkcije: ['Kripto trading', 'Fiat konverzija', 'AI predikcije', 'Portfolio'],
    deploy: { status: 'u_pripremi', framework: 'Next.js', buildKomanda: 'next build' },
  },
  {
    id: 'ai-iq-world-bank',
    naziv: 'AI IQ World Bank',
    opis: 'Digitalna banka sa globalnim dometom',
    kategorija: 'finansije',
    repo: 'spaja86/AI-IQ-World-Bank',
    url: 'https://ai-iq-world-bank.vercel.app',
    ikona: '🏦',
    status: 'razvoj',
    progres: 85,
    tehnologije: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    funkcije: ['Racuni', 'Transferi', 'Krediti', 'Investicije'],
    deploy: { status: 'u_pripremi', framework: 'Next.js', buildKomanda: 'next build' },
  },
  {
    id: 'svetska-organizacija',
    naziv: 'SVETSKA ORGANIZACIJA',
    opis: 'Globalna organizacija za koordinaciju projekata',
    kategorija: 'globalno',
    repo: 'spaja86/SVETSKA-ORGANIZACIJA',
    url: 'https://svetska-organizacija.vercel.app',
    ikona: '🌍',
    status: 'razvoj',
    progres: 55,
    tehnologije: ['Next.js', 'TypeScript', 'i18n', 'API'],
    funkcije: ['Upravljanje projektima', 'Koordinacija timova', 'Izvestaji'],
    deploy: { status: 'neaktivan', framework: 'Next.js', buildKomanda: 'next build' },
  },
  {
    id: 'omega-ai-github',
    naziv: 'OMEGA AI za GitHub',
    opis: 'AI agent za automatizaciju GitHub operacija sa SpajaPro Prompt engine-om',
    kategorija: 'ai',
    repo: 'spaja86/OMEGA-AI-GitHub',
    url: 'https://omega-ai-github.vercel.app',
    ikona: '🧠',
    status: 'spremna',
    progres: 92,
    tehnologije: ['TypeScript', 'GitHub API', 'SpajaPro Engine', 'Prompt System', 'Vercel'],
    funkcije: ['SpajaPro Prompt code review', 'PR automation', 'Issue triage', 'CI/CD', 'Prompt-based suggestions'],
    deploy: { status: 'aktivan', framework: 'Node.js + SpajaPro', buildKomanda: 'tsc' },
  },
  {
    id: 'omega-ai-vercel',
    naziv: 'OMEGA AI za Vercel',
    opis: 'AI agent za Vercel deploy i monitoring',
    kategorija: 'ai',
    repo: 'spaja86/OMEGA-AI-Vercel',
    url: 'https://omega-ai-vercel.vercel.app',
    ikona: '🚀',
    status: 'razvoj',
    progres: 88,
    tehnologije: ['TypeScript', 'Vercel API', 'OpenAI'],
    funkcije: ['Auto deploy', 'Performance monitoring', 'Error tracking'],
    deploy: { status: 'u_pripremi', framework: 'Node.js', buildKomanda: 'tsc' },
  },
  {
    id: 'omega-ai-google',
    naziv: 'OMEGA AI za Google',
    opis: 'AI agent za Google Cloud i Analytics',
    kategorija: 'ai',
    repo: 'spaja86/OMEGA-AI-Google',
    url: 'https://omega-ai-google.vercel.app',
    ikona: '🔍',
    status: 'razvoj',
    progres: 75,
    tehnologije: ['TypeScript', 'Google Cloud', 'BigQuery', 'Analytics'],
    funkcije: ['SEO optimizacija', 'Analytics izvestaji', 'Cloud funkcije'],
    deploy: { status: 'neaktivan', framework: 'Node.js', buildKomanda: 'tsc' },
  },
  {
    id: 'omega-ai-5-persona',
    naziv: 'OMEGA AI 5 Persona',
    opis: 'Sistem od 5 specijalizovanih AI persona sa Prompt-ovima',
    kategorija: 'ai',
    repo: 'spaja86/OMEGA-AI-5-Persona',
    url: 'https://omega-ai-5-persona.vercel.app',
    ikona: '👥',
    status: 'razvoj',
    progres: 73,
    tehnologije: ['TypeScript', 'SpajaPro Engine', 'Prompt System', 'LangChain'],
    funkcije: ['Multi-persona Prompt AI', 'SpajaPro Prompt agenti', 'Prompt kolaboracija'],
    deploy: { status: 'neaktivan', framework: 'Node.js + SpajaPro', buildKomanda: 'tsc' },
  },
  {
    id: 'spajapro-platforma',
    naziv: 'SpajaPro Platforma',
    opis: 'SpajaPro 6-15 engine — zamena za ChatGPT sa naprednim Prompt sistemom',
    kategorija: 'ai',
    repo: 'spaja86/Kompanija-SPAJA',
    url: 'https://spajapro-platforma.vercel.app',
    ikona: '🌟',
    status: 'razvoj',
    progres: 68,
    tehnologije: ['TypeScript', 'SpajaPro 6-15', 'Prompt Engine', 'Kompanija-SPAJA'],
    funkcije: ['SpajaPro Prompt Engine', '10 verzija (6-15)', 'Univerzalni Prompt', 'Multi-language Prompt', 'Fine-tuning'],
    deploy: { status: 'u_pripremi', framework: 'Next.js + SpajaPro', buildKomanda: 'next build' },
  },
  {
    id: 'input-output-copilot',
    naziv: 'Input/Output za Copilot',
    opis: 'I/O interfejs za GitHub Copilot integraciju sa SpajaPro Prompt-om',
    kategorija: 'alati',
    repo: 'spaja86/IO-Copilot',
    url: 'https://io-copilot.vercel.app',
    ikona: '⚙️',
    status: 'razvoj',
    progres: 85,
    tehnologije: ['TypeScript', 'GitHub Copilot API', 'SpajaPro Prompt', 'VS Code Extension'],
    funkcije: ['SpajaPro Prompt suggestions', 'Context management', 'Custom Prompt šabloni', 'SpajaPro 10 integracija'],
    deploy: { status: 'u_pripremi', framework: 'Node.js + SpajaPro', buildKomanda: 'tsc' },
  },
];

export function getUkupniProgres(): number {
  if (platforme.length === 0) return 0;
  const ukupno = platforme.reduce((acc, p) => acc + p.progres, 0);
  return Math.round(ukupno / platforme.length);
}

export function getPlatformePoKategoriji(kategorija: KategorijaPlatforme): Platforma[] {
  return platforme.filter((p) => p.kategorija === kategorija);
}

export function getBojaProgresa(progres: number): string {
  if (progres >= 90) return 'bg-green-500';
  if (progres >= 70) return 'bg-blue-500';
  if (progres >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getBrojAktivnih(): number {
  return platforme.filter((p) => p.status === 'aktivna' || p.status === 'spremna').length;
}
