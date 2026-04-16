export interface ITProduct {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ITProductCategory;
  features: string[];
  targetPlatforms: string[];
  impact: "high" | "medium" | "low";
}

export type ITProductCategory =
  | "acceleration"
  | "monitoring"
  | "security"
  | "ai"
  | "deployment"
  | "integration"
  | "data"
  | "communication";

export const itProducts: ITProduct[] = [
  {
    id: "spaja-accelerator",
    name: "SPAJA Accelerator",
    description:
      "Ubrzava sve razvojne procese korišćenjem AI-automatizacije, CI/CD pipeline-a i smart caching-a.",
    icon: "⚡",
    category: "acceleration",
    features: [
      "Automatski CI/CD pipeline",
      "Smart caching za brži build",
      "Paralelno testiranje",
      "Hot-reload optimizacija",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "high",
  },
  {
    id: "spaja-monitor",
    name: "SPAJA Monitor",
    description:
      "Real-time praćenje statusa svih platformi – uptime, performance, greške i korisničko iskustvo.",
    icon: "📊",
    category: "monitoring",
    features: [
      "Real-time status dashboard",
      "Performance metrike",
      "Alerting sistem",
      "Uptime praćenje",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "high",
  },
  {
    id: "spaja-shield",
    name: "SPAJA Shield",
    description:
      "Sveobuhvatna bezbednosna zaštita – SSL, firewall, DDoS zaštita, enkripcija podataka.",
    icon: "🛡️",
    category: "security",
    features: [
      "SSL/TLS enkripcija",
      "DDoS zaštita",
      "Firewall pravila",
      "Bezbednosni audit",
    ],
    targetPlatforms: ["Ai-Iq-World-Bank", "Ai-Iq-Menja-nica", "IO-OPENUI-AO"],
    impact: "high",
  },
  {
    id: "omega-engine",
    name: "OMEGA AI Engine",
    description:
      "Centralni AI motor koji pokreće sve OMEGA AI sisteme – beskonačno evolvuirajući.",
    icon: "🧠",
    category: "ai",
    features: [
      "Machine Learning pipeline",
      "Natural Language Processing",
      "Auto-evolucija modela",
      "Multi-platform AI",
    ],
    targetPlatforms: [
      "OMEGA AI za GitHub",
      "OMEGA AI za Vercel",
      "OMEGA AI za Google",
      "OMEGA AI 5 Persona",
    ],
    impact: "high",
  },
  {
    id: "spaja-deploy",
    name: "SPAJA Deploy",
    description:
      "Jedan klik za deploy svih platformi na Vercel – automatski build, preview i produkcija.",
    icon: "🚀",
    category: "deployment",
    features: [
      "One-click Vercel deploy",
      "Preview environments",
      "Automatic rollback",
      "Multi-region deployment",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "high",
  },
  {
    id: "spaja-connector",
    name: "SPAJA Connector",
    description:
      "API gateway koji povezuje sve platforme u jedinstven ekosistem sa centralnim upravljanjem.",
    icon: "🔗",
    category: "acceleration",
    features: [
      "Centralni API gateway",
      "Cross-platform komunikacija",
      "Unified authentication",
      "Rate limiting",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "medium",
  },
  {
    id: "spaja-analytics",
    name: "SPAJA Analytics",
    description:
      "Napredna analitika i izveštaji za sve platforme – korisnici, performanse, prihodi.",
    icon: "📈",
    category: "monitoring",
    features: [
      "Korisnička analitika",
      "Performance izveštaji",
      "Revenue tracking",
      "Custom dashboards",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "medium",
  },
  {
    id: "spaja-auth",
    name: "SPAJA Auth",
    description:
      "Unified autentifikacija za sve platforme – SSO, 2FA, OAuth integracije.",
    icon: "🔐",
    category: "security",
    features: [
      "Single Sign-On (SSO)",
      "Dvofaktorska autentifikacija",
      "OAuth 2.0 integracije",
      "Role-based pristup",
    ],
    targetPlatforms: [
      "Ai-Iq-World-Bank",
      "Ai-Iq-Menja-nica",
      "IO-OPENUI-AO",
    ],
    impact: "high",
  },
  {
    id: "spaja-ekosistem-hub",
    name: "SPAJA Ekosistem Hub",
    description:
      "Unified frontend platforma iz IO-OPENUI-AO — spaja Banku, Menjačnicu, Kompaniju i AI servis na jednom mestu. WebRTC + Socket.IO + OpenAI Realtime API.",
    icon: "🌐",
    category: "integration",
    features: [
      "4 integrisana servisa na jednom URL-u",
      "WebRTC glasovni AI chat (OpenAI)",
      "Socket.IO real-time messaging",
      "Vercel routing za sve module (/bank, /exchange, /company, /ai)",
      "Profesionalni dark-theme UI",
      "Primenjiv na sve platforme ekosistema",
    ],
    targetPlatforms: [
      "AI IQ World Bank",
      "AI IQ Menjačnica",
      "Kompanija SPAJA",
      "IO OpenUI AO",
      "Sve platforme",
    ],
    impact: "high",
  },
  {
    id: "spaja-database",
    name: "SPAJA Database",
    description:
      "Centralizovani data layer za sve platforme — PostgreSQL, Redis cache, real-time sync i automatski backup podataka.",
    icon: "🗄️",
    category: "data",
    features: [
      "PostgreSQL sa Prisma ORM",
      "Redis caching layer",
      "Real-time data sync",
      "Automatski backup & migracije",
    ],
    targetPlatforms: [
      "AI IQ World Bank",
      "AI IQ Menjačnica",
      "IO OpenUI AO",
      "Sve platforme",
    ],
    impact: "high",
  },
  {
    id: "spaja-design-system",
    name: "SPAJA Design System",
    description:
      "Unified UI komponentna biblioteka — konzistentan dizajn, dark theme, responsive grid, animacije i pristupačnost za sve platforme.",
    icon: "🎨",
    category: "acceleration",
    features: [
      "Reusable UI komponente",
      "Dark/Light tema podrška",
      "Responsive grid sistem",
      "Animacije i tranzicije",
      "Accessibility (WCAG 2.1)",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "high",
  },
  {
    id: "spaja-testing",
    name: "SPAJA Testing",
    description:
      "Automatizovani testing framework — unit, integration, E2E testovi, visual regression i performance benchmarks za sve platforme.",
    icon: "🧪",
    category: "deployment",
    features: [
      "Unit testovi (Vitest/Jest)",
      "E2E testovi (Playwright)",
      "Visual regression testiranje",
      "Performance benchmarks",
      "Automatski test reports",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "high",
  },
  {
    id: "spaja-payments",
    name: "SPAJA Payments",
    description:
      "Unified payment processing — kripto transakcije, fiat plaćanja, Stripe/PayPal integracija, multi-currency podrška.",
    icon: "💳",
    category: "integration",
    features: [
      "Kripto transakcije (BTC, ETH, USDT)",
      "Fiat plaćanja (RSD, EUR, USD)",
      "Stripe & PayPal integracija",
      "Multi-currency konverzija",
      "Transakcioni izveštaji",
    ],
    targetPlatforms: [
      "AI IQ World Bank",
      "AI IQ Menjačnica",
      "Kompanija SPAJA",
    ],
    impact: "high",
  },
  {
    id: "spaja-notifications",
    name: "SPAJA Notifications",
    description:
      "Centralizovani sistem za notifikacije — push, email, SMS, in-app obaveštenja i alerting za sve platforme.",
    icon: "🔔",
    category: "communication",
    features: [
      "Push notifikacije (web & mobile)",
      "Email obaveštenja (SMTP)",
      "SMS integracija",
      "In-app notifikacije",
      "Alert prioritizacija",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "medium",
  },
  {
    id: "spaja-i18n",
    name: "SPAJA i18n",
    description:
      "Internacionalizacija za globalni doseg — podrška za srpski, engleski, nemački, i još 20+ jezika. RTL podrška.",
    icon: "🌍",
    category: "integration",
    features: [
      "Multi-language podrška (20+ jezika)",
      "Srpski, engleski, nemački",
      "RTL layout podrška",
      "Automatski prevod (AI)",
      "Locale-aware formatiranje",
    ],
    targetPlatforms: [
      "Sve platforme",
      "SVETSKA ORGANIZACIJA",
    ],
    impact: "medium",
  },
  {
    id: "spaja-backup",
    name: "SPAJA Backup",
    description:
      "Disaster recovery i backup sistem — automatski snapshots, geo-redundantno skladištenje, instant restore za sve podatke.",
    icon: "💾",
    category: "security",
    features: [
      "Automatski daily snapshots",
      "Geo-redundantno skladištenje",
      "Instant restore (<5 min)",
      "Verzionisanje podataka",
      "Disaster recovery plan",
    ],
    targetPlatforms: [
      "AI IQ World Bank",
      "AI IQ Menjačnica",
      "Sve platforme",
    ],
    impact: "high",
  },
  {
    id: "spaja-docs",
    name: "SPAJA Docs",
    description:
      "Auto-generisana dokumentacija — API docs, user guides, developer portal, changelog i knowledge base za sve platforme.",
    icon: "📚",
    category: "acceleration",
    features: [
      "Automatska API dokumentacija",
      "Interaktivni developer portal",
      "User guides & tutorials",
      "Changelog generator",
      "Knowledge base sa pretragom",
    ],
    targetPlatforms: ["Sve platforme"],
    impact: "medium",
  },
  // ── IO/OPENUI/AO Gaming & Lab ──────────────────────────────────────
  {
    id: "io-openui-ao-gaming-engine",
    name: "IO/OPENUI/AO Gaming Engine",
    description:
      "Univerzalni gaming engine za IO/OPENUI/AO platformu — 95 igrica u 18 kategorija sa SPAJA Univerzalnim Endžinom i dimenzionalnim renderovanjem 360D-5760D.",
    icon: "🎮",
    category: "integration",
    features: [
      "95 igrica u 18 kategorija",
      "SPAJA Univerzalni Endžin 100% pokrivenost",
      "Dimenzionalno renderovanje 360D-5760D",
      "SpajaPro 6-15 Prompt integracija",
      "OMEGA AI persona integracija",
    ],
    targetPlatforms: ["IO OpenUI AO", "AI IQ SUPER PLATFORMA"],
    impact: "high",
  },
  {
    id: "io-openui-ao-lab-simulacije",
    name: "IO/OPENUI/AO Lab Simulacioni Sistem",
    description:
      "Simulacioni sistem za IOOpenUIAO Laboratoriju — 10 simulacija u 8 naučnih kategorija sa prosečnom preciznošću 91%.",
    icon: "🔬",
    category: "ai",
    features: [
      "10 naučnih simulacija",
      "8 kategorija simulacija",
      "8 laboratorijskih alata",
      "Prosečna preciznost 91%",
      "3D vizualizacija i spektralna analiza",
    ],
    targetPlatforms: ["IO OpenUI AO", "AI IQ SUPER PLATFORMA"],
    impact: "high",
  },
  {
    id: "io-openui-ao-analitika",
    name: "IO/OPENUI/AO Analitika",
    description:
      "Analitičko-dijagnostički sistem za IO/OPENUI/AO platformu — kombinovana analitika gaming platforme i laboratorije.",
    icon: "📊",
    category: "monitoring",
    features: [
      "Gaming performans analitika",
      "Lab preciznost praćenje",
      "Kombinovani dashboard",
      "Zdravlje platforme monitoring",
      "Trend analiza po kategorijama",
    ],
    targetPlatforms: ["IO OpenUI AO", "AI IQ SUPER PLATFORMA"],
    impact: "medium",
  },
];

export const productCategoryLabels: Record<ITProductCategory, string> = {
  acceleration: "Ubrzanje Procesa",
  monitoring: "Monitoring & Analitika",
  security: "Bezbednost",
  ai: "AI & Machine Learning",
  deployment: "Deployment & DevOps",
  integration: "Integracija Platformi",
  data: "Podaci & Skladištenje",
  communication: "Komunikacija & Obaveštenja",
};

export const productCategoryIcons: Record<ITProductCategory, string> = {
  acceleration: "⚡",
  monitoring: "📊",
  security: "🛡️",
  ai: "🧠",
  deployment: "🚀",
  integration: "🌐",
  data: "🗄️",
  communication: "🔔",
};
