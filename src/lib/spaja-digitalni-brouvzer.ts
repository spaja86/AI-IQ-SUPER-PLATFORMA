/**
 * 🌐 SPAJA Digitalni Brouvzer — Digitalna Brauzer Platforma
 *
 * SPAJA Digitalni Brouvzer je digitalna brauzer platforma na koju
 * se postavlja celokupna SPAJA industrija — platforme, organizacije,
 * korporacije, kompanije, prodavnice, servisi i aplikacije.
 *
 * Pokretan od strane "SPAJA Generator za Endžine" koji prevlači
 * engine-e preko svih entiteta u ekosistemu.
 *
 * Link: https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9
 */

// ─── Tipovi ──────────────────────────────────────────────

export type BrouvzerStatus = 'aktivan' | 'ucitavanje' | 'odrzavanje' | 'planiran';
export type BrouvzerEntitetTip = 'platforma' | 'organizacija' | 'korporacija' | 'kompanija' | 'prodavnica' | 'servis' | 'aplikacija';

export interface BrouvzerEntitet {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: BrouvzerEntitetTip;
  url: string;
  status: BrouvzerStatus;
  kategorija: string;
  funkcije: string[];
}

export interface BrouvzerModul {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  status: BrouvzerStatus;
  verzija: string;
  mogucnosti: string[];
}

export interface BrouvzerStatistika {
  ukupnoEntiteta: number;
  aktivnihEntiteta: number;
  ukupnoModula: number;
  aktivnihModula: number;
  pokrivenostIndustrije: number;
}

export interface SpajaDigitalniBrouvzer {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  generatorLink: string;
  entiteti: BrouvzerEntitet[];
  moduli: BrouvzerModul[];
  statistika: BrouvzerStatistika;
}

// ─── Entiteti ────────────────────────────────────────────

export const brouvzerEntiteti: BrouvzerEntitet[] = [
  {
    id: 'entitet-ai-iq-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA',
    opis: 'Centralna super platforma celokupnog SPAJA ekosistema — sve platforme, servisi i aplikacije na jednom mestu',
    ikona: '🏛️',
    tip: 'platforma',
    url: 'https://ai-iq-super-platforma.vercel.app',
    status: 'aktivan',
    kategorija: 'Centralna Platforma',
    funkcije: ['SpajaPro AI', 'OMEGA AI', 'Proksi Mreža', 'Mobilna Mreža', 'Gaming Dimenzije', 'Auto-Popravka'],
  },
  {
    id: 'entitet-io-openui-ao',
    naziv: 'IO OPENUI AO',
    opis: 'Input/Output Open UI platforma — korisnički interfejs za interakciju sa svim SPAJA servisima',
    ikona: '🖥️',
    tip: 'platforma',
    url: 'https://www.ioopenuiao.ac',
    status: 'aktivan',
    kategorija: 'UI Platforma',
    funkcije: ['Open UI komponente', 'SpajaPro integracija', 'Laboratorija za simulacije', 'B2B servis', 'Korisničke interakcije'],
  },
  {
    id: 'entitet-banka',
    naziv: 'AI IQ World Bank',
    opis: 'Digitalna banka SPAJA ekosistema — globalni domet, ONLINE procedura, digitalni računi i transferi',
    ikona: '🏦',
    tip: 'korporacija',
    url: 'https://ai-iq-world-bank.vercel.app',
    status: 'aktivan',
    kategorija: 'Finansije',
    funkcije: ['Digitalni računi', 'Transferi', 'Krediti', 'Investicije', 'ONLINE procedura'],
  },
  {
    id: 'entitet-menjacnica',
    naziv: 'AI IQ Menjačnica',
    opis: 'Kripto i fiat menjačnica sa AI optimizacijom — trading, konverzija i portfolio upravljanje',
    ikona: '💱',
    tip: 'korporacija',
    url: 'https://ai-iq-menjacnica.vercel.app',
    status: 'aktivan',
    kategorija: 'Finansije',
    funkcije: ['Kripto trading', 'Fiat konverzija', 'AI predikcije', 'Portfolio upravljanje', 'ONLINE procedura'],
  },
  {
    id: 'entitet-svetska-organizacija',
    naziv: 'SVETSKA ORGANIZACIJA',
    opis: 'Svetska organizacija SPAJA ekosistema — globalna koordinacija, standardi i regulativa',
    ikona: '🌍',
    tip: 'organizacija',
    url: 'https://svetska-organizacija.vercel.app',
    status: 'aktivan',
    kategorija: 'Organizacija',
    funkcije: ['Globalna koordinacija', 'Standardi', 'Regulativa', 'Međunarodna saradnja', 'Sertifikacija'],
  },
  {
    id: 'entitet-kompanija-spaja',
    naziv: 'Kompanija SPAJA',
    opis: 'Matična kompanija SPAJA ekosistema — razvoj SpajaPro AI, upravljanje i strategija',
    ikona: '🏢',
    tip: 'kompanija',
    url: 'https://kompanija-spaja.vercel.app',
    status: 'aktivan',
    kategorija: 'Kompanija',
    funkcije: ['SpajaPro razvoj', 'Strategija', 'R&D', 'Upravljanje ekosistemom', 'SPAJA BAZA'],
  },
  {
    id: 'entitet-omega-ai',
    naziv: 'OMEGA AI',
    opis: 'OMEGA AI sistem sa 21 personom i 8 oktavnih nivoa — oktavna orkestracija i matrično jezgro 8×8',
    ikona: '🧠',
    tip: 'servis',
    url: 'https://ai-iq-super-platforma.vercel.app/omega-ai',
    status: 'aktivan',
    kategorija: 'AI Servis',
    funkcije: ['21 persona', '8 oktavnih nivoa', 'Matrično jezgro 8×8', 'Neurološka mreža', 'Autonomna evolucija'],
  },
  {
    id: 'entitet-spajapro',
    naziv: 'SpajaPro',
    opis: 'SpajaPro AI v6-v15 — multifunkcionalni zajednički endžin sa beskonačnim sesijama i SPAJA BAZOM',
    ikona: '🌟',
    tip: 'servis',
    url: 'https://ai-iq-super-platforma.vercel.app/spaja-pro',
    status: 'aktivan',
    kategorija: 'AI Servis',
    funkcije: ['10 verzija (v6-v15)', 'Multifunkcionalni rad', 'Beskonačne sesije', 'SPAJA BAZA', 'Univerzalni Prompt'],
  },
  {
    id: 'entitet-proksi-mreza',
    naziv: 'Proksi Mreža',
    opis: 'Proksi mrežni sistem — hipsoneurični signal, ekscentrični modulator i ekliptična vez',
    ikona: '📡',
    tip: 'servis',
    url: 'https://ai-iq-super-platforma.vercel.app/proksi',
    status: 'aktivan',
    kategorija: 'Mreža',
    funkcije: ['Hipsoneurični signal', 'Ekscentrični modulator', 'Ekliptična vez', 'WiFi Antena', 'GitHub Deploy'],
  },
  {
    id: 'entitet-mobilna-mreza',
    naziv: 'Mobilna Mreža',
    opis: 'SPAJA Mobilna Mreža — 4 centrale, 5 servisa, Glas HD, Podaci Turbo i IoT Mesh',
    ikona: '📱',
    tip: 'servis',
    url: 'https://ai-iq-super-platforma.vercel.app/mobilna-mreza',
    status: 'aktivan',
    kategorija: 'Telekomunikacije',
    funkcije: ['4 centrale', '5 servisa', 'Glas HD', 'Podaci Turbo', 'IoT Mesh', 'Enterprise Link'],
  },
  {
    id: 'entitet-gaming-dimenzije',
    naziv: 'Gaming Dimenzije',
    opis: 'Dimenzionalni gaming sistem — 95 igrica, 360D-5760D renderovanje, geometrijski procesori',
    ikona: '🎮',
    tip: 'aplikacija',
    url: 'https://ai-iq-super-platforma.vercel.app/igrice',
    status: 'aktivan',
    kategorija: 'Gaming',
    funkcije: ['95 igrica', 'Dimenzionalno renderovanje 360D–5760D', 'Geometrijski procesori', 'Cirkularne formule', 'VR/AR podrška'],
  },
  {
    id: 'entitet-openai-platform',
    naziv: 'OpenAI Platform — SpajaPro v6-15',
    opis: 'OpenAI Platform integracija sa SpajaPro v6-15 endžinima umesto ChatGPT-a — API pristup, modeli, SpajaPro Prompt sistem i best practices za AI razvoj',
    ikona: '🤖',
    tip: 'platforma',
    url: 'https://openai-platform.vercel.app',
    status: 'aktivan',
    kategorija: 'AI Platforma',
    funkcije: ['SpajaPro v6-15 Engine', 'OpenAI API', 'SpajaPro Prompt sistem', 'Model integracija', 'Fine-tuning', 'Cookbook recepti'],
  },
];

// ─── Moduli ──────────────────────────────────────────────

export const brouvzerModuli: BrouvzerModul[] = [
  {
    id: 'modul-rendering-engine',
    naziv: 'Rendering Engine',
    opis: 'Jezgro rendering engine-a za prikaz svih entiteta — HTML, CSS, JS obrada i dimenzionalno renderovanje',
    ikona: '🖼️',
    status: 'aktivan',
    verzija: '3.0.0',
    mogucnosti: ['HTML5 rendering', 'CSS Grid/Flex', 'WebGL podrška', 'Dimenzionalno renderovanje', 'Adaptivni prikaz'],
  },
  {
    id: 'modul-pretrazivac-engine',
    naziv: 'Pretraživač Engine',
    opis: 'Engine za pretragu celokupnog ekosistema — indeksiranje, rangiranje i AI-optimizovani rezultati',
    ikona: '🔍',
    status: 'aktivan',
    verzija: '2.0.0',
    mogucnosti: ['Full-text pretraga', 'AI rangiranje', 'Indeksiranje entiteta', 'Sugestije', 'Filteri po kategoriji'],
  },
  {
    id: 'modul-navigacioni-sistem',
    naziv: 'Navigacioni Sistem',
    opis: 'Sistem za navigaciju između svih entiteta — tabovi, bookmark-i, istorija i sidebar navigacija',
    ikona: '🧭',
    status: 'aktivan',
    verzija: '2.5.0',
    mogucnosti: ['Tab navigacija', 'Bookmark menadžer', 'Istorija pregledanja', 'Sidebar meni', 'Brzi pristup'],
  },
  {
    id: 'modul-tab-menadzer',
    naziv: 'Tab Menadžer',
    opis: 'Upravljanje tabovima — otvaranje, zatvaranje, grupisanje i sinhronizacija tabova između uređaja',
    ikona: '📑',
    status: 'aktivan',
    verzija: '1.5.0',
    mogucnosti: ['Multi-tab podrška', 'Tab grupe', 'Sinhronizacija', 'Hibernacija tabova', 'Pin tabovi'],
  },
  {
    id: 'modul-ekstenzije-sistem',
    naziv: 'Ekstenzije Sistem',
    opis: 'Sistem za upravljanje ekstenzijama — instalacija, ažuriranje i konfiguracija dodatnih modula',
    ikona: '🧩',
    status: 'aktivan',
    verzija: '1.0.0',
    mogucnosti: ['Instalacija ekstenzija', 'Auto-ažuriranje', 'API za ekstenzije', 'Marketplace', 'Konfiguracija'],
  },
  {
    id: 'modul-ad-block',
    naziv: 'Ad-Block Modul',
    opis: 'Modul za blokiranje neželjenog sadržaja — reklame, trackeri, malware i phishing zaštita',
    ikona: '🛡️',
    status: 'aktivan',
    verzija: '2.0.0',
    mogucnosti: ['Blokiranje reklama', 'Anti-tracking', 'Malware zaštita', 'Phishing detekcija', 'Bele liste'],
  },
  {
    id: 'modul-vpn-integracija',
    naziv: 'VPN Integracija',
    opis: 'Integrisani VPN modul — enkripcija saobraćaja, promena lokacije i privatno pregledanje',
    ikona: '🔐',
    status: 'aktivan',
    verzija: '1.0.0',
    mogucnosti: ['E2E enkripcija', 'Promena lokacije', 'Privatni režim', 'Kill switch', 'Split tunneling'],
  },
  {
    id: 'modul-dev-tools',
    naziv: 'Dev Tools Modul',
    opis: 'Razvojni alati za programere — inspektor elemenata, konzola, mrežni monitor i performanse',
    ikona: '🔧',
    status: 'aktivan',
    verzija: '3.0.0',
    mogucnosti: ['Inspektor elemenata', 'JavaScript konzola', 'Mrežni monitor', 'Performanse profajler', 'Storage inspektor'],
  },
];

// ─── Kompletni SPAJA Digitalni Brouvzer ──────────────────

function izracunajStatistiku(): BrouvzerStatistika {
  const aktivnihEntiteta = brouvzerEntiteti.filter((e) => e.status === 'aktivan').length;
  const aktivnihModula = brouvzerModuli.filter((m) => m.status === 'aktivan').length;
  const ukupnoKategorija = new Set(brouvzerEntiteti.map((e) => e.kategorija)).size;

  return {
    ukupnoEntiteta: brouvzerEntiteti.length,
    aktivnihEntiteta,
    ukupnoModula: brouvzerModuli.length,
    aktivnihModula,
    pokrivenostIndustrije: Math.round((ukupnoKategorija / 10) * 100),
  };
}

export const spajaDigitalniBrouvzer: SpajaDigitalniBrouvzer = {
  naziv: 'SPAJA Digitalni Brouvzer',
  opis:
    'SPAJA Digitalni Brouvzer je digitalna brauzer platforma na koju se postavlja celokupna SPAJA industrija — ' +
    'platforme, organizacije, korporacije, kompanije, prodavnice, servisi i aplikacije. Pokretan od strane ' +
    'SPAJA Generator za Endžine koji prevlači engine-e preko svih entiteta u ekosistemu.',
  verzija: '1.0.0',
  link: 'https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9',
  generatorLink: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  entiteti: brouvzerEntiteti,
  moduli: brouvzerModuli,
  statistika: izracunajStatistiku(),
};

// ─── Helper funkcije ─────────────────────────────────────

export function getAktivniEntiteti(): BrouvzerEntitet[] {
  return brouvzerEntiteti.filter((e) => e.status === 'aktivan');
}

export function getEntitetiPoTipu(tip: BrouvzerEntitetTip): BrouvzerEntitet[] {
  return brouvzerEntiteti.filter((e) => e.tip === tip);
}

export function getAktivniModuli(): BrouvzerModul[] {
  return brouvzerModuli.filter((m) => m.status === 'aktivan');
}

export function getModulPoId(id: string): BrouvzerModul | undefined {
  return brouvzerModuli.find((m) => m.id === id);
}

export function getBrouvzerStatistika(): BrouvzerStatistika {
  return izracunajStatistiku();
}
