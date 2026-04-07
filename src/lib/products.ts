import type { Product } from './types';

export const products: Product[] = [
  // ── Acceleration ──────────────────────────────────────────────────────
  {
    id: 'turbo-cache',
    name: 'TurboCache',
    description: 'Ultra-brzi caching layer za sve platforme u ekosistemu.',
    category: 'acceleration',
    status: 'active',
    icon: '⚡',
    version: '1.2.0',
    platformId: 'ai-iq-super',
    features: ['Edge caching', 'Cache invalidation', 'Multi-layer cache'],
    techStack: ['Redis', 'CDN', 'Edge Functions'],
  },
  {
    id: 'speed-optimizer',
    name: 'SpeedOptimizer',
    description: 'Alat za optimizaciju performansi web aplikacija.',
    category: 'acceleration',
    status: 'active',
    icon: '🚀',
    version: '2.0.0',
    features: ['Code splitting', 'Image optimization', 'Lazy loading', 'Bundle analysis'],
    techStack: ['Webpack', 'Sharp', 'Lighthouse'],
  },
  {
    id: 'load-balancer',
    name: 'LoadBalancer Pro',
    description: 'Inteligentni load balancer sa health check-ovima i auto-scaling-om.',
    category: 'acceleration',
    status: 'active',
    icon: '⚖️',
    version: '1.0.0',
    features: ['Round-robin', 'Health checks', 'Auto-scaling', 'Rate limiting'],
    techStack: ['Go', 'Docker', 'Kubernetes'],
  },
  // ── Monitoring ────────────────────────────────────────────────────────
  {
    id: 'watchdog',
    name: 'Watchdog',
    description: 'Centralizovani monitoring sistem za sve servise i platforme.',
    category: 'monitoring',
    status: 'active',
    icon: '👁️',
    version: '1.5.0',
    platformId: 'devops-tools',
    features: ['Real-time monitoring', 'Alerts', 'Dashboards', 'Log aggregation'],
    techStack: ['Grafana', 'Prometheus', 'Loki'],
  },
  {
    id: 'health-checker',
    name: 'HealthChecker',
    description: 'Automatski health check servis za praćenje dostupnosti svih platformi.',
    category: 'monitoring',
    status: 'active',
    icon: '💚',
    version: '1.1.0',
    platformId: 'devops-tools',
    features: ['Endpoint monitoring', 'Uptime tracking', 'Status pages', 'Incident alerts'],
    techStack: ['Node.js', 'Cron', 'WebSocket'],
  },
  // ── Security ──────────────────────────────────────────────────────────
  {
    id: 'shield',
    name: 'Shield',
    description: 'Security layer sa WAF-om, rate limiting-om i DDoS zaštitom.',
    category: 'security',
    status: 'active',
    icon: '🛡️',
    version: '2.1.0',
    features: ['WAF', 'Rate limiting', 'DDoS protection', 'IP blocking'],
    techStack: ['Cloudflare', 'Vercel Edge', 'Custom rules'],
  },
  {
    id: 'auth-service',
    name: 'AuthService',
    description: 'Centralizovani authentication i authorization servis.',
    category: 'security',
    status: 'active',
    icon: '🔐',
    version: '1.0.0',
    features: ['OAuth 2.0', 'JWT', 'RBAC', 'MFA', 'SSO'],
    techStack: ['Next-Auth', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'vault',
    name: 'Vault',
    description: 'Sigurno skladište za API ključeve, tajne i konfiguracije.',
    category: 'security',
    status: 'active',
    icon: '🔒',
    version: '1.0.0',
    features: ['Secret management', 'Key rotation', 'Encryption at rest', 'Audit logs'],
    techStack: ['HashiCorp Vault', 'AWS KMS'],
  },
  // ── AI ────────────────────────────────────────────────────────────────
  {
    id: 'smart-assistant',
    name: 'Smart Assistant',
    description: 'AI-powered asistent za korisničku podršku i automatizaciju zadataka.',
    category: 'ai',
    status: 'active',
    icon: '🧞',
    version: '1.0.0',
    platformId: 'ai-engine',
    features: ['Chatbot', 'Task automation', 'Knowledge base', 'Multi-language'],
    techStack: ['OpenAI API', 'LangChain', 'Vector DB'],
  },
  // ── Deployment ────────────────────────────────────────────────────────
  {
    id: 'deploy-engine',
    name: 'DeployEngine',
    description: 'Automatizovani deployment pipeline za sve platforme.',
    category: 'deployment',
    status: 'active',
    icon: '🚀',
    version: '1.3.0',
    platformId: 'devops-tools',
    features: ['Auto deploy', 'Rollback', 'Preview environments', 'Blue-green deploy'],
    techStack: ['Vercel', 'GitHub Actions', 'Docker'],
  },
  {
    id: 'container-manager',
    name: 'ContainerManager',
    description: 'Upravljanje Docker kontejnerima i orkestracija servisa.',
    category: 'deployment',
    status: 'active',
    icon: '📦',
    version: '1.0.0',
    platformId: 'devops-tools',
    features: ['Container orchestration', 'Service discovery', 'Health monitoring', 'Auto-restart'],
    techStack: ['Docker', 'Kubernetes', 'Helm'],
  },
  // ── Integration ───────────────────────────────────────────────────────
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Centralni API gateway za sve mikroservise u ekosistemu.',
    category: 'integration',
    status: 'active',
    icon: '🔗',
    version: '1.4.0',
    platformId: 'ai-iq-super',
    features: ['Routing', 'Auth', 'Rate limiting', 'Logging', 'Versioning'],
    techStack: ['Next.js API Routes', 'Middleware', 'Edge Functions'],
  },
  {
    id: 'event-bus',
    name: 'EventBus',
    description: 'Event-driven messaging sistem za komunikaciju između servisa.',
    category: 'integration',
    status: 'active',
    icon: '📡',
    version: '1.0.0',
    features: ['Pub/Sub', 'Event sourcing', 'Dead letter queue', 'Retry logic'],
    techStack: ['Redis Streams', 'WebSocket', 'NATS'],
  },
  {
    id: 'data-sync',
    name: 'DataSync',
    description: 'Sinhronizacija podataka između platformi i servisa u realnom vremenu.',
    category: 'integration',
    status: 'active',
    icon: '🔄',
    version: '1.0.0',
    features: ['Real-time sync', 'Conflict resolution', 'Offline support', 'Webhooks'],
    techStack: ['CRDTs', 'WebSocket', 'PostgreSQL'],
  },
  // ── Data ──────────────────────────────────────────────────────────────
  {
    id: 'data-warehouse',
    name: 'DataWarehouse',
    description: 'Centralno skladište podataka za analitiku i izveštavanje.',
    category: 'data',
    status: 'active',
    icon: '🗄️',
    version: '1.0.0',
    features: ['ETL pipelines', 'Data modeling', 'Query optimization', 'Partitioning'],
    techStack: ['PostgreSQL', 'BigQuery', 'dbt'],
  },
  // ── Communication ─────────────────────────────────────────────────────
  {
    id: 'messenger',
    name: 'Messenger',
    description: 'Real-time messaging servis za komunikaciju unutar ekosistema.',
    category: 'communication',
    status: 'active',
    icon: '💬',
    version: '1.0.0',
    platformId: 'social-network',
    features: ['1-on-1 chat', 'Group chat', 'File sharing', 'Video calls'],
    techStack: ['WebRTC', 'Socket.IO', 'Redis'],
  },
  // ── Analytics ─────────────────────────────────────────────────────────
  {
    id: 'analytics-engine',
    name: 'AnalyticsEngine',
    description: 'Motor za prikupljanje i analizu korisničkih i poslovnih podataka.',
    category: 'analytics',
    status: 'active',
    icon: '📈',
    version: '1.0.0',
    platformId: 'ai-analytics',
    features: ['Event tracking', 'Funnels', 'Cohort analysis', 'Custom dashboards'],
    techStack: ['ClickHouse', 'Next.js', 'D3.js'],
  },
];

export const productCategories: Record<string, { label: string; icon: string }> = {
  acceleration: { label: 'Ubrzanje', icon: '⚡' },
  monitoring: { label: 'Monitoring', icon: '👁️' },
  security: { label: 'Bezbednost', icon: '🛡️' },
  ai: { label: 'AI & ML', icon: '🤖' },
  deployment: { label: 'Deployment', icon: '🚀' },
  integration: { label: 'Integracija', icon: '🔗' },
  data: { label: 'Podaci', icon: '🗄️' },
  communication: { label: 'Komunikacija', icon: '💬' },
  analytics: { label: 'Analitika', icon: '📈' },
  automation: { label: 'Automatizacija', icon: '⚙️' },
};

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.status === 'active');
}

export function getProductsByPlatform(platformId: string): Product[] {
  return products.filter((p) => p.platformId === platformId);
}
