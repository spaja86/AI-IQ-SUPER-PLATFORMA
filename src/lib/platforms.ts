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
}

export type PlatformCategory = "core" | "finance" | "ai" | "social" | "tools";
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
  },
  {
    id: "io-openui-ao",
    name: "IO OPENUI AO",
    description:
      "Platforma za profesionalnu saradnju, igrice i mnogo toga još. Koristi WebRTC i Socket.IO.",
    category: "core",
    repo: "https://github.com/spaja86/IO-OPENUI-AO",
    url: "https://github.com/spaja86/IO-OPENUI-AO",
    icon: "🖥️",
    status: "development",
    progress: 25,
    technologies: ["TypeScript", "Vite", "WebRTC", "Socket.IO", "Vercel"],
    features: [
      "Real-time WebRTC komunikacija",
      "Socket.IO chat",
      "Vercel konfiguracija",
      "Profesionalna saradnja",
    ],
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
  },
  {
    id: "ai-iq-world-bank",
    name: "AI IQ World Bank",
    description:
      "Najbolja banka na svetu, maksimalno profesionalna, saradnju ima sa svim bankama.",
    category: "finance",
    repo: "https://github.com/spaja86/Ai-Iq-World-Bank",
    url: "https://github.com/spaja86/Ai-Iq-World-Bank",
    icon: "🏦",
    status: "development",
    progress: 15,
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "Profesionalni bankarski sajt",
      "Omega AI tehnologija",
      "Svetska pokrivenost",
      "Kontakt info",
    ],
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
  },
  {
    id: "svetska-organizacija",
    name: "SVETSKA ORGANIZACIJA",
    description: "Svetska organizacija za dobrobit čovečanstva.",
    category: "core",
    repo: "https://github.com/spaja86/SVETSKA-ORGANIZACIJA",
    url: "https://github.com/spaja86/SVETSKA-ORGANIZACIJA",
    icon: "🌍",
    status: "planning",
    progress: 2,
    technologies: ["Planirano"],
    features: [
      "Dobrobit čovečanstva",
      "Svetska misija",
      "Humanitarni rad",
      "Globalna mreža",
    ],
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
  },
  {
    id: "omega-ai-github",
    name: "OMEGA AI za GitHub",
    description:
      "Omega AI koji beskonačno evolvuirajuće unapređuje GitHub platformu.",
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
  },
];

export const categoryLabels: Record<PlatformCategory, string> = {
  core: "Osnovna Infrastruktura",
  finance: "Finansije & Trgovanje",
  ai: "OMEGA AI Sistemi",
  social: "Socijalne Mreže",
  tools: "Alati & Integracije",
};

export const categoryIcons: Record<PlatformCategory, string> = {
  core: "🏗️",
  finance: "💰",
  ai: "🧠",
  social: "📱",
  tools: "🔧",
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
