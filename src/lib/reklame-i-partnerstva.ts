/**
 * 📢 Reklame i Partnerstva — AI IQ SUPER PLATFORMA
 *
 * Reklamni sistem za skaliranje i monetizaciju Digitalne Industrije.
 * Partnerstva iz svih branši — tehnologija, finansije, telekomunikacije,
 * edukacija, zdravstvo, gaming, mediji, e-commerce, i još mnogo toga.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA, OMEGA_AI_PERSONA_UKUPNO, OMEGA_AI_PERSONA_COUNT, TOTAL_PAGES, TOTAL_API_ROUTES } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type ReklamaTip =
  | 'baner'
  | 'video'
  | 'tekstualna'
  | 'interaktivna'
  | 'sponzorisana'
  | 'nativna'
  | 'popup'
  | 'email';

export type ReklamaStatus = 'aktivna' | 'u_pripremi' | 'planirana' | 'zavrsena';

export type PartnerstvoTip =
  | 'tehnoloski'
  | 'finansijski'
  | 'telekomunikacioni'
  | 'edukativni'
  | 'zdravstveni'
  | 'gaming'
  | 'medijski'
  | 'e-commerce'
  | 'industrijski'
  | 'kreativni';

export type PartnerstvoStatus = 'aktivno' | 'u_pregovorima' | 'planirano' | 'potpisano';

export type MonetizacijaKanal =
  | 'reklame'
  | 'pretplate'
  | 'partnerstva'
  | 'affiliate'
  | 'sponzorstva'
  | 'licenciranje'
  | 'konsalting'
  | 'api-pristup';

export interface Reklama {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: ReklamaTip;
  status: ReklamaStatus;
  ciljnaPublika: string;
  platforma: string;
  poruka: string;
  cta: string;
  ocekivaniDoseg: string;
}

export interface Partnerstvo {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  bransa: PartnerstvoTip;
  status: PartnerstvoStatus;
  benefiti: string[];
  kontakt: string;
}

export interface MonetizacijaKanalInfo {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kanal: MonetizacijaKanal;
  mesecniPrihod: string;
  status: ReklamaStatus;
}

// ─── Reklame ─────────────────────────────────────────────

export const reklame: Reklama[] = [
  {
    id: 'reklama-spajapro-ai',
    naziv: 'SpajaPro AI — Zamena za ChatGPT',
    opis: 'Reklamna kampanja za SpajaPro engine verzije 6-15 — domaći AI koji zamenjuje ChatGPT sa 10 verzija i punom Prompt podrškom.',
    ikona: '🤖',
    tip: 'video',
    status: 'aktivna',
    ciljnaPublika: 'Programeri, IT kompanije, tech startupovi',
    platforma: 'YouTube, LinkedIn, Twitter/X, TikTok',
    poruka: `SpajaPro 6-15 — AI engine sa ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} persona. Zameni ChatGPT sa domaćim AI-jem. Besplatno probaj!`,
    cta: 'Probaj SpajaPro besplatno →',
    ocekivaniDoseg: '500.000+ pregleda mesečno',
  },
  {
    id: 'reklama-digitalna-industrija',
    naziv: 'Digitalna Industrija — Kompanija SPAJA',
    opis: 'Glavna korporativna reklama za Digitalnu Industriju — sve platforme, proizvodi i servisi na jednom mestu.',
    ikona: '🏭',
    tip: 'baner',
    status: 'aktivna',
    ciljnaPublika: 'Biznisi, korporacije, investitori',
    platforma: 'Google Ads, Facebook, Instagram, LinkedIn',
    poruka: `${KOMPANIJA} — Digitalna Industrija sa ${TOTAL_PAGES} stranica, ${TOTAL_API_ROUTES} API-ja i ${OMEGA_AI_PERSONA_COUNT} AI persona. Vaša digitalna transformacija počinje ovde.`,
    cta: 'Uđi u Digitalnu Industriju →',
    ocekivaniDoseg: '1.000.000+ impresija mesečno',
  },
  {
    id: 'reklama-gaming-platforma',
    naziv: 'IO/OPENUI/AO Gaming — 95 igrica',
    opis: 'Reklamna kampanja za gaming platformu sa 95 igrica u 18 kategorija — Dota 1350, TRANSFORMERS, Poker i još.',
    ikona: '🎮',
    tip: 'video',
    status: 'aktivna',
    ciljnaPublika: 'Gameri, mladi 15-35, gaming zajednice',
    platforma: 'Twitch, YouTube Gaming, TikTok, Discord Ads',
    poruka: '95 igrica, 18 kategorija — Dota 1350, TRANSFORMERS, BUBLI BABLI, Poker, Sabljarka! Igraj besplatno na SPAJA platformi!',
    cta: 'Igraj odmah besplatno →',
    ocekivaniDoseg: '2.000.000+ pregleda mesečno',
  },
  {
    id: 'reklama-banka-menjacnica',
    naziv: 'SPAJA Banka & Menjačnica',
    opis: 'Finansijska reklama za SPAJA Banku i Menjačnicu — digitalno bankarstvo, kripto, transferi, AI savetnik.',
    ikona: '🏦',
    tip: 'nativna',
    status: 'aktivna',
    ciljnaPublika: 'Korisnici finansijskih usluga, kripto trejderi, biznisi',
    platforma: 'Google Ads, Bloomberg, CoinDesk, Financial Times',
    poruka: 'SPAJA Banka — digitalno bankarstvo sa AI savetnikom. Kripto menjačnica sa real-time kursevima. Sigurno, brzo, pametno.',
    cta: 'Otvori račun besplatno →',
    ocekivaniDoseg: '300.000+ impresija mesečno',
  },
  {
    id: 'reklama-mobilna-mreza',
    naziv: 'SPAJA Mobilna Mreža — Vaš signal',
    opis: 'Reklamna kampanja za SPAJA Mobilnu Mrežu sa 4 centrale i Proksi integracijom.',
    ikona: '📱',
    tip: 'interaktivna',
    status: 'u_pripremi',
    ciljnaPublika: 'Svi korisnici mobilnih telefona, biznisi',
    platforma: 'TV, Radio, Bilbordi, Online',
    poruka: 'SPAJA Mobilna — sopstvena mobilna mreža sa 4 centrale. Pozivni: +38177, +38188, +38178, +38187. Neograničen internet i pozivi!',
    cta: 'Pređi na SPAJA Mobilnu →',
    ocekivaniDoseg: '5.000.000+ impresija mesečno',
  },
  {
    id: 'reklama-digitalni-tv',
    naziv: 'SPAJA Digitalni Televizor — 12 kanala',
    opis: 'Reklama za SPAJA Digitalni Televizor sa 12 kanala u browseru — zabava, sport, vesti, muzika.',
    ikona: '📺',
    tip: 'video',
    status: 'aktivna',
    ciljnaPublika: 'Svi uzrasti, ljubitelji TV sadržaja',
    platforma: 'YouTube, Facebook Watch, Instagram Reels',
    poruka: 'SPAJA TV — 12 kanala u tvom browseru! Sport, zabava, vesti, muzika, edukacija. Besplatno, bez kabla!',
    cta: 'Gledaj SPAJA TV besplatno →',
    ocekivaniDoseg: '800.000+ pregleda mesečno',
  },
  {
    id: 'reklama-omega-ai-suport',
    naziv: 'OMEGA AI Suport — 21 persona za tebe',
    opis: 'Reklama za OMEGA AI Suport sistem sa 21 specijalizovanom personom za korisničku podršku.',
    ikona: '📞',
    tip: 'tekstualna',
    status: 'aktivna',
    ciljnaPublika: 'Biznis korisnici, SaaS kompanije',
    platforma: 'LinkedIn, Google Ads, Email Marketing',
    poruka: `OMEGA AI Suport — ${OMEGA_AI_PERSONA_COUNT} AI persona spremno da ti pomogne 24/7. Tiketing, chat, telefon, email. SLA 99.2%.`,
    cta: 'Kontaktiraj AI Suport →',
    ocekivaniDoseg: '200.000+ impresija mesečno',
  },
  {
    id: 'reklama-proksi-wifi',
    naziv: 'SPAJA Proksi & WiFi Antena',
    opis: 'Reklama za Proksi mrežu i WiFi antenu sa 10²²⁸ TB kapaciteta — globalna povezanost.',
    ikona: '📡',
    tip: 'baner',
    status: 'u_pripremi',
    ciljnaPublika: 'Tehničke kompanije, ISP-ovi, datacentri',
    platforma: 'TechCrunch, Wired, Hacker News, Reddit',
    poruka: 'SPAJA Proksi — 10²²⁸ TB kapaciteta. WiFi antena sa hipsoneuričnim signalom. Globalna mreža sa 5 čvorova. Budućnost konektivnosti.',
    cta: 'Saznaj više o Proksi mreži →',
    ocekivaniDoseg: '150.000+ impresija mesečno',
  },
  {
    id: 'reklama-render-medija',
    naziv: 'SPAJA Render Medija — AI kreacija',
    opis: 'Reklama za Render Medija sistem — renderovanje slika i video sadržaja sa AI filterima.',
    ikona: '🎬',
    tip: 'video',
    status: 'planirana',
    ciljnaPublika: 'Kreatori sadržaja, influenseri, agencije',
    platforma: 'Instagram, TikTok, YouTube, Pinterest',
    poruka: 'SPAJA Render Medija — kreiraj slike i video sa AI-jem. Filteri, efekti, automatsko renderovanje. Tvoja kreativnost × AI = magija.',
    cta: 'Kreiraj sa AI-jem →',
    ocekivaniDoseg: '1.500.000+ pregleda mesečno',
  },
  {
    id: 'reklama-digitalni-kompjuter',
    naziv: 'SPAJA Digitalni Kompjuter u browseru',
    opis: 'Reklama za virtualni kompjuter u browseru — GPU 8.700.000, RAM 276.000 GB.',
    ikona: '🖥️',
    tip: 'interaktivna',
    status: 'planirana',
    ciljnaPublika: 'Programeri, dizajneri, inženjeri, naučnici',
    platforma: 'GitHub Sponsors, Stack Overflow, Dev.to',
    poruka: 'SPAJA Digitalni Kompjuter — virtualni PC sa GPU 8.700.000 i RAM 276.000 GB. U tvom browseru. Bez instalacije.',
    cta: 'Pokreni Kompjuter →',
    ocekivaniDoseg: '250.000+ impresija mesečno',
  },
  {
    id: 'reklama-brouvzer',
    naziv: 'SPAJA Digitalni Brouvzer — Novi Internet',
    opis: 'Reklama za SPAJA sopstveni web pretraživač sa vlastitim render motorom.',
    ikona: '🌐',
    tip: 'video',
    status: 'planirana',
    ciljnaPublika: 'Svi internet korisnici, tech entuzijasti',
    platforma: 'YouTube, Product Hunt, Hacker News, Reddit',
    poruka: 'SPAJA Brouvzer — sopstveni render motor, providni frontend, maksimalna privatnost. Budućnost pregledanja interneta.',
    cta: 'Preuzmi SPAJA Brouvzer →',
    ocekivaniDoseg: '3.000.000+ pregleda mesečno',
  },
  {
    id: 'reklama-blog-faq',
    naziv: 'SPAJA Blog & FAQ — Znanje za sve',
    opis: 'Content marketing reklama za blog i FAQ sekciju sa člancima, vodičima i odgovorima.',
    ikona: '📝',
    tip: 'nativna',
    status: 'aktivna',
    ciljnaPublika: 'Svi koji traže znanje, edukatori, studenti',
    platforma: 'Google Search, Medium, Dev.to, Hashnode',
    poruka: 'SPAJA Blog — članci, vodiči, FAQ. Nauči sve o AI, programiranju, Digitalnoj Industriji. Besplatno znanje!',
    cta: 'Čitaj SPAJA Blog →',
    ocekivaniDoseg: '400.000+ poseta mesečno',
  },
];

// ─── Partnerstva ─────────────────────────────────────────

export const partnerstva: Partnerstvo[] = [
  {
    id: 'partner-google',
    naziv: 'Google Cloud & AI Partnership',
    opis: 'Strateško partnerstvo sa Google-om za cloud infrastrukturu, AI/ML servise, i YouTube reklamiranje.',
    ikona: '🔵',
    bransa: 'tehnoloski',
    status: 'u_pregovorima',
    benefiti: [
      'Google Cloud krediti za infrastrukturu',
      'YouTube Ads partnerski program',
      'Google AI/ML API integracija',
      'Google Workspace za tim',
      'Priority podrška od Google tima',
    ],
    kontakt: 'partnerstva@kompanija-spaja.com',
  },
  {
    id: 'partner-microsoft',
    naziv: 'Microsoft Azure & GitHub Partnership',
    opis: 'Partnerstvo sa Microsoft-om za Azure hosting, GitHub Copilot integraciju, i reklamni doseg.',
    ikona: '🟦',
    bransa: 'tehnoloski',
    status: 'u_pregovorima',
    benefiti: [
      'Azure cloud krediti',
      'GitHub Copilot za ceo tim',
      'LinkedIn Ads partnerski program',
      'Microsoft 365 integracija',
      'VS Code ekstenzije za SpajaPro',
    ],
    kontakt: 'partnerstva@kompanija-spaja.com',
  },
  {
    id: 'partner-vercel',
    naziv: 'Vercel Pro Partnership',
    opis: 'Vercel kao deploy partner — sve platforme se hostuju na Vercel-u sa prioritetnim deploy-om.',
    ikona: '▲',
    bransa: 'tehnoloski',
    status: 'potpisano',
    benefiti: [
      'Vercel Pro plan za sve projekte',
      'Prioritetni deploy i edge funkcije',
      'Custom domeni za svaku platformu',
      'Vercel Analytics integracija',
      'Ko-marketing kampanje',
    ],
    kontakt: 'partnerstva@kompanija-spaja.com',
  },
  {
    id: 'partner-stripe',
    naziv: 'Stripe Payments Partnership',
    opis: 'Stripe kao platni procesor — integracija za pretplate, plaćanja i monetizaciju celokupne platforme.',
    ikona: '💳',
    bransa: 'finansijski',
    status: 'potpisano',
    benefiti: [
      'Snižene procesorske provizije',
      'Stripe Atlas za kompaniju',
      'Stripe Billing za pretplate',
      'Stripe Connect za marketplace',
      'Priority support od Stripe tima',
    ],
    kontakt: 'finansije@kompanija-spaja.com',
  },
  {
    id: 'partner-coinbase',
    naziv: 'Coinbase & Kripto Partnerstvo',
    opis: 'Partnerstvo za kripto menjačnicu, wallet integraciju i blockchain reklamiranje.',
    ikona: '🪙',
    bransa: 'finansijski',
    status: 'u_pregovorima',
    benefiti: [
      'Coinbase Commerce integracija',
      'Kripto wallet za korisnike',
      'Kripto-to-fiat konverzija',
      'Blockchain edukativni sadržaj',
      'Ko-brendirane kampanje',
    ],
    kontakt: 'finansije@kompanija-spaja.com',
  },
  {
    id: 'partner-telekom',
    naziv: 'Telekomunikacioni Partneri',
    opis: 'Partnerstva sa telekomunikacionim operaterima za SPAJA Mobilnu Mrežu — roaming, infrastruktura.',
    ikona: '📡',
    bransa: 'telekomunikacioni',
    status: 'planirano',
    benefiti: [
      'Deljenje infrastrukture',
      'Roaming ugovori',
      'Bundled ponude za korisnike',
      'Ko-brendirane SIM kartice',
      'Zajednički marketing',
    ],
    kontakt: 'mobilna@kompanija-spaja.com',
  },
  {
    id: 'partner-univerziteti',
    naziv: 'Univerzitetski & Edukativni Partneri',
    opis: 'Partnerstva sa univerzitetima za edukaciju, istraživanje i studentske programe oko AI/ML.',
    ikona: '🎓',
    bransa: 'edukativni',
    status: 'u_pregovorima',
    benefiti: [
      'Besplatan pristup za studente',
      'AI/ML kursevi na platformi',
      'Istraživačka saradnja',
      'Studentski hakaton programi',
      'Certifikacioni programi',
    ],
    kontakt: 'edukacija@kompanija-spaja.com',
  },
  {
    id: 'partner-zdravstvo',
    naziv: 'Zdravstveni AI Partneri',
    opis: 'Partnerstva sa zdravstvenim ustanovama za AI dijagnostiku, telemedicinu i health-tech.',
    ikona: '🏥',
    bransa: 'zdravstveni',
    status: 'planirano',
    benefiti: [
      'AI dijagnostički alati',
      'Telemedicina platforma',
      'Zdravstveni chatbot sa OMEGA AI',
      'Medicinski podaci i analitika',
      'Ko-razvoj health-tech proizvoda',
    ],
    kontakt: 'zdravstvo@kompanija-spaja.com',
  },
  {
    id: 'partner-gaming-studiji',
    naziv: 'Gaming Studiji & Esport',
    opis: 'Partnerstva sa gaming studijima i esport organizacijama za gaming platformu sa 95 igrica.',
    ikona: '🎮',
    bransa: 'gaming',
    status: 'u_pregovorima',
    benefiti: [
      'Distribucija igrica na platformi',
      'Esport turniri i lige',
      'In-game reklamiranje',
      'Cross-promotion kampanje',
      'Zajedničko razvijanje igrica',
    ],
    kontakt: 'gaming@kompanija-spaja.com',
  },
  {
    id: 'partner-medijske-kuce',
    naziv: 'Medijske Kuće & Influenseri',
    opis: 'Partnerstva sa medijskim kućama, novinarima i influenserima za širenje dosega.',
    ikona: '📰',
    bransa: 'medijski',
    status: 'u_pregovorima',
    benefiti: [
      'PR članci i recenzije',
      'Influenser marketing kampanje',
      'Podcast sponzorstva',
      'Video recenzije proizvoda',
      'Ekskluzivni intervjui sa osnivačem',
    ],
    kontakt: 'mediji@kompanija-spaja.com',
  },
  {
    id: 'partner-ecommerce',
    naziv: 'E-Commerce & Marketplace Partneri',
    opis: 'Partnerstva sa e-commerce platformama za prodaju digitalnih proizvoda i servisa.',
    ikona: '🛒',
    bransa: 'e-commerce',
    status: 'planirano',
    benefiti: [
      'Marketplace za digitalne proizvode',
      'API integracija sa shopovima',
      'Affiliate programi',
      'Cross-selling mogućnosti',
      'Zajedničke kampanje i popusti',
    ],
    kontakt: 'ecommerce@kompanija-spaja.com',
  },
  {
    id: 'partner-industrija-40',
    naziv: 'Industrija 4.0 & IoT Partneri',
    opis: 'Partnerstva za IoT, pametne fabrike i industrijsku automatizaciju sa OMEGA AI.',
    ikona: '🏭',
    bransa: 'industrijski',
    status: 'planirano',
    benefiti: [
      'IoT senzor integracija',
      'OMEGA AI za industrijsku automatizaciju',
      'Prediktivno održavanje',
      'Digital twin simulacije',
      'Smart factory rešenja',
    ],
    kontakt: 'industrija@kompanija-spaja.com',
  },
  {
    id: 'partner-kreativne-agencije',
    naziv: 'Kreativne & Marketing Agencije',
    opis: 'Partnerstva sa kreativnim agencijama za dizajn reklama, branding i marketing kampanje.',
    ikona: '🎨',
    bransa: 'kreativni',
    status: 'u_pregovorima',
    benefiti: [
      'Profesionalni dizajn reklama',
      'Video produkcija kampanja',
      'Social media menadžment',
      'Branding i vizuelni identitet',
      'Performance marketing',
    ],
    kontakt: 'marketing@kompanija-spaja.com',
  },
  {
    id: 'partner-aws',
    naziv: 'Amazon Web Services (AWS)',
    opis: 'Partnerstvo sa AWS-om za cloud kompjuting, ML servise i globalni doseg.',
    ikona: '☁️',
    bransa: 'tehnoloski',
    status: 'planirano',
    benefiti: [
      'AWS Activate krediti za startupove',
      'SageMaker za ML modele',
      'CloudFront CDN za globalni doseg',
      'AWS Marketplace listing',
      'Tehnička podrška od AWS-a',
    ],
    kontakt: 'partnerstva@kompanija-spaja.com',
  },
  {
    id: 'partner-discord',
    naziv: 'Discord Community Partnership',
    opis: 'Partnerstvo sa Discord-om za gaming zajednicu, bot integraciju i community building.',
    ikona: '💬',
    bransa: 'gaming',
    status: 'u_pregovorima',
    benefiti: [
      'Verifikovani server status',
      'Discord Bot sa OMEGA AI',
      'Server boosting za zajednicu',
      'Ekskluzivni kanali za korisnike',
      'Community events i giveaways',
    ],
    kontakt: 'zajednica@kompanija-spaja.com',
  },
];

// ─── Monetizacija ────────────────────────────────────────

export const monetizacijaKanali: MonetizacijaKanalInfo[] = [
  {
    id: 'monetizacija-reklame',
    naziv: 'Reklamni Prihodi',
    opis: 'Prihodi od baner reklama, video reklama, nativnih reklama i sponzorisanog sadržaja na platformi.',
    ikona: '📢',
    kanal: 'reklame',
    mesecniPrihod: 'Ciljano: €50.000+',
    status: 'aktivna',
  },
  {
    id: 'monetizacija-pretplate',
    naziv: 'SpajaPro Pretplate',
    opis: 'Mesečne i godišnje pretplate na SpajaPro planove — Basic, Pro, Enterprise, VIP.',
    ikona: '⭐',
    kanal: 'pretplate',
    mesecniPrihod: 'Ciljano: €100.000+',
    status: 'aktivna',
  },
  {
    id: 'monetizacija-partnerstva',
    naziv: 'Partnerski Prihodi',
    opis: 'Prihodi od strateških partnerstava — ko-marketing, revenue sharing, referral programi.',
    ikona: '🤝',
    kanal: 'partnerstva',
    mesecniPrihod: 'Ciljano: €30.000+',
    status: 'u_pripremi',
  },
  {
    id: 'monetizacija-affiliate',
    naziv: 'Affiliate Program',
    opis: 'Affiliate prihodi od preporuka korisnika — provizija za svaku registraciju i pretplatu.',
    ikona: '🔗',
    kanal: 'affiliate',
    mesecniPrihod: 'Ciljano: €20.000+',
    status: 'u_pripremi',
  },
  {
    id: 'monetizacija-sponzorstva',
    naziv: 'Sponzorstva & Brending',
    opis: 'Prihodi od sponzorstva na gaming turnirima, eventima, blog članicima i podcast epizodama.',
    ikona: '🏆',
    kanal: 'sponzorstva',
    mesecniPrihod: 'Ciljano: €15.000+',
    status: 'planirana',
  },
  {
    id: 'monetizacija-licenciranje',
    naziv: 'SpajaPro Licenciranje',
    opis: 'Licenciranje SpajaPro engine-a drugim kompanijama — OEM, white-label, enterprise licence.',
    ikona: '📜',
    kanal: 'licenciranje',
    mesecniPrihod: 'Ciljano: €200.000+',
    status: 'planirana',
  },
  {
    id: 'monetizacija-konsalting',
    naziv: 'AI Konsalting Usluge',
    opis: 'Konsalting usluge za implementaciju AI rešenja, digitalne transformacije i OMEGA AI integracije.',
    ikona: '💼',
    kanal: 'konsalting',
    mesecniPrihod: 'Ciljano: €40.000+',
    status: 'planirana',
  },
  {
    id: 'monetizacija-api',
    naziv: 'API Pristup & Pay-per-Use',
    opis: `Plaćeni pristup SpajaPro API-ju za eksterne developere — ${TOTAL_API_ROUTES} endpointa na raspolaganju.`,
    ikona: '🔌',
    kanal: 'api-pristup',
    mesecniPrihod: 'Ciljano: €25.000+',
    status: 'u_pripremi',
  },
];

// ─── Funkcije ────────────────────────────────────────────

export function getReklameMetrike() {
  const aktivne = reklame.filter((r) => r.status === 'aktivna').length;
  const uPripremi = reklame.filter((r) => r.status === 'u_pripremi').length;
  const planirane = reklame.filter((r) => r.status === 'planirana').length;

  return {
    ukupnoReklama: reklame.length,
    aktivnihReklama: aktivne,
    uPripremiReklama: uPripremi,
    planiranihReklama: planirane,
    ukupnoPartnerstava: partnerstva.length,
    aktivnihPartnerstava: partnerstva.filter((p) => p.status === 'potpisano').length,
    uPregovorima: partnerstva.filter((p) => p.status === 'u_pregovorima').length,
    planiranihPartnerstava: partnerstva.filter((p) => p.status === 'planirano').length,
    monetizacijaKanala: monetizacijaKanali.length,
    aktivnihKanala: monetizacijaKanali.filter((m) => m.status === 'aktivna').length,
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
  };
}

export function getPartnerstvaPoBransi() {
  const branse = new Map<PartnerstvoTip, Partnerstvo[]>();
  for (const p of partnerstva) {
    const lista = branse.get(p.bransa) ?? [];
    lista.push(p);
    branse.set(p.bransa, lista);
  }
  return branse;
}

export function getReklameSummary() {
  const metrike = getReklameMetrike();
  return {
    ukupnoReklama: metrike.ukupnoReklama,
    ukupnoPartnerstava: metrike.ukupnoPartnerstava,
    ukupnoKanala: metrike.monetizacijaKanala,
    status: `${metrike.aktivnihReklama} aktivnih, ${metrike.uPripremiReklama} u pripremi, ${metrike.planiranihReklama} planiranih`,
    partnerstvaStatus: `${metrike.aktivnihPartnerstava} potpisanih, ${metrike.uPregovorima} u pregovorima, ${metrike.planiranihPartnerstava} planiranih`,
    monetizacijaStatus: `${metrike.aktivnihKanala} aktivnih od ${metrike.monetizacijaKanala} kanala`,
  };
}
