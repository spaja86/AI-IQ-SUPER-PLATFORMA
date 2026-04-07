import type { Platform, EntityStatus } from './types';

export type { Platform };

export function getStatusLabel(status: EntityStatus): string {
  const labels: Record<EntityStatus, string> = {
    active: 'Aktivno',
    development: 'U razvoju',
    planned: 'Planirano',
    archived: 'Arhivirano',
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: EntityStatus): string {
  const colors: Record<EntityStatus, string> = {
    active: 'text-emerald-400',
    development: 'text-amber-400',
    planned: 'text-blue-400',
    archived: 'text-zinc-400',
  };
  return colors[status] ?? 'text-zinc-400';
}

export const platforms: Platform[] = [
  // ── Core ──────────────────────────────────────────────────────────────
  {
    id: 'ai-iq-super',
    name: 'AI-IQ SUPER PLATFORMA',
    description: 'Centralna platforma koja povezuje sve pod-platforme, organizacije i kompanije u jedinstveni digitalni ekosistem.',
    category: 'core',
    status: 'active',
    icon: '🧠',
    techStack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Vercel'],
    features: ['Centralni dashboard', 'Ekosistem pregled', 'Deploy management', 'API Gateway'],
    deploy: { status: 'deployed', domain: 'ai-iq-super-platforma.vercel.app', vercelProject: 'ai-iq-super-platforma', framework: 'nextjs', buildCommand: 'npm run build' },
  },
  {
    id: 'io-openui-ao',
    name: 'IO-OPENUI-AO',
    description: 'Unified frontend sa modulima za banku, menjačnicu, kompaniju i AI — WebRTC i Socket.IO integracija.',
    category: 'core',
    status: 'active',
    icon: '🌐',
    techStack: ['React', 'WebRTC', 'Socket.IO', 'Vercel'],
    features: ['Bank modul', 'Exchange modul', 'Company modul', 'AI modul', 'Real-time chat'],
    deploy: { status: 'deployed', domain: 'io-openui-ao.vercel.app', vercelProject: 'io-openui-ao', framework: 'react', buildCommand: 'npm run build' },
  },
  // ── Finance ───────────────────────────────────────────────────────────
  {
    id: 'banka-platforma',
    name: 'SPAJA Banka',
    description: 'Digitalna bankarska platforma sa podrškom za račune, transakcije, kredite i investicije.',
    category: 'finance',
    status: 'development',
    icon: '🏦',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    features: ['Digitalni računi', 'Transakcije', 'Krediti', 'Investicije', 'KYC/AML'],
  },
  {
    id: 'menjacnica-platforma',
    name: 'SPAJA Menjačnica',
    description: 'Platforma za razmenu valuta — fiat i crypto — sa real-time kursevima.',
    category: 'finance',
    status: 'development',
    icon: '💱',
    techStack: ['Next.js', 'TypeScript', 'WebSocket', 'Redis'],
    features: ['Fiat exchange', 'Crypto exchange', 'Real-time rates', 'Portfolio tracking'],
  },
  // ── AI ────────────────────────────────────────────────────────────────
  {
    id: 'ai-engine',
    name: 'AI Engine',
    description: 'Centralni AI motor sa ML modelima, NLP-om i automatizacijom za ceo ekosistem.',
    category: 'ai',
    status: 'development',
    icon: '🤖',
    techStack: ['Python', 'FastAPI', 'TensorFlow', 'OpenAI API'],
    features: ['NLP procesiranje', 'ML modeli', 'Automatizacija', 'AI asistenti'],
  },
  {
    id: 'ai-analytics',
    name: 'AI Analitika',
    description: 'Platforma za naprednu analitiku i business intelligence sa AI podrškom.',
    category: 'ai',
    status: 'planned',
    icon: '📊',
    techStack: ['Python', 'Next.js', 'D3.js', 'BigQuery'],
    features: ['Dashboards', 'Predictive analytics', 'Custom reports', 'Data visualization'],
  },
  // ── Social ────────────────────────────────────────────────────────────
  {
    id: 'social-network',
    name: 'SPAJA Social',
    description: 'Interna i eksterna društvena mreža za povezivanje zaposlenih, partnera i korisnika.',
    category: 'social',
    status: 'planned',
    icon: '👥',
    techStack: ['Next.js', 'GraphQL', 'PostgreSQL', 'Redis'],
    features: ['Profili', 'Feed', 'Grupe', 'Poruke', 'Događaji'],
  },
  // ── Commerce ──────────────────────────────────────────────────────────
  {
    id: 'marketplace',
    name: 'SPAJA Marketplace',
    description: 'Digitalna tržnica za proizvode i usluge unutar ekosistema.',
    category: 'commerce',
    status: 'planned',
    icon: '🛒',
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    features: ['Prodavnice', 'Proizvodi', 'Narudžbe', 'Plaćanja', 'Recenzije'],
  },
  // ── Global ────────────────────────────────────────────────────────────
  {
    id: 'global-connect',
    name: 'Global Connect',
    description: 'Platforma za međunarodno povezivanje i ekspanziju na globalna tržišta.',
    category: 'global',
    status: 'planned',
    icon: '🌍',
    techStack: ['Next.js', 'TypeScript', 'i18n', 'CDN'],
    features: ['Multi-language', 'Regional hubs', 'Partneri', 'Compliance'],
  },
  // ── Tools ─────────────────────────────────────────────────────────────
  {
    id: 'devops-tools',
    name: 'DevOps Alati',
    description: 'Interna platforma za CI/CD, monitoring, logging i infrastrukturu.',
    category: 'tools',
    status: 'active',
    icon: '🔧',
    techStack: ['Docker', 'GitHub Actions', 'Vercel', 'Grafana'],
    features: ['CI/CD pipelines', 'Monitoring', 'Logging', 'Alerting'],
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Centralizovani admin panel za upravljanje celim ekosistemom.',
    category: 'tools',
    status: 'development',
    icon: '⚙️',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    features: ['User management', 'Roles & permissions', 'Audit log', 'Settings'],
  },
];

export const platformCategories: Record<string, { label: string; icon: string }> = {
  core: { label: 'Core Platforme', icon: '🧠' },
  finance: { label: 'Finansije', icon: '💰' },
  global: { label: 'Globalno', icon: '🌍' },
  ai: { label: 'AI & ML', icon: '🤖' },
  social: { label: 'Društveno', icon: '👥' },
  tools: { label: 'Alati', icon: '🔧' },
  commerce: { label: 'Trgovina', icon: '🛒' },
  education: { label: 'Edukacija', icon: '📚' },
  media: { label: 'Mediji', icon: '📺' },
};

export function getPlatformsByCategory(category: string): Platform[] {
  return platforms.filter((p) => p.category === category);
}

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find((p) => p.id === id);
}

export function getActivePlatforms(): Platform[] {
  return platforms.filter((p) => p.status === 'active');
}
