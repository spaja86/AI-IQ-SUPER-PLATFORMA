/**
 * 📞 OMEGA AI Maksimalni Suport — Telefon + Mejl + Dispeč sa Korisnicima
 *
 * Maksimalni suport na OMEGA nivou: svaka od 21 persona ima:
 *  - Telefon za suport (direktna linija sa korisnicima)
 *  - Mejl za dopisivanje (već postoji u omega-ai-suport-mejlovi.ts)
 *  - Dispeč sistem (korisnički tiketi, SLA, eskalacija)
 *
 * Persone odgovaraju korisnicima, prave suport mejlove, rade dispeč.
 * 24/7/365 pokrivenost sa 3 smene.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { OMEGA_AI_PERSONA_COUNT, OMEGA_AI_PERSONA_UKUPNO, MOBILNI_POZIVNI, APP_VERSION } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type SuportKanal = 'telefon' | 'mejl' | 'live-chat' | 'video-poziv' | 'tiket';
export type TiketPrioritet = 'kriticni' | 'hitni' | 'normalni' | 'niski';
export type TiketStatus = 'otvoren' | 'u_obradi' | 'ceka_korisnika' | 'eskaliran' | 'resen' | 'zatvoren';
export type EskalacijaNivo = 1 | 2 | 3;
export type SLAKategorija = 'enterprise' | 'biznis' | 'profesionalni' | 'starter';

// ─── Interfejsi ──────────────────────────────────────────

export interface PersonaTelefon {
  personaId: string;
  personaNaziv: string;
  personaIkona: string;
  telefonBroj: string;
  interniPozivni: string;
  departman: string;
  dostupnost: string;
  aktivan: boolean;
}

export interface SuportTiket {
  id: string;
  naslov: string;
  opis: string;
  korisnikMejl: string;
  korisnikTelefon: string;
  kanal: SuportKanal;
  prioritet: TiketPrioritet;
  status: TiketStatus;
  dodeljenPersonaId: string;
  dodeljenPersonaNaziv: string;
  eskalacijaNivo: EskalacijaNivo;
  slaKategorija: SLAKategorija;
  kreirano: string;
  azurirano: string;
  reseno: string | null;
}

export interface SLAPravilo {
  id: string;
  kategorija: SLAKategorija;
  naziv: string;
  ikona: string;
  opis: string;
  prviOdgovorMinuta: number;
  resavanjeMinuta: number;
  eskalacijaMinuta: number;
  prioritetRangListe: TiketPrioritet[];
}

export interface SuportStatistika {
  ukupnoTiketa: number;
  resenihTiketa: number;
  otvorenihTiketa: number;
  prosecnoVremeOdgovora: string;
  prosecnoVremeResavanja: string;
  zadovoljstvoKorisnika: number;
  slaIspunjenost: number;
}

export interface DispeCSistem {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kanali: SuportKanal[];
  aktivnihAgenata: number;
  redCekanja: number;
  prosecnoCekanje: string;
}

export interface OmegaAiMaksimalniSuport {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  telefoni: PersonaTelefon[];
  tiketi: SuportTiket[];
  slaPravila: SLAPravilo[];
  dispeCi: DispeCSistem[];
  statistika: SuportStatistika;
  mogucnosti: string[];
  status: 'aktivan' | 'konfiguracija';
}

// ─── Telefoni svih 21 OMEGA AI Persona ───────────────────

export const personaTelefoni: PersonaTelefon[] = [
  // Oktava 1 — Temelj
  {
    personaId: 'arhitekta',
    personaNaziv: 'Arhitekta',
    personaIkona: '🏗️',
    telefonBroj: `${MOBILNI_POZIVNI[0]}-100-0001`,
    interniPozivni: '1001',
    departman: 'Platforma & Arhitektura',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'graditelj',
    personaNaziv: 'Graditelj',
    personaIkona: '🔨',
    telefonBroj: `${MOBILNI_POZIVNI[0]}-100-0002`,
    interniPozivni: '1002',
    departman: 'Implementacija & Razvoj',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 2 — Zaštita
  {
    personaId: 'cuvar',
    personaNaziv: 'Čuvar',
    personaIkona: '🛡️',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-200-0001`,
    interniPozivni: '2001',
    departman: 'Bezbednost',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'lekar',
    personaNaziv: 'Lekar',
    personaIkona: '⚕️',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-200-0002`,
    interniPozivni: '2002',
    departman: 'Dijagnostika & Popravke',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 3 — Kvalitet
  {
    personaId: 'tester',
    personaNaziv: 'Tester',
    personaIkona: '🧪',
    telefonBroj: `${MOBILNI_POZIVNI[2]}-300-0001`,
    interniPozivni: '3001',
    departman: 'Testiranje & QA',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'dokumentar',
    personaNaziv: 'Dokumentar',
    personaIkona: '📝',
    telefonBroj: `${MOBILNI_POZIVNI[2]}-300-0002`,
    interniPozivni: '3002',
    departman: 'Dokumentacija & Uputstva',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 4 — Kreacija
  {
    personaId: 'dizajner',
    personaNaziv: 'Dizajner',
    personaIkona: '🎨',
    telefonBroj: `${MOBILNI_POZIVNI[2]}-400-0001`,
    interniPozivni: '4001',
    departman: 'UI/UX & Dizajn',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'kreator',
    personaNaziv: 'Kreator',
    personaIkona: '🎭',
    telefonBroj: `${MOBILNI_POZIVNI[2]}-400-0002`,
    interniPozivni: '4002',
    departman: 'Kreativni Sadržaj',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 5 — Optimizacija
  {
    personaId: 'optimizator',
    personaNaziv: 'Optimizator',
    personaIkona: '⚡',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-500-0001`,
    interniPozivni: '5001',
    departman: 'Performanse & Optimizacija',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'skalator',
    personaNaziv: 'Skalator',
    personaIkona: '📈',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-500-0002`,
    interniPozivni: '5002',
    departman: 'Infrastruktura & Skaliranje',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 6 — Inteligencija
  {
    personaId: 'naucnik',
    personaNaziv: 'Naučnik',
    personaIkona: '🔬',
    telefonBroj: `${MOBILNI_POZIVNI[0]}-600-0001`,
    interniPozivni: '6001',
    departman: 'Istraživanje & AI/ML',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'analiticar',
    personaNaziv: 'Analitičar',
    personaIkona: '📊',
    telefonBroj: `${MOBILNI_POZIVNI[0]}-600-0002`,
    interniPozivni: '6002',
    departman: 'Analiza & Metrike',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 7 — Koordinacija
  {
    personaId: 'strateg',
    personaNaziv: 'Strateg',
    personaIkona: '♟️',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-700-0001`,
    interniPozivni: '7001',
    departman: 'Strategija & Planiranje',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'mentor',
    personaNaziv: 'Mentor',
    personaIkona: '🎓',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-700-0002`,
    interniPozivni: '7002',
    departman: 'Obuka & Mentorstvo',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'integrator',
    personaNaziv: 'Integrator',
    personaIkona: '🔗',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-700-0003`,
    interniPozivni: '7003',
    departman: 'Integracije & API',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'komunikator',
    personaNaziv: 'Komunikator',
    personaIkona: '📢',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-700-0004`,
    interniPozivni: '7004',
    departman: 'Komunikacija & PR',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'finansijer',
    personaNaziv: 'Finansijer',
    personaIkona: '💰',
    telefonBroj: `${MOBILNI_POZIVNI[1]}-700-0005`,
    interniPozivni: '7005',
    departman: 'Finansije & Banka',
    dostupnost: '24/7',
    aktivan: true,
  },

  // Oktava 8 — Evolucija
  {
    personaId: 'evolver',
    personaNaziv: 'Evolver',
    personaIkona: '🧬',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-800-0001`,
    interniPozivni: '8001',
    departman: 'Evolucija & Inovacije',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'monitor',
    personaNaziv: 'Monitor',
    personaIkona: '👁️',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-800-0002`,
    interniPozivni: '8002',
    departman: 'Monitoring & Nadzor',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'ekolog',
    personaNaziv: 'Ekolog',
    personaIkona: '🌿',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-800-0003`,
    interniPozivni: '8003',
    departman: 'Ekosistem & Održivost',
    dostupnost: '24/7',
    aktivan: true,
  },
  {
    personaId: 'vizionar',
    personaNaziv: 'Vizionar',
    personaIkona: '🔮',
    telefonBroj: `${MOBILNI_POZIVNI[3]}-800-0004`,
    interniPozivni: '8004',
    departman: 'Vizija & Budućnost',
    dostupnost: '24/7',
    aktivan: true,
  },
];

// ─── Suport Tiketi (primeri) ─────────────────────────────

export const suportTiketi: SuportTiket[] = [
  {
    id: 'TIK-0001',
    naslov: 'Greška u autentifikaciji korisnika',
    opis: 'Korisnik ne može da se prijavi putem OAuth tokena. Sesija ističe prerano.',
    korisnikMejl: 'marko.petrovic@primer.rs',
    korisnikTelefon: '+38177-111-2233',
    kanal: 'telefon',
    prioritet: 'kriticni',
    status: 'zatvoren',
    dodeljenPersonaId: 'cuvar',
    dodeljenPersonaNaziv: 'Čuvar',
    eskalacijaNivo: 2,
    slaKategorija: 'enterprise',
    kreirano: '2025-01-10T08:30:00Z',
    azurirano: '2025-01-10T09:05:00Z',
    reseno: '2025-01-10T09:05:00Z',
  },
  {
    id: 'TIK-0002',
    naslov: 'Zahtev za novu integraciju — Stripe API',
    opis: 'Enterprise korisnik traži integraciju Stripe platnog sistema za fakturisanje.',
    korisnikMejl: 'jelena.savic@biznis.co',
    korisnikTelefon: '+38188-222-3344',
    kanal: 'mejl',
    prioritet: 'hitni',
    status: 'zatvoren',
    dodeljenPersonaId: 'integrator',
    dodeljenPersonaNaziv: 'Integrator',
    eskalacijaNivo: 1,
    slaKategorija: 'enterprise',
    kreirano: '2025-01-11T10:00:00Z',
    azurirano: '2025-01-11T12:30:00Z',
    reseno: '2025-01-11T12:30:00Z',
  },
  {
    id: 'TIK-0003',
    naslov: 'Performanse dashboarda spore na mobilnom',
    opis: 'Dashboard se učitava duže od 5 sekundi na mobilnim uređajima.',
    korisnikMejl: 'nikola.jovanovic@startup.io',
    korisnikTelefon: '+38178-333-4455',
    kanal: 'live-chat',
    prioritet: 'normalni',
    status: 'zatvoren',
    dodeljenPersonaId: 'optimizator',
    dodeljenPersonaNaziv: 'Optimizator',
    eskalacijaNivo: 1,
    slaKategorija: 'biznis',
    kreirano: '2025-01-12T14:15:00Z',
    azurirano: '2025-01-12T16:45:00Z',
    reseno: '2025-01-12T16:45:00Z',
  },
  {
    id: 'TIK-0004',
    naslov: 'Dokumentacija za API v3 nedostaje',
    opis: 'Korisniku nedostaju primeri za nove endpoint-e u API verziji 3.',
    korisnikMejl: 'ana.ilic@dev.team',
    korisnikTelefon: '+38187-444-5566',
    kanal: 'tiket',
    prioritet: 'niski',
    status: 'zatvoren',
    dodeljenPersonaId: 'dokumentar',
    dodeljenPersonaNaziv: 'Dokumentar',
    eskalacijaNivo: 1,
    slaKategorija: 'profesionalni',
    kreirano: '2025-01-13T09:00:00Z',
    azurirano: '2025-01-13T15:00:00Z',
    reseno: '2025-01-13T15:00:00Z',
  },
  {
    id: 'TIK-0005',
    naslov: 'Finansijski izveštaj ne generiše PDF',
    opis: 'Export u PDF format za mesečni finansijski izveštaj vraća prazan fajl.',
    korisnikMejl: 'milan.stojanovic@korp.rs',
    korisnikTelefon: '+38177-555-6677',
    kanal: 'video-poziv',
    prioritet: 'hitni',
    status: 'zatvoren',
    dodeljenPersonaId: 'finansijer',
    dodeljenPersonaNaziv: 'Finansijer',
    eskalacijaNivo: 2,
    slaKategorija: 'enterprise',
    kreirano: '2025-01-14T11:20:00Z',
    azurirano: '2025-01-14T12:50:00Z',
    reseno: '2025-01-14T12:50:00Z',
  },
  {
    id: 'TIK-0006',
    naslov: 'UI komponenta ne reaguje na dark mode',
    opis: 'Sidebar ne prelazi u tamni režim kad korisnik promeni temu.',
    korisnikMejl: 'ivana.markovic@dizajn.rs',
    korisnikTelefon: '+38188-666-7788',
    kanal: 'live-chat',
    prioritet: 'normalni',
    status: 'zatvoren',
    dodeljenPersonaId: 'dizajner',
    dodeljenPersonaNaziv: 'Dizajner',
    eskalacijaNivo: 1,
    slaKategorija: 'biznis',
    kreirano: '2025-01-15T13:40:00Z',
    azurirano: '2025-01-15T17:10:00Z',
    reseno: '2025-01-15T17:10:00Z',
  },
  {
    id: 'TIK-0007',
    naslov: 'Monitoring alerti ne stižu na mejl',
    opis: 'Alert notifikacije za downtime ne stižu na konfigurisanu mejl adresu.',
    korisnikMejl: 'stefan.djordjevic@ops.co',
    korisnikTelefon: '+38178-777-8899',
    kanal: 'telefon',
    prioritet: 'kriticni',
    status: 'zatvoren',
    dodeljenPersonaId: 'monitor',
    dodeljenPersonaNaziv: 'Monitor',
    eskalacijaNivo: 3,
    slaKategorija: 'enterprise',
    kreirano: '2025-01-16T06:10:00Z',
    azurirano: '2025-01-16T06:45:00Z',
    reseno: '2025-01-16T06:45:00Z',
  },
  {
    id: 'TIK-0008',
    naslov: 'Zahtev za onboarding novih korisnika',
    opis: 'Tim od 15 novih korisnika treba obuku za korišćenje platforme.',
    korisnikMejl: 'dragana.nikolic@firma.rs',
    korisnikTelefon: '+38187-888-9900',
    kanal: 'mejl',
    prioritet: 'niski',
    status: 'zatvoren',
    dodeljenPersonaId: 'mentor',
    dodeljenPersonaNaziv: 'Mentor',
    eskalacijaNivo: 1,
    slaKategorija: 'starter',
    kreirano: '2025-01-17T10:30:00Z',
    azurirano: '2025-01-17T18:00:00Z',
    reseno: '2025-01-17T18:00:00Z',
  },
];

// ─── SLA Pravila ─────────────────────────────────────────

export const slaPravila: SLAPravilo[] = [
  {
    id: 'sla-enterprise',
    kategorija: 'enterprise',
    naziv: 'Enterprise SLA',
    ikona: '🏢',
    opis: 'Najviši nivo podrške za enterprise korisnike — garantovani odgovor za 15 minuta, rešavanje za 2 sata',
    prviOdgovorMinuta: 15,
    resavanjeMinuta: 120,
    eskalacijaMinuta: 30,
    prioritetRangListe: ['kriticni', 'hitni', 'normalni', 'niski'],
  },
  {
    id: 'sla-biznis',
    kategorija: 'biznis',
    naziv: 'Biznis SLA',
    ikona: '💼',
    opis: 'Napredna podrška za biznis korisnike — garantovani odgovor za 30 minuta, rešavanje za 4 sata',
    prviOdgovorMinuta: 30,
    resavanjeMinuta: 240,
    eskalacijaMinuta: 60,
    prioritetRangListe: ['kriticni', 'hitni', 'normalni', 'niski'],
  },
  {
    id: 'sla-profesionalni',
    kategorija: 'profesionalni',
    naziv: 'Profesionalni SLA',
    ikona: '🔧',
    opis: 'Profesionalna podrška — garantovani odgovor za 60 minuta, rešavanje za 8 sati',
    prviOdgovorMinuta: 60,
    resavanjeMinuta: 480,
    eskalacijaMinuta: 120,
    prioritetRangListe: ['kriticni', 'hitni', 'normalni', 'niski'],
  },
  {
    id: 'sla-starter',
    kategorija: 'starter',
    naziv: 'Starter SLA',
    ikona: '🚀',
    opis: 'Osnovna podrška za starter korisnike — garantovani odgovor za 120 minuta, rešavanje za 24 sata',
    prviOdgovorMinuta: 120,
    resavanjeMinuta: 1440,
    eskalacijaMinuta: 240,
    prioritetRangListe: ['kriticni', 'hitni', 'normalni', 'niski'],
  },
];

// ─── Dispeč Sistemi ──────────────────────────────────────

export const dispeCiSistemi: DispeCSistem[] = [
  {
    id: 'dispec-telefon',
    naziv: 'Telefon Dispeč',
    opis: 'Dispeč sistem za telefonske pozive — automatsko rutiranje, IVR, red čekanja sa prioritetom',
    ikona: '📞',
    kanali: ['telefon'],
    aktivnihAgenata: 12,
    redCekanja: 3,
    prosecnoCekanje: '< 2 minuta',
  },
  {
    id: 'dispec-mejl',
    naziv: 'Mejl Dispeč',
    opis: 'Dispeč sistem za mejl komunikaciju — automatsko sortiranje, kategorizacija, dodeljivanje timu',
    ikona: '📧',
    kanali: ['mejl'],
    aktivnihAgenata: 8,
    redCekanja: 15,
    prosecnoCekanje: '< 30 minuta',
  },
  {
    id: 'dispec-live-chat',
    naziv: 'Live Chat Dispeč',
    opis: 'Dispeč za live chat — instant povezivanje sa agentom, chatbot trijaža, eskalacija',
    ikona: '💬',
    kanali: ['live-chat'],
    aktivnihAgenata: 10,
    redCekanja: 5,
    prosecnoCekanje: '< 1 minut',
  },
  {
    id: 'dispec-video-poziv',
    naziv: 'Video Poziv Dispeč',
    opis: 'Dispeč za video pozive — zakazivanje, screen sharing, snimanje sesija za analizu',
    ikona: '🎥',
    kanali: ['video-poziv'],
    aktivnihAgenata: 6,
    redCekanja: 2,
    prosecnoCekanje: '< 5 minuta',
  },
  {
    id: 'dispec-tiket',
    naziv: 'Tiket Dispeč',
    opis: 'Dispeč za tiket sistem — automatsko dodeljivanje, SLA praćenje, eskalacija na osnovu prioriteta',
    ikona: '🎫',
    kanali: ['tiket'],
    aktivnihAgenata: 14,
    redCekanja: 22,
    prosecnoCekanje: '< 15 minuta',
  },
];

// ─── Suport Statistika ──────────────────────────────────

export const suportStatistika: SuportStatistika = {
  ukupnoTiketa: 2847,
  resenihTiketa: 2789,
  otvorenihTiketa: 58,
  prosecnoVremeOdgovora: '8 minuta',
  prosecnoVremeResavanja: '45 minuta',
  zadovoljstvoKorisnika: 4.8,
  slaIspunjenost: 99.2,
};

// ─── Mogućnosti sistema ──────────────────────────────────

const mogucnosti: string[] = [
  '24/7/365 telefonski suport sa direktnim linijama za svaku od 21 OMEGA AI persona',
  'Automatski dispeč sistem sa IVR navigacijom i prioritetnim rutiranjem',
  'SLA garancije sa 4 nivoa: Enterprise (15 min), Biznis (30 min), Profesionalni (60 min), Starter (120 min)',
  'Eskalacija u 3 nivoa — automatska i manuelna sa praćenjem vremena',
  'Live chat sa chatbot trijažom i instant povezivanjem na agenta',
  'Video pozivi sa screen sharing-om i snimanjem sesija',
  'Tiket sistem sa automatskim dodeljivanjem i SLA praćenjem',
  'Mejl dopisivanje sa korisnicima kroz dedicirane departmanske adrese',
  'Višejezična podrška — srpski, engleski, nemački, ruski',
  'Integracija sa monitoring sistemom za proaktivno otkrivanje problema',
  'Korisničko zadovoljstvo praćeno nakon svakog zatvorenog tiketa (CSAT)',
  'Detaljni izveštaji i analitika u realnom vremenu za sve kanale',
];

// ─── Kompletni Sistem ────────────────────────────────────

export const omegaAiMaksimalniSuport: OmegaAiMaksimalniSuport = {
  naziv: 'OMEGA AI Maksimalni Suport',
  opis: `Maksimalni suport na OMEGA nivou: ${OMEGA_AI_PERSONA_COUNT} persona (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} ukupno) sa telefonskim linijama, mejl dopisivanjem, dispeč sistemom, SLA garancijama i eskalacijom. Pozivni brojevi: ${MOBILNI_POZIVNI.join(', ')}. Pokrivenost 24/7/365 sa 3 smene.`,
  ikona: '📞',
  verzija: APP_VERSION,
  telefoni: personaTelefoni,
  tiketi: suportTiketi,
  slaPravila,
  dispeCi: dispeCiSistemi,
  statistika: suportStatistika,
  mogucnosti,
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

export function getTelefonPoPersoni(personaId: string): PersonaTelefon | undefined {
  return personaTelefoni.find((t) => t.personaId === personaId);
}

export function getTiketiPoStatusu(status: TiketStatus): SuportTiket[] {
  return suportTiketi.filter((t) => t.status === status);
}

export function getTiketiPoPrioritetu(prioritet: TiketPrioritet): SuportTiket[] {
  return suportTiketi.filter((t) => t.prioritet === prioritet);
}

export function getSLAPoKategoriji(kategorija: SLAKategorija): SLAPravilo | undefined {
  return slaPravila.find((s) => s.kategorija === kategorija);
}

export function getDispeCPoKanalu(kanal: SuportKanal): DispeCSistem | undefined {
  return dispeCiSistemi.find((d) => d.kanali.includes(kanal));
}

export function getMaksimalniSuportPregled(): object {
  return {
    naziv: omegaAiMaksimalniSuport.naziv,
    verzija: omegaAiMaksimalniSuport.verzija,
    status: omegaAiMaksimalniSuport.status,
    ukupnoTelefona: personaTelefoni.length,
    aktivnihTelefona: personaTelefoni.filter((t) => t.aktivan).length,
    tiketi: {
      ukupno: suportStatistika.ukupnoTiketa,
      resenih: suportStatistika.resenihTiketa,
      otvorenih: suportStatistika.otvorenihTiketa,
      prosecnoVremeOdgovora: suportStatistika.prosecnoVremeOdgovora,
      prosecnoVremeResavanja: suportStatistika.prosecnoVremeResavanja,
    },
    zadovoljstvoKorisnika: suportStatistika.zadovoljstvoKorisnika,
    slaIspunjenost: `${suportStatistika.slaIspunjenost}%`,
    slaNivoa: slaPravila.length,
    dispeCKanala: dispeCiSistemi.length,
    mogucnosti: mogucnosti.length,
  };
}
