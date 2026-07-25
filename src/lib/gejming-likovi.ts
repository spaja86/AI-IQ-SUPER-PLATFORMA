/**
 * 🎭 GEJMING LIKOVI — Industrija Gejming Likova
 *
 * Centralni katalog i sistem za dizajn svih gaming entiteta:
 * likova (playable/NPC), objekata, subjekata, okruženja i sredstava
 * koji postoje u okviru igrica na AI IQ SUPER PLATFORMA.
 */

import { APP_VERSION } from './constants';
import type { DimenzijaNivo } from './dimenzije';

// ─── Tipovi entiteta ────────────────────────────────────────────────

export type TipGejmingEntiteta =
  | 'lik-igriv'
  | 'lik-npc'
  | 'objekat'
  | 'subjekat'
  | 'okruzenje'
  | 'sredstvo'
  | 'vozilo'
  | 'oruzje'
  | 'kostim';

export type KategorijaDizajna =
  | 'fantazija'
  | 'sci-fi'
  | 'realizam'
  | 'retro'
  | 'anime'
  | 'horror'
  | 'sport'
  | 'istorija';

export type StatusEntiteta = 'aktivan' | 'razvoj' | 'planiran' | 'arhiviran';

// ─── Interfejsi ─────────────────────────────────────────────────────

export interface GejmingEntitet {
  id: string;
  naziv: string;
  tip: TipGejmingEntiteta;
  kategorijaDizajna: KategorijaDizajna;
  opis: string;
  ikona: string;
  igricaId: string;
  dimenzije: DimenzijaNivo[];
  status: StatusEntiteta;
  atributi: string[];
  sposobnosti: string[];
  vizuelniStil: string;
  inspiracija?: string;
}

export interface GejmingLikoviPregled {
  ukupnoEntiteta: number;
  likovaIgravih: number;
  npcLikova: number;
  objekata: number;
  subjekata: number;
  okruzenja: number;
  sredstava: number;
  vozila: number;
  oruzja: number;
  kostima: number;
  kategorijaCount: number;
  vezanihIgrica: number;
}

export interface GejmingLikoviRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  pregled: GejmingLikoviPregled;
  poTipu: Array<{ tip: TipGejmingEntiteta; brojEntiteta: number }>;
  poKategoriji: Array<{ kategorija: KategorijaDizajna; brojEntiteta: number }>;
  poIgrici: Array<{ igricaId: string; brojEntiteta: number }>;
  entiteti: GejmingEntitet[];
}

// ─── Katalog entiteta ───────────────────────────────────────────────

export const gejmingEntiteti: GejmingEntitet[] = [
  // ═══ LIKOVI IGRIVI ════════════════════════════════════════════════

  {
    id: 'entitet-omega-vitez',
    naziv: 'Omega Vitez',
    tip: 'lik-igriv',
    kategorijaDizajna: 'fantazija',
    opis: 'Glavni igrivi lik za dimenzionalne avanture. Oblačen u elipsoidni oklop koji menja boju po dimenziji. U 5760D poprima holografski prikaz sa spiralnim aurima.',
    ikona: '⚔️',
    igricaId: 'igrica-omega-lavirint',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Snaga: 85', 'Brzina: 70', 'Odbrana: 90', 'Inteligencija: 75'],
    sposobnosti: ['Dimenzionalni skok', 'Elipsoidni štit', 'Spiralna rotacija', 'Rezonantni udar'],
    vizuelniStil: 'Elipsoidni oklop, holografski vizir, spiralna aura',
    inspiracija: 'OMEGA AI Arhitekta persona',
  },
  {
    id: 'entitet-spaja-pilot',
    naziv: 'SPAJA Pilot',
    tip: 'lik-igriv',
    kategorijaDizajna: 'sci-fi',
    opis: 'Vozač spiralnih trkačkih vozila u dimenzionalnom prostoru. Odelo sa integrisanim SPAJA Accelerator senzorom koji reaguje na promenu dimenzije.',
    ikona: '🏎️',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Upravljanje: 95', 'Reakcija: 88', 'Izdržljivost: 72', 'Taktika: 80'],
    sposobnosti: ['Turbo pojačanje', 'Spiralno ubrzanje', 'Dimenzionalni drift', 'Energetski štit'],
    vizuelniStil: 'Aerodinamično odelo, neonski akcentni, vizir sa HUD prikazom',
    inspiracija: 'Futuristički trkački pilot',
  },
  {
    id: 'entitet-graditelj-alfa',
    naziv: 'Graditelj Alfa',
    tip: 'lik-igriv',
    kategorijaDizajna: 'sci-fi',
    opis: 'Inženjer dimenzionalnih struktura. Sposoban da koristi sve geometrijske forme — Elipsoid, Rezonance, Hiperbole i Spirale — kao građevinske blokove.',
    ikona: '🏗️',
    igricaId: 'igrica-dimenzionalni-graditelj',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Gradnja: 100', 'Preciznost: 92', 'Kreativnost: 88', 'Resursi: 78'],
    sposobnosti: ['Brza gradnja', 'Geometrijska sinteza', 'Dimenzionalni blueprint', 'Strukturna analiza'],
    vizuelniStil: 'Tehnički kombinezon, holografski projektor, geometrijske šare na odelu',
    inspiracija: 'OMEGA AI Graditelj persona',
  },
  {
    id: 'entitet-strateg-omega',
    naziv: 'Strateg Omega',
    tip: 'lik-igriv',
    kategorijaDizajna: 'fantazija',
    opis: 'Vođa dimenzionalne strategije koji kontroliše teritorije. Nosi kapu moći sa ugrađenim rezonantnim kristalima koji se proširuju po dimenzijama.',
    ikona: '🗺️',
    igricaId: 'igrica-omega-strategija',
    dimenzije: ['2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Komanda: 95', 'Strategija: 100', 'Diplomatija: 82', 'Vizija: 97'],
    sposobnosti: ['Taktička mapa', 'Teritorijalna kontrola', 'Rezonantni savez', 'Dimenzionalni pregled'],
    vizuelniStil: 'Kraljevski ogrtač sa dimenzionalnim simbolima, lebdeća karta',
    inspiracija: 'OMEGA AI Strateg persona',
  },
  {
    id: 'entitet-signal-lovac',
    naziv: 'Signal Lovac',
    tip: 'lik-igriv',
    kategorijaDizajna: 'sci-fi',
    opis: 'Operativac koji lovi rezonantne signale kroz Proksi mrežu. Opremljen SPAJA Monitor naočarima i Signal Shield oklopom.',
    ikona: '📡',
    igricaId: 'igrica-proksi-signal-lovac',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Detekcija: 96', 'Agilnost: 85', 'Tehnika: 90', 'Kamuflacija: 78'],
    sposobnosti: ['Signal skeniranje', 'Proksi skok', 'Lažni signal', 'Shield aktivacija'],
    vizuelniStil: 'Taktički odelo sa antenama, neonski senzori, Signal Shield oklop',
    inspiracija: 'Cyber-operativac budućnosti',
  },
  {
    id: 'entitet-prompt-ucenik',
    naziv: 'Prompt Učenik',
    tip: 'lik-igriv',
    kategorijaDizajna: 'anime',
    opis: 'Mladi istraživač koji uči SpajaPro Prompt sistem kroz dimenzionalne izazove. Vizuelno inspirisan anime esteetikom sa magičnim prompt-krstom.',
    ikona: '🌟',
    igricaId: 'igrica-spajapro-prompt-quest',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Učenje: 90', 'Kreativnost: 85', 'Adaptacija: 88', 'Prompt moć: 75'],
    sposobnosti: ['Prompt summon', 'Dimenzionalni rast', 'AI evaluacija', 'Prompt kombinacija'],
    vizuelniStil: 'Anime student, lebdeće prompt-rune, OMEGA AI pratilac',
    inspiracija: 'Anime protagonist koji uči magiju',
  },
  {
    id: 'entitet-ai-student',
    naziv: 'AI Student',
    tip: 'lik-igriv',
    kategorijaDizajna: 'anime',
    opis: 'Istraživač koji trenira 21 OMEGA AI personu. Može preuzeti vizuelna obeležja svake persone (Arhitekta, Čuvar, Lekar...) kao kostim pojačanje.',
    ikona: '🧠',
    igricaId: 'igrica-omega-ai-akademija',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Inteligencija: 95', 'Empatija: 88', 'Adaptacija: 92', 'AI moć: 85'],
    sposobnosti: ['Persona uslov', 'AI mentorstvo', 'Multi-persona sinteza', 'Dimenzionalni napredak'],
    vizuelniStil: 'Akademski kombinezon sa 21 odznakom, lebdeće AI holograme',
    inspiracija: 'OMEGA AI svaka persona',
  },
  {
    id: 'entitet-turbo-optimizator',
    naziv: 'Turbo Optimizator',
    tip: 'lik-igriv',
    kategorijaDizajna: 'retro',
    opis: 'Retroduhovni optimizator koda sa neon-pixel estetikom. Nosi ekran na grudima koji prikazuje live metriku optimizacije.',
    ikona: '⚡',
    igricaId: 'igrica-turbo-optimizer',
    dimenzije: ['720D', '1440D'],
    status: 'aktivan',
    atributi: ['Optimizacija: 100', 'Preciznost: 90', 'Brzina: 88', 'Analiza: 85'],
    sposobnosti: ['Code split', 'Bundle smanjenje', 'Tree shake', 'Parallel build'],
    vizuelniStil: 'Retro piksel estetika, neon boje, pixel-art animacije',
    inspiracija: 'Retro računarski heroj',
  },

  // ═══ LIKOVI NPC ═══════════════════════════════════════════════════

  {
    id: 'entitet-npc-cuvar-lavirinta',
    naziv: 'Čuvar Lavirinta',
    tip: 'lik-npc',
    kategorijaDizajna: 'fantazija',
    opis: 'NPC koji čuva ulaze u dimenzionalne lavirinte. Menja vizuelni oblik prema dimenziji — u 360D je kamen, u 5760D holografski duh.',
    ikona: '👁️',
    igricaId: 'igrica-omega-lavirint',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Čuvanje: 100', 'Percepcija: 95', 'Dimenzionalna svest: 90'],
    sposobnosti: ['Dimenzionalna blokada', 'Rezonantna detekcija', 'Lavirint generisanje'],
    vizuelniStil: 'Kamen u 360D, kristalni u 1440D, duh u 5760D',
    inspiracija: 'OMEGA AI Čuvar persona',
  },
  {
    id: 'entitet-npc-trkacki-rival',
    naziv: 'Trkački Rival',
    tip: 'lik-npc',
    kategorijaDizajna: 'sci-fi',
    opis: 'AI protivnik u spiralnim trkama koji prilagođava svoju taktiku prema odabranoj dimenziji igrača. U višim dimenzijama koristi naprednije manevare.',
    ikona: '🏁',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Brzina: 90-98 (po D)', 'Taktika: 85', 'Prilagodljivost: 95'],
    sposobnosti: ['Adaptivna AI taktika', 'Dimenzionalni drift blok', 'Turbo kontra'],
    vizuelniStil: 'Rivalski boje inverz od igrača, agresivne linije',
    inspiracija: 'AI adversarial racing opponent',
  },
  {
    id: 'entitet-npc-mentor-ai',
    naziv: 'Mentor AI',
    tip: 'lik-npc',
    kategorijaDizajna: 'sci-fi',
    opis: 'Holografski NPC mentor koji vodi igrača kroz OMEGA AI Akademiju. Menja izgled prema trenutnoj OMEGA AI personi koja se trenira.',
    ikona: '🤖',
    igricaId: 'igrica-omega-ai-akademija',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Mudrost: 100', 'Strpljenje: 100', 'Znanje: 100'],
    sposobnosti: ['Holografska demonstracija', 'Persona promena', 'AI evaluacija odgovora'],
    vizuelniStil: 'Holografski učitelj, menja formu po personi, lebdeće knjige',
    inspiracija: 'OMEGA AI Mentor persona',
  },
  {
    id: 'entitet-npc-proksi-sabotazer',
    naziv: 'Proksi Saboter',
    tip: 'lik-npc',
    kategorijaDizajna: 'horror',
    opis: 'Mračni NPC koji šalje lažne signale i pokušava da ometa Signal Lovca. Vizuelno nalik glitched digitalnom entitetu koji se fragmentira.',
    ikona: '👾',
    igricaId: 'igrica-proksi-signal-lovac',
    dimenzije: ['720D', '1440D', '2880D'],
    status: 'aktivan',
    atributi: ['Sabotaža: 88', 'Kamuflacija: 95', 'Brzina: 82'],
    sposobnosti: ['Lažni signal emisija', 'Glitch napad', 'Dimenzionalni nestanak'],
    vizuelniStil: 'Fragmentirani digitalni entitet, static-noise vizuelni, crveni akcentni',
    inspiracija: 'Digital glitch antagonist',
  },
  {
    id: 'entitet-npc-firewall-boss',
    naziv: 'Firewall Šef',
    tip: 'lik-npc',
    kategorijaDizajna: 'horror',
    opis: 'Krajnji boss u Firewall Odbrani — masivni digitalni napadač koji koordinira sve pretnje. Vizuelno crni hologram sa crvenim rasterom.',
    ikona: '🔴',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Napad: 100', 'Izdržljivost: 95', 'Koordinacija: 98'],
    sposobnosti: ['Masovni DDoS', 'Enkriptovana invazija', 'Dimenzionalni prodor'],
    vizuelniStil: 'Crni hologram sa crvenim matricnim uzorkom, veličina se povećava sa dimenzijom',
    inspiracija: 'Cyber threat boss',
  },

  // ═══ OBJEKTI ════════════════════════════════════════════════════

  {
    id: 'entitet-objekat-elipsoidni-portal',
    naziv: 'Elipsoidni Portal',
    tip: 'objekat',
    kategorijaDizajna: 'fantazija',
    opis: 'Dimenzionalni portal oblika elipsoide koji omogućava prolaz između nivoa lavirinta. Menja boju prema ciljnoj dimenziji.',
    ikona: '🌀',
    igricaId: 'igrica-omega-lavirint',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Veličina: Varijabilna', 'Stabilnost: 85', 'Propusnost: dimenzionalna'],
    sposobnosti: ['Dimenzionalni transport', 'Rezonantna sinhronizacija'],
    vizuelniStil: 'Elipsoidni okvir, energetska membrana, spiralni efekti na rubovima',
  },
  {
    id: 'entitet-objekat-rezonantni-kamen',
    naziv: 'Rezonantni Kamen',
    tip: 'objekat',
    kategorijaDizajna: 'fantazija',
    opis: 'Misteriozni kristalni kamen koji emituje rezonantne frekvencije. Koristi se kao hint sistem u slagalicama — vibrira na pravom rešenju.',
    ikona: '💎',
    igricaId: 'igrica-elipsoidni-slagalice',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Frekvencija: 440Hz-4400Hz', 'Luminiscencija: varijabilna'],
    sposobnosti: ['Rezonantni hint', 'Frekventna detekcija'],
    vizuelniStil: 'Kristalni oktaedar, pulsira svetlošću, lebdi',
  },
  {
    id: 'entitet-objekat-deploy-kapsula',
    naziv: 'Deploy Kapsula',
    tip: 'objekat',
    kategorijaDizajna: 'sci-fi',
    opis: 'Tehnoloska kapsula koja se koristi za deploy aplikacija u Deploy Misiji. Svaki uspešan deploy se prikazuje kao lansiranje kapsule u dimenziju.',
    ikona: '🚀',
    igricaId: 'igrica-deploy-misija',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 1 deploy', 'Brzina lansiranja: varijabilna', 'Stabilnost: 99.9%'],
    sposobnosti: ['Zero-downtime lansiranje', 'Preview kapsula', 'Rollback sistem'],
    vizuelniStil: 'Futuristička kapsula, SPAJA logotip, plava energetska traga',
  },
  {
    id: 'entitet-objekat-api-gateway-toranj',
    naziv: 'API Gateway Toranj',
    tip: 'objekat',
    kategorijaDizajna: 'sci-fi',
    opis: 'Visoki digitalni toranj koji predstavlja API Gateway čvor u igri. Rutira saobraćaj vidljiv kao svetlosne linije između tornjeva.',
    ikona: '🗼',
    igricaId: 'igrica-api-gateway-masters',
    dimenzije: ['2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 10K req/s', 'Latencija: minimalna', 'Stabilnost: 99.99%'],
    sposobnosti: ['Rutiranje', 'Load balancing', 'Rate limit primena'],
    vizuelniStil: 'Digitalni toranj, svetlosne rute, holografski display saobraćaja',
  },
  {
    id: 'entitet-objekat-data-kontejner',
    naziv: 'Data Kontejner',
    tip: 'objekat',
    kategorijaDizajna: 'retro',
    opis: 'Piksel-art kontejner koji sadrži podatke za sinhronizaciju. U retro stilu — prikazuje se kao kaseta ili floppy disk za niže dimenzije.',
    ikona: '📦',
    igricaId: 'igrica-data-sync-utrka',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 1-100 MB po D', 'Integritet: 100%'],
    sposobnosti: ['Data pakovanje', 'Brza sinhronizacija'],
    vizuelniStil: 'Retro piksel-art kaseta/floppy, neon konture, blinker LED',
  },
  {
    id: 'entitet-objekat-turbo-booster',
    naziv: 'Turbo Booster',
    tip: 'objekat',
    kategorijaDizajna: 'retro',
    opis: 'Arkadni pojačivač brzine na trkačkoj stazi. Vizuelno nalik retro znakovskom strelom sa neonskim sjajem.',
    ikona: '⚡',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Pojačanje: +50% brzina', 'Trajanje: 5 sekundi'],
    sposobnosti: ['Turbo aktivacija', 'Spiralni katapult'],
    vizuelniStil: 'Retro neon strelica, blink efekat, električni luk',
  },

  // ═══ SUBJEKTI ══════════════════════════════════════════════════

  {
    id: 'entitet-subjekat-digitalna-industrija',
    naziv: 'Digitalna Industrija',
    tip: 'subjekat',
    kategorijaDizajna: 'sci-fi',
    opis: 'Apstraktni subjekat koji predstavlja Digitalnu Industriju kao entitet u igri. Prikazuje se kao grad-sistem na pozadini svake dimenzije.',
    ikona: '🏭',
    igricaId: 'igrica-omega-strategija',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Moć: beskonačna', 'Resursi: sistemski', 'Uticaj: globalni'],
    sposobnosti: ['Sistemska kontrola', 'Resursi generisanje', 'Industrijska ekspanzija'],
    vizuelniStil: 'Futuristički city-scape, holografske zgrade, energetski tokovi',
    inspiracija: 'AI IQ SUPER PLATFORMA ekosistem',
  },
  {
    id: 'entitet-subjekat-omega-ai-korporacija',
    naziv: 'OMEGA AI Korporacija',
    tip: 'subjekat',
    kategorijaDizajna: 'sci-fi',
    opis: 'Subjekat koji predstavlja OMEGA AI mrežu kao kolektivni entitet. U igri se prikazuje kao lebdeći holografski sferni sistem sa 21 čvorom.',
    ikona: '🧠',
    igricaId: 'igrica-omega-ai-akademija',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Kolektivna inteligencija: 100', 'Personas: 21', 'Oktava: 8'],
    sposobnosti: ['Kolektivna svest', 'Multi-persona projekcija', 'AI mreža aktivacija'],
    vizuelniStil: 'Sferni hologram sa 21 svetlucavim čvorom, zelena energija',
    inspiracija: 'OMEGA AI sistem',
  },
  {
    id: 'entitet-subjekat-proksi-mreza',
    naziv: 'Proksi Mreža',
    tip: 'subjekat',
    kategorijaDizajna: 'sci-fi',
    opis: 'Živi subjekat koji predstavlja Proksi mrežu. Vizuelno se prikazuje kao vibrirajući web signalnih niti koji reaguje na igrača.',
    ikona: '🕸️',
    igricaId: 'igrica-proksi-signal-lovac',
    dimenzije: ['720D', '1440D', '2880D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 10²²⁸ TB', 'Čvorovi: beskrajni'],
    sposobnosti: ['Signal emisija', 'Mreža proširivanje', 'Šum generisanje'],
    vizuelniStil: 'Animirana mreža niti, plavi pulsirajući čvorovi, signal talasi',
    inspiracija: 'SPAJA Proksi sistem',
  },
  {
    id: 'entitet-subjekat-firewall-bastion',
    naziv: 'Firewall Bastion',
    tip: 'subjekat',
    kategorijaDizajna: 'istorija',
    opis: 'Digitalni bastion koji predstavlja odbrambeni sistem u Firewall igri. Inspirisan tvrđavama iz istorije ali u digitalnom formatu.',
    ikona: '🏰',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Odbrana: 95', 'Kapacitet: neograničen', 'Starosti: digitalna'],
    sposobnosti: ['Odbrana koordinacija', 'Firewall aktivacija', 'Enkriptovana zona'],
    vizuelniStil: 'Tvrđava silueta sa digitalnim zidovima, holografski bedem',
    inspiracija: 'Istorijske tvrđave u digitalnom formatu',
  },

  // ═══ OKRUŽENJA ════════════════════════════════════════════════

  {
    id: 'entitet-okruzenje-dimenzionalni-lavirint',
    naziv: 'Dimenzionalni Lavirint',
    tip: 'okruzenje',
    kategorijaDizajna: 'fantazija',
    opis: 'Generisano okruženje lavirinta koje se menja prema dimenziji. U 360D su bazični hodnici, u 5760D je kompleksni heksa-deka-cirkularni lavirint sa svim efektima.',
    ikona: '🌐',
    igricaId: 'igrica-omega-lavirint',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Veličina: po dimenziji', 'Kompleksnost: 360 do 5760 nivoa', 'Generisanje: algoritmičko'],
    sposobnosti: ['Dimenzionalna adaptacija', 'Proceduralna generacija', 'Rezonantna promena'],
    vizuelniStil: 'Elipsoidni zidovi, rezonantni prolazi, dimenzionalna paleta boja',
  },
  {
    id: 'entitet-okruzenje-spiralna-staza',
    naziv: 'Spiralna Staza',
    tip: 'okruzenje',
    kategorijaDizajna: 'sci-fi',
    opis: 'Trkačka staza generisana spiralnim formulama. Svaka dimenzija donosi drugačiju konfiguraciju — od bazičnih spirala u 360D do heksa-deka-cirkularnih u 5760D.',
    ikona: '🌀',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Dužina: po dimenziji', 'Zavoji: spiralni', 'Površina: dimenzionalna'],
    sposobnosti: ['Spiralna adaptacija', 'Rezonantni ubrzivači', 'Dimenzionalni rascep'],
    vizuelniStil: 'Neon staza na tamnoj pozadini, spiralni efekti, brzinometar u HUD-u',
  },
  {
    id: 'entitet-okruzenje-digitalni-bastion',
    naziv: 'Digitalni Bojno Polje',
    tip: 'okruzenje',
    kategorijaDizajna: 'horror',
    opis: 'Mračno digitalno okruženje Firewall Odbrane. Ispunjeno crvenim alarmima i binarnim kodovima koji teku po površinama — vizuelno napeto.',
    ikona: '🔴',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Tenzija: maksimalna', 'Vidljivost: smanjena', 'Rizik: visok'],
    sposobnosti: ['Alarm generisanje', 'Threat vizuelizacija', 'Kriza atmosfera'],
    vizuelniStil: 'Tamno digitalno polje, crveni alarmi, binarni tok na površinama',
  },
  {
    id: 'entitet-okruzenje-prompt-akademija',
    naziv: 'Prompt Akademija',
    tip: 'okruzenje',
    kategorijaDizajna: 'anime',
    opis: 'Svetla, inspirativna akademija za učenje SpajaPro Prompt sistema. Anime estetika sa lebdećim knjigama i svetlucavim rune-sistemom na zidovima.',
    ikona: '🏫',
    igricaId: 'igrica-spajapro-prompt-quest',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 100 studenata', 'Nivo: dimenzionalni', 'Atmosfera: inspirativna'],
    sposobnosti: ['Prompt materijalizacija', 'Rune aktivacija', 'AI mentorstvo okruženje'],
    vizuelniStil: 'Anime škola, lebdeće knjige, rune na zidovima, mekan osvjet',
  },
  {
    id: 'entitet-okruzenje-retro-arena',
    naziv: 'Retro Arena',
    tip: 'okruzenje',
    kategorijaDizajna: 'retro',
    opis: 'Nostalgična piksel-art arena za arkadne igre. Neon boje, piksel-art tribine, old-school score tabela — savršena za Data Sync Utrku.',
    ikona: '🕹️',
    igricaId: 'igrica-data-sync-utrka',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Stil: piksel-art', 'Era: 1980-2000', 'Score: analogni prikaz'],
    sposobnosti: ['Retro atmosfera', 'Piksel renderovanje', 'Score board prikazivanje'],
    vizuelniStil: 'CRT monitor estetika, neon piksel-art, scanline efekti',
  },
  {
    id: 'entitet-okruzenje-omega-strategijska-mapa',
    naziv: 'Omega Strategijska Mapa',
    tip: 'okruzenje',
    kategorijaDizajna: 'istorija',
    opis: 'Proširiva dimenzionalna mapa za Omega Strategiju. Inspirisana istorijskim mapama ali prikazana kao holografski 3D model koji se širi po dimenzijama.',
    ikona: '🗺️',
    igricaId: 'igrica-omega-strategija',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Veličina: po dimenziji', 'Teritorije: po D', 'Detalj: istorijski'],
    sposobnosti: ['Dimenzionalna ekspanzija', 'Teritorijalna vizuelizacija', 'Istorijski overlay'],
    vizuelniStil: 'Holografska karta sa istorijskim slojevima, zlatan okvir, plava energija',
    inspiracija: 'Istorijske strateške karte',
  },

  // ═══ SREDSTVA ════════════════════════════════════════════════

  {
    id: 'entitet-sredstvo-spaja-monitor-senzor',
    naziv: 'SPAJA Monitor Senzor',
    tip: 'sredstvo',
    kategorijaDizajna: 'sci-fi',
    opis: 'Ručni senzor koji prikazuje signal jačinu i tip u realnom vremenu. Koristi SPAJA Monitor tehnologiju. Veoma korisno za Signal Lovca.',
    ikona: '📊',
    igricaId: 'igrica-proksi-signal-lovac',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Domet: po dimenziji', 'Preciznost: 99.9%', 'Napajanje: beskonačno'],
    sposobnosti: ['Signal detekcija', 'Tip identifikacija', 'Jačina merenje'],
    vizuelniStil: 'Sci-fi ručni uređaj, OLED ekran, plavi LED indikatori',
  },
  {
    id: 'entitet-sredstvo-prompt-scroll',
    naziv: 'Prompt Svitak',
    tip: 'sredstvo',
    kategorijaDizajna: 'fantazija',
    opis: 'Magični svitak koji sadrži SpajaPro prompt formule. Koristi se u Prompt Quest igri za aktivaciju dimenzionalnih izazova.',
    ikona: '📜',
    igricaId: 'igrica-spajapro-prompt-quest',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 28 promptova', 'Magična snaga: kategorija'],
    sposobnosti: ['Prompt aktivacija', 'Dimenzionalni izazov summon', 'Znanje prenos'],
    vizuelniStil: 'Pergamentni svitak sa svetlucavim rune slovima, zlatni okov',
    inspiracija: 'SpajaPro 28 promptova',
  },
  {
    id: 'entitet-sredstvo-build-alat',
    naziv: 'Build Alat',
    tip: 'sredstvo',
    kategorijaDizajna: 'sci-fi',
    opis: 'Višenamjenski alat za gradnju dimenzionalnih struktura. Prikazuje holografski blueprint i koristi geometrijske forme kao template.',
    ikona: '🔧',
    igricaId: 'igrica-dimenzionalni-graditelj',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Forme: 4 geometrijske', 'Preciznost: milimetarska', 'Blueprint: holografski'],
    sposobnosti: ['Elipsoid kreiranje', 'Rezonanca postavljanje', 'Spirala generisanje'],
    vizuelniStil: 'Futuristički višefunkcijski alat, holografski ekran na dršci',
  },
  {
    id: 'entitet-sredstvo-shield-generator',
    naziv: 'Shield Generator',
    tip: 'sredstvo',
    kategorijaDizajna: 'sci-fi',
    opis: 'Prenosivi SPAJA Shield generator za Firewall Odbranu. Kreira energetski štit koji blokira digitalne napade.',
    ikona: '🛡️',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Pokrivenost: radijus 50m', 'Trajanje: 30s', 'Napajanje: energetski ćelija'],
    sposobnosti: ['Štit aktivacija', 'Blokada DDoS', 'Enkriptovana zona'],
    vizuelniStil: 'Kompaktni uređaj sa plavim energetskim emijerom, SPAJA logo',
  },

  // ═══ VOZILA ════════════════════════════════════════════════════

  {
    id: 'entitet-vozilo-spiralni-bolid',
    naziv: 'Spiralni Bolid',
    tip: 'vozilo',
    kategorijaDizajna: 'sci-fi',
    opis: 'Trkačko vozilo specijalnog dizajna za spiralne staze. Karoserija oblika spirale prilagođava aerodinamiku prema odabranoj dimenziji.',
    ikona: '🏎️',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Top brzina: po D (360kmh-5760kmh)', 'Ubrzanje: 0-100 u 2s', 'Masa: dimenzionalna'],
    sposobnosti: ['Turbo boost', 'Spiralni drift', 'Dimenzionalni prelaz', 'Rezonantni motor'],
    vizuelniStil: 'Aerodinamična spiralna karoserija, neon pruge, holografski štitnici',
    inspiracija: 'Formula 1 u dimenzionalnom prostoru',
  },
  {
    id: 'entitet-vozilo-deploy-raketa',
    naziv: 'Deploy Raketa',
    tip: 'vozilo',
    kategorijaDizajna: 'sci-fi',
    opis: 'Raketa koja lansira Deploy Kapsule u dimenzije. SPAJA CI/CD logotip na trupu, dimenzionalni motor sa plavim plamenom.',
    ikona: '🚀',
    igricaId: 'igrica-deploy-misija',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 5 kapsula', 'Brzina: Mach 10', 'Preciznost: 99.9%'],
    sposobnosti: ['Multi-kapsula lansiranje', 'Orbit korekcija', 'Zero-downtime isporuka'],
    vizuelniStil: 'Bela raketa sa SPAJA logom, plava mlazna traga, holografski navigacioni ekran',
  },
  {
    id: 'entitet-vozilo-retro-kolicica',
    naziv: 'Retro Kolica',
    tip: 'vozilo',
    kategorijaDizajna: 'retro',
    opis: 'Piksel-art kolica za prenos Data Kontejnera u Data Sync Utrci. 8-bit animacija vožnje sa chiptune zvučnim efektima.',
    ikona: '🛒',
    igricaId: 'igrica-data-sync-utrka',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Kapacitet: 10 kontejnera', 'Brzina: retro spora do brza', 'Stil: 8-bit'],
    sposobnosti: ['Brzo punjenje', 'Piksel dash', 'Data Sync poteg'],
    vizuelniStil: '8-bit piksel-art kolica, neon boje, animirani točkovi',
  },

  // ═══ ORUŽJA ════════════════════════════════════════════════════

  {
    id: 'entitet-oruzje-rezonantni-mac',
    naziv: 'Rezonantni Mač',
    tip: 'oruzje',
    kategorijaDizajna: 'fantazija',
    opis: 'Mač iskovan od rezonantnih kristala dimenzionalnog lavirinta. Sečivo treperi prema frekvenciji dimenzije — svaka dimenzija menja boju i snagu.',
    ikona: '⚔️',
    igricaId: 'igrica-omega-lavirint',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Snaga: 50-500 (po D)', 'Domet: 2m', 'Brzina: srednja'],
    sposobnosti: ['Rezonantni udar', 'Dimenzionalni sec', 'Frekventni val'],
    vizuelniStil: 'Kristalno sečivo, rezonantne rune na osnovi, aura po boji dimenzije',
  },
  {
    id: 'entitet-oruzje-firewall-top',
    naziv: 'Firewall Top',
    tip: 'oruzje',
    kategorijaDizajna: 'sci-fi',
    opis: 'Odbrambeni top koji ispalja SPAJA Firewall pakete na nadolazeće digitalne pretnje. Može biti nadograđen SPAJA Shield i SPAJA Crypto modulima.',
    ikona: '🔫',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Paljba: 100 paketa/s', 'Preciznost: 95%', 'Doseg: po dimenziji'],
    sposobnosti: ['Firewall ispaljivanje', 'Encrypted packet', 'Burst mod'],
    vizuelniStil: 'Digitalni top sa SPAJA Shield modulima, plavo-zelena energija',
  },
  {
    id: 'entitet-oruzje-signal-pistolj',
    naziv: 'Signal Pištolj',
    tip: 'oruzje',
    kategorijaDizajna: 'sci-fi',
    opis: 'Oružje Signal Lovca za neutralizaciju lažnih signala. Emituje kontra-signal koji anulira Proksi sabotažu.',
    ikona: '🔫',
    igricaId: 'igrica-proksi-signal-lovac',
    dimenzije: ['720D', '1440D'],
    status: 'aktivan',
    atributi: ['Kontra-signal: 100%', 'Brzina: instant', 'Punjenje: 5s'],
    sposobnosti: ['Signal neutralizacija', 'Lažni signal detekcija', 'SPAJA Shield emisija'],
    vizuelniStil: 'Kompaktni cyber pištolj, antenna na vrhu, antenski emiter',
  },
  {
    id: 'entitet-oruzje-optimizacioni-skener',
    naziv: 'Optimizacioni Skener',
    tip: 'oruzje',
    kategorijaDizajna: 'retro',
    opis: 'Retro scanner oružje koje identifikuje i neutralizuje neefikasan kod. U Turbo Optimizer igri, svaki sken poboljšava performanse sistema.',
    ikona: '📡',
    igricaId: 'igrica-turbo-optimizer',
    dimenzije: ['720D', '1440D'],
    status: 'aktivan',
    atributi: ['Analiza: 100%', 'Optimizacija: 50-100% po sken', 'Domet: sistemski'],
    sposobnosti: ['Code analiza', 'Bundle reduction', 'Performance boost'],
    vizuelniStil: 'Retro skener sa piksel ekranom, zelenji laser, chiptune zvuk',
  },

  // ═══ KOSTIMI ════════════════════════════════════════════════════

  {
    id: 'entitet-kostim-arhitekta-oklop',
    naziv: 'Arhitekta Oklop',
    tip: 'kostim',
    kategorijaDizajna: 'sci-fi',
    opis: 'Specijalni kostim za OMEGA AI Arhitekta personu. Holografski blueprint-linije teku po oklop-površinama. Povećava atribute gradnje.',
    ikona: '🦺',
    igricaId: 'igrica-omega-ai-akademija',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Oklop: 85', 'Gradnja bonus: +30%', 'Blueprint vizija: aktivna'],
    sposobnosti: ['Blueprint overlay', 'Strukturna analiza', 'Arhitektonski boost'],
    vizuelniStil: 'Sivi inženjerski kombineozon, holografski blueprint projekcija, zlatni OMEGA AI simbol',
    inspiracija: 'OMEGA AI Arhitekta persona',
  },
  {
    id: 'entitet-kostim-lekar-odora',
    naziv: 'Lekar Odora',
    tip: 'kostim',
    kategorijaDizajna: 'realizam',
    opis: 'Kostim OMEGA AI Lekara — medicinska odora sa digitalno-medicinskim pomagalima. Povećava healing i repair sposobnosti u OMEGA AI Akademiji.',
    ikona: '🥼',
    igricaId: 'igrica-omega-ai-akademija',
    dimenzije: ['360D', '720D'],
    status: 'aktivan',
    atributi: ['Healing: +50%', 'Dijagnoza: 100%', 'Odbrana: 70'],
    sposobnosti: ['AI dijagnoza', 'Sistemski popravak', 'Status isceljenje'],
    vizuelniStil: 'Bela medicinska odora, digitalni stetoskop, AI senzori na rukama',
    inspiracija: 'OMEGA AI Lekar persona',
  },
  {
    id: 'entitet-kostim-trkacko-odelo',
    naziv: 'Trkačko Odelo',
    tip: 'kostim',
    kategorijaDizajna: 'sport',
    opis: 'Visoko-performansni sportski kostim za spiralne trke. Aerodinamičan dizajn sa integrisanim SPAJA senzorima za reakcijsko vreme.',
    ikona: '👔',
    igricaId: 'igrica-spiralni-trke',
    dimenzije: ['360D', '720D', '1440D'],
    status: 'aktivan',
    atributi: ['Aerodinamičnost: 95%', 'Zaštita: 80', 'Sensor-suit: aktivan'],
    sposobnosti: ['Turbo ready', 'Reakcijsko pojačanje', 'Spiralni mod'],
    vizuelniStil: 'Atletski kombinezon, SPAJA logotip, aerodinamični linijski dizajn, boja po timu',
    inspiracija: 'F1 vozački kombinezon',
  },
  {
    id: 'entitet-kostim-cyber-odelo',
    naziv: 'Cyber Odelo',
    tip: 'kostim',
    kategorijaDizajna: 'horror',
    opis: 'Mračno cyber odelo za Firewall Odbranu. Crna baza sa crvenim neonskim linijama — vizuelno strahuje neprijatelje i povećava taktičku svest.',
    ikona: '🥷',
    igricaId: 'igrica-firewall-odbrana',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Stealth: 90%', 'Cyber odbrana: +40%', 'Taktika: 95'],
    sposobnosti: ['Cyber kamuflacija', 'Firewall boost', 'Threat detection'],
    vizuelniStil: 'Crni high-tech kombinezon, crveni neon konture, vizir sa red-tint',
    inspiracija: 'Cyber security operative',
  },
  {
    id: 'entitet-kostim-samurai-oklop',
    naziv: 'Samurai Oklop',
    tip: 'kostim',
    kategorijaDizajna: 'istorija',
    opis: 'Istorijski inspirisan samurai oklop sa dimenzionalnim modifikacijama za Omega Strategiju. Povećava komandne sposobnosti i strateški autoritet.',
    ikona: '⛩️',
    igricaId: 'igrica-omega-strategija',
    dimenzije: ['1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Autoritet: +50%', 'Oklop: 92', 'Komanda: +30%'],
    sposobnosti: ['Strateški rally', 'Komandni oklop', 'Teritorijalni prestiž'],
    vizuelniStil: 'Tradicionalni samurai oklop sa holografskim dimenzionalnim simbolima',
    inspiracija: 'Istorijski feudalni japan',
  },

  // ═══ COLD AND FIRE entiteti ═══════════════════════════════════════

  {
    id: 'entitet-cold-ratnik',
    naziv: 'Cold Ratnik',
    tip: 'lik-igriv',
    kategorijaDizajna: 'fantazija',
    opis: 'Igrivi lik za COLD AND FIRE — majstor ledenih moći. Oblačen u kristalni oklop od dimenzionalnog leda koji menja providnost prema izabranoj dimenziji. U 5760D celo telo prekriveno spiralnim ledenim aurima i hiperboličkim kristalima.',
    ikona: '❄️',
    igricaId: 'igrica-cold-and-fire',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Hladnoća: 95', 'Odbrana: 88', 'Brzina: 72', 'Elementalna moć: 90'],
    sposobnosti: ['Ledeni štit', 'Mrazni prasak', 'Dimenzionalni zaleđivač', 'COLD-FIRE fuzija'],
    vizuelniStil: 'Kristalni ledeni oklop, holografski snežni vizir, spiralna ledena aura',
    inspiracija: 'Dualistički elemental leda i vatre',
  },
  {
    id: 'entitet-fire-feniks',
    naziv: 'Fire Feniks',
    tip: 'lik-igriv',
    kategorijaDizajna: 'fantazija',
    opis: 'Drugi igrivi lik za COLD AND FIRE — komandant vatrenih moći. Nosi ognjeni oklop koji tinja i eksplodira prema snazi dimenzije. U 5760D poprima puni fenikski vizuelni prikaz sa spiralnim vatrenim krilima.',
    ikona: '🔥',
    igricaId: 'igrica-cold-and-fire',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Vatra: 98', 'Napad: 95', 'Brzina: 85', 'Elementalna moć: 93'],
    sposobnosti: ['Vatreni prasak', 'Feniksi let', 'Dimenzionalna erupcija', 'COLD-FIRE fuzija'],
    vizuelniStil: 'Ognjeni oklop sa živim plamenom, spiralna vatrena krila, feniksi trag',
    inspiracija: 'Mitološki feniks i dualistički elemental',
  },
  {
    id: 'entitet-oruzje-ledena-vatra-mac',
    naziv: 'Ledena Vatra — Mač',
    tip: 'oruzje',
    kategorijaDizajna: 'fantazija',
    opis: 'Legendarno oružje COLD AND FIRE — mač koji kombinuje led i vatru u jednom sečivu. Gornja polovina sečiva je od dimenzionalnog leda, donja od živog plamena. U višim dimenzijama sečivo se transformiše u spiralnu fuziju oba elementa.',
    ikona: '⚔️',
    igricaId: 'igrica-cold-and-fire',
    dimenzije: ['360D', '720D', '1440D', '2880D', '5760D'],
    status: 'aktivan',
    atributi: ['Šteta leda: 85', 'Šteta vatre: 85', 'Fuziona šteta: 170', 'Dimenzionalni bonus: +40%'],
    sposobnosti: ['Dualni elementalni udar', 'COLD-FIRE fuzioni prasak', 'Dimenzionalni rez'],
    vizuelniStil: 'Sečivo sa led-vatra granicom, plave i crvene rune na drži, spiralni efekti u višim D',
    inspiracija: 'Dualistički mač vatre i leda iz COLD AND FIRE sveta',
  },
];

// ─── Helper funkcije ────────────────────────────────────────────────

export function countByTip(tip: TipGejmingEntiteta): number {
  return gejmingEntiteti.filter((e) => e.tip === tip).length;
}

export function countByKategorija(kategorija: KategorijaDizajna): number {
  return gejmingEntiteti.filter((e) => e.kategorijaDizajna === kategorija).length;
}

export function getUniqueIgrice(): string[] {
  return [...new Set(gejmingEntiteti.map((e) => e.igricaId))];
}

export function getSviTipovi(): TipGejmingEntiteta[] {
  return [...new Set(gejmingEntiteti.map((e) => e.tip))];
}

export function getSveKategorijeDizajna(): KategorijaDizajna[] {
  return [...new Set(gejmingEntiteti.map((e) => e.kategorijaDizajna))];
}

// ─── Builder funkcija ───────────────────────────────────────────────

export function buildGejmingLikovi(userId: string): GejmingLikoviRezultat {
  const sviTipovi: TipGejmingEntiteta[] = [
    'lik-igriv', 'lik-npc', 'objekat', 'subjekat',
    'okruzenje', 'sredstvo', 'vozilo', 'oruzje', 'kostim',
  ];

  const sveKategorije: KategorijaDizajna[] = [
    'fantazija', 'sci-fi', 'realizam', 'retro',
    'anime', 'horror', 'sport', 'istorija',
  ];

  const poTipu = sviTipovi.map((tip) => ({
    tip,
    brojEntiteta: countByTip(tip),
  }));

  const poKategoriji = sveKategorije.map((kategorija) => ({
    kategorija,
    brojEntiteta: countByKategorija(kategorija),
  }));

  const vezanihIgrica = getUniqueIgrice();

  const poIgrici = vezanihIgrica.map((igricaId) => ({
    igricaId,
    brojEntiteta: gejmingEntiteti.filter((e) => e.igricaId === igricaId).length,
  }));

  const pregled: GejmingLikoviPregled = {
    ukupnoEntiteta: gejmingEntiteti.length,
    likovaIgravih: countByTip('lik-igriv'),
    npcLikova: countByTip('lik-npc'),
    objekata: countByTip('objekat'),
    subjekata: countByTip('subjekat'),
    okruzenja: countByTip('okruzenje'),
    sredstava: countByTip('sredstvo'),
    vozila: countByTip('vozilo'),
    oruzja: countByTip('oruzje'),
    kostima: countByTip('kostim'),
    kategorijaCount: sveKategorije.filter((k) => countByKategorija(k) > 0).length,
    vezanihIgrica: vezanihIgrica.length,
  };

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    pregled,
    poTipu,
    poKategoriji,
    poIgrici,
    entiteti: gejmingEntiteti,
  };
}
