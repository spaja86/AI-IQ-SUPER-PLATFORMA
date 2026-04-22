/**
 * 🌐 SPAJA Digitalni Brouvzer — EKSTREMNI DIGITALNI BROUZER
 *
 * SPAJA Digitalni Brouvzer + SPAJA Generator za Endžine = EKSTREMNI DIGITALNI BROUZER
 *
 * Nastao prevlačenjem "SPAJA Generator za Endžine" preko "SPAJA Digitalni Brouvzer".
 * Rezultat: EKSTREMNI DIGITALNI BROUZER koji može samostalno da radi, ima sopstveni
 * motor (engine), sopstveni backend i providni (transparentni) frontend.
 *
 * Može da se ubacuje u druge brouzere jer ima svoj motor i svoj bekend i providni frontend.
 * Služi za: prenos podataka, deploy, import, export i mnogo drugih funkcija.
 *
 * Integracija sa SPAJA BAZA (takođe sa prevučenim Generator Endžinom):
 *   - SPAJA BAZA ima motor, kapacitet, snagu, bekend
 *   - Uvoz na sve platforme Digitalne Industrije jer rade kao celina
 *   - Deploy igrica i svega na IO/OPENUI/AO sajt
 *
 * SPAJA Digitalni Brouvzer ide ispod "Digitalna Industrija" i prati sve sajtove.
 * Protok podataka svuda + deploying + import + export.
 *
 * Linkovi:
 *   Digitalni Brouvzer: https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9
 *   Generator Endžina: https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de
 *   SPAJA BAZA: https://chatgpt.com/c/695ca489-4d8c-832f-a0aa-bfcad425ef4d
 */

// ─── Tipovi ──────────────────────────────────────────────

export type BrouvzerStatus = 'aktivan' | 'ucitavanje' | 'odrzavanje' | 'planiran';
export type BrouvzerEntitetTip = 'platforma' | 'organizacija' | 'korporacija' | 'kompanija' | 'prodavnica' | 'servis' | 'aplikacija';
export type EkstremniRezim = 'samostalan' | 'ugraden' | 'hibridni';

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

export interface EkstremniMotor {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  tip: 'rendering' | 'js-engine' | 'network' | 'storage' | 'deploy' | 'transfer';
  status: BrouvzerStatus;
  mogucnosti: string[];
}

export interface EkstremniBackend {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'api' | 'baza' | 'auth' | 'deploy' | 'transfer' | 'cache';
  status: BrouvzerStatus;
  mogucnosti: string[];
}

export interface ProvidniFrontend {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'ui' | 'overlay' | 'embeddable' | 'standalone' | 'responsive';
  status: BrouvzerStatus;
  mogucnosti: string[];
}

export interface BrouvzerStatistika {
  ukupnoEntiteta: number;
  aktivnihEntiteta: number;
  ukupnoModula: number;
  aktivnihModula: number;
  pokrivenostIndustrije: number;
  ukupnoMotora: number;
  ukupnoBackendServisa: number;
  ukupnoFrontendKomponenti: number;
  ekstremniRezim: EkstremniRezim;
}

export interface SpajaDigitalniBrouvzer {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  generatorLink: string;
  bazaLink: string;
  ekstremniRezim: EkstremniRezim;
  entiteti: BrouvzerEntitet[];
  moduli: BrouvzerModul[];
  motori: EkstremniMotor[];
  backend: EkstremniBackend[];
  providniFrontend: ProvidniFrontend[];
  statistika: BrouvzerStatistika;
  mogucnosti: string[];
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
    id: 'entitet-spaja-platforma',
    naziv: 'SPAJA PLATFORMA',
    opis: 'Digitalna platforma za lakšu komunikaciju između klijenata, preduzeća, kompanija, banaka i drugih korisnika — SPAJA Generator za Endžine dejstvuje direktno na ovu platformu',
    ikona: '🌐',
    tip: 'platforma',
    url: 'https://ai-iq-super-platforma.vercel.app/digitalna-platforma',
    status: 'aktivan',
    kategorija: 'Digitalna Platforma',
    funkcije: [
      'Komunikacija klijent–kompanija',
      'Bankarska integracija',
      'Platforma u platformi (multi-space)',
      'Ekstremna saradnja i igrice',
      'SPAJA Generator za Endžine integracija',
      'Digitalni Brouvzer embed',
    ],
  },
  {
    id: 'entitet-io-openui-ao',
    naziv: 'IO OPENUI AO',
    opis: 'Input/Output Open UI platforma — korisnički interfejs za interakciju sa svim SPAJA servisima',
    ikona: '🖥️',
    tip: 'platforma',
    url: 'https://io-openui-ao.vercel.app',
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
    url: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html',
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
    url: 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app/index.html',
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
    url: 'https://svetska-organizacija-git-copil-0ce22a-nikolas-projects-b8a8458f.vercel.app/',
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
    url: 'https://kompanija-spaja.com/',
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

// ─── Ekstremni Motori ────────────────────────────────────

export const ekstremniMotori: EkstremniMotor[] = [
  {
    id: 'motor-rendering',
    naziv: 'Rendering Motor',
    opis: 'Sopstveni rendering motor Ekstremnog Digitalnog Brouvzera — HTML5, CSS3, WebGL, dimenzionalno renderovanje 360D-5760D',
    ikona: '🖼️',
    verzija: '2.0.0',
    tip: 'rendering',
    status: 'aktivan',
    mogucnosti: ['HTML5 obrada', 'CSS3 renderovanje', 'WebGL 2.0', 'Dimenzionalno renderovanje 360D-5760D', 'Canvas 2D/3D', 'SVG rendering', 'Adaptivni layout'],
  },
  {
    id: 'motor-js-engine',
    naziv: 'JavaScript Motor',
    opis: 'Sopstveni JS engine — kompilacija, interpretacija, optimizacija JavaScript i TypeScript koda',
    ikona: '⚡',
    verzija: '2.0.0',
    tip: 'js-engine',
    status: 'aktivan',
    mogucnosti: ['JIT kompilacija', 'TypeScript podrška', 'ES2025+', 'Web Workers', 'Service Workers', 'WASM podrška', 'Module sistem'],
  },
  {
    id: 'motor-network',
    naziv: 'Mrežni Motor',
    opis: 'Sopstveni mrežni motor za HTTP/HTTPS, WebSocket, SSE, gRPC komunikaciju i proksi rutiranje',
    ikona: '🌐',
    verzija: '2.0.0',
    tip: 'network',
    status: 'aktivan',
    mogucnosti: ['HTTP/2 i HTTP/3', 'WebSocket', 'SSE streaming', 'gRPC podrška', 'Proksi rutiranje', 'DNS rezolucija', 'TLS 1.3'],
  },
  {
    id: 'motor-storage',
    naziv: 'Storage Motor',
    opis: 'Sopstveni motor za skladištenje — IndexedDB, LocalStorage, SessionStorage, CacheAPI, SPAJA BAZA integracija',
    ikona: '💾',
    verzija: '2.0.0',
    tip: 'storage',
    status: 'aktivan',
    mogucnosti: ['IndexedDB', 'LocalStorage', 'SessionStorage', 'Cache API', 'SPAJA BAZA integracija', 'File System Access', 'OPFS'],
  },
  {
    id: 'motor-deploy',
    naziv: 'Deploy Motor',
    opis: 'Motor za deploy — automatski deploy na Vercel, GitHub Pages, sve platforme Digitalne Industrije i IO/OPENUI/AO',
    ikona: '🚀',
    verzija: '2.0.0',
    tip: 'deploy',
    status: 'aktivan',
    mogucnosti: ['Vercel deploy', 'GitHub Pages', 'CI/CD pipeline', 'Multi-platform deploy', 'IO/OPENUI/AO deploy', 'Rollback', 'Preview deploy'],
  },
  {
    id: 'motor-transfer',
    naziv: 'Transfer Motor',
    opis: 'Motor za prenos podataka — import, export, streaming, batch transfer, real-time sinhronizacija',
    ikona: '🔄',
    verzija: '2.0.0',
    tip: 'transfer',
    status: 'aktivan',
    mogucnosti: ['Import podataka', 'Export podataka', 'Stream transfer', 'Batch upload/download', 'Real-time sync', 'Format konverzija', 'Kompresija'],
  },
];

// ─── Ekstremni Backend ───────────────────────────────────

export const ekstremniBackend: EkstremniBackend[] = [
  {
    id: 'backend-api-server',
    naziv: 'API Server',
    opis: 'Sopstveni backend API server Ekstremnog Brouvzera — REST, GraphQL, WebSocket endpointi',
    ikona: '🖧',
    tip: 'api',
    status: 'aktivan',
    mogucnosti: ['REST API', 'GraphQL', 'WebSocket server', 'Rate limiting', 'Request routing', 'Middleware chain', 'Error handling'],
  },
  {
    id: 'backend-baza-integracija',
    naziv: 'SPAJA BAZA Integracija',
    opis: 'Backend integracija sa SPAJA BAZOM — 12 kolekcija, CRUD, transakcije, sa prevučenim Generator Endžinom',
    ikona: '💾',
    tip: 'baza',
    status: 'aktivan',
    mogucnosti: ['12 kolekcija', 'CRUD operacije', 'Indeksi i pretraga', 'Transakcije', 'Backup', 'Replikacija', 'Generator Endžin nad bazom'],
  },
  {
    id: 'backend-auth',
    naziv: 'Autentifikacija Backend',
    opis: 'Backend za autentifikaciju — JWT, OAuth, sesije, RBAC dozvole',
    ikona: '🔐',
    tip: 'auth',
    status: 'aktivan',
    mogucnosti: ['JWT tokeni', 'OAuth2', 'Sesije', 'RBAC', '2FA', 'API ključevi', 'Rate limiting'],
  },
  {
    id: 'backend-deploy',
    naziv: 'Deploy Backend',
    opis: 'Backend za deploy servise — build, bundle, upload, deploy na sve platforme Digitalne Industrije',
    ikona: '🚀',
    tip: 'deploy',
    status: 'aktivan',
    mogucnosti: ['Build pipeline', 'Bundle optimizacija', 'Multi-platform deploy', 'Deploy history', 'Rollback', 'Preview URLs', 'IO/OPENUI/AO deploy'],
  },
  {
    id: 'backend-transfer',
    naziv: 'Transfer Backend',
    opis: 'Backend za prenos podataka — import, export, transformacija, validacija',
    ikona: '🔄',
    tip: 'transfer',
    status: 'aktivan',
    mogucnosti: ['Import JSON/CSV/XML', 'Export JSON/CSV/XML', 'Data transformacija', 'Validacija', 'Batch operacije', 'Streaming transfer', 'Format konverzija'],
  },
  {
    id: 'backend-cache',
    naziv: 'Cache Backend',
    opis: 'Backend za keširanje — memorijski keš, Redis-like, CDN keš, stranica keš',
    ikona: '⚡',
    tip: 'cache',
    status: 'aktivan',
    mogucnosti: ['Memorijski keš', 'Multi-layer cache', 'CDN integracija', 'Cache invalidation', 'TTL upravljanje', 'Preloading', 'Compression'],
  },
];

// ─── Providni (Transparentni) Frontend ───────────────────

export const providniFrontendKomponente: ProvidniFrontend[] = [
  {
    id: 'frontend-ui-sloj',
    naziv: 'UI Providni Sloj',
    opis: 'Transparentni UI sloj koji se može staviti preko bilo kog drugog brouvzera — overlay režim',
    ikona: '🪟',
    tip: 'ui',
    status: 'aktivan',
    mogucnosti: ['Transparentni overlay', 'Drag & drop', 'Resize', 'Multi-window', 'Theme sistem', 'Dark/Light mode', 'Adaptivni layout'],
  },
  {
    id: 'frontend-overlay',
    naziv: 'Overlay Komponenta',
    opis: 'Providni overlay koji se može postaviti preko postojećeg sajta — praćenje podataka u realnom vremenu',
    ikona: '📊',
    tip: 'overlay',
    status: 'aktivan',
    mogucnosti: ['Real-time monitoring', 'Data overlay', 'Performance metrike', 'Network inspektor', 'Console output', 'Element picker', 'Screenshot'],
  },
  {
    id: 'frontend-embeddable',
    naziv: 'Embeddable Widget',
    opis: 'Ugradiva widget komponenta — može se ubaciti u druge brouzere kao iframe, web component ili script',
    ikona: '🧩',
    tip: 'embeddable',
    status: 'aktivan',
    mogucnosti: ['iframe integracija', 'Web Component', 'Script inject', 'PostMessage API', 'Cross-origin podrška', 'Sandbox režim', 'Permission kontrola'],
  },
  {
    id: 'frontend-standalone',
    naziv: 'Standalone Aplikacija',
    opis: 'Samostalna PWA aplikacija — može da radi potpuno nezavisno od drugih brouvzera',
    ikona: '🖥️',
    tip: 'standalone',
    status: 'aktivan',
    mogucnosti: ['PWA podrška', 'Offline rad', 'Install prompt', 'Push notifikacije', 'Background sync', 'File handling', 'Protocol handling'],
  },
  {
    id: 'frontend-responsive',
    naziv: 'Responsive Engine',
    opis: 'Responzivni engine za adaptaciju na sve uređaje — desktop, tablet, mobilni, TV, IoT',
    ikona: '📱',
    tip: 'responsive',
    status: 'aktivan',
    mogucnosti: ['Desktop layout', 'Tablet layout', 'Mobilni layout', 'TV layout', 'IoT layout', 'Auto-adaptacija', 'Breakpoint sistem'],
  },
];

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
    ukupnoMotora: ekstremniMotori.length,
    ukupnoBackendServisa: ekstremniBackend.length,
    ukupnoFrontendKomponenti: providniFrontendKomponente.length,
    ekstremniRezim: 'samostalan',
  };
}

// ─── Mogućnosti Ekstremnog Brouvzera ─────────────────────

const ekstremneMogucnosti: string[] = [
  'Samostalan rad — ne zavisi od drugih brouvzera',
  'Može se ubaciti u druge brouzere (embeddable)',
  'Sopstveni motor (rendering, JS, network, storage, deploy, transfer)',
  'Sopstveni backend (API server, SPAJA BAZA, auth, deploy, transfer, cache)',
  'Providni (transparentni) frontend — overlay, embeddable, standalone, responsive',
  'Prenos podataka (import/export) između svih platformi Digitalne Industrije',
  'Deploy na IO/OPENUI/AO i sve ostale platforme',
  'SPAJA BAZA integracija sa prevučenim Generator Endžinom',
  'Praćenje svih sajtova Digitalne Industrije u realnom vremenu',
  'Protok podataka svuda — deploy, import, export',
  'Deploy igrica i aplikacija na IO/OPENUI/AO sajt',
  'Multi-platform deploy (Vercel, GitHub Pages, custom)',
  'Real-time sinhronizacija podataka',
  'Offline rad sa background sync',
  'VPN i Ad-block integracija',
  'Dev Tools za programere',
  'PWA standalone aplikacija',
  'Cross-origin komunikacija sa PostMessage API',
];

export const spajaDigitalniBrouvzer: SpajaDigitalniBrouvzer = {
  naziv: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
  opis:
    'EKSTREMNI DIGITALNI BROUZER nastao prevlačenjem SPAJA Generator za Endžine preko SPAJA Digitalnog Brouvzera. ' +
    'Može samostalno da radi, ima sopstveni motor, backend i providni frontend. Može se ubaciti u druge brouzere. ' +
    'Služi za prenos podataka, deploy, import, export i praćenje svih sajtova Digitalne Industrije. ' +
    'Integrisana SPAJA BAZA sa prevučenim Generator Endžinom. Deploy igrica i svega na IO/OPENUI/AO.',
  verzija: '2.0.0',
  link: 'https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9',
  generatorLink: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  bazaLink: 'https://chatgpt.com/c/695ca489-4d8c-832f-a0aa-bfcad425ef4d',
  ekstremniRezim: 'samostalan',
  entiteti: brouvzerEntiteti,
  moduli: brouvzerModuli,
  motori: ekstremniMotori,
  backend: ekstremniBackend,
  providniFrontend: providniFrontendKomponente,
  statistika: izracunajStatistiku(),
  mogucnosti: ekstremneMogucnosti,
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

export function getEkstremniMotori(): EkstremniMotor[] {
  return ekstremniMotori.filter((m) => m.status === 'aktivan');
}

export function getEkstremniBackend(): EkstremniBackend[] {
  return ekstremniBackend.filter((b) => b.status === 'aktivan');
}

export function getProvidniFrontend(): ProvidniFrontend[] {
  return providniFrontendKomponente.filter((f) => f.status === 'aktivan');
}

export function getEkstremneMogucnosti(): string[] {
  return ekstremneMogucnosti;
}
