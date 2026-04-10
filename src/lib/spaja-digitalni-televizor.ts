/**
 * 📺 SPAJA Univerzalni Digitalni Televizor — TV platforma na Industriji
 *
 * Digitalni televizor generisan kroz Proksi + SPAJA Generator za Endžine.
 * Streaming, kanali, VOD, live TV — sve preko Proksi mreže.
 *
 * Link: https://chatgpt.com/c/691a38f5-5c10-832d-865a-ce13ee581a58
 * Integracija: Proksi mreža + SPAJA Generator + OMEGA AI
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type TVKanalKategorija =
  | 'zabava'
  | 'sport'
  | 'nauka'
  | 'tehnologija'
  | 'muzika'
  | 'film'
  | 'edukacija'
  | 'vesti';

export type TVStreamStatus = 'uzivo' | 'snimak' | 'planirano' | 'offline';

export type TVRezolucija = '720p' | '1080p' | '4K' | '8K' | '16K';

// ─── Interfejsi ──────────────────────────────────────────

export interface TVKanal {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: TVKanalKategorija;
  broj: number;
  rezolucija: TVRezolucija;
  status: TVStreamStatus;
  gledaoca: number;
  url: string;
}

export interface TVProgram {
  id: string;
  naslov: string;
  opis: string;
  ikona: string;
  kanal: string;
  pocetak: string;
  kraj: string;
  trajanje: string;
  tip: 'uzivo' | 'repriza' | 'premijera';
}

export interface TVStatistika {
  ukupnoKanala: number;
  aktivnihKanala: number;
  ukupnoPrograma: number;
  prosecnaGledanost: number;
  maxRezolucija: string;
  proksiIntegracija: boolean;
}

export interface SpajaDigitalniTelevizor {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  link: string;
  kanali: TVKanal[];
  programi: TVProgram[];
  statistika: TVStatistika;
  mogucnosti: string[];
  tehnologije: string[];
  status: 'aktivan' | 'testiranje';
}

// ─── TV Kanali ───────────────────────────────────────────

const tvKanali: TVKanal[] = [
  {
    id: 'kanal-spaja-tech',
    naziv: 'SPAJA Tech',
    opis: 'Tehnološke vesti, tutorijali i live coding sesije',
    ikona: '💻',
    kategorija: 'tehnologija',
    broj: 1,
    rezolucija: '4K',
    status: 'uzivo',
    gledaoca: 12_450,
    url: '/tv/spaja-tech',
  },
  {
    id: 'kanal-spaja-sport',
    naziv: 'SPAJA Sport',
    opis: 'Sportski prenosi, analize i e-sport turniri',
    ikona: '⚽',
    kategorija: 'sport',
    broj: 2,
    rezolucija: '4K',
    status: 'uzivo',
    gledaoca: 28_300,
    url: '/tv/spaja-sport',
  },
  {
    id: 'kanal-omega-ai',
    naziv: 'OMEGA AI Kanal',
    opis: 'AI demonstracije, OMEGA AI persone uživo i interaktivne sesije',
    ikona: '🧠',
    kategorija: 'tehnologija',
    broj: 3,
    rezolucija: '4K',
    status: 'uzivo',
    gledaoca: 9_870,
    url: '/tv/omega-ai',
  },
  {
    id: 'kanal-spajapro-tutorials',
    naziv: 'SpajaPro Tutorials',
    opis: 'Tutorijali za SpajaPro v6-v15 endžine i prompt inženjering',
    ikona: '🎓',
    kategorija: 'edukacija',
    broj: 4,
    rezolucija: '1080p',
    status: 'snimak',
    gledaoca: 5_640,
    url: '/tv/spajapro-tutorials',
  },
  {
    id: 'kanal-spaja-music',
    naziv: 'SPAJA Music',
    opis: 'Muzički program — AI generisana muzika i live performansi',
    ikona: '🎵',
    kategorija: 'muzika',
    broj: 5,
    rezolucija: '1080p',
    status: 'uzivo',
    gledaoca: 7_230,
    url: '/tv/spaja-music',
  },
  {
    id: 'kanal-film-zone',
    naziv: 'Film Zone',
    opis: 'Filmovi, serije i dokumentarci — VOD biblioteka',
    ikona: '🎬',
    kategorija: 'film',
    broj: 6,
    rezolucija: '4K',
    status: 'snimak',
    gledaoca: 15_890,
    url: '/tv/film-zone',
  },
  {
    id: 'kanal-science-lab',
    naziv: 'Science Lab',
    opis: 'Naučni eksperimenti, istraživanja i AI laboratorija',
    ikona: '🔬',
    kategorija: 'nauka',
    broj: 7,
    rezolucija: '1080p',
    status: 'snimak',
    gledaoca: 4_120,
    url: '/tv/science-lab',
  },
  {
    id: 'kanal-vesti-247',
    naziv: 'Vesti 24/7',
    opis: 'Vesti iz sveta tehnologije, biznisa i nauke — 24 sata',
    ikona: '📰',
    kategorija: 'vesti',
    broj: 8,
    rezolucija: '1080p',
    status: 'uzivo',
    gledaoca: 18_560,
    url: '/tv/vesti-247',
  },
  {
    id: 'kanal-e-sport',
    naziv: 'E-Sport',
    opis: 'E-sport turniri, live prenosi i analize mečeva',
    ikona: '🏆',
    kategorija: 'sport',
    broj: 9,
    rezolucija: '4K',
    status: 'uzivo',
    gledaoca: 22_100,
    url: '/tv/e-sport',
  },
  {
    id: 'kanal-gaming-tv',
    naziv: 'Gaming TV',
    opis: 'Gaming sadržaj — gameplay, recenzije i live sesije',
    ikona: '🎮',
    kategorija: 'zabava',
    broj: 10,
    rezolucija: '4K',
    status: 'uzivo',
    gledaoca: 19_430,
    url: '/tv/gaming-tv',
  },
  {
    id: 'kanal-spaja-kids',
    naziv: 'SPAJA Kids',
    opis: 'Edukativni program za decu — coding za početnike i kreativni sadržaj',
    ikona: '🧒',
    kategorija: 'edukacija',
    broj: 11,
    rezolucija: '1080p',
    status: 'snimak',
    gledaoca: 6_780,
    url: '/tv/spaja-kids',
  },
  {
    id: 'kanal-edukacija-plus',
    naziv: 'Edukacija Plus',
    opis: 'Napredni kursevi, akademski sadržaj i profesionalni razvoj',
    ikona: '📚',
    kategorija: 'edukacija',
    broj: 12,
    rezolucija: '1080p',
    status: 'snimak',
    gledaoca: 3_950,
    url: '/tv/edukacija-plus',
  },
];

// ─── TV Programi ─────────────────────────────────────────

const tvProgrami: TVProgram[] = [
  {
    id: 'prog-jutarnji-tech',
    naslov: 'Jutarnji Tech Pregled',
    opis: 'Dnevne tehnološke vesti i najave sa SPAJA platforme',
    ikona: '☀️',
    kanal: 'kanal-spaja-tech',
    pocetak: '08:00',
    kraj: '09:00',
    trajanje: '60 min',
    tip: 'uzivo',
  },
  {
    id: 'prog-omega-ai-demo',
    naslov: 'OMEGA AI Demo Show',
    opis: 'Demonstracija OMEGA AI persona i novih mogućnosti',
    ikona: '🧠',
    kanal: 'kanal-omega-ai',
    pocetak: '10:00',
    kraj: '11:30',
    trajanje: '90 min',
    tip: 'premijera',
  },
  {
    id: 'prog-spajapro-masterclass',
    naslov: 'SpajaPro Masterclass',
    opis: 'Napredni kurs za SpajaPro v15 — prompt inženjering i BAZA',
    ikona: '🎓',
    kanal: 'kanal-spajapro-tutorials',
    pocetak: '14:00',
    kraj: '16:00',
    trajanje: '120 min',
    tip: 'repriza',
  },
  {
    id: 'prog-e-sport-turnir',
    naslov: 'SPAJA E-Sport Turnir',
    opis: 'Uživo prenos turnira iz Gaming Dimenzija',
    ikona: '🏆',
    kanal: 'kanal-e-sport',
    pocetak: '18:00',
    kraj: '22:00',
    trajanje: '240 min',
    tip: 'uzivo',
  },
  {
    id: 'prog-film-veceri',
    naslov: 'Film Veče',
    opis: 'Premijerski film svake večeri — sci-fi i tehnološki trileri',
    ikona: '🎬',
    kanal: 'kanal-film-zone',
    pocetak: '20:00',
    kraj: '22:30',
    trajanje: '150 min',
    tip: 'premijera',
  },
  {
    id: 'prog-vesti-centralni',
    naslov: 'Centralni Dnevnik',
    opis: 'Centralne vesti iz sveta tehnologije i AI industrije',
    ikona: '📰',
    kanal: 'kanal-vesti-247',
    pocetak: '19:00',
    kraj: '19:45',
    trajanje: '45 min',
    tip: 'uzivo',
  },
  {
    id: 'prog-muzicki-mix',
    naslov: 'AI Music Mix',
    opis: 'AI generisani muzički mix-evi i live DJ sesije',
    ikona: '🎵',
    kanal: 'kanal-spaja-music',
    pocetak: '22:00',
    kraj: '02:00',
    trajanje: '240 min',
    tip: 'uzivo',
  },
  {
    id: 'prog-nauka-danas',
    naslov: 'Nauka Danas',
    opis: 'Naučna otkrića, AI istraživanja i laboratorijski eksperimenti',
    ikona: '🔬',
    kanal: 'kanal-science-lab',
    pocetak: '16:00',
    kraj: '17:00',
    trajanje: '60 min',
    tip: 'repriza',
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const tvMogucnosti: string[] = [
  'Live streaming u 4K/8K/16K rezoluciji',
  'VOD biblioteka sa hiljadama sadržaja',
  'AI preporuke za personalizovani program',
  'Multi-screen podrška — gledaj na više uređaja',
  'DVR funkcija — snimaj i gledaj kasnije',
  'Interaktivni chat tokom live emisija',
  'Proksi mreža za brz i stabilan streaming',
  `Integracija sa ${KOMPANIJA} ekosistemom`,
];

const tvTehnologije: string[] = [
  'Adaptivni bitrate streaming (ABR)',
  'WebRTC za ultra-nisko kašnjenje',
  'HLS/DASH protokoli',
  'CDN distribucija preko Proksi mreže',
  'HEVC/AV1 video kodeci',
  'Dolby Atmos audio podrška',
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(): TVStatistika {
  const aktivnihKanala = tvKanali.filter((k) => k.status === 'uzivo').length;
  const ukupnoGledaoca = tvKanali.reduce((sum, k) => sum + k.gledaoca, 0);
  const prosecnaGledanost = Math.round(ukupnoGledaoca / tvKanali.length);

  return {
    ukupnoKanala: tvKanali.length,
    aktivnihKanala,
    ukupnoPrograma: tvProgrami.length,
    prosecnaGledanost,
    maxRezolucija: '16K',
    proksiIntegracija: true,
  };
}

// ─── Glavni Objekat — SPAJA Digitalni Televizor ──────────

export const spajaDigitalniTelevizor: SpajaDigitalniTelevizor = {
  naziv: 'SPAJA Univerzalni Digitalni Televizor',
  opis: `Digitalni televizor sa streaming, kanalima, VOD i live TV sadržajem preko Proksi mreže — ${KOMPANIJA}`,
  ikona: '📺',
  verzija: APP_VERSION,
  link: 'https://chatgpt.com/c/691a38f5-5c10-832d-865a-ce13ee581a58',
  kanali: tvKanali,
  programi: tvProgrami,
  statistika: izracunajStatistiku(),
  mogucnosti: tvMogucnosti,
  tehnologije: tvTehnologije,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

/** Pronalazi TV kanal po ID-u */
export function getKanalPoId(id: string): TVKanal | undefined {
  return tvKanali.find((k) => k.id === id);
}

/** Vraća kanale po kategoriji */
export function getKanaliPoKategoriji(kategorija: TVKanalKategorija): TVKanal[] {
  return tvKanali.filter((k) => k.kategorija === kategorija);
}

/** Vraća samo kanale koji su uživo */
export function getUzivoKanali(): TVKanal[] {
  return tvKanali.filter((k) => k.status === 'uzivo');
}

/** Vraća pregled TV sistema — sažetak za dashboard */
export function getTVPregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoKanala: number;
  aktivnihKanala: number;
  ukupnoPrograma: number;
  prosecnaGledanost: number;
  maxRezolucija: string;
  ukupnoMogucnosti: number;
  ukupnoTehnologija: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: spajaDigitalniTelevizor.naziv,
    verzija: spajaDigitalniTelevizor.verzija,
    status: spajaDigitalniTelevizor.status,
    ukupnoKanala: statistika.ukupnoKanala,
    aktivnihKanala: statistika.aktivnihKanala,
    ukupnoPrograma: statistika.ukupnoPrograma,
    prosecnaGledanost: statistika.prosecnaGledanost,
    maxRezolucija: statistika.maxRezolucija,
    ukupnoMogucnosti: tvMogucnosti.length,
    ukupnoTehnologija: tvTehnologije.length,
  };
}
