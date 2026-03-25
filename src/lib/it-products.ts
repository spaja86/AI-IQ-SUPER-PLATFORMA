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
  | "integration";

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
];

export const productCategoryLabels: Record<ITProductCategory, string> = {
  acceleration: "Ubrzanje Procesa",
  monitoring: "Monitoring & Analitika",
  security: "Bezbednost",
  ai: "AI & Machine Learning",
  deployment: "Deployment & DevOps",
  integration: "Integracija Platformi",
};

export const productCategoryIcons: Record<ITProductCategory, string> = {
  acceleration: "⚡",
  monitoring: "📊",
  security: "🛡️",
  ai: "🧠",
  deployment: "🚀",
  integration: "🌐",
};
