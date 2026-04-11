/**
 * 🎥 SPAJA Monitoring Live — Live Streaming Platforma (Twitch-like)
 *
 * Monitoring Live je live streaming platforma generisana kroz SPAJA Generator.
 * Nešto poput Twitcha — kreatori, streamovi, chat, donacije.
 *
 * Link: https://chatgpt.com/c/68e00ce2-6550-8325-8247-e50fd9a3496f
 * Integracija: Proksi mreža + Real-time + OMEGA AI
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type StreamKategorija =
  | 'gaming'
  | 'coding'
  | 'muzika'
  | 'edukacija'
  | 'razgovor'
  | 'sport'
  | 'kreativno'
  | 'ai-demo';

export type StreamStatus = 'uzivo' | 'offline' | 'zakazan' | 'repriza';

export type StreamKvalitet = '480p' | '720p' | '1080p' | '4K';

// ─── Interfejsi ──────────────────────────────────────────

export interface LiveStream {
  id: string;
  naslov: string;
  opis: string;
  ikona: string;
  streamer: string;
  kategorija: StreamKategorija;
  status: StreamStatus;
  kvalitet: StreamKvalitet;
  gledaoca: number;
  pratioca: number;
  pocetak: string;
  trajanje: string;
  chatAktivan: boolean;
}

export interface Streamer {
  id: string;
  ime: string;
  avatar: string;
  ikona: string;
  pratilaca: number;
  ukupnoStreamova: number;
  kategorija: StreamKategorija;
  verifikovan: boolean;
  partner: boolean;
}

export interface MonitoringLiveStatistika {
  ukupnoStreamova: number;
  aktivnihStreamova: number;
  ukupnoStreamera: number;
  ukupnoGledaoca: number;
  prosecnoGledaoca: number;
}

export interface SpajaMonitoringLive {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  link: string;
  streamovi: LiveStream[];
  streameri: Streamer[];
  statistika: MonitoringLiveStatistika;
  mogucnosti: string[];
  status: 'aktivan' | 'beta';
}

// ─── Streamovi ───────────────────────────────────────────

const liveStreamovi: LiveStream[] = [
  {
    id: 'stream-coding-live',
    naslov: 'SpajaPro v15 — Live Coding Session',
    opis: 'Razvoj novih funkcionalnosti za SpajaPro v15 endžin uživo',
    ikona: '💻',
    streamer: 'streamer-alex-dev',
    kategorija: 'coding',
    status: 'uzivo',
    kvalitet: '1080p',
    gledaoca: 3_240,
    pratioca: 18_500,
    pocetak: '2025-07-01T10:00:00Z',
    trajanje: '3h 45min',
    chatAktivan: true,
  },
  {
    id: 'stream-gaming-dimenzije',
    naslov: 'Gaming Dimenzije — 4320D Turnir',
    opis: 'Uživo turnir u Gaming Dimenzijama sa dimenzionalnim renderovanjem',
    ikona: '🎮',
    streamer: 'streamer-gamer-pro',
    kategorija: 'gaming',
    status: 'uzivo',
    kvalitet: '4K',
    gledaoca: 8_920,
    pratioca: 42_300,
    pocetak: '2025-07-01T18:00:00Z',
    trajanje: '5h 20min',
    chatAktivan: true,
  },
  {
    id: 'stream-omega-ai-demo',
    naslov: 'OMEGA AI — 21 Persona Demo',
    opis: 'Demonstracija svih 21 OMEGA AI persona uživo',
    ikona: '🧠',
    streamer: 'streamer-omega-ai',
    kategorija: 'ai-demo',
    status: 'uzivo',
    kvalitet: '4K',
    gledaoca: 5_670,
    pratioca: 31_200,
    pocetak: '2025-07-01T14:00:00Z',
    trajanje: '2h 15min',
    chatAktivan: true,
  },
  {
    id: 'stream-muzika-ai',
    naslov: 'AI Music Studio — Live Set',
    opis: 'AI generisana muzika i live DJ performance',
    ikona: '🎵',
    streamer: 'streamer-dj-neural',
    kategorija: 'muzika',
    status: 'uzivo',
    kvalitet: '1080p',
    gledaoca: 2_180,
    pratioca: 9_800,
    pocetak: '2025-07-01T22:00:00Z',
    trajanje: '4h 00min',
    chatAktivan: true,
  },
  {
    id: 'stream-edukacija-prompt',
    naslov: 'Prompt Engineering Kurs',
    opis: 'Kurs prompt inženjeringa za SpajaPro i OMEGA AI',
    ikona: '🎓',
    streamer: 'streamer-prof-ai',
    kategorija: 'edukacija',
    status: 'repriza',
    kvalitet: '1080p',
    gledaoca: 1_450,
    pratioca: 15_600,
    pocetak: '2025-06-30T10:00:00Z',
    trajanje: '2h 30min',
    chatAktivan: false,
  },
  {
    id: 'stream-kreativni-dizajn',
    naslov: 'AI Design Studio',
    opis: 'Kreativni dizajn sa AI alatima — UI/UX i grafički dizajn',
    ikona: '🎨',
    streamer: 'streamer-dizajner',
    kategorija: 'kreativno',
    status: 'zakazan',
    kvalitet: '4K',
    gledaoca: 0,
    pratioca: 7_300,
    pocetak: '2025-07-02T15:00:00Z',
    trajanje: '3h 00min',
    chatAktivan: false,
  },
  {
    id: 'stream-sport-analiza',
    naslov: 'E-Sport Analiza — AI Predikcije',
    opis: 'AI analiza e-sport mečeva sa predikcijama ishoda',
    ikona: '🏆',
    streamer: 'streamer-sport-ai',
    kategorija: 'sport',
    status: 'uzivo',
    kvalitet: '1080p',
    gledaoca: 4_350,
    pratioca: 22_100,
    pocetak: '2025-07-01T19:00:00Z',
    trajanje: '2h 00min',
    chatAktivan: true,
  },
  {
    id: 'stream-razgovor-zajednica',
    naslov: 'SPAJA Community Talk',
    opis: 'Razgovor sa zajednicom — pitanja, predlozi i planovi',
    ikona: '💬',
    streamer: 'streamer-community',
    kategorija: 'razgovor',
    status: 'zakazan',
    kvalitet: '720p',
    gledaoca: 0,
    pratioca: 5_400,
    pocetak: '2025-07-03T12:00:00Z',
    trajanje: '1h 30min',
    chatAktivan: false,
  },
];

// ─── Streameri ───────────────────────────────────────────

const streameri: Streamer[] = [
  {
    id: 'streamer-alex-dev',
    ime: 'AlexDev',
    avatar: '/avatars/alex-dev.png',
    ikona: '💻',
    pratilaca: 18_500,
    ukupnoStreamova: 342,
    kategorija: 'coding',
    verifikovan: true,
    partner: true,
  },
  {
    id: 'streamer-gamer-pro',
    ime: 'GamerPro',
    avatar: '/avatars/gamer-pro.png',
    ikona: '🎮',
    pratilaca: 42_300,
    ukupnoStreamova: 876,
    kategorija: 'gaming',
    verifikovan: true,
    partner: true,
  },
  {
    id: 'streamer-omega-ai',
    ime: 'OMEGA AI Official',
    avatar: '/avatars/omega-ai.png',
    ikona: '🧠',
    pratilaca: 31_200,
    ukupnoStreamova: 128,
    kategorija: 'ai-demo',
    verifikovan: true,
    partner: true,
  },
  {
    id: 'streamer-dj-neural',
    ime: 'DJ Neural',
    avatar: '/avatars/dj-neural.png',
    ikona: '🎵',
    pratilaca: 9_800,
    ukupnoStreamova: 215,
    kategorija: 'muzika',
    verifikovan: true,
    partner: false,
  },
  {
    id: 'streamer-prof-ai',
    ime: 'Prof AI',
    avatar: '/avatars/prof-ai.png',
    ikona: '🎓',
    pratilaca: 15_600,
    ukupnoStreamova: 98,
    kategorija: 'edukacija',
    verifikovan: true,
    partner: true,
  },
  {
    id: 'streamer-sport-ai',
    ime: 'SportAI Analyst',
    avatar: '/avatars/sport-ai.png',
    ikona: '🏆',
    pratilaca: 22_100,
    ukupnoStreamova: 410,
    kategorija: 'sport',
    verifikovan: true,
    partner: true,
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const monitoringLiveMogucnosti: string[] = [
  'Live streaming u 4K kvalitetu',
  'Real-time chat sa emojima i reakcijama',
  'Donacije i podrška kreatorima',
  'VOD arhiva — svi prethodni streamovi',
  'Clip sistem — iseci najbolje momente',
  'Raid i host funkcionalnost',
  'Sub-only režim za pretplatnike',
  'AI moderacija chata putem OMEGA AI',
  'Proksi mreža za stabilan streaming',
  `Partner program sa ${KOMPANIJA}`,
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(): MonitoringLiveStatistika {
  const aktivnihStreamova = liveStreamovi.filter((s) => s.status === 'uzivo').length;
  const ukupnoGledaoca = liveStreamovi.reduce((sum, s) => sum + s.gledaoca, 0);
  const prosecnoGledaoca = aktivnihStreamova > 0
    ? Math.round(ukupnoGledaoca / aktivnihStreamova)
    : 0;

  return {
    ukupnoStreamova: liveStreamovi.length,
    aktivnihStreamova,
    ukupnoStreamera: streameri.length,
    ukupnoGledaoca,
    prosecnoGledaoca,
  };
}

// ─── Glavni Objekat — SPAJA Monitoring Live ──────────────

export const spajaMonitoringLive: SpajaMonitoringLive = {
  naziv: 'SPAJA Monitoring Live',
  opis: `Live streaming platforma sa kreatorima, streamovima, chatom i donacijama — ${KOMPANIJA}`,
  ikona: '🎥',
  verzija: APP_VERSION,
  link: 'https://chatgpt.com/c/68e00ce2-6550-8325-8247-e50fd9a3496f',
  streamovi: liveStreamovi,
  streameri,
  statistika: izracunajStatistiku(),
  mogucnosti: monitoringLiveMogucnosti,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

/** Vraća samo streamove koji su uživo */
export function getUzivoStreamovi(): LiveStream[] {
  return liveStreamovi.filter((s) => s.status === 'uzivo');
}

/** Pronalazi streamera po ID-u */
export function getStreamerPoId(id: string): Streamer | undefined {
  return streameri.find((s) => s.id === id);
}

/** Vraća streamove po kategoriji */
export function getStreamoviPoKategoriji(kategorija: StreamKategorija): LiveStream[] {
  return liveStreamovi.filter((s) => s.kategorija === kategorija);
}

/** Vraća pregled Monitoring Live sistema — sažetak za dashboard */
export function getMonitoringLivePregled(): {
  naziv: string;
  verzija: string;
  status: string;
  ukupnoStreamova: number;
  aktivnihStreamova: number;
  ukupnoStreamera: number;
  ukupnoGledaoca: number;
  prosecnoGledaoca: number;
  ukupnoMogucnosti: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: spajaMonitoringLive.naziv,
    verzija: spajaMonitoringLive.verzija,
    status: spajaMonitoringLive.status,
    ukupnoStreamova: statistika.ukupnoStreamova,
    aktivnihStreamova: statistika.aktivnihStreamova,
    ukupnoStreamera: statistika.ukupnoStreamera,
    ukupnoGledaoca: statistika.ukupnoGledaoca,
    prosecnoGledaoca: statistika.prosecnoGledaoca,
    ukupnoMogucnosti: monitoringLiveMogucnosti.length,
  };
}
