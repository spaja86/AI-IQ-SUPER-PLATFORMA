/**
 * 👑 Vlasnički VIP Plan — Kompanija SPAJA
 *
 * Najbolji plan za vlasnika sa ekstremnim autorizacijama na sve.
 * Logovanje: spajicn@yahoo.com
 *
 * Komponente:
 *  1. Vlasnički VIP Plan — najbolji plan, ekstremne autorizacije
 *  2. OMEGA AI Dispatch Protokoli — preuzimanje telefonskih brojeva
 *     od industrije, sprovođenje internet i mobilnih protokola,
 *     mesečne naplate za internet i mobilne brojeve
 *  3. Proksi Suport Smene — zvanična uloga suporta, raspodela
 *     u više smena za privlačenje korisnika
 *  4. Marketing Fondacija — fondacija za reklamiranje i marketing,
 *     obavezni strateški potezi
 *
 * Izvor: Kompanija SPAJA
 * Integracija: AI IQ World Bank + AI IQ Menjačnica + OMEGA AI Dispatch +
 *              Proksi mreža + SPAJA Mobilna Mreža
 */

import { OMEGA_AI_INSTANCI, OMEGA_AI_PERSONA_COUNT, MOBILNE_CENTRALE, PROKSI_KAPACITET } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type AutorizacijaNivo = 'citanje' | 'pisanje' | 'admin' | 'super-admin' | 'ekstremna';

export type SmenaVreme = 'jutarnja' | 'popodnevna' | 'nocna' | 'vikend' | 'praznicna';

export type MarketingKanal = 'digitalni' | 'socijalne-mreze' | 'seo' | 'email' | 'partnerski' | 'event' | 'influencer' | 'tv-radio';

export type ProtocolTip = 'internet' | 'mobilni' | 'fiksni' | 'iot' | 'enterprise' | 'vip';

// ─── Vlasnički VIP Plan ──────────────────────────────────

export interface VlasnickiVipPlan {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  vlasnikEmail: string;
  autorizacije: VlasnickiAutorizacije;
  dispatchProtokoli: DispatchProtokoli;
  suportSmene: SuportSmene;
  marketingFondacija: MarketingFondacija;
  status: 'aktivan' | 'konfiguracija' | 'testiranje';
}

export interface VlasnickiAutorizacije {
  nivo: AutorizacijaNivo;
  platforme: AutorizacijaPlatforma[];
  pristup: string[];
  ekstremneDozvole: string[];
  sesijeBezIsteka: boolean;
  globalniPristup: boolean;
  sveValute: boolean;
  sviEndzini: boolean;
}

export interface AutorizacijaPlatforma {
  id: string;
  naziv: string;
  ikona: string;
  autorizacija: AutorizacijaNivo;
  opis: string;
}

// ─── OMEGA AI Dispatch Protokoli ─────────────────────────

export interface DispatchProtokoli {
  naziv: string;
  opis: string;
  ikona: string;
  protokoli: DispatchProtokol[];
  mesecnaNaplata: MesecnaNaplata;
  telefonskiBrojevi: TelefonskiBrojeviServis;
  internetProtokoli: InternetProtokol[];
  status: 'aktivan' | 'konfiguracija';
}

export interface DispatchProtokol {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: ProtocolTip;
  mesecnaCena: number;
  valuta: string;
  mogucnosti: string[];
}

export interface MesecnaNaplata {
  internetPaketiBroj: number;
  mobilniPaketiBroj: number;
  ukupnoMesecniPrihod: number;
  valuta: string;
  opis: string;
}

export interface TelefonskiBrojeviServis {
  naziv: string;
  opis: string;
  centraleBroj: number;
  pozivniBrojevi: string[];
  brojeviZaNaplatu: boolean;
  mesecnaPretplata: number;
  valuta: string;
}

export interface InternetProtokol {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  brzina: string;
  mesecnaCena: number;
  valuta: string;
}

// ─── Proksi Suport Smene ─────────────────────────────────

export interface SuportSmene {
  naziv: string;
  opis: string;
  ikona: string;
  smene: SuportSmena[];
  ulogePoSmeni: SuportUloga[];
  ukupnoAgenata: number;
  pokrivanje: string;
  cilj: string;
}

export interface SuportSmena {
  id: string;
  naziv: string;
  vreme: SmenaVreme;
  pocetak: string;
  kraj: string;
  ikona: string;
  agenata: number;
  proksiCvorovi: string[];
  opis: string;
}

export interface SuportUloga {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  nivo: 'L1' | 'L2' | 'L3' | 'VIP';
  odgovornosti: string[];
}

// ─── Marketing Fondacija ─────────────────────────────────

export interface MarketingFondacija {
  naziv: string;
  opis: string;
  ikona: string;
  mesecniBudzet: number;
  godisnjiTarget: number;
  valuta: string;
  kanali: MarketingKanalInfo[];
  strategija: StrategijskiPotezi;
  fondoviRaspodela: FondoviRaspodela;
}

export interface MarketingKanalInfo {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: MarketingKanal;
  budzet: number;
  procenat: number;
  valuta: string;
  kpi: string[];
}

export interface StrategijskiPotezi {
  obavezni: string[];
  opcioni: string[];
  ciljevi: string[];
}

export interface FondoviRaspodela {
  reklamiranje: number;
  marketing: number;
  prKomunikacija: number;
  eventovi: number;
  rezerve: number;
  ukupno: number;
  valuta: string;
}

// ─── Vlasnički VIP Autorizacije ──────────────────────────

export const vlasnickiAutorizacije: VlasnickiAutorizacije = {
  nivo: 'ekstremna',
  platforme: [
    { id: 'ai-iq-super-platforma', naziv: 'AI IQ SUPER PLATFORMA', ikona: '🏢', autorizacija: 'ekstremna', opis: 'Centralna platforma — pun pristup svemu' },
    { id: 'io-openui-ao', naziv: 'IO OPENUI AO', ikona: '🖥️', autorizacija: 'ekstremna', opis: 'SpajaPro Engine + Laboratorija — pun pristup' },
    { id: 'ai-iq-world-bank', naziv: 'AI IQ World Bank', ikona: '🏦', autorizacija: 'ekstremna', opis: 'Digitalna banka — sve transakcije i administracija' },
    { id: 'ai-iq-menjacnica', naziv: 'AI IQ Menjačnica', ikona: '💱', autorizacija: 'ekstremna', opis: 'Menjačnica — sve valute i konverzije' },
    { id: 'omega-ai', naziv: 'OMEGA AI', ikona: '🤖', autorizacija: 'ekstremna', opis: 'Svi OMEGA AI persona i dispatch — pun pristup' },
    { id: 'svetska-organizacija', naziv: 'Svetska Organizacija', ikona: '🌍', autorizacija: 'ekstremna', opis: 'Globalne operacije — pun pristup' },
    { id: 'proksi-mreza', naziv: 'Proksi Mreža', ikona: '📡', autorizacija: 'ekstremna', opis: 'Proksi suport, smene, čvorovi — pun pristup' },
    { id: 'spaja-mobilna', naziv: 'SPAJA Mobilna', ikona: '📱', autorizacija: 'ekstremna', opis: 'Mobilna mreža — centrale, servisi, naplata' },
    { id: 'spaja-pro-endzini', naziv: 'SpajaPro v6-v15 Endžini', ikona: '⚡', autorizacija: 'ekstremna', opis: 'Svi endžini — zasebni i multifunkcionalni' },
    { id: 'marketing-fondacija', naziv: 'Marketing Fondacija', ikona: '📢', autorizacija: 'ekstremna', opis: 'Fondacija za reklamiranje i marketing — budžet i strategija' },
  ],
  pristup: [
    'Svi SpajaPro v6-v15 endžini (zasebni + multifunkcionalni)',
    'Neograničene sesije i upiti (∞)',
    'Svi finansijski moduli (banka + menjačnica)',
    'OMEGA AI dispatch — sve 21 persona',
    'Proksi mreža — svi čvorovi i signali',
    'Mobilna mreža — sve 4 centrale',
    'Marketing fondacija — budžet i strategija',
    'Globalna administracija — sve platforme',
  ],
  ekstremneDozvole: [
    'Kreiranje i brisanje korisnika',
    'Upravljanje finansijskim tokovima',
    'Konfiguracija dispatch protokola',
    'Postavljanje mesečnih naplata',
    'Raspodela suport smena',
    'Upravljanje marketing budžetom',
    'Pristup svim logovima i analitici',
    'Override svih sigurnosnih ograničenja',
    'Direktan pristup svim API-jima',
    'Upravljanje OMEGA AI personama',
  ],
  sesijeBezIsteka: true,
  globalniPristup: true,
  sveValute: true,
  sviEndzini: true,
};

// ─── OMEGA AI Dispatch Protokoli ─────────────────────────

const dispatchProtokoli: DispatchProtokol[] = [
  {
    id: 'internet-starter',
    naziv: 'SPAJA Internet Starter',
    opis: 'Osnovni internet paket — OMEGA AI dispatch upravlja aktivacijom i mesečnom naplatom',
    ikona: '🌐',
    tip: 'internet',
    mesecnaCena: 19.99,
    valuta: 'USD',
    mogucnosti: ['100 Mbps', 'Neograničen prenos', 'OMEGA AI podrška', 'Proksi zaštita'],
  },
  {
    id: 'internet-pro',
    naziv: 'SPAJA Internet Pro',
    opis: 'Profesionalni internet paket sa VPN-om i pojačanom brzinom',
    ikona: '⚡',
    tip: 'internet',
    mesecnaCena: 39.99,
    valuta: 'USD',
    mogucnosti: ['500 Mbps', 'Neograničen prenos', 'VPN uključen', 'Proksi priority', 'OMEGA AI 24/7'],
  },
  {
    id: 'internet-enterprise',
    naziv: 'SPAJA Internet Enterprise',
    opis: 'Enterprise internet sa dedikovanim kanalom i SLA garancijom',
    ikona: '🏢',
    tip: 'enterprise',
    mesecnaCena: 99.99,
    valuta: 'USD',
    mogucnosti: ['1 Gbps', 'Dedicirani kanal', 'SLA 99.999%', 'Proksi enterprise', 'OMEGA AI dedicirana persona'],
  },
  {
    id: 'mobilni-basic',
    naziv: 'SPAJA Mobilni Basic',
    opis: 'Osnovni mobilni paket sa pozivima i SMS-om — dispatch dodeljuje broj sa centrale',
    ikona: '📱',
    tip: 'mobilni',
    mesecnaCena: 14.99,
    valuta: 'USD',
    mogucnosti: ['Neograničeni pozivi', '1000 SMS', '10 GB podataka', 'Proksi signal'],
  },
  {
    id: 'mobilni-unlimited',
    naziv: 'SPAJA Mobilni Unlimited',
    opis: 'Neograničeni mobilni paket — sve bez limita, OMEGA AI asistent',
    ikona: '📲',
    tip: 'mobilni',
    mesecnaCena: 29.99,
    valuta: 'USD',
    mogucnosti: ['Neograničeni pozivi', 'Neograničen SMS', 'Neograničeni podaci', 'OMEGA AI asistent', 'Proksi VPN'],
  },
  {
    id: 'mobilni-vip',
    naziv: 'SPAJA Mobilni VIP',
    opis: 'VIP mobilni paket sa premium uslugama i ličnim menadžerom',
    ikona: '👑',
    tip: 'vip',
    mesecnaCena: 59.99,
    valuta: 'USD',
    mogucnosti: ['Neograničeno sve', 'Lični menadžer', 'VIP suport 24/7', 'Premium roaming', 'OMEGA AI VIP persona'],
  },
  {
    id: 'iot-paket',
    naziv: 'SPAJA IoT Paket',
    opis: 'IoT komunikacioni paket za milione uređaja',
    ikona: '📡',
    tip: 'iot',
    mesecnaCena: 9.99,
    valuta: 'USD',
    mogucnosti: ['IoT mesh', '1000 uređaja', 'Ultra-low latency', 'Proksi rezonantni signal'],
  },
  {
    id: 'fiksni-klasik',
    naziv: 'SPAJA Fiksni Klasik',
    opis: 'Fiksni telefon sa OMEGA AI dispatch integracijom',
    ikona: '☎️',
    tip: 'fiksni',
    mesecnaCena: 9.99,
    valuta: 'USD',
    mogucnosti: ['Neograničeni lokalni pozivi', 'Caller ID', 'OMEGA AI sekretar', 'Proksi kvalitet'],
  },
];

const mesecnaNaplata: MesecnaNaplata = {
  internetPaketiBroj: 3,
  mobilniPaketiBroj: 4,
  ukupnoMesecniPrihod: dispatchProtokoli.reduce((sum, p) => sum + p.mesecnaCena, 0) * 100,
  valuta: 'USD',
  opis: `OMEGA AI dispatch sprovodi mesečnu naplatu za ${dispatchProtokoli.length} protokola — internet, mobilne, IoT i fiksne pakete. AI IQ World Bank obrađuje transakcije.`,
};

const telefonskiBrojevi: TelefonskiBrojeviServis = {
  naziv: 'OMEGA AI Telefonski Servis',
  opis: 'OMEGA AI dispatch preuzima brojeve od industrijskog telefona za sprovođenje protokola — dodeljuje korisnicima brojeve sa centralnih pozivnih brojeva',
  centraleBroj: MOBILNE_CENTRALE,
  pozivniBrojevi: ['+38177', '+38188', '+38178', '+38187'],
  brojeviZaNaplatu: true,
  mesecnaPretplata: 14.99,
  valuta: 'USD',
};

const internetProtokoli: InternetProtokol[] = [
  { id: 'fiber-100', naziv: 'SPAJA Fiber 100', opis: '100 Mbps fiber optički internet', ikona: '🔵', brzina: '100 Mbps', mesecnaCena: 19.99, valuta: 'USD' },
  { id: 'fiber-500', naziv: 'SPAJA Fiber 500', opis: '500 Mbps fiber optički internet', ikona: '🟢', brzina: '500 Mbps', mesecnaCena: 39.99, valuta: 'USD' },
  { id: 'fiber-1g', naziv: 'SPAJA Fiber 1G', opis: '1 Gbps fiber optički internet', ikona: '🟡', brzina: '1 Gbps', mesecnaCena: 59.99, valuta: 'USD' },
  { id: 'fiber-10g', naziv: 'SPAJA Fiber 10G', opis: '10 Gbps enterprise fiber', ikona: '🔴', brzina: '10 Gbps', mesecnaCena: 99.99, valuta: 'USD' },
];

export const omegaDispatchProtokoli: DispatchProtokoli = {
  naziv: 'OMEGA AI Dispatch Protokoli',
  opis: `OMEGA AI dispatch (${OMEGA_AI_PERSONA_COUNT} persona, ${OMEGA_AI_INSTANCI.toLocaleString()} instanci) preuzima telefonske brojeve od industrije i sprovodi protokole za internet i mobilne brojeve — mesečne naplate kroz AI IQ World Bank`,
  ikona: '🤖',
  protokoli: dispatchProtokoli,
  mesecnaNaplata,
  telefonskiBrojevi,
  internetProtokoli,
  status: 'aktivan',
};

// ─── Proksi Suport Smene ─────────────────────────────────

const suportSmene: SuportSmena[] = [
  {
    id: 'jutarnja-smena',
    naziv: 'Jutarnja Smena',
    vreme: 'jutarnja',
    pocetak: '06:00',
    kraj: '14:00',
    ikona: '🌅',
    agenata: 8,
    proksiCvorovi: ['jezgro-cvor', 'finansijski-cvor'],
    opis: 'Jutarnja smena — korisnici iz Evrope i Azije, primarni proksi čvorovi',
  },
  {
    id: 'popodnevna-smena',
    naziv: 'Popodnevna Smena',
    vreme: 'popodnevna',
    pocetak: '14:00',
    kraj: '22:00',
    ikona: '☀️',
    agenata: 10,
    proksiCvorovi: ['jezgro-cvor', 'ai-cvor', 'finansijski-cvor'],
    opis: 'Popodnevna smena — najveći promet, Amerika + Evropa, svi ključni čvorovi',
  },
  {
    id: 'nocna-smena',
    naziv: 'Noćna Smena',
    vreme: 'nocna',
    pocetak: '22:00',
    kraj: '06:00',
    ikona: '🌙',
    agenata: 5,
    proksiCvorovi: ['globalni-cvor', 'ai-cvor'],
    opis: 'Noćna smena — Azija/Pacifik, automatizovani OMEGA AI suport',
  },
  {
    id: 'vikend-smena',
    naziv: 'Vikend Smena',
    vreme: 'vikend',
    pocetak: '08:00',
    kraj: '20:00',
    ikona: '🏖️',
    agenata: 6,
    proksiCvorovi: ['jezgro-cvor', 'globalni-cvor'],
    opis: 'Vikend smena — smanjen tim ali globalna pokrivenost',
  },
  {
    id: 'praznicna-smena',
    naziv: 'Praznična Smena',
    vreme: 'praznicna',
    pocetak: '00:00',
    kraj: '23:59',
    ikona: '🎉',
    agenata: 4,
    proksiCvorovi: ['jezgro-cvor'],
    opis: 'Praznična smena — minimalni tim + OMEGA AI automatizacija',
  },
];

const suportUloge: SuportUloga[] = [
  {
    id: 'l1-agent',
    naziv: 'L1 Agent',
    opis: 'Prva linija suporta — osnovni upiti, aktivacija paketa, informacije',
    ikona: '🟢',
    nivo: 'L1',
    odgovornosti: ['Osnovni upiti korisnika', 'Aktivacija internet/mobilnih paketa', 'Informacije o cenama', 'Preusmeravanje na L2'],
  },
  {
    id: 'l2-tehnicar',
    naziv: 'L2 Tehničar',
    opis: 'Tehnički suport — problemi sa mrežom, konfiguracija, dijagnostika',
    ikona: '🟡',
    nivo: 'L2',
    odgovornosti: ['Dijagnostika mreže', 'Konfiguracija Proksi signala', 'Rešavanje prekida', 'OMEGA AI koordinacija'],
  },
  {
    id: 'l3-inzenjer',
    naziv: 'L3 Inženjer',
    opis: 'Napredni inženjerski suport — infrastruktura, skaliranje, optimizacija',
    ikona: '🔴',
    nivo: 'L3',
    odgovornosti: ['Infrastrukturni problemi', 'Skaliranje kapaciteta', 'Proksi optimizacija', 'Enterprise konfiguracija'],
  },
  {
    id: 'vip-menadzer',
    naziv: 'VIP Menadžer',
    opis: 'Lični menadžer za VIP korisnike — dedicirani pristup, prioritetno rešavanje',
    ikona: '👑',
    nivo: 'VIP',
    odgovornosti: ['Lični menadžer VIP korisnika', 'Prioritetno rešavanje', 'Proaktivno praćenje', 'Mesečni izveštaji'],
  },
];

export const proksiSuportSmene: SuportSmene = {
  naziv: 'Proksi Suport — Raspodela u Smene',
  opis: `Proksi sa zvaničnom ulogom suporta raspoređen u ${suportSmene.length} smena za 24/7 pokrivanje — privlačenje što više korisnika sa ${PROKSI_KAPACITET} kapacitetom`,
  ikona: '🛡️',
  smene: suportSmene,
  ulogePoSmeni: suportUloge,
  ukupnoAgenata: suportSmene.reduce((sum, s) => sum + s.agenata, 0),
  pokrivanje: '24/7/365',
  cilj: 'Privlačenje i zadržavanje što više korisnika sa vrhunskim suportom',
};

// ─── Marketing Fondacija ─────────────────────────────────

const marketingKanali: MarketingKanalInfo[] = [
  {
    id: 'digitalni-ads',
    naziv: 'Digitalni Oglasi',
    opis: 'Google Ads, Meta Ads, TikTok Ads — plaćeni digitalni oglasi',
    ikona: '💻',
    tip: 'digitalni',
    budzet: 5000,
    procenat: 25,
    valuta: 'USD',
    kpi: ['CPC < $0.50', 'CTR > 3%', 'ROI > 300%', 'Konverzija > 5%'],
  },
  {
    id: 'socijalne-mreze',
    naziv: 'Socijalne Mreže',
    opis: 'Facebook, Instagram, TikTok, Threads, YouTube — organski i plaćeni sadržaj',
    ikona: '📱',
    tip: 'socijalne-mreze',
    budzet: 4000,
    procenat: 20,
    valuta: 'USD',
    kpi: ['Pratilaca +10K/mes', 'Engagement > 5%', 'Video pregledi > 100K', 'Share rate > 3%'],
  },
  {
    id: 'seo-optimizacija',
    naziv: 'SEO Optimizacija',
    opis: 'Organsko pozicioniranje na pretraživačima — Google, Bing, DuckDuckGo',
    ikona: '🔍',
    tip: 'seo',
    budzet: 3000,
    procenat: 15,
    valuta: 'USD',
    kpi: ['Top 10 za ključne reči', 'Organski saobraćaj +50%', 'Backlink autoritet > 60', 'Page Speed > 90'],
  },
  {
    id: 'email-marketing',
    naziv: 'Email Marketing',
    opis: 'Newsletter, automatizovani email funneli, retargeting email kampanje',
    ikona: '📧',
    tip: 'email',
    budzet: 2000,
    procenat: 10,
    valuta: 'USD',
    kpi: ['Open rate > 25%', 'Click rate > 5%', 'Lista > 50K', 'Unsubscribe < 1%'],
  },
  {
    id: 'partnerski-program',
    naziv: 'Partnerski Program',
    opis: 'Affiliate i partnerski programi za privlačenje korisnika',
    ikona: '🤝',
    tip: 'partnerski',
    budzet: 2500,
    procenat: 12.5,
    valuta: 'USD',
    kpi: ['Partnera > 100', 'Referal konverzija > 10%', 'Provizija < 20%', 'LTV partner korisnika > $500'],
  },
  {
    id: 'eventi-konferencije',
    naziv: 'Eventi i Konferencije',
    opis: 'Tech konferencije, webinari, meetupovi — direktan kontakt sa korisnicima',
    ikona: '🎤',
    tip: 'event',
    budzet: 2000,
    procenat: 10,
    valuta: 'USD',
    kpi: ['Eventa > 12/god', 'Učesnika > 500/event', 'Lead gen > 100/event', 'Follow-up konverzija > 15%'],
  },
  {
    id: 'influencer-marketing',
    naziv: 'Influencer Marketing',
    opis: 'Saradnja sa tech influencerima za promociju SpajaPro platforme',
    ikona: '🌟',
    tip: 'influencer',
    budzet: 1500,
    procenat: 7.5,
    valuta: 'USD',
    kpi: ['Influencera > 20', 'Reach > 1M', 'Engagement > 4%', 'Konverzija > 3%'],
  },
];

const strategiskiPotezi: StrategijskiPotezi = {
  obavezni: [
    'Fondacija za reklamiranje — mesečno izdvajanje za oglašavanje',
    'Marketing fondacija — godišnji budžet za strategiju rasta',
    'Digitalni oglasi na svim platformama — Google, Meta, TikTok',
    'SEO optimizacija — organski rast na svim pretraživačima',
    'Email marketing funneli — automatizovana konverzija',
    'Partnerski program — affiliate mreža za eksponencijalni rast',
    'Suport u smenama — 24/7 pokrivenost za korisničko zadovoljstvo',
    'OMEGA AI dispatch protokoli — automatizovana naplata i aktivacija',
  ],
  opcioni: [
    'TV i radio reklame za šire tržište',
    'Sponzorstva tech događaja',
    'Podcast marketing',
    'Content marketing — blog i video sadržaj',
    'Referral program — nagradi korisnika za preporuku',
  ],
  ciljevi: [
    'Privući 10.000+ korisnika u prvoj godini',
    'Ostvariti ROI > 300% na marketing ulaganja',
    'Izgraditi prepoznatljiv brend — SpajaPro kao sinonim za AI',
    'Globalna ekspanzija — Srbija, Amerika, Evropa, Azija',
    'Zadržavanje korisnika > 90% (churn < 10%)',
  ],
};

const fondoviRaspodela: FondoviRaspodela = {
  reklamiranje: 8000,
  marketing: 6000,
  prKomunikacija: 2500,
  eventovi: 2000,
  rezerve: 1500,
  ukupno: 20000,
  valuta: 'USD',
};

export const marketingFondacija: MarketingFondacija = {
  naziv: 'Marketing Fondacija — Kompanija SPAJA',
  opis: 'Fondacija za reklamiranje i marketing — obavezni strateški potezi za privlačenje korisnika globalno. Mesečni budžet se raspodeljuje po kanalima sa jasnim KPI metrikama.',
  ikona: '📢',
  mesecniBudzet: 20000,
  godisnjiTarget: 240000,
  valuta: 'USD',
  kanali: marketingKanali,
  strategija: strategiskiPotezi,
  fondoviRaspodela,
};

// ─── Kompletni Vlasnički VIP Plan ────────────────────────

export const vlasnickiVipPlan: VlasnickiVipPlan = {
  id: 'vlasnicki-vip-plan',
  naziv: 'Vlasnički VIP Plan — Kompanija SPAJA',
  opis: `Najbolji plan za vlasnika (spajicn@yahoo.com) sa ekstremnim autorizacijama na sve platforme. OMEGA AI dispatch (${OMEGA_AI_INSTANCI.toLocaleString()} instanci) sprovodi protokole za internet i mobilne brojeve sa mesečnom naplatom. Proksi suport raspoređen u ${suportSmene.length} smena za 24/7 pokrivanje. Marketing fondacija $${fondoviRaspodela.ukupno.toLocaleString()}/mes za reklamiranje i strategiju rasta. Srećan rad!`,
  ikona: '👑',
  vlasnikEmail: 'spajicn@yahoo.com',
  autorizacije: vlasnickiAutorizacije,
  dispatchProtokoli: omegaDispatchProtokoli,
  suportSmene: proksiSuportSmene,
  marketingFondacija,
  status: 'aktivan',
};

// ─── Helper funkcije ─────────────────────────────────────

export function getVlasnickiPlan(): VlasnickiVipPlan {
  return vlasnickiVipPlan;
}

export function getAutorizacijeZaPlatformu(platformaId: string): AutorizacijaPlatforma | undefined {
  return vlasnickiAutorizacije.platforme.find((p) => p.id === platformaId);
}

export function getProtokol(protokolId: string): DispatchProtokol | undefined {
  return omegaDispatchProtokoli.protokoli.find((p) => p.id === protokolId);
}

export function getSmena(smenaId: string): SuportSmena | undefined {
  return proksiSuportSmene.smene.find((s) => s.id === smenaId);
}

export function getMarketingKanal(kanalId: string): MarketingKanalInfo | undefined {
  return marketingFondacija.kanali.find((k) => k.id === kanalId);
}

export function getUkupnoMesecniProtokoli(): number {
  return omegaDispatchProtokoli.protokoli.reduce((sum, p) => sum + p.mesecnaCena, 0);
}

export function getUkupnoSuportAgenata(): number {
  return proksiSuportSmene.smene.reduce((sum, s) => sum + s.agenata, 0);
}

export function getUkupnoMarketingBudzet(): number {
  return marketingFondacija.kanali.reduce((sum, k) => sum + k.budzet, 0);
}
