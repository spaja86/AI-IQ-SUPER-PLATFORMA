/**
 * 📡 PROKSI — Digitalni Proksi Sistem Digitalne Industrije
 *
 * Ekscentrični simulator koncentričnog hipsoneurcioničnog signala
 * koji se plasira prema objektima sa WiFi antenama.
 *
 * Rezonance i amplitude se međusobno uvezuju u ekliptičnu vezu
 * koja razvija snagu signala ogromne propusnosti.
 *
 * Proksi je mrežni sloj Digitalne Industrije koji omogućava
 * komunikaciju između svih platformi, servisa i AI agenata.
 */

export interface ProksiSignal {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'koncentricni' | 'ekscentricni' | 'eklipticni' | 'rezonantni';
  frekvencija: string;
  amplituda: string;
  snaga: string;
  domet: string;
  status: 'aktivan' | 'modulacija' | 'sinhronizacija' | 'hibernacija';
}

export interface ProksiCvor {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  signali: string[];
  kapacitet: string;
  latencija: string;
  povezanePlatforme: string[];
}

export interface ProksiMreza {
  naziv: string;
  opis: string;
  cvorovi: ProksiCvor[];
  signali: ProksiSignal[];
  ukupniKapacitet: string;
  topologija: 'koncentricna' | 'eklipticna' | 'hibridna';
}

/** Proksi signali — tipovi signala u mreži */
export const proksiSignali: ProksiSignal[] = [
  {
    id: 'hipsoneuricni-primarni',
    naziv: 'Hipsoneurični Primarni',
    opis: 'Primarni koncentrični signal koji uspostavlja osnovu mreže — jezgro celokupne Proksi komunikacije',
    ikona: '📡',
    tip: 'koncentricni',
    frekvencija: '8.7 THz Oktavni',
    amplituda: '∞ dB Adaptivna',
    snaga: '10²²⁸ TB/s',
    domet: 'Globalni — sve WiFi antene',
    status: 'aktivan',
  },
  {
    id: 'ekscentricni-modulator',
    naziv: 'Ekscentrični Modulator',
    opis: 'Ekscentrični simulator koji modulira signal prema WiFi objektima — prilagođava frekvenciju u realnom vremenu',
    ikona: '🌀',
    tip: 'ekscentricni',
    frekvencija: '12.4 THz Dinamička',
    amplituda: 'Varijabilna 0–∞ dB',
    snaga: '10²²⁸ TB/s',
    domet: 'Sve plasirene WiFi tačke',
    status: 'aktivan',
  },
  {
    id: 'eklipticna-veza',
    naziv: 'Ekliptična Veza',
    opis: 'Ekliptična vez koja uvezuje rezonance i amplitude — kreira stabilnu orbitalnu komunikaciju',
    ikona: '🔄',
    tip: 'eklipticni',
    frekvencija: '21.6 THz Harmonična',
    amplituda: 'Sinhronizovana sa rezonancama',
    snaga: '10²²⁸ TB/s',
    domet: 'Ekliptični opseg — pun krug',
    status: 'aktivan',
  },
  {
    id: 'rezonantni-pojacavac',
    naziv: 'Rezonantni Pojačavač',
    opis: 'Pojačava rezonantne harmonike između čvorova — eksponencijalno multiplicira propusnost',
    ikona: '⚡',
    tip: 'rezonantni',
    frekvencija: '44.1 THz Rezonantna',
    amplituda: 'Auto-eskalaciona',
    snaga: '10²²⁸ TB/s',
    domet: 'Svi rezonantni čvorovi',
    status: 'aktivan',
  },
  {
    id: 'koncentricni-distributer',
    naziv: 'Koncentrični Distributer',
    opis: 'Distribuira signal u koncentričnim krugovima — svaki krug udvostručuje domet',
    ikona: '🎯',
    tip: 'koncentricni',
    frekvencija: '16.8 THz Cirkularna',
    amplituda: 'Progresivna ×2 po krugu',
    snaga: '10²²⁸ TB/s',
    domet: 'Koncentrični krugovi × n',
    status: 'aktivan',
  },
  {
    id: 'hibridni-sinhronizator',
    naziv: 'Hibridni Sinhronizator',
    opis: 'Sinhronizuje sve tipove signala u harmoničnu celinu — master clock celokupne mreže',
    ikona: '🔮',
    tip: 'eklipticni',
    frekvencija: '88.2 THz Master',
    amplituda: 'Unificirana',
    snaga: '10²²⁸ TB/s',
    domet: 'Celokupna Proksi mreža',
    status: 'sinhronizacija',
  },
];

/** Proksi čvorovi — tačke u mreži */
export const proksiCvorovi: ProksiCvor[] = [
  {
    id: 'jezgro-cvor',
    naziv: 'Jezgro Čvor',
    opis: 'Centralni čvor Proksi mreže — srce celokupnog sistema',
    ikona: '🏭',
    signali: ['hipsoneuricni-primarni', 'koncentricni-distributer', 'hibridni-sinhronizator'],
    kapacitet: '10²²⁸ TB',
    latencija: '0.001 ms',
    povezanePlatforme: ['ai-iq-super-platforma', 'io-openui-ao'],
  },
  {
    id: 'finansijski-cvor',
    naziv: 'Finansijski Čvor',
    opis: 'Čvor za finansijske platforme — banka i menjačnica',
    ikona: '💰',
    signali: ['ekscentricni-modulator', 'eklipticna-veza'],
    kapacitet: '10²²⁸ TB',
    latencija: '0.003 ms',
    povezanePlatforme: ['ai-iq-world-bank', 'ai-iq-menjacnica'],
  },
  {
    id: 'ai-cvor',
    naziv: 'AI Čvor',
    opis: 'Čvor za AI platforme i OMEGA agente',
    ikona: '🧠',
    signali: ['rezonantni-pojacavac', 'eklipticna-veza', 'hibridni-sinhronizator'],
    kapacitet: '10²²⁸ TB',
    latencija: '0.002 ms',
    povezanePlatforme: ['omega-ai-github', 'omega-ai-vercel', 'omega-ai-google', 'omega-ai-5-persona', 'openai-platforma'],
  },
  {
    id: 'globalni-cvor',
    naziv: 'Globalni Čvor',
    opis: 'Čvor za globalnu komunikaciju i organizacije',
    ikona: '🌍',
    signali: ['koncentricni-distributer', 'ekscentricni-modulator'],
    kapacitet: '10²²⁸ TB',
    latencija: '0.005 ms',
    povezanePlatforme: ['svetska-organizacija'],
  },
  {
    id: 'alati-cvor',
    naziv: 'Alati Čvor',
    opis: 'Čvor za razvojne alate i integracije',
    ikona: '⚙️',
    signali: ['ekscentricni-modulator', 'rezonantni-pojacavac'],
    kapacitet: '10²²⁸ TB',
    latencija: '0.004 ms',
    povezanePlatforme: ['input-output-copilot'],
  },
];

/** Kompletna Proksi mreža */
export const proksiMreza: ProksiMreza = {
  naziv: 'SPAJA Proksi Mreža',
  opis: 'Ekscentrični simulator koncentričnog hipsoneuričnog signala prema plasiranim objektima sa WiFi antenama — rezonance i amplitude se uvezuju u ekliptičnu vez ogromne propusnosti. Proširena WiFi Antenom za eliptični suplement ekscentričnog koda u matričnom jednačenju oktavnog sistema.',
  cvorovi: proksiCvorovi,
  signali: proksiSignali,
  ukupniKapacitet: '10²²⁸ TB',
  topologija: 'hibridna',
};

// Helpers
export function getAktivniSignali(): ProksiSignal[] {
  return proksiSignali.filter((s) => s.status === 'aktivan');
}

export function getCvorPoId(id: string): ProksiCvor | undefined {
  return proksiCvorovi.find((c) => c.id === id);
}

export function getSignaliZaCvor(cvorId: string): ProksiSignal[] {
  const cvor = getCvorPoId(cvorId);
  if (!cvor) return [];
  return proksiSignali.filter((s) => cvor.signali.includes(s.id));
}

export function getBrojPovezanihPlatformi(): number {
  const sve = new Set(proksiCvorovi.flatMap((c) => c.povezanePlatforme));
  return sve.size;
}
