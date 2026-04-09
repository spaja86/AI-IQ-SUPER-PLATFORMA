/**
 * 🔧 SPAJA Generator za Endžine — Engine Generator za AI IQ SUPER PLATFORMA
 *
 * SPAJA Generator za Endžine prevlači engine-e (endžine) preko celog
 * repozitorijuma AI-IQ-SUPER-PLATFORMA i svih entiteta u njemu.
 *
 * Generator je engine koji generiše, primenjuje i optimizuje ostale
 * engine-e (SpajaPro, OMEGA AI, Proksi, Mobilna, itd.) u celom ekosistemu.
 *
 * Link: https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de
 */

// ─── Tipovi ──────────────────────────────────────────────

export type EngineStatus = 'aktivan' | 'generisanje' | 'optimizacija' | 'priprema' | 'planiran';
export type EngineTip = 'core' | 'ai' | 'mreza' | 'finansije' | 'deploy' | 'gaming' | 'komunikacija' | 'bezbednost' | 'repo-engine';

export interface GenerisaniEngine {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: EngineTip;
  status: EngineStatus;
  verzija: string;
  ciljniModul: string;
  mogucnosti: string[];
  generisanDatum: string;
  optimizacija: number; // procenat optimizacije 0-100
}

export interface GeneratorKonfiguracija {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  parametri: string[];
  ciljniRepozitorijum: string;
  aktivna: boolean;
}

export interface GeneratorStatistika {
  ukupnoEngina: number;
  aktivnihEngina: number;
  uOptimizaciji: number;
  prosecnaOptimizacija: number;
  pokrivenostRepozitorijuma: number; // procenat
}

export interface SpajaGeneratorEngine {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  engini: GenerisaniEngine[];
  konfiguracije: GeneratorKonfiguracija[];
  statistika: GeneratorStatistika;
}

// ─── Generisani Engine-i ─────────────────────────────────

export const generisaniEngini: GenerisaniEngine[] = [
  {
    id: 'engine-spajapro-core',
    naziv: 'SpajaPro Core Engine',
    opis: 'Jezgro SpajaPro engine-a generisano od strane SPAJA Generatora — osnova za sve AI operacije u ekosistemu',
    ikona: '🌟',
    tip: 'ai',
    status: 'aktivan',
    verzija: '15.0.0',
    ciljniModul: 'src/lib/spaja-pro.ts',
    mogucnosti: ['Prompt obrada', 'Multi-model AI', 'Univerzalni Prompt', 'Fine-tuning', 'Token optimizacija'],
    generisanDatum: '2024-01-15',
    optimizacija: 95,
  },
  {
    id: 'engine-omega-ai',
    naziv: 'OMEGA AI Dispatch Engine',
    opis: 'OMEGA AI dispatch engine generisan za oktavnu orkestraciju 21 persone u 8 oktava',
    ikona: '🧠',
    tip: 'ai',
    status: 'aktivan',
    verzija: '8.0.0',
    ciljniModul: 'src/lib/omega-ai-dispatch.ts',
    mogucnosti: ['21 persona dispatch', '8 oktavnih nivoa', 'Matrično jezgro 8×8', 'Neurološka mreža', 'Autonomna evolucija'],
    generisanDatum: '2024-03-20',
    optimizacija: 92,
  },
  {
    id: 'engine-proksi-signal',
    naziv: 'Proksi Signal Engine',
    opis: 'Engine za proksi mrežu — hipsoneurični signal, ekscentrični modulator, ekliptična vez',
    ikona: '📡',
    tip: 'mreza',
    status: 'aktivan',
    verzija: '6.0.0',
    ciljniModul: 'src/lib/proksi.ts',
    mogucnosti: ['Hipsoneurični signal', 'Ekscentrični modulator', 'Ekliptična vez', 'Rezonantni pojačavač', '10²²⁸ TB kapacitet'],
    generisanDatum: '2024-06-10',
    optimizacija: 88,
  },
  {
    id: 'engine-mobilna-mreza',
    naziv: 'Mobilna Mreža Engine',
    opis: 'Engine za SPAJA Mobilnu Mrežu — 4 centrale, 5 servisa, Proksi integracija',
    ikona: '📱',
    tip: 'mreza',
    status: 'aktivan',
    verzija: '4.0.0',
    ciljniModul: 'src/lib/mobilna-mreza.ts',
    mogucnosti: ['4 centrale', '5 servisa', 'Glas HD', 'Podaci Turbo', 'IoT Mesh', 'Enterprise Link'],
    generisanDatum: '2024-09-01',
    optimizacija: 85,
  },
  {
    id: 'engine-wifi-antena',
    naziv: 'WiFi Antena Engine',
    opis: 'Engine za Proksi WiFi Antenu — eliptični suplement ekscentričnog koda u matričnom jednačenju',
    ikona: '📶',
    tip: 'mreza',
    status: 'aktivan',
    verzija: '5.0.0',
    ciljniModul: 'src/lib/proksi-wifi-antena.ts',
    mogucnosti: ['Eliptični suplement', 'Ekscentrični kod', 'Matrično jednačenje', 'Oktavni sistem', 'GitHub integracija'],
    generisanDatum: '2024-12-01',
    optimizacija: 90,
  },
  {
    id: 'engine-github-deploy',
    naziv: 'GitHub Deploy Engine',
    opis: 'Engine za Proksi GitHub Deploy — automatski deploy svih repozitorijuma preko Proksi mreže',
    ikona: '🐙',
    tip: 'deploy',
    status: 'aktivan',
    verzija: '3.0.0',
    ciljniModul: 'src/lib/proksi-github-deploy.ts',
    mogucnosti: ['Auto deploy', 'Multi-repo', 'Proksi integracija', 'Vercel deployment', 'CI/CD automation'],
    generisanDatum: '2025-01-15',
    optimizacija: 82,
  },
  {
    id: 'engine-gaming-dimenzije',
    naziv: 'Gaming Dimenzionalni Engine',
    opis: 'Engine za dimenzionalne igrice — 360D-5760D rendering, geometrijski procesori, cirkularne formule',
    ikona: '🎮',
    tip: 'gaming',
    status: 'aktivan',
    verzija: '2.0.0',
    ciljniModul: 'src/lib/igrice.ts',
    mogucnosti: ['Dimenzionalno renderovanje 360D–5760D', 'Geometrijski procesori', 'Cirkularne formule', '95 igrica', 'VR/AR podrška'],
    generisanDatum: '2025-03-15',
    optimizacija: 78,
  },
  {
    id: 'engine-sekvence',
    naziv: 'Sekvence Rendering Engine',
    opis: 'Engine za sekvence rendering — 10 tipova sekvenci, skeleton sistem, stranica = 3 linije koda',
    ikona: '🧩',
    tip: 'core',
    status: 'aktivan',
    verzija: '10.0.0',
    ciljniModul: 'src/lib/sekvence/index.ts',
    mogucnosti: ['10 tipova sekvenci', 'Skeleton sistem', 'Hero, Statistika, Progres, Kartice, Tabela', 'CTA, Baner, Lista, Hijerarhija, Tekst'],
    generisanDatum: '2024-01-01',
    optimizacija: 98,
  },
  {
    id: 'engine-auto-popravka',
    naziv: 'Auto-Popravka Engine',
    opis: 'Engine za autonomnu dijagnostiku i popravku sistema — 260+ dijagnostičkih provera',
    ikona: '🔧',
    tip: 'core',
    status: 'aktivan',
    verzija: '7.0.0',
    ciljniModul: 'src/lib/auto-repair/diagnostics.ts',
    mogucnosti: ['260+ dijagnostičkih provera', 'Automatska popravka', 'Zdravlje sistema', 'Repair engine', 'Upgrade engine'],
    generisanDatum: '2024-06-01',
    optimizacija: 96,
  },
  {
    id: 'engine-evolucija',
    naziv: 'Evolucioni Engine',
    opis: 'Engine za autonomnu evoluciju — dijagnostika + preporuke + GitHub Issues + auto-merge',
    ikona: '🧬',
    tip: 'core',
    status: 'aktivan',
    verzija: '5.0.0',
    ciljniModul: 'src/lib/evolucija/',
    mogucnosti: ['Autonomna dijagnostika', 'GitHub Issue kreiranje', 'Copilot agent rešavanje', 'Auto-merge', 'Kontinualno poboljšanje'],
    generisanDatum: '2024-09-01',
    optimizacija: 93,
  },
  {
    id: 'engine-finansije-banka',
    naziv: 'Finansijski Banka Engine',
    opis: 'Engine za AI IQ World Bank — digitalna banka sa globalnim dometom i ONLINE procedurom',
    ikona: '🏦',
    tip: 'finansije',
    status: 'generisanje',
    verzija: '1.5.0',
    ciljniModul: 'platforme/ai-iq-world-bank',
    mogucnosti: ['Digitalni računi', 'Transferi', 'Krediti', 'Investicije', 'ONLINE procedura'],
    generisanDatum: '2025-06-01',
    optimizacija: 70,
  },
  {
    id: 'engine-finansije-menjacnica',
    naziv: 'Finansijski Menjačnica Engine',
    opis: 'Engine za AI IQ Menjačnicu — kripto i fiat menjačnica sa AI optimizacijom i ONLINE procedurom',
    ikona: '💱',
    tip: 'finansije',
    status: 'generisanje',
    verzija: '1.5.0',
    ciljniModul: 'platforme/ai-iq-menjacnica',
    mogucnosti: ['Kripto trading', 'Fiat konverzija', 'AI predikcije', 'Portfolio', 'ONLINE procedura'],
    generisanDatum: '2025-06-01',
    optimizacija: 68,
  },
  {
    id: 'engine-bezbednost',
    naziv: 'Bezbednosni Shield Engine',
    opis: 'Engine za bezbednost celokupnog ekosistema — WAF, DDoS, enkripcija, Prompt zaštita',
    ikona: '🛡️',
    tip: 'bezbednost',
    status: 'aktivan',
    verzija: '3.0.0',
    ciljniModul: 'src/lib/spaja-pro.ts',
    mogucnosti: ['SpajaPro 7 Štit integracija', 'WAF', 'DDoS zaštita', 'E2E enkripcija', 'Prompt injection prevention'],
    generisanDatum: '2024-03-20',
    optimizacija: 91,
  },
  {
    id: 'engine-komunikacija',
    naziv: 'Komunikacioni Engine',
    opis: 'Engine za komunikaciju između svih modula — event bus, messaging, real-time sinhronizacija',
    ikona: '💬',
    tip: 'komunikacija',
    status: 'optimizacija',
    verzija: '2.0.0',
    ciljniModul: 'src/lib/spaja-univerzalni-prompt.ts',
    mogucnosti: ['Univerzalni Prompt', 'Event bus', 'Real-time sync', 'Cross-modul messaging', 'Notification sistem'],
    generisanDatum: '2025-01-01',
    optimizacija: 75,
  },

  // ─── Repo-specifični Engine-i za sve repozitorijume ─────

  {
    id: 'engine-repo-ai-iq-world-bank',
    naziv: 'AI IQ World Bank Repo Engine',
    opis: 'SPAJA Generator endžin za Ai-Iq-World-Bank repozitorijum — digitalna banka sa globalnim dometom, ONLINE procedura, AI optimizacija finansija',
    ikona: '🏦',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/Ai-Iq-World-Bank',
    mogucnosti: ['Digitalna banka', 'ONLINE procedura', 'Globalni transferi', 'AI krediti', 'Investicioni modul'],
    generisanDatum: '2026-04-07',
    optimizacija: 85,
  },
  {
    id: 'engine-repo-ai-iq-menjacnica',
    naziv: 'AI IQ Menjačnica Repo Engine',
    opis: 'SPAJA Generator endžin za Ai-Iq-Menja-nica repozitorijum — kripto i fiat menjačnica sa AI predikcijama',
    ikona: '💱',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/Ai-Iq-Menja-nica',
    mogucnosti: ['Kripto trading', 'Fiat konverzija', 'AI predikcije', 'Portfolio menadžment', 'ONLINE procedura'],
    generisanDatum: '2026-04-07',
    optimizacija: 80,
  },
  {
    id: 'engine-repo-svetska-organizacija',
    naziv: 'SVETSKA ORGANIZACIJA Repo Engine',
    opis: 'SPAJA Generator endžin za SVETSKA-ORGANIZACIJA repozitorijum — globalna koordinacija projekata i timova',
    ikona: '🌍',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/SVETSKA-ORGANIZACIJA',
    mogucnosti: ['Upravljanje projektima', 'Koordinacija timova', 'Izveštaji', 'i18n lokalizacija', 'ONLINE procedura'],
    generisanDatum: '2026-04-07',
    optimizacija: 75,
  },
  {
    id: 'engine-repo-io-openui-ao',
    naziv: 'IO OPENUI AO Repo Engine',
    opis: 'SPAJA Generator endžin za IO-OPENUI-AO repozitorijum — unified frontend sa SpajaPro engine-om, Prompt sistemom i B2B softverom',
    ikona: '🖥️',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/IO-OPENUI-AO',
    mogucnosti: ['SpajaPro Prompt Chat', 'Fizička laboratorija', 'B2B softver', 'Igrice Dota/TRANSFORMERS/BUBLI BABLI/POKER', 'WebRTC'],
    generisanDatum: '2026-04-07',
    optimizacija: 82,
  },
  {
    id: 'engine-repo-openai-platform',
    naziv: 'OpenAI Platform Repo Engine',
    opis: 'SPAJA Generator endžin za openai-platform repozitorijum — OpenAI API integracija sa OMEGA AI sistemom',
    ikona: '🤖',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/openai-platform',
    mogucnosti: ['OpenAI API', 'OMEGA AI povezivanje', 'SpajaPro kompatibilnost', 'AI servisi', 'Model integracija'],
    generisanDatum: '2026-04-07',
    optimizacija: 78,
  },
  {
    id: 'engine-repo-kompanija-spaja',
    naziv: 'Kompanija SPAJA Repo Engine',
    opis: 'SPAJA Generator endžin za Kompanija-SPAJA repozitorijum — SpajaPro 6-15 engine i matična kompanija',
    ikona: '🏢',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/Kompanija-SPAJA',
    mogucnosti: ['SpajaPro 6-15', 'Univerzalni Prompt', 'Kompanija upravljanje', 'Multi-language Prompt', 'Fine-tuning'],
    generisanDatum: '2026-04-07',
    optimizacija: 88,
  },
  {
    id: 'engine-repo-omega-ai-github',
    naziv: 'OMEGA AI za GitHub Repo Engine',
    opis: 'SPAJA Generator endžin za OMEGA-AI-za-GIT-HUB repozitorijum — AI agent za automatizaciju GitHub operacija',
    ikona: '🐙',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/OMEGA-AI-za-GIT-HUB',
    mogucnosti: ['SpajaPro code review', 'PR automation', 'Issue triage', 'CI/CD automatizacija', 'Prompt suggestions'],
    generisanDatum: '2026-04-07',
    optimizacija: 90,
  },
  {
    id: 'engine-repo-omega-ai-vercel',
    naziv: 'OMEGA AI za Vercel Repo Engine',
    opis: 'SPAJA Generator endžin za OMEGA-AI-za-Vercel- repozitorijum — AI agent za Vercel deploy i monitoring',
    ikona: '🚀',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/OMEGA-AI-za-Vercel-',
    mogucnosti: ['Auto deploy', 'Performance monitoring', 'Error tracking', 'Vercel API', 'Build optimizacija'],
    generisanDatum: '2026-04-07',
    optimizacija: 86,
  },
  {
    id: 'engine-repo-omega-ai-google',
    naziv: 'OMEGA AI za Google Repo Engine',
    opis: 'SPAJA Generator endžin za -OMEGA-AI-za-Google- repozitorijum — AI agent za Google Cloud i Analytics',
    ikona: '🔍',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/-OMEGA-AI-za-Google-',
    mogucnosti: ['SEO optimizacija', 'Google Analytics', 'Cloud funkcije', 'BigQuery', 'Search Console'],
    generisanDatum: '2026-04-07',
    optimizacija: 77,
  },
  {
    id: 'engine-repo-omega-ai-5-persona',
    naziv: 'OMEGA AI 5 Persona Social Repo Engine',
    opis: 'SPAJA Generator endžin za -OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube- repozitorijum — 5 AI persona za društvene mreže',
    ikona: '👥',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/-OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube-',
    mogucnosti: ['Facebook persona', 'Instagram persona', 'TikTok persona', 'Threads persona', 'YouTube persona'],
    generisanDatum: '2026-04-07',
    optimizacija: 74,
  },
  {
    id: 'engine-repo-java-swing-gui',
    naziv: 'Java Swing GUI Repo Engine',
    opis: 'SPAJA Generator endžin za Read-data-from-database-and-write-to-excel-by-using-java-Swing-GUI repozitorijum — Java Swing GUI za baze podataka i Excel',
    ikona: '☕',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/Read-data-from-database-and-write-to-excel-by-using-java-Swing-GUI',
    mogucnosti: ['Java Swing GUI', 'Database čitanje', 'Excel pisanje', 'JDBC konekcija', 'Tabelarni prikaz'],
    generisanDatum: '2026-04-07',
    optimizacija: 72,
  },
  {
    id: 'engine-repo-input-output-copilot',
    naziv: 'Input/Output za Copilot Repo Engine',
    opis: 'SPAJA Generator endžin za Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno repozitorijum — I/O za aktivnu komunikaciju Copilota sa korisnicima',
    ikona: '⚙️',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno',
    mogucnosti: ['Copilot I/O interfejs', 'Aktivna komunikacija', 'SpajaPro Prompt', 'Context management', 'Korisničke interakcije'],
    generisanDatum: '2026-04-07',
    optimizacija: 83,
  },
  {
    id: 'engine-repo-openai-cookbook',
    naziv: 'OpenAI Cookbook Repo Engine',
    opis: 'SPAJA Generator endžin za openai-cookbook repozitorijum — recepti i primeri za OpenAI API integraciju',
    ikona: '📖',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/openai-cookbook',
    mogucnosti: ['OpenAI recepti', 'API primeri', 'Best practices', 'Prompt engineering', 'Model integracija'],
    generisanDatum: '2026-04-07',
    optimizacija: 70,
  },
  {
    id: 'engine-repo-hello-world',
    naziv: 'Hello World Repo Engine',
    opis: 'SPAJA Generator endžin za hello-world repozitorijum — osnovni starter sa SPAJA Generator integracijom',
    ikona: '👋',
    tip: 'repo-engine',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'spaja86/hello-world',
    mogucnosti: ['Starter projekat', 'SPAJA integracija', 'CI/CD setup', 'README generator', 'Template sistem'],
    generisanDatum: '2026-04-07',
    optimizacija: 68,
  },

  // ─── Digitalni Brouvzer, Laboratorija za Simulacije, Render Medija ─

  {
    id: 'engine-digitalni-brouvzer',
    naziv: 'Digitalni Brouvzer Engine',
    opis: 'Engine za SPAJA Digitalni Brouvzer — digitalna brauzer platforma na koju se postavlja celokupna industrija (platforme, organizacije, korporacije, kompanije, prodavnice). Link: https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9',
    ikona: '🌐',
    tip: 'core',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-digitalni-brouvzer.ts',
    mogucnosti: ['Brauzer platforma', 'Plasiranje industrije', 'Entiteti ekosistema', 'Tab menadžment', 'VPN integracija', 'Ad-block', 'Dev Tools'],
    generisanDatum: '2026-04-08',
    optimizacija: 88,
  },
  {
    id: 'engine-io-openui-ao-laboratorija',
    naziv: 'IOOpenUIAO Laboratorija za Simulacije Engine',
    opis: 'Engine za IOOpenUIAO Laboratoriju za Simulacije — naučne i tehničke simulacije u 8 kategorija (fizika, hemija, biologija, matematika, AI/ML, inženjerstvo, ekonomija, ekologija). Link: https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
    ikona: '🔬',
    tip: 'ai',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/io-openui-ao-laboratorija-simulacije.ts',
    mogucnosti: ['Naučne simulacije', '8 kategorija', 'Laboratorijski alati', 'Vizualizacija 3D', 'Spektralna analiza', 'AI trening simulacija', 'Ekonomski modeli'],
    generisanDatum: '2026-04-08',
    optimizacija: 85,
  },
  {
    id: 'engine-render-medija',
    naziv: 'SPAJA Render za Slike i Video Engine',
    opis: 'Engine za SPAJA Render — renderovanje slika, videa, animacija, 3D modela, vektorske grafike, holograma i VR/AR sadržaja. Manifestovan kroz SPAJA Generator za Endžine. Link: https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
    ikona: '🎬',
    tip: 'core',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-render-medija.ts',
    mogucnosti: ['Slike HD/4K/8K', 'Video rendering', 'Animacije', '3D modeli', 'Vektorska grafika', 'Hologrami', 'VR/AR render', 'AI upscaling', 'Dimenzionalni render 360D-5760D'],
    generisanDatum: '2026-04-08',
    optimizacija: 90,
  },

  // ─── IO/OPENUI/AO Gaming Platforma — SPAJA Univerzalni Endžin nad igricama ─

  {
    id: 'engine-io-openui-ao-gaming',
    naziv: 'IO/OPENUI/AO Gaming Univerzalni Engine',
    opis: 'SPAJA Univerzalni Endžin prevučen preko svih 95 igrica na IO/OPENUI/AO platformi (www.ioopenuiao.ac). Dimenzionalno renderovanje 360D–5760D, SpajaPro 6-15 integracija, OMEGA AI podrška, Proksi mrežna optimizacija. Link: https://chatgpt.com/c/688e73aa-ecf8-8006-a7bd-b7d796498ae7',
    ikona: '🎮',
    tip: 'gaming',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/io-openui-ao-gaming-platforma.ts',
    mogucnosti: ['95 igrica u opticaju', 'SPAJA Univerzalni Endžin nad svakom igricom', '18 kategorija igrica', 'Dimenzionalno renderovanje 360D–5760D', 'www.ioopenuiao.ac domen', 'SpajaPro 6-15 integracija', 'OMEGA AI persona podrška', 'Proksi mrežna optimizacija'],
    generisanDatum: '2026-04-08',
    optimizacija: 85,
  },

  // ─── Backend Infrastruktura — SPAJA BAZA, Auth, Mejl, Platni, Real-time ─

  {
    id: 'engine-spaja-baza',
    naziv: 'SPAJA BAZA Engine',
    opis: 'Engine za SPAJA BAZU — najjaču bazu podataka Digitalne Industrije. 12 kolekcija, CRUD, indeksi, transakcije, backup, replikacija, keširanje. Generisan kroz SPAJA Generator za Endžine. Link: https://chatgpt.com/c/695ca489-4d8c-832f-a0aa-bfcad425ef4d',
    ikona: '💾',
    tip: 'core',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-baza.ts',
    mogucnosti: ['12 kolekcija', 'CRUD operacije', 'Indeksi i pretraga', 'Transakcije', 'Backup i oporavak', 'Replikacija', 'Keširanje', 'Multi-tenant'],
    generisanDatum: '2026-04-09',
    optimizacija: 92,
  },
  {
    id: 'engine-autentifikacija',
    naziv: 'Autentifikacija Engine',
    opis: 'Engine za autentifikaciju i autorizaciju — JWT, OAuth, 2FA, RBAC, sesije. Generisan kroz SPAJA Generator za Endžine + AI IQ World Bank. Link: https://chatgpt.com/c/68981608-32dc-832e-831e-9ff1a0ff485c',
    ikona: '🔐',
    tip: 'bezbednost',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/autentifikacija.ts',
    mogucnosti: ['JWT tokeni', 'OAuth (Google, GitHub)', 'Dvofaktorska autentifikacija', 'RBAC dozvole', 'Sesije', 'Vlasnički VIP pristup', 'Rate limiting', 'Brute-force zaštita'],
    generisanDatum: '2026-04-09',
    optimizacija: 94,
  },
  {
    id: 'engine-profesionalni-mejl',
    naziv: 'Profesionalni Mejl Engine',
    opis: 'Engine za profesionalni mejl sistem — 4 domena, 8 šablona, bankarski mejlovi sa IBAN-om, newsletter. Generisan kroz SPAJA Generator za Endžine. Link: https://chatgpt.com/c/696e2c9d-36d8-832f-9771-7fcc834f4df6',
    ikona: '📧',
    tip: 'komunikacija',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-profesionalni-mejl.ts',
    mogucnosti: ['4 mejl domena', '8 profesionalnih šablona', 'Bankarski mejlovi sa IBAN', 'Newsletter engine', 'Notifikacioni sistem', 'SMTP konfiguracija', 'Marketing kampanje', 'Verifikacioni mejlovi'],
    generisanDatum: '2026-04-09',
    optimizacija: 90,
  },
  {
    id: 'engine-platni-sistem',
    naziv: 'Stripe Platni Sistem Engine',
    opis: 'Engine za Stripe platni sistem — pretplate, fakture, refund, webhook, multi-valutna podrška. Generisan kroz SPAJA Generator za Endžine + AI IQ World Bank.',
    ikona: '💳',
    tip: 'finansije',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-platni-sistem.ts',
    mogucnosti: ['Stripe Checkout', 'Pretplate (5 planova)', 'Fakturisanje', 'Refund sistem', 'Webhook obrada', 'Multi-valutna podrška (12 valuta)', 'Kripto plaćanja (BTC, ETH)', 'PCI DSS usklađenost'],
    generisanDatum: '2026-04-09',
    optimizacija: 88,
  },
  {
    id: 'engine-realtime',
    naziv: 'Real-Time Sistem Engine',
    opis: 'Engine za real-time funkcije — event bus, kanali, notifikacije, presence, live dashboard. SSE + WebSocket-ready.',
    ikona: '⚡',
    tip: 'komunikacija',
    status: 'aktivan',
    verzija: '1.0.0',
    ciljniModul: 'src/lib/spaja-realtime.ts',
    mogucnosti: ['Event Bus', '8 kanala', 'Push notifikacije', 'Presence sistem', 'Live Dashboard', 'SSE streaming', 'WebSocket-ready', 'Real-time metrike'],
    generisanDatum: '2026-04-09',
    optimizacija: 86,
  },
];

// ─── Generator konfiguracije ─────────────────────────────

export const generatorKonfiguracije: GeneratorKonfiguracija[] = [
  {
    id: 'config-full-repo',
    naziv: 'Puna Repozitorijum Konfiguracija',
    opis: 'Generiše i primenjuje engine-e na celokupan AI-IQ-SUPER-PLATFORMA repozitorijum',
    ikona: '🏭',
    parametri: ['src/lib/', 'src/app/', 'src/components/', 'public/', 'platforms/'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    aktivna: true,
  },
  {
    id: 'config-spajapro',
    naziv: 'SpajaPro Engine Konfiguracija',
    opis: 'Konfiguracija za generisanje SpajaPro 6-15 engine-a',
    ikona: '🌟',
    parametri: ['src/lib/spaja-pro.ts', 'src/lib/prompt.ts', 'src/lib/spaja-univerzalni-prompt.ts'],
    ciljniRepozitorijum: 'spaja86/Kompanija-SPAJA',
    aktivna: true,
  },
  {
    id: 'config-omega-ai',
    naziv: 'OMEGA AI Engine Konfiguracija',
    opis: 'Konfiguracija za generisanje OMEGA AI engine-a sa 21 personom i 8 oktava',
    ikona: '🧠',
    parametri: ['src/lib/omega-ai.ts', 'src/lib/omega-ai-dispatch.ts'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    aktivna: true,
  },
  {
    id: 'config-proksi',
    naziv: 'Proksi Mrežna Konfiguracija',
    opis: 'Konfiguracija za generisanje Proksi, WiFi Antena i GitHub Deploy engine-a',
    ikona: '📡',
    parametri: ['src/lib/proksi.ts', 'src/lib/proksi-wifi-antena.ts', 'src/lib/proksi-github-deploy.ts'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    aktivna: true,
  },
  {
    id: 'config-gaming',
    naziv: 'Gaming Engine Konfiguracija',
    opis: 'Konfiguracija za generisanje gaming engine-a — 95 igrica u dimenzionalnom prostoru',
    ikona: '🎮',
    parametri: ['src/lib/igrice.ts', 'src/lib/dimenzije.ts', 'src/lib/it-proizvodi.ts'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    aktivna: true,
  },
  {
    id: 'config-finansije',
    naziv: 'Finansijski Engine Konfiguracija',
    opis: 'Konfiguracija za generisanje finansijskih engine-a — banka i menjačnica',
    ikona: '💰',
    parametri: ['platforme/ai-iq-world-bank', 'platforme/ai-iq-menjacnica'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-World-Bank',
    aktivna: true,
  },
  {
    id: 'config-backend',
    naziv: 'Backend Infrastruktura Konfiguracija',
    opis: 'Konfiguracija za generisanje backend engine-a — SPAJA BAZA, Autentifikacija, Mejl, Platni Sistem, Real-time',
    ikona: '🔧',
    parametri: ['src/lib/spaja-baza.ts', 'src/lib/autentifikacija.ts', 'src/lib/spaja-profesionalni-mejl.ts', 'src/lib/spaja-platni-sistem.ts', 'src/lib/spaja-realtime.ts'],
    ciljniRepozitorijum: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    aktivna: true,
  },

  // ─── Repo-specifične konfiguracije za sve repozitorijume ─

  {
    id: 'config-repo-ai-iq-world-bank',
    naziv: 'AI IQ World Bank Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko Ai-Iq-World-Bank repozitorijuma',
    ikona: '🏦',
    parametri: ['src/', 'pages/', 'components/', 'api/', 'lib/'],
    ciljniRepozitorijum: 'spaja86/Ai-Iq-World-Bank',
    aktivna: true,
  },
  {
    id: 'config-repo-ai-iq-menjacnica',
    naziv: 'AI IQ Menjačnica Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko Ai-Iq-Menja-nica repozitorijuma',
    ikona: '💱',
    parametri: ['src/', 'pages/', 'components/', 'api/', 'lib/'],
    ciljniRepozitorijum: 'spaja86/Ai-Iq-Menja-nica',
    aktivna: true,
  },
  {
    id: 'config-repo-svetska-organizacija',
    naziv: 'SVETSKA ORGANIZACIJA Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko SVETSKA-ORGANIZACIJA repozitorijuma',
    ikona: '🌍',
    parametri: ['src/', 'pages/', 'components/', 'lib/', 'i18n/'],
    ciljniRepozitorijum: 'spaja86/SVETSKA-ORGANIZACIJA',
    aktivna: true,
  },
  {
    id: 'config-repo-io-openui-ao',
    naziv: 'IO OPENUI AO Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko IO-OPENUI-AO repozitorijuma — SpajaPro, Lab, B2B',
    ikona: '🖥️',
    parametri: ['src/', 'components/', 'lib/', 'spajapro/', 'lab/'],
    ciljniRepozitorijum: 'spaja86/IO-OPENUI-AO',
    aktivna: true,
  },
  {
    id: 'config-repo-openai-platform',
    naziv: 'OpenAI Platform Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko openai-platform repozitorijuma',
    ikona: '🤖',
    parametri: ['src/', 'api/', 'models/', 'lib/', 'config/'],
    ciljniRepozitorijum: 'spaja86/openai-platform',
    aktivna: true,
  },
  {
    id: 'config-repo-kompanija-spaja',
    naziv: 'Kompanija SPAJA Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko Kompanija-SPAJA repozitorijuma — SpajaPro 6-15',
    ikona: '🏢',
    parametri: ['src/', 'spajapro/', 'prompt/', 'lib/', 'engine/'],
    ciljniRepozitorijum: 'spaja86/Kompanija-SPAJA',
    aktivna: true,
  },
  {
    id: 'config-repo-omega-ai-github',
    naziv: 'OMEGA AI za GitHub Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko OMEGA-AI-za-GIT-HUB repozitorijuma',
    ikona: '🐙',
    parametri: ['src/', 'agents/', 'actions/', 'lib/', 'github/'],
    ciljniRepozitorijum: 'spaja86/OMEGA-AI-za-GIT-HUB',
    aktivna: true,
  },
  {
    id: 'config-repo-omega-ai-vercel',
    naziv: 'OMEGA AI za Vercel Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko OMEGA-AI-za-Vercel- repozitorijuma',
    ikona: '🚀',
    parametri: ['src/', 'deploy/', 'monitoring/', 'lib/', 'vercel/'],
    ciljniRepozitorijum: 'spaja86/OMEGA-AI-za-Vercel-',
    aktivna: true,
  },
  {
    id: 'config-repo-omega-ai-google',
    naziv: 'OMEGA AI za Google Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko -OMEGA-AI-za-Google- repozitorijuma',
    ikona: '🔍',
    parametri: ['src/', 'cloud/', 'analytics/', 'lib/', 'seo/'],
    ciljniRepozitorijum: 'spaja86/-OMEGA-AI-za-Google-',
    aktivna: true,
  },
  {
    id: 'config-repo-omega-ai-5-persona',
    naziv: 'OMEGA AI 5 Persona Social Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko OMEGA AI 5 Persona repozitorijuma za društvene mreže',
    ikona: '👥',
    parametri: ['src/', 'personas/', 'social/', 'lib/', 'content/'],
    ciljniRepozitorijum: 'spaja86/-OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube-',
    aktivna: true,
  },
  {
    id: 'config-repo-java-swing-gui',
    naziv: 'Java Swing GUI Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko Java Swing GUI repozitorijuma',
    ikona: '☕',
    parametri: ['src/', 'main/', 'java/', 'resources/', 'gui/'],
    ciljniRepozitorijum: 'spaja86/Read-data-from-database-and-write-to-excel-by-using-java-Swing-GUI',
    aktivna: true,
  },
  {
    id: 'config-repo-input-output-copilot',
    naziv: 'Input/Output za Copilot Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko Input/Output za Copilot repozitorijuma',
    ikona: '⚙️',
    parametri: ['src/', 'io/', 'copilot/', 'lib/', 'prompts/'],
    ciljniRepozitorijum: 'spaja86/Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno',
    aktivna: true,
  },
  {
    id: 'config-repo-openai-cookbook',
    naziv: 'OpenAI Cookbook Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko openai-cookbook repozitorijuma',
    ikona: '📖',
    parametri: ['examples/', 'notebooks/', 'src/', 'guides/', 'recipes/'],
    ciljniRepozitorijum: 'spaja86/openai-cookbook',
    aktivna: true,
  },
  {
    id: 'config-repo-hello-world',
    naziv: 'Hello World Repo Konfiguracija',
    opis: 'Konfiguracija za prevlačenje endžina preko hello-world repozitorijuma — starter',
    ikona: '👋',
    parametri: ['src/', 'README.md', '.github/', 'lib/'],
    ciljniRepozitorijum: 'spaja86/hello-world',
    aktivna: true,
  },
];

// ─── Kompletni SPAJA Generator za Endžine ────────────────

function izracunajStatistiku(): GeneratorStatistika {
  const aktivnih = generisaniEngini.filter((e) => e.status === 'aktivan').length;
  const uOptimizaciji = generisaniEngini.filter((e) => e.status === 'optimizacija').length;
  const prosek = generisaniEngini.length > 0
    ? Math.round(generisaniEngini.reduce((acc, e) => acc + e.optimizacija, 0) / generisaniEngini.length)
    : 0;

  return {
    ukupnoEngina: generisaniEngini.length,
    aktivnihEngina: aktivnih,
    uOptimizaciji,
    prosecnaOptimizacija: prosek,
    pokrivenostRepozitorijuma: 100,
  };
}

export const spajaGeneratorEngine: SpajaGeneratorEngine = {
  naziv: 'SPAJA Generator za Endžine',
  opis:
    'SPAJA Generator za Endžine je centralni engine generator koji prevlači engine-e preko celog ' +
    'repozitorijuma AI-IQ-SUPER-PLATFORMA i svih 14 eksternih repozitorijuma u ekosistemu. Generiše, ' +
    'primenjuje i optimizuje sve engine-e — od SpajaPro i OMEGA AI do Proksi, Mobilna Mreža, Gaming, ' +
    'Finansije, Backend Infrastruktura (SPAJA BAZA, Autentifikacija, Profesionalni Mejl, Platni Sistem, ' +
    'Real-time) i svih repo-specifičnih endžina za Ai-Iq-World-Bank, Ai-Iq-Menja-nica, SVETSKA-ORGANIZACIJA, ' +
    'IO-OPENUI-AO, openai-platform, Kompanija-SPAJA, OMEGA-AI-za-GIT-HUB, OMEGA-AI-za-Vercel-, ' +
    '-OMEGA-AI-za-Google-, OMEGA-AI-5-persona, Java-Swing-GUI, Input-Output-Copilot, openai-cookbook, hello-world.',
  verzija: '2.0.0',
  link: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  engini: generisaniEngini,
  konfiguracije: generatorKonfiguracije,
  statistika: izracunajStatistiku(),
};

// ─── Helper funkcije ─────────────────────────────────────

export function getAktivniEngini(): GenerisaniEngine[] {
  return generisaniEngini.filter((e) => e.status === 'aktivan');
}

export function getEnginePoId(id: string): GenerisaniEngine | undefined {
  return generisaniEngini.find((e) => e.id === id);
}

export function getEnginiPoTipu(tip: EngineTip): GenerisaniEngine[] {
  return generisaniEngini.filter((e) => e.tip === tip);
}

export function getEnginiUGenerisanju(): GenerisaniEngine[] {
  return generisaniEngini.filter((e) => e.status === 'generisanje');
}

export function getEnginiUOptimizaciji(): GenerisaniEngine[] {
  return generisaniEngini.filter((e) => e.status === 'optimizacija');
}

export function getProsecnaOptimizacija(): number {
  if (generisaniEngini.length === 0) return 0;
  return Math.round(generisaniEngini.reduce((acc, e) => acc + e.optimizacija, 0) / generisaniEngini.length);
}

export function getAktivneKonfiguracije(): GeneratorKonfiguracija[] {
  return generatorKonfiguracije.filter((k) => k.aktivna);
}

export function getGeneratorStatistika(): GeneratorStatistika {
  return izracunajStatistiku();
}

export function getRepoEngini(): GenerisaniEngine[] {
  return generisaniEngini.filter((e) => e.tip === 'repo-engine');
}

export function getRepoKonfiguracije(): GeneratorKonfiguracija[] {
  return generatorKonfiguracije.filter((k) => k.id.startsWith('config-repo-'));
}
