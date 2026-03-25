export type DeployStatus = "deployed" | "failing" | "not-deployed" | "no-domain";

export interface DeployInfo {
  status: DeployStatus;
  domain?: string;
  vercelProject?: string;
  framework: string;
  buildCommand: string;
  outputDir?: string;
  rootDir?: string;
  nodeVersion?: string;
  notes?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  category: PlatformCategory;
  repo: string;
  url: string;
  icon: string;
  status: PlatformStatus;
  progress: number;
  technologies: string[];
  features: string[];
  deploy: DeployInfo;
}

export type PlatformCategory = "core" | "finance" | "ai" | "social" | "tools" | "global";
export type PlatformStatus = "active" | "development" | "planning" | "ready";

export const platforms: Platform[] = [
  {
    id: "ai-iq-super-platforma",
    name: "AI IQ SUPER PLATFORMA",
    description:
      "Centralni hub koji spaja sve platforme Kompanije SPAJA u jednu mega-korporaciju.",
    category: "core",
    repo: "https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA",
    url: "/dashboard",
    icon: "🏢",
    status: "active",
    progress: 100,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    features: [
      "Dashboard za sve platforme",
      "IT proizvodi",
      "Status monitoring",
      "Vercel deployment",
    ],
    deploy: {
      status: "deployed",
      vercelProject: "ai-iq-super-platforma",
      framework: "Next.js",
      buildCommand: "next build",
      notes: "Glavni hub — deploy radi. Treba kupiti custom domen.",
    },
  },
  {
    id: "io-openui-ao",
    name: "IO OPENUI AO",
    description:
      "Unified SPAJA Ekosistem — 4 servisa na jednom mestu: Banka, Menjačnica, Kompanija i AI platforma. WebRTC glasovni AI chat, Socket.IO real-time chat, Vercel deployment.",
    category: "core",
    repo: "https://github.com/spaja86/IO-OPENUI-AO",
    url: "https://github.com/spaja86/IO-OPENUI-AO",
    icon: "🖥️",
    status: "development",
    progress: 65,
    technologies: ["TypeScript", "Vite", "WebRTC", "Socket.IO", "OpenAI API", "Express", "Vercel"],
    features: [
      "Unified ekosistem frontend (4 servisa)",
      "WebRTC glasovni AI chat sa OpenAI",
      "Socket.IO real-time tekstualni chat",
      "Banka + Menjačnica + Kompanija + AI moduli",
      "Vercel konfiguracija sa rutiranjem",
      "Profesionalna saradnja",
    ],
    deploy: {
      status: "failing",
      domain: "ioopenuiao.com",
      vercelProject: "io-openui-ao",
      framework: "Other",
      buildCommand: "",
      outputDir: "public",
      rootDir: ".",
      nodeVersion: "18.x",
      notes: "Domen zakupljen ali deploy FAIL. Proveri: (1) Framework Preset → 'Other', (2) Root Directory → '.', (3) Output Directory → 'public', (4) Build Command → prazan (statički sajt). Razlog pada: Vercel pokušava build koji ne postoji.",
    },
  },
  {
    id: "ai-iq-menjacnica",
    name: "AI IQ Menjačnica",
    description:
      "Najbolja menjačnica na svetu sa najviše kripto valuta. Svetski standardi trgovanja.",
    category: "finance",
    repo: "https://github.com/spaja86/Ai-Iq-Menja-nica",
    url: "https://github.com/spaja86/Ai-Iq-Menja-nica",
    icon: "💱",
    status: "development",
    progress: 20,
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "BUY/SELL interfejs",
      "RSD/EUR u kripto",
      "Market trade UI",
      "Live pricing",
    ],
    deploy: {
      status: "failing",
      domain: "ai-iq-menjacnica.com",
      vercelProject: "ai-iq-menjacnica",
      framework: "Other",
      buildCommand: "",
      outputDir: ".",
      rootDir: ".",
      nodeVersion: "18.x",
      notes: "Domen zakupljen ali deploy FAIL. Proveri: (1) Framework Preset → 'Other' (čist HTML/CSS/JS), (2) Output Directory → '.' (root), (3) Build Command → prazan. HTML sajt ne zahteva build — Vercel samo servira fajlove.",
    },
  },
  {
    id: "ai-iq-world-bank",
    name: "AI IQ World Bank",
    description:
      "Najbolja banka na svetu sa kompletnim sistemom — 7+ sekcija, Omega AI tehnologija, svetska pokrivenost, partneri i statistike. Saradnja sa svim bankama.",
    category: "finance",
    repo: "https://github.com/spaja86/Ai-Iq-World-Bank",
    url: "https://github.com/spaja86/Ai-Iq-World-Bank",
    icon: "🏦",
    status: "development",
    progress: 40,
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "Kompletna navigacija (7+ sekcija)",
      "Home, About, Services, Technology",
      "Omega AI tehnologija integracija",
      "Partners & Statistics sekcije",
      "Smederevo Expansion plan",
      "Kontakt + 4 socijalne mreže",
      "Profesionalni bankarski dizajn",
      "Svetska pokrivenost",
    ],
    deploy: {
      status: "no-domain",
      vercelProject: "ai-iq-world-bank",
      framework: "Other",
      buildCommand: "",
      outputDir: ".",
      rootDir: ".",
      notes: "Treba kupiti domen (npr. ai-iq-world-bank.com). HTML/CSS/JS sajt — Framework Preset → 'Other', bez build komande.",
    },
  },
  {
    id: "openai-platform",
    name: "OpenAI Platform",
    description:
      "Profesionalna platforma za poslovanje, filmove, slike, igrice i još mnogo toga.",
    category: "ai",
    repo: "https://github.com/spaja86/openai-platform",
    url: "https://github.com/spaja86/openai-platform",
    icon: "🤖",
    status: "planning",
    progress: 2,
    technologies: ["Planirano"],
    features: [
      "Poslovanje",
      "Filmovi i slike",
      "Igrice",
      "AI integracije",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Planirano",
      buildCommand: "",
      notes: "Tek u planiranju. Kada bude spreman, deploy kao Next.js ili Vite app.",
    },
  },
  {
    id: "svetska-organizacija",
    name: "SVETSKA ORGANIZACIJA",
    description: "Svetska organizacija za dobrobit čovečanstva sa Svetskim APR sistemom i svim pratećim elementima. Regulatorni i humanitarni sloj industrije.",
    category: "global",
    repo: "https://github.com/spaja86/SVETSKA-ORGANIZACIJA",
    url: "https://github.com/spaja86/SVETSKA-ORGANIZACIJA",
    icon: "🌍",
    status: "development",
    progress: 25,
    technologies: ["Planirano", "APR Sistem"],
    features: [
      "Svetski APR sistem",
      "Registracija kompanija i entiteta",
      "Dobrobit čovečanstva",
      "Svetska misija",
      "Humanitarni rad",
      "Globalna mreža",
      "Regulatorni okvir",
      "Pratečim elementima i standardima",
    ],
    deploy: {
      status: "no-domain",
      vercelProject: "svetska-organizacija",
      framework: "Other",
      buildCommand: "",
      outputDir: ".",
      rootDir: ".",
      notes: "Treba kupiti domen (npr. svetska-organizacija.org). Deploy kao statički sajt.",
    },
  },
  {
    id: "input-output-copilot",
    name: "Input/Output za Copilot",
    description:
      "Profesionalni peč za GitHub – I/O sistem za aktivnu komunikaciju sa korisnicima.",
    category: "tools",
    repo: "https://github.com/spaja86/Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno",
    url: "https://github.com/spaja86/Input-Output-za-kopilota-da-mo-e-da-komunicira-sa-korsnicima-akticno",
    icon: "🔌",
    status: "development",
    progress: 10,
    technologies: ["Python"],
    features: [
      "Autofinis I/O sistem",
      "API integracije",
      "Aktivna komunikacija",
      "GitHub peč",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Python",
      buildCommand: "",
      notes: "Python projekat — deploy na Vercel kao serverless function ili koristiti drugi hosting.",
    },
  },
  {
    id: "omega-ai-github",
    name: "OMEGA AI za GitHub",
    description:
      "Omega AI koji beskonačno evoluirajuće unapređuje GitHub platformu.",
    category: "ai",
    repo: "https://github.com/spaja86/OMEGA-AI-za-GIT-HUB",
    url: "https://github.com/spaja86/OMEGA-AI-za-GIT-HUB",
    icon: "🐙",
    status: "planning",
    progress: 1,
    technologies: ["Planirano"],
    features: [
      "GitHub unapređenje",
      "Beskonačna evolucija",
      "AI automatizacija",
      "Smart workflows",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Planirano",
      buildCommand: "",
      notes: "U planiranju. GitHub-specifičan alat — deploy kao GitHub App ili Vercel serverless.",
    },
  },
  {
    id: "omega-ai-vercel",
    name: "OMEGA AI za Vercel",
    description:
      "Omega AI koji non-stop unapređuje i poboljšava Vercel platformu.",
    category: "ai",
    repo: "https://github.com/spaja86/OMEGA-AI-za-Vercel-",
    url: "https://github.com/spaja86/OMEGA-AI-za-Vercel-",
    icon: "▲",
    status: "planning",
    progress: 1,
    technologies: ["Planirano"],
    features: [
      "Vercel unapređenje",
      "Deploy optimizacija",
      "Performance boost",
      "AI evolucija",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Planirano",
      buildCommand: "",
      notes: "U planiranju. Vercel-specifičan alat — deploy kao Vercel integration.",
    },
  },
  {
    id: "omega-ai-google",
    name: "OMEGA AI za Google",
    description:
      "Omega AI koji unapređuje i evolvuira Google ka beskonačnostima.",
    category: "ai",
    repo: "https://github.com/spaja86/-OMEGA-AI-za-Google-",
    url: "https://github.com/spaja86/-OMEGA-AI-za-Google-",
    icon: "🔍",
    status: "planning",
    progress: 1,
    technologies: ["Planirano"],
    features: [
      "Google unapređenje",
      "Search evolucija",
      "AI beskonačnost",
      "Cloud integracije",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Planirano",
      buildCommand: "",
      notes: "U planiranju. Google-specifičan alat.",
    },
  },
  {
    id: "omega-ai-social",
    name: "OMEGA AI 5 Persona",
    description:
      "OMEGA AI za Facebook, Instagram, TikTok, Threads i YouTube – 5 persona u jednom.",
    category: "social",
    repo: "https://github.com/spaja86/-OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube-",
    url: "https://github.com/spaja86/-OMEGA-AI-5-persona-za-Facebook-i-Instagram-i-TikTok-i-Threads-i-YoutYube-",
    icon: "📱",
    status: "planning",
    progress: 1,
    technologies: ["Planirano"],
    features: [
      "Facebook AI",
      "Instagram AI",
      "TikTok AI",
      "Threads & YouTube AI",
    ],
    deploy: {
      status: "not-deployed",
      framework: "Planirano",
      buildCommand: "",
      notes: "U planiranju. Social media AI alat.",
    },
  },
];

export const categoryLabels: Record<PlatformCategory, string> = {
  core: "Osnovna Infrastruktura",
  finance: "Finansije & Trgovanje",
  ai: "OMEGA AI Sistemi",
  social: "Socijalne Mreže",
  tools: "Alati & Integracije",
  global: "Globalne Organizacije",
};

export const categoryIcons: Record<PlatformCategory, string> = {
  core: "🏗️",
  finance: "💰",
  ai: "🧠",
  social: "📱",
  tools: "🔧",
  global: "🌍",
};

export function getOverallProgress(): number {
  const total = platforms.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(total / platforms.length);
}

export function getPlatformsByCategory(
  category: PlatformCategory
): Platform[] {
  return platforms.filter((p) => p.category === category);
}

export function getStatusColor(status: PlatformStatus): string {
  switch (status) {
    case "ready":
      return "text-green-400";
    case "active":
      return "text-blue-400";
    case "development":
      return "text-yellow-400";
    case "planning":
      return "text-gray-400";
  }
}

export function getStatusLabel(status: PlatformStatus): string {
  switch (status) {
    case "ready":
      return "Spremno ✅";
    case "active":
      return "Aktivno 🟢";
    case "development":
      return "U razvoju 🟡";
    case "planning":
      return "Planirano 📋";
  }
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 20) return "bg-yellow-500";
  return "bg-gray-500";
}

export function getDeployStatusLabel(status: DeployStatus): string {
  switch (status) {
    case "deployed":
      return "Deployano ✅";
    case "failing":
      return "Deploy FAIL ❌";
    case "not-deployed":
      return "Nije deployano ⬜";
    case "no-domain":
      return "Treba domen 🔴";
  }
}

export function getDeployStatusColor(status: DeployStatus): string {
  switch (status) {
    case "deployed":
      return "text-green-400";
    case "failing":
      return "text-red-400";
    case "not-deployed":
      return "text-gray-400";
    case "no-domain":
      return "text-orange-400";
  }
}

export function getDeployStats() {
  const deployed = platforms.filter((p) => p.deploy.status === "deployed").length;
  const failing = platforms.filter((p) => p.deploy.status === "failing").length;
  const noDomain = platforms.filter((p) => p.deploy.status === "no-domain").length;
  const notDeployed = platforms.filter((p) => p.deploy.status === "not-deployed").length;
  const withDomain = platforms.filter((p) => p.deploy.domain).length;
  const needDomain = platforms.filter(
    (p) => p.deploy.status !== "not-deployed" && !p.deploy.domain
  ).length;
  return { deployed, failing, noDomain, notDeployed, withDomain, needDomain };
}
