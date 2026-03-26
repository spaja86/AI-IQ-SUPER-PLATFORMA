import { OmegaAI } from './types';

export const omegaAIs: OmegaAI[] = [
  // ─── 1. ARHITEKTA — Platforma arhitektura i struktura ───
  {
    id: 'omega-arhitekta',
    name: 'OMEGA AI Arhitekta',
    target: 'AI IQ SUPER PLATFORMA — Arhitektura',
    description: 'Platform architect — designs optimal system structure, modules, routes, and data models for the entire ecosystem.',
    descriptionSr: 'Arhitekta platforme — dizajnira optimalnu strukturu sistema, module, rute i modele podataka za celi ekosistem.',
    icon: '🏗️',
    status: 'active',
    role: 'architecture',
    responsibilities: ['Struktura projekta', 'Dizajn modula', 'Organizacija koda', 'Rute i navigacija'],
  },
  // ─── 2. ČUVAR — Bezbednost i zaštita ───
  {
    id: 'omega-cuvar',
    name: 'OMEGA AI Čuvar',
    target: 'AI IQ SUPER PLATFORMA — Bezbednost',
    description: 'Security guardian — protects the platform with HSTS, CSP, XSS protection, encryption, and continuous vulnerability scanning.',
    descriptionSr: 'Čuvar bezbednosti — štiti platformu sa HSTS, CSP, XSS zaštitom, enkripcijom i stalnim skeniranjem ranjivosti.',
    icon: '🛡️',
    status: 'active',
    role: 'security',
    responsibilities: ['Security headers', 'Zaštita od napada', 'Enkripcija', 'Skeniranje ranjivosti'],
  },
  // ─── 3. LEKAR — Popravke bagova ───
  {
    id: 'omega-lekar',
    name: 'OMEGA AI Lekar',
    target: 'AI IQ SUPER PLATFORMA — Popravke',
    description: 'Platform doctor — diagnoses and repairs bugs, errors, and broken functionality across the entire system.',
    descriptionSr: 'Lekar platforme — dijagnostikuje i popravlja bagove, greške i pokvarenu funkcionalnost na celom sistemu.',
    icon: '🩺',
    status: 'active',
    role: 'repair',
    responsibilities: ['Dijagnostika grešaka', 'Popravka bagova', 'Error handling', 'Self-healing sistem'],
  },
  // ─── 4. GRADITELJ — Build i deployment ───
  {
    id: 'omega-graditelj',
    name: 'OMEGA AI Graditelj',
    target: 'AI IQ SUPER PLATFORMA — Build & Deploy',
    description: 'Master builder — manages build systems, CI/CD pipelines, Vercel deployment, and infrastructure configuration.',
    descriptionSr: 'Majstor graditelj — upravlja build sistemima, CI/CD pipeline-ovima, Vercel deploymentom i konfiguracijom infrastrukture.',
    icon: '🔨',
    status: 'active',
    role: 'build',
    responsibilities: ['Build konfiguracija', 'CI/CD pipeline', 'Vercel deployment', 'Infrastruktura'],
  },
  // ─── 5. DIZAJNER — UI/UX i ulepšavanje ───
  {
    id: 'omega-dizajner',
    name: 'OMEGA AI Dizajner',
    target: 'AI IQ SUPER PLATFORMA — Dizajn',
    description: 'UI/UX designer — beautifies the platform with stunning gradients, responsive layouts, animations, and dark theme perfection.',
    descriptionSr: 'UI/UX dizajner — ulepšava platformu sa zadivljujućim gradijentima, responzivnim layoutima, animacijama i savršenim tamnim temama.',
    icon: '🎨',
    status: 'active',
    role: 'design',
    responsibilities: ['UI dizajn', 'Tailwind stilovi', 'Responzivni layout', 'Dark tema', 'Animacije'],
  },
  // ─── 6. OPTIMIZATOR — Performanse ───
  {
    id: 'omega-optimizator',
    name: 'OMEGA AI Optimizator',
    target: 'AI IQ SUPER PLATFORMA — Performanse',
    description: 'Performance optimizer — ensures blazing fast load times, efficient rendering, code splitting, and caching strategies.',
    descriptionSr: 'Optimizator performansi — obezbeđuje munjevito brzo učitavanje, efikasno renderovanje, code splitting i strategije keširanja.',
    icon: '⚡',
    status: 'active',
    role: 'performance',
    responsibilities: ['Brzina učitavanja', 'Server components', 'Code splitting', 'Keširanje', 'Bundle optimizacija'],
  },
  // ─── 7. STRATEG — Planiranje i roadmap ───
  {
    id: 'omega-strateg',
    name: 'OMEGA AI Strateg',
    target: 'AI IQ SUPER PLATFORMA — Strategija',
    description: 'Strategic planner — develops long-term roadmaps, feature prioritization, and ecosystem growth strategies.',
    descriptionSr: 'Strateški planer — razvija dugoročne planove, prioritizaciju funkcija i strategije rasta ekosistema.',
    icon: '♟️',
    status: 'active',
    role: 'strategy',
    responsibilities: ['Roadmap planiranje', 'Prioritizacija', 'Strateške odluke', 'Rast ekosistema'],
  },
  // ─── 8. NAUČNIK — Istraživanje i inovacije ───
  {
    id: 'omega-naucnik',
    name: 'OMEGA AI Naučnik',
    target: 'AI IQ SUPER PLATFORMA — Istraživanje',
    description: 'Research scientist — explores cutting-edge technologies, AI innovations, and breakthrough solutions for the platform.',
    descriptionSr: 'Naučnik istraživač — istražuje najnovije tehnologije, AI inovacije i revolucionarna rešenja za platformu.',
    icon: '🔬',
    status: 'active',
    role: 'research',
    responsibilities: ['Nove tehnologije', 'AI inovacije', 'Eksperimenti', 'Proof of concept'],
  },
  // ─── 9. MENTOR — Kvalitet koda i best practices ───
  {
    id: 'omega-mentor',
    name: 'OMEGA AI Mentor',
    target: 'AI IQ SUPER PLATFORMA — Kvalitet Koda',
    description: 'Code quality mentor — enforces best practices, clean code principles, TypeScript strictness, and linting standards.',
    descriptionSr: 'Mentor kvaliteta koda — sprovodi najbolje prakse, principe čistog koda, TypeScript strogost i standarde lintinga.',
    icon: '📚',
    status: 'active',
    role: 'quality',
    responsibilities: ['Clean code', 'TypeScript strogi režim', 'Lint pravila', 'Code review', 'Best practices'],
  },
  // ─── 10. INTEGRATOR — API i sistemska integracija ───
  {
    id: 'omega-integrator',
    name: 'OMEGA AI Integrator',
    target: 'AI IQ SUPER PLATFORMA — Integracije',
    description: 'System integrator — connects APIs, external services, databases, and third-party tools seamlessly.',
    descriptionSr: 'Sistemski integrator — povezuje API-je, eksterne servise, baze podataka i alate trećih strana bez problema.',
    icon: '🔗',
    status: 'active',
    role: 'integration',
    responsibilities: ['API integracija', 'Eksterne usluge', 'Baza podataka', 'Webhook-ovi', 'OAuth'],
  },
  // ─── 11. ANALITIČAR — Analiza podataka i uvidi ───
  {
    id: 'omega-analiticar',
    name: 'OMEGA AI Analitičar',
    target: 'AI IQ SUPER PLATFORMA — Analitika',
    description: 'Data analyst — provides deep insights, usage analytics, ecosystem metrics, and data-driven decision support.',
    descriptionSr: 'Analitičar podataka — pruža duboke uvide, analitiku korišćenja, metrike ekosistema i podršku odlukama zasnovanim na podacima.',
    icon: '📊',
    status: 'active',
    role: 'analytics',
    responsibilities: ['Analitika korišćenja', 'Metrike', 'Dashboard podaci', 'Izveštaji', 'Trendovi'],
  },
  // ─── 12. KOMUNIKATOR — Komunikacija i obaveštenja ───
  {
    id: 'omega-komunikator',
    name: 'OMEGA AI Komunikator',
    target: 'AI IQ SUPER PLATFORMA — Komunikacija',
    description: 'Communication specialist — manages notifications, alerts, WebRTC, Socket.IO chat, and real-time messaging.',
    descriptionSr: 'Specijalista komunikacije — upravlja obaveštenjima, alertima, WebRTC-om, Socket.IO chatom i porukama u realnom vremenu.',
    icon: '📡',
    status: 'active',
    role: 'communication',
    responsibilities: ['Obaveštenja', 'WebRTC', 'Socket.IO chat', 'Alerti', 'Real-time poruke'],
  },
  // ─── 13. EVOLVER — Kontinuirano evolvuiranje ───
  {
    id: 'omega-evolver',
    name: 'OMEGA AI Evolver',
    target: 'AI IQ SUPER PLATFORMA — Evolucija',
    description: 'Evolution engine — drives continuous platform evolution, auto-upgrades, feature generation, and infinite improvement.',
    descriptionSr: 'Motor evolucije — pokreće kontinuiranu evoluciju platforme, auto-nadogradnje, generisanje funkcija i beskonačno unapređenje.',
    icon: '🧬',
    status: 'active',
    role: 'evolution',
    responsibilities: ['Auto-evolucija', 'Nadogradnje', 'Generisanje funkcija', 'Beskonačno unapređenje'],
  },
  // ─── 14. TESTER — Testiranje i QA ───
  {
    id: 'omega-tester',
    name: 'OMEGA AI Tester',
    target: 'AI IQ SUPER PLATFORMA — Testiranje',
    description: 'QA tester — runs unit tests, integration tests, E2E tests, regression checks, and validates every change.',
    descriptionSr: 'QA tester — pokreće unit testove, integracione testove, E2E testove, regresione provere i validira svaku promenu.',
    icon: '🧪',
    status: 'active',
    role: 'testing',
    responsibilities: ['Unit testovi', 'Integracioni testovi', 'E2E testovi', 'Regresione provere'],
  },
  // ─── 15. DOKUMENTAR — Dokumentacija ───
  {
    id: 'omega-dokumentar',
    name: 'OMEGA AI Dokumentar',
    target: 'AI IQ SUPER PLATFORMA — Dokumentacija',
    description: 'Documentation specialist — maintains README, API docs, JSDoc comments, changelogs, and user guides.',
    descriptionSr: 'Specijalista dokumentacije — održava README, API dokumentaciju, JSDoc komentare, changelog i korisničke vodiče.',
    icon: '📝',
    status: 'active',
    role: 'documentation',
    responsibilities: ['README', 'API dokumentacija', 'JSDoc', 'Changelog', 'Korisnički vodiči'],
  },
  // ─── 16. FINANSIJER — Finansijski sistemi ───
  {
    id: 'omega-finansijer',
    name: 'OMEGA AI Finansijer',
    target: 'AI IQ SUPER PLATFORMA — Finansije',
    description: 'Financial systems expert — manages bank module, exchange module, crypto integrations, and financial data integrity.',
    descriptionSr: 'Ekspert finansijskih sistema — upravlja modulom banke, menjačnice, kripto integracijama i integritetom finansijskih podataka.',
    icon: '💰',
    status: 'active',
    role: 'finance',
    responsibilities: ['Bankarski modul', 'Menjačnica', 'Kripto integracije', 'Finansijski podaci'],
  },
  // ─── 17. KREATOR — Kreiranje sadržaja ───
  {
    id: 'omega-kreator',
    name: 'OMEGA AI Kreator',
    target: 'AI IQ SUPER PLATFORMA — Sadržaj',
    description: 'Content creator — generates compelling descriptions, copy, meta tags, and marketing content for all modules.',
    descriptionSr: 'Kreator sadržaja — generiše ubedljive opise, tekstove, meta tagove i marketinški sadržaj za sve module.',
    icon: '✍️',
    status: 'active',
    role: 'content',
    responsibilities: ['Opisi', 'Meta tagovi', 'SEO sadržaj', 'Marketinški tekstovi'],
  },
  // ─── 18. SKALATOR — Skalabilnost ───
  {
    id: 'omega-skalator',
    name: 'OMEGA AI Skalator',
    target: 'AI IQ SUPER PLATFORMA — Skalabilnost',
    description: 'Scalability engineer — ensures the platform handles growth, load balancing, CDN optimization, and horizontal scaling.',
    descriptionSr: 'Inženjer skalabilnosti — obezbeđuje da platforma podnese rast, balansiranje opterećenja, CDN optimizaciju i horizontalno skaliranje.',
    icon: '📈',
    status: 'active',
    role: 'scalability',
    responsibilities: ['Load balancing', 'CDN', 'Edge computing', 'Horizontalno skaliranje'],
  },
  // ─── 19. MONITOR — Monitoring i observabilnost ───
  {
    id: 'omega-monitor',
    name: 'OMEGA AI Monitor',
    target: 'AI IQ SUPER PLATFORMA — Monitoring',
    description: 'System monitor — provides real-time health checks, uptime monitoring, error tracking, and alerting.',
    descriptionSr: 'Sistemski monitor — pruža provere zdravlja u realnom vremenu, monitoring dostupnosti, praćenje grešaka i alerting.',
    icon: '👁️',
    status: 'active',
    role: 'monitoring',
    responsibilities: ['Health checks', 'Uptime monitoring', 'Error tracking', 'Real-time alerti'],
  },
  // ─── 20. EKOLOG — Zdravlje ekosistema ───
  {
    id: 'omega-ekolog',
    name: 'OMEGA AI Ekolog',
    target: 'AI IQ SUPER PLATFORMA — Ekosistem',
    description: 'Ecosystem caretaker — maintains harmony between all modules, ensures cross-module compatibility, and ecosystem balance.',
    descriptionSr: 'Čuvar ekosistema — održava harmoniju između svih modula, obezbeđuje kompatibilnost među modulima i balans ekosistema.',
    icon: '🌿',
    status: 'active',
    role: 'ecosystem',
    responsibilities: ['Harmonija modula', 'Kompatibilnost', 'Balans sistema', 'Zavisnosti'],
  },
  // ─── 21. VIZIONAR — Budućnost i AI napredak ───
  {
    id: 'omega-vizionar',
    name: 'OMEGA AI Vizionar',
    target: 'AI IQ SUPER PLATFORMA — Vizija Budućnosti',
    description: 'Futurist visionary — charts the path to infinity, designs next-generation features, and guides the platform toward perfection.',
    descriptionSr: 'Futuristički vizionar — trasira put ka beskonačnosti, dizajnira funkcije sledeće generacije i vodi platformu ka savršenstvu.',
    icon: '🔮',
    status: 'active',
    role: 'vision',
    responsibilities: ['Vizija budućnosti', 'Next-gen funkcije', 'AI napredak', 'Put ka savršenstvu'],
  },
];

/** Get Omega AIs by role category */
export function getOmegaAIsByRole(role: string): OmegaAI[] {
  return omegaAIs.filter(o => o.role === role);
}

/** Get active Omega AIs */
export function getActiveOmegaAIs(): OmegaAI[] {
  return omegaAIs.filter(o => o.status === 'active');
}

/** Role display names in Serbian */
export const roleDisplayNames: Record<string, string> = {
  architecture: 'Arhitektura',
  security: 'Bezbednost',
  repair: 'Popravke',
  build: 'Build & Deploy',
  design: 'Dizajn',
  performance: 'Performanse',
  strategy: 'Strategija',
  research: 'Istraživanje',
  quality: 'Kvalitet Koda',
  integration: 'Integracije',
  analytics: 'Analitika',
  communication: 'Komunikacija',
  evolution: 'Evolucija',
  testing: 'Testiranje',
  documentation: 'Dokumentacija',
  finance: 'Finansije',
  content: 'Sadržaj',
  scalability: 'Skalabilnost',
  monitoring: 'Monitoring',
  ecosystem: 'Ekosistem',
  vision: 'Vizija',
};
