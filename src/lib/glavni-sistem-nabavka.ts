/**
 * 🏭💰 GLAVNI SISTEM NABAVKE — Digitalna Industrija
 *
 * Glavni Sistem koji je spojen sa Glavnim Endžinom i troši pare
 * iz AI IQ World Bank za kupovinu svega što je potrebno
 * Digitalnoj Industriji.
 *
 * 50 digitalnih varijacija — Biskop, Top, Konj, Kraljica, Radio,
 * Akademija, CRM, ERP, Firewall, VPN, i mnogo više.
 *
 * Autofinish #352
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type NabavkaStatus = 'kupljeno' | 'u-procesu' | 'planirano' | 'isporuceno';
export type NabavkaKategorija =
  | 'stratesko-digitalno'
  | 'komunikacije'
  | 'infrastruktura'
  | 'edukacija'
  | 'poslovanje'
  | 'bezbednost'
  | 'kreativno'
  | 'zdravstvo'
  | 'globalno'
  | 'nauka'
  | 'transport'
  | 'gaming';

export interface NabavkaStavka {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: NabavkaKategorija;
  cenaUSD: number;
  status: NabavkaStatus;
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  namena: string;
  datumNabavke: string;
}

export interface NabavkaTransakcija {
  id: string;
  stavkaId: string;
  iznos: number;
  valuta: 'USD' | 'EUR';
  izvor: string;
  destinacija: string;
  status: 'izvrseno' | 'u-obradi' | 'cekanje';
  datum: string;
}

export interface GlavniSistemNabavka {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  kompanija: string;
  status: 'aktivan';
  bankaIzvor: string;
  racunBrojevi: string[];
  stavke: NabavkaStavka[];
  transakcije: NabavkaTransakcija[];
  ukupnoPotroseno: number;
  ukupnoStavki: number;
  kategorije: NabavkaKategorija[];
  povezanSa: string[];
}

// ─── 50 Digitalnih Varijacija — Nabavka ──────────────────

const danas = new Date().toISOString().split('T')[0];

export const nabavkaStavke: NabavkaStavka[] = [
  // ── Strateško-Digitalne figure ─────────────────────────
  {
    id: 'nabavka-digitalni-biskop',
    naziv: 'Digitalni Biskop',
    opis: 'Dijagonalni AI advisor za strateško planiranje — analizira sve putanje i daje dijagonalne preporuke.',
    ikona: '♗',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Strateško planiranje, dijagonalna analitika, AI savetovanje',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-top',
    naziv: 'Digitalni Top (Rook)',
    opis: 'Linearni procesni engine za vertikalne i horizontalne operacije — prava linija efikasnosti.',
    ikona: '♖',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 12_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Linearni procesni management, vertikalna i horizontalna optimizacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-konj',
    naziv: 'Digitalni Konj (Knight)',
    opis: 'L-pattern analitika za nepredvidljive tokove podataka — skače gde drugi ne mogu.',
    ikona: '♞',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 10_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Nepredvidljiva analitika, skok-pattern obrada, kreativno rešavanje problema',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-kraljica',
    naziv: 'Digitalna Kraljica',
    opis: 'Univerzalni multi-direkcioni engine — kombinacija svih pravaca, najmoćnija figura u sistemu.',
    ikona: '♛',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 25_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'Multi-direkcioni procesing, univerzalna optimizacija, kruna sistema',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-kralj',
    naziv: 'Digitalni Kralj',
    opis: 'Centralni zaštitni sloj sistema — poslednja linija odbrane, najvažniji entitet.',
    ikona: '♚',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'Centralna zaštita, poslednja linija odbrane, sistemska bezbednost',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-pesak',
    naziv: 'Digitalni Pešak (Pawn)',
    opis: 'Micro-servisi koji se promovišu u veće module — mali ali potencijalno moćni.',
    ikona: '♟',
    kategorija: 'stratesko-digitalno',
    cenaUSD: 5_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Micro-servisi, auto-promocija u veće module, distribuirana obrada',
    datumNabavke: danas,
  },

  // ── Gaming varijacije ──────────────────────────────────
  {
    id: 'nabavka-digitalni-arkade',
    naziv: 'Digitalni Arkade Engine',
    opis: 'Retro gaming platforma — klasične arkadne igrice u digitalnom formatu.',
    ikona: '🕹️',
    kategorija: 'gaming',
    cenaUSD: 8_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Retro gaming, arkadne igrice, nostalgija platforma',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-vr-simulacija',
    naziv: 'Digitalni VR Simulacija',
    opis: 'Virtual Reality integracija za sve igrice i simulacije u ekosistemu.',
    ikona: '🥽',
    kategorija: 'gaming',
    cenaUSD: 30_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'VR igrice, simulacije, immersive iskustvo',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-esports-arena',
    naziv: 'Digitalni E-Sports Arena',
    opis: 'Kompetitivni gaming modul za takmičenja, turnire i e-sports lige.',
    ikona: '🏟️',
    kategorija: 'gaming',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'E-sports, turniri, kompetitivni gaming, rang liste',
    datumNabavke: danas,
  },

  // ── Komunikacije ───────────────────────────────────────
  {
    id: 'nabavka-digitalni-radio',
    naziv: 'Digitalni Radio',
    opis: 'Streaming audio platforma — radio stanice, podkastovi, muzika na zahtev.',
    ikona: '📻',
    kategorija: 'komunikacije',
    cenaUSD: 7_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Audio streaming, radio stanice, podkastovi',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-telegram',
    naziv: 'Digitalni Telegram',
    opis: 'Instant messaging sistem sa end-to-end enkripcijom — brza sigurna komunikacija.',
    ikona: '✈️',
    kategorija: 'komunikacije',
    cenaUSD: 12_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Instant messaging, end-to-end enkripcija, brza komunikacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-forum',
    naziv: 'Digitalni Forum',
    opis: 'Community diskusiona platforma — forum za korisnike, developere, i moderatore.',
    ikona: '🗣️',
    kategorija: 'komunikacije',
    cenaUSD: 6_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Community, diskusije, Q&A, moderacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-podcast',
    naziv: 'Digitalni Podcast',
    opis: 'Audio sadržaj platforma — snimanje, editovanje, distribucija podkasta.',
    ikona: '🎙️',
    kategorija: 'komunikacije',
    cenaUSD: 5_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Podkast produkcija, distribucija, analitika',
    datumNabavke: danas,
  },

  // ── Infrastruktura ─────────────────────────────────────
  {
    id: 'nabavka-digitalni-cloud-fabric',
    naziv: 'Digitalni Cloud Fabric',
    opis: 'Multi-cloud orchestration — upravljanje resursima preko više cloud provajdera.',
    ikona: '☁️',
    kategorija: 'infrastruktura',
    cenaUSD: 35_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'Multi-cloud orchestration, resource management, auto-scaling',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-edge-node',
    naziv: 'Digitalni Edge Node',
    opis: 'Edge computing čvor mreža — distribuirana obrada na rubovima mreže.',
    ikona: '🌍',
    kategorija: 'infrastruktura',
    cenaUSD: 18_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Edge computing, distribuirana obrada, niža latencija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-dns-engine',
    naziv: 'Digitalni DNS Engine',
    opis: 'Interni DNS resolver — brzo razrešavanje domena unutar ekosistema.',
    ikona: '🔗',
    kategorija: 'infrastruktura',
    cenaUSD: 8_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'DNS razrešavanje, interni routing, domen management',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-cdn',
    naziv: 'Digitalni CDN',
    opis: 'Content Delivery Network modul — brza isporuka sadržaja korisnicima širom sveta.',
    ikona: '🌐',
    kategorija: 'infrastruktura',
    cenaUSD: 22_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Content delivery, globalna distribucija, keš optimizacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-load-balancer-plus',
    naziv: 'Digitalni Load Balancer Plus',
    opis: 'Napredni traffic management — inteligentno raspodela saobraćaja sa AI predviđanjem.',
    ikona: '⚖️',
    kategorija: 'infrastruktura',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Traffic management, AI-powered load balancing, auto-scaling',
    datumNabavke: danas,
  },

  // ── Edukacija ──────────────────────────────────────────
  {
    id: 'nabavka-digitalna-akademija',
    naziv: 'Digitalna Akademija',
    opis: 'E-learning platforma — kursevi, certifikati, mentorstvo za korisnike i developere.',
    ikona: '🎓',
    kategorija: 'edukacija',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'E-learning, kursevi, certifikati, online edukacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-mentor',
    naziv: 'Digitalni Mentor',
    opis: 'AI tutoring sistem — personalizovano mentorstvo za svakog korisnika.',
    ikona: '👨‍🏫',
    kategorija: 'edukacija',
    cenaUSD: 12_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'AI tutoring, personalizovano učenje, adaptivna edukacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-biblioteka',
    naziv: 'Digitalna Biblioteka',
    opis: 'Digitalni arhiv i dokumentacija — beskonačna baza znanja sa kategorijama i pretragom.',
    ikona: '📚',
    kategorija: 'edukacija',
    cenaUSD: 10_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Digitalni arhiv, baza znanja, dokumentacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-certifikat-engine',
    naziv: 'Digitalni Certifikat Engine',
    opis: 'Sertifikacioni modul — kreiranje i izdavanje digitalnih certifikata.',
    ikona: '📜',
    kategorija: 'edukacija',
    cenaUSD: 8_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Digitalni certifikati, verifikacija, blockchain potpis',
    datumNabavke: danas,
  },

  // ── Poslovanje ─────────────────────────────────────────
  {
    id: 'nabavka-digitalni-crm',
    naziv: 'Digitalni CRM',
    opis: 'Customer Relationship Management — upravljanje odnosima sa klijentima.',
    ikona: '👥',
    kategorija: 'poslovanje',
    cenaUSD: 25_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'CRM, upravljanje klijentima, prodajni pipeline, analitika',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-erp',
    naziv: 'Digitalni ERP',
    opis: 'Enterprise Resource Planning — upravljanje svim resursima Digitalne Industrije.',
    ikona: '🏢',
    kategorija: 'poslovanje',
    cenaUSD: 40_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'ERP, upravljanje resursima, finansije, HR, logistika',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-invoice-generator',
    naziv: 'Digitalni Invoice Generator',
    opis: 'Automatsko fakturisanje — generisanje, slanje i praćenje faktura.',
    ikona: '🧾',
    kategorija: 'poslovanje',
    cenaUSD: 7_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Fakturisanje, automatsko generisanje faktura, praćenje plaćanja',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-hr-platforma',
    naziv: 'Digitalni HR Platforma',
    opis: 'Upravljanje ljudskim resursima — HR, regrutacija, plate, benefiti.',
    ikona: '👔',
    kategorija: 'poslovanje',
    cenaUSD: 18_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'HR management, regrutacija, plate, timski rad',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-tender-engine',
    naziv: 'Digitalni Tender Engine',
    opis: 'Sistem za digitalne tendere — kreiranje, objavljivanje i evaluacija tendera.',
    ikona: '📋',
    kategorija: 'poslovanje',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Digitalni tenderi, javne nabavke, evaluacija ponuda',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-smart-contract',
    naziv: 'Digitalni Ugovor (Smart Contract)',
    opis: 'Blockchain ugovori — digitalno potpisivanje i izvršavanje ugovora.',
    ikona: '📝',
    kategorija: 'poslovanje',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Smart contracts, blockchain, digitalno potpisivanje',
    datumNabavke: danas,
  },

  // ── Bezbednost ─────────────────────────────────────────
  {
    id: 'nabavka-digitalni-firewall',
    naziv: 'Digitalni Firewall',
    opis: 'Napredni WAF modul — zaštita od napada, filtriranje saobraćaja.',
    ikona: '🔥',
    kategorija: 'bezbednost',
    cenaUSD: 25_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'WAF, firewall, zaštita od napada, filtriranje saobraćaja',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-vpn-gateway',
    naziv: 'Digitalni VPN Gateway',
    opis: 'Šifrovani tunel za podatke — bezbedan pristup resursima sa bilo kog mesta.',
    ikona: '🔐',
    kategorija: 'bezbednost',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'VPN, šifrovani tunel, bezbedan pristup, remote access',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-antivirus',
    naziv: 'Digitalni Antivirus Engine',
    opis: 'Skeniranje i zaštita — AI-powered detekcija pretnji i malvera.',
    ikona: '🦠',
    kategorija: 'bezbednost',
    cenaUSD: 18_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Antivirus, skeniranje pretnji, AI detekcija malvera',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-forenzika',
    naziv: 'Digitalna Forenzika',
    opis: 'Digitalna forenzička analitika — istraga incidenata, analiza tragova, evidencija.',
    ikona: '🔎',
    kategorija: 'bezbednost',
    cenaUSD: 22_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Digitalna forenzika, istraga incidenata, analiza tragova',
    datumNabavke: danas,
  },

  // ── Kreativno ──────────────────────────────────────────
  {
    id: 'nabavka-digitalni-dizajn-studio',
    naziv: 'Digitalni Dizajn Studio',
    opis: 'UI/UX alat za dizajniranje interfejsa, wireframe-ova i prototipova.',
    ikona: '🎨',
    kategorija: 'kreativno',
    cenaUSD: 12_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'UI/UX dizajn, wireframe, prototipovanje, stilski vodič',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-video-editor',
    naziv: 'Digitalni Video Editor',
    opis: 'Video produkcija — snimanje, editovanje, efekti, rendering videa.',
    ikona: '🎬',
    kategorija: 'kreativno',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Video produkcija, editovanje, rendering, distribucija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-muzicki-studio',
    naziv: 'Digitalni Muzički Studio',
    opis: 'Audio produkcija — snimanje, miksovanje, mastering, distribucija muzike.',
    ikona: '🎵',
    kategorija: 'kreativno',
    cenaUSD: 10_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Audio produkcija, snimanje, miksovanje, mastering',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-3d-modelar',
    naziv: 'Digitalni 3D Modelar',
    opis: '3D vizualizacija — modeliranje, renderovanje, animacija 3D objekata.',
    ikona: '🗿',
    kategorija: 'kreativno',
    cenaUSD: 18_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: '3D modeliranje, renderovanje, animacija, vizualizacija',
    datumNabavke: danas,
  },

  // ── Zdravstvo ──────────────────────────────────────────
  {
    id: 'nabavka-digitalna-klinika',
    naziv: 'Digitalna Klinika',
    opis: 'Telemedicina platforma — onlajn konsultacije, dijagnostika, recepti.',
    ikona: '🏥',
    kategorija: 'zdravstvo',
    cenaUSD: 30_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Telemedicina, onlajn konsultacije, digitalna dijagnostika',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-apotekar',
    naziv: 'Digitalni Apotekar',
    opis: 'Online farmacija — naručivanje lekova, recepata i zdravstvenih proizvoda.',
    ikona: '💊',
    kategorija: 'zdravstvo',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Online farmacija, naručivanje lekova, zdravstveni proizvodi',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-fitnes-trener',
    naziv: 'Digitalni Fitnes Trener',
    opis: 'Health & Fitness AI — personalizovani treninzi, ishrana, praćenje napretka.',
    ikona: '💪',
    kategorija: 'zdravstvo',
    cenaUSD: 8_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Fitnes, treninzi, ishrana, zdravstveno praćenje',
    datumNabavke: danas,
  },

  // ── Globalno ───────────────────────────────────────────
  {
    id: 'nabavka-digitalni-ambasador',
    naziv: 'Digitalni Ambasador',
    opis: 'Diplomatski komunikacioni modul — predstavljanje industrije na globalnom nivou.',
    ikona: '🌎',
    kategorija: 'globalno',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Diplomatija, globalno predstavljanje, partnerstva',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-prevodilac',
    naziv: 'Digitalni Prevodilac',
    opis: 'Multi-jezički AI prevodilac — prevođenje u realnom vremenu na 100+ jezika.',
    ikona: '🌐',
    kategorija: 'globalno',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'AI prevođenje, multi-jezička podrška, lokalizacija',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-turisticki-vodic',
    naziv: 'Digitalni Turistički Vodič',
    opis: 'Turizam platforma — virtuelni obilasci, preporuke, rezervacije.',
    ikona: '🗺️',
    kategorija: 'globalno',
    cenaUSD: 10_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Turizam, virtuelni obilasci, preporuke, rezervacije',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-posta',
    naziv: 'Digitalna Pošta',
    opis: 'Digital mail i delivery — slanje paketa, pisama i digitalnih pošiljki.',
    ikona: '📮',
    kategorija: 'globalno',
    cenaUSD: 12_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Digitalna pošta, slanje paketa, delivery tracking',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-berza',
    naziv: 'Digitalna Berza',
    opis: 'Stock exchange modul — trgovanje digitalnim akcijama i tokenima.',
    ikona: '📊',
    kategorija: 'globalno',
    cenaUSD: 35_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'Berza, digitalno trgovanje, akcije, tokeni',
    datumNabavke: danas,
  },

  // ── Nauka ──────────────────────────────────────────────
  {
    id: 'nabavka-digitalna-laboratorija-plus',
    naziv: 'Digitalna Laboratorija Plus',
    opis: 'Proširena simulaciona lab — napredni eksperimenti, AI-driven istraživanja.',
    ikona: '🔬',
    kategorija: 'nauka',
    cenaUSD: 25_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Napredne simulacije, AI istraživanja, eksperimenti',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalna-observatorija',
    naziv: 'Digitalna Observatorija',
    opis: 'Astronomski AI modul — posmatranje svemira, simulacija nebeskih tela.',
    ikona: '🔭',
    kategorija: 'nauka',
    cenaUSD: 20_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Astronomija, simulacija svemira, posmatranje nebeskih tela',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-genom-analizator',
    naziv: 'Digitalni Genom Analizator',
    opis: 'Bioinformatika engine — analiza genoma, DNK sekvenciranje, medicinska genetika.',
    ikona: '🧬',
    kategorija: 'nauka',
    cenaUSD: 30_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Bioinformatika, genom analiza, DNK sekvenciranje',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-kvantni-simulator',
    naziv: 'Digitalni Kvantni Simulator',
    opis: 'Kvantna simulacija — simuliranje kvantnih sistema i eksperimenata.',
    ikona: '⚛️',
    kategorija: 'nauka',
    cenaUSD: 40_000,
    status: 'kupljeno',
    prioritet: 'kritican',
    namena: 'Kvantna simulacija, kvantni eksperimenti, kvantna kriptografija',
    datumNabavke: danas,
  },

  // ── Transport ──────────────────────────────────────────
  {
    id: 'nabavka-digitalni-logistika-engine',
    naziv: 'Digitalni Logistika Engine',
    opis: 'Supply chain management — upravljanje lancem snabdevanja, dostava, skladištenje.',
    ikona: '🚚',
    kategorija: 'transport',
    cenaUSD: 22_000,
    status: 'kupljeno',
    prioritet: 'visok',
    namena: 'Logistika, supply chain, dostava, skladištenje',
    datumNabavke: danas,
  },
  {
    id: 'nabavka-digitalni-fleet-manager',
    naziv: 'Digitalni Fleet Manager',
    opis: 'Upravljanje voznim parkom — praćenje vozila, rute, troškovi, održavanje.',
    ikona: '🚗',
    kategorija: 'transport',
    cenaUSD: 15_000,
    status: 'kupljeno',
    prioritet: 'srednji',
    namena: 'Fleet management, GPS praćenje, optimizacija ruta',
    datumNabavke: danas,
  },
];

// ─── Generisanje transakcija za svaku stavku ─────────────

function generisiTransakcije(stavke: NabavkaStavka[]): NabavkaTransakcija[] {
  return stavke.map((s, i) => ({
    id: `TRX-NABAVKA-${String(i + 1).padStart(3, '0')}`,
    stavkaId: s.id,
    iznos: s.cenaUSD,
    valuta: 'USD' as const,
    izvor: 'AI IQ World Bank — DIGI-IND-001',
    destinacija: `Digitalna Industrija — ${s.naziv}`,
    status: 'izvrseno' as const,
    datum: new Date().toISOString(),
  }));
}

// ─── Ukupno potrošeno ────────────────────────────────────

function izracunajUkupno(stavke: NabavkaStavka[]): number {
  return stavke.reduce((sum, s) => sum + s.cenaUSD, 0);
}

// ─── Sve kategorije ──────────────────────────────────────

function dohvatiKategorije(stavke: NabavkaStavka[]): NabavkaKategorija[] {
  return [...new Set(stavke.map((s) => s.kategorija))];
}

// ─── Glavni Sistem Nabavke — Instanca ────────────────────

const transakcije = generisiTransakcije(nabavkaStavke);

export const glavniSistemNabavka: GlavniSistemNabavka = {
  id: 'glavni-sistem-nabavka',
  naziv: 'Glavni Sistem Nabavke — Digitalna Industrija',
  opis:
    'Glavni Sistem za nabavku koji je spojen sa Glavnim Endžinom i troši pare ' +
    'iz AI IQ World Bank za kupovinu svega što je potrebno Digitalnoj Industriji. ' +
    `Nabavljeno ${nabavkaStavke.length} digitalnih varijacija — od Biskopa i Kraljice do CRM-a i ERP-a, ` +
    'od Firewall-a do Kvantnog Simulatora. Sve kupljeno, sve isporučeno, sve aktivno.',
  ikona: '🏭💰',
  verzija: APP_VERSION,
  kompanija: KOMPANIJA,
  status: 'aktivan',
  bankaIzvor: 'AI IQ World Bank',
  racunBrojevi: ['DIGI-IND-001', 'DIGI-IND-002-EUR'],
  stavke: nabavkaStavke,
  transakcije,
  ukupnoPotroseno: izracunajUkupno(nabavkaStavke),
  ukupnoStavki: nabavkaStavke.length,
  kategorije: dohvatiKategorije(nabavkaStavke),
  povezanSa: [
    'Glavni Endžin Digitalne Industrije',
    'AI IQ World Bank',
    'OMEGA AI',
    'SpajaPro v6-v15',
    'SPAJA Generator za Endžine',
  ],
};

// ─── Helper funkcije ─────────────────────────────────────

export function getNabavkaPoKategoriji(kategorija: NabavkaKategorija): NabavkaStavka[] {
  return nabavkaStavke.filter((s) => s.kategorija === kategorija);
}

export function getNabavkaPoStatusu(status: NabavkaStatus): NabavkaStavka[] {
  return nabavkaStavke.filter((s) => s.status === status);
}

export function getUkupnoPotroseno(): number {
  return izracunajUkupno(nabavkaStavke);
}

export function getNabavkaStatistika() {
  return {
    ukupnoStavki: nabavkaStavke.length,
    ukupnoPotroseno: izracunajUkupno(nabavkaStavke),
    kupljeno: nabavkaStavke.filter((s) => s.status === 'kupljeno').length,
    kategorija: dohvatiKategorije(nabavkaStavke).length,
    transakcija: transakcije.length,
    kriticnih: nabavkaStavke.filter((s) => s.prioritet === 'kritican').length,
    visokih: nabavkaStavke.filter((s) => s.prioritet === 'visok').length,
    bankaIzvor: 'AI IQ World Bank',
  };
}
