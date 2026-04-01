import type { Sajt, KategorijaSajta } from './types';

export const sajtovi: Sajt[] = [
  {
    id: 'aiiq-menjacnica',
    naziv: 'AI IQ Menjačnica',
    url: 'https://www.aiiqmenjačnica.com',
    ikona: '💱',
    kategorija: 'ekosistem',
    opis: 'Menjačnica sa AI optimizacijom',
  },
  {
    id: 'io-openui-ao',
    naziv: 'IO OPENUI AO',
    url: 'https://www.ioopenuiao.ac',
    ikona: '🖥️',
    kategorija: 'ekosistem',
    opis: 'Unified frontend platforma za ekosistem',
  },
  {
    id: 'ai-iq-world-bank',
    naziv: 'AI IQ World Bank',
    url: 'https://www.ai-iq-world-bank.com',
    ikona: '🏦',
    kategorija: 'ekosistem',
    opis: 'Digitalna banka sa globalnim dometom',
  },
  {
    id: 'kompanija-spaja',
    naziv: 'Kompanija SPAJA',
    url: 'https://www.kompanija-spaja.com',
    ikona: '🏢',
    kategorija: 'ekosistem',
    opis: 'Centralna kompanija Digitalne Industrije',
  },
  {
    id: 'svetska-organizacija',
    naziv: 'Svetska Organizacija',
    url: 'https://www.svetska-organizacija.com',
    ikona: '🌍',
    kategorija: 'ekosistem',
    opis: 'Globalna organizacija za koordinaciju projekata',
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
    id: 'openai',
    naziv: 'OpenAI',
    url: 'https://www.openai.com',
    ikona: '🤖',
    kategorija: 'tehnoloski-partner',
    opis: 'AI istraživanje i razvoj',
  },
  {
    id: 'vercel',
    naziv: 'Vercel',
    url: 'https://www.vercel.com',
    ikona: '🚀',
    kategorija: 'tehnoloski-partner',
    opis: 'Deploy i hosting platforma',
  },
  {
    id: 'github',
    naziv: 'GitHub',
    url: 'https://www.github.com',
    ikona: '💻',
    kategorija: 'tehnoloski-partner',
    opis: 'Platforma za upravljanje kodom',
  },
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
    url: 'https://www.youtyoube.com',
    ikona: '🎬',
    kategorija: 'drustvena-mreza',
    opis: 'Platforma za video sadržaje',
  },
  {
    id: 'threads',
    naziv: 'Threads',
    url: 'https://www.threads.com',
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
