/** Image-inspired architecture inventory, not a registry of executable services. */
export const OMEGA_MODULES = [
  {
    id: 'snoe',
    title: 'SpajaNikOpenEvolution',
    short: 'SNOE',
    group: 'vision',
    state: 'planned',
    items: [
      'Vizuelni misaoni interfejs',
      'Laboratorija i test okruženje',
      'Galaktička integracija',
    ],
  },
  {
    id: 'openui',
    title: 'I/O OpenUI / AO',
    short: 'I/O',
    group: 'vision',
    state: 'planned',
    items: [
      'WebRTC · Socket.IO · SSE',
      'Multimodalni interfejs',
      'Digitalni browser / CRDT',
    ],
  },
  {
    id: 'suoc',
    title: 'SpajaUltraOmegaCore',
    short: 'SUOC',
    group: 'vision',
    state: 'local',
    items: [
      'AKTIVIRAJ · IZGRADI · POKRENI',
      'Postojeći SUOC parser i runtime',
      'Ograničeni numerički VRH pozivi',
    ],
  },
  {
    id: 'bank',
    title: 'AI IQ World Bank',
    short: 'BANK',
    group: 'vision',
    state: 'planned',
    items: [
      'Koncept bankarskog modula',
      'Kartice i finansijski pregled',
      'Bez platnih operacija u ovom skeletu',
    ],
  },
  {
    id: 'company',
    title: 'Kompanija SPAJA',
    short: 'SPAJA',
    group: 'vision',
    state: 'planned',
    items: ['Brend i kampanje', 'Video · audio · slike', 'Srbija / Smederevo'],
  },
  {
    id: 'games',
    title: 'Game platforme',
    short: 'G01',
    group: 'games',
    state: 'planned',
    items: [
      'Dota 1250 · 7v7 MOBA',
      'AI draft / synergy',
      'MMR · XP · skill tree',
    ],
  },
  {
    id: 'poker',
    title: 'Spaja Poker',
    short: 'G02',
    group: 'games',
    state: 'planned',
    items: [
      'Špil i pravila igre',
      'Liga / eliminacija / dueli',
      'Interfejs za budući adapter',
    ],
  },
  {
    id: 'transformers',
    title: 'Transformers 1350',
    short: 'G03',
    group: 'games',
    state: 'planned',
    items: [
      'Mapa i transformacije',
      'Replay i simulacija',
      'Interfejs za budući adapter',
    ],
  },
  {
    id: 'agents',
    title: 'Multi-Agent System',
    short: 'MAS',
    group: 'execution',
    state: 'planned',
    items: [
      'Simulation · Analysis · Validation',
      'Reporting · RL / PPO',
      'Task orchestrator · Tool calling / RAG',
    ],
  },
  {
    id: 'backend',
    title: 'SPAJA Backend Core',
    short: 'CORE',
    group: 'execution',
    state: 'planned',
    items: [
      'Trigger Engine · RLHF · PDF',
      'API Gateway · Event Bus · Queue',
      'Audit · Failover · Policy Engine',
    ],
  },
  {
    id: 'vrh',
    title: 'VRH numeričko jezgro',
    short: 'VRH',
    group: 'execution',
    state: 'local',
    items: [
      'Postojeći VRH dispatcher',
      'A: zbir 1–3 = 6',
      'B: sačuvan rezultat 6–8 = 21',
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Validation',
    short: 'AUTO',
    group: 'execution',
    state: 'planned',
    items: [
      'Integration tests · Benchmarks',
      'Snapshot / RLHF update',
      'Audit i GPU health adapteri',
    ],
  },
  {
    id: 'ovsm',
    title: 'Naučni zapisi / OVSM',
    short: 'OVSM',
    group: 'domains',
    state: 'planned',
    items: [
      'Statika / dinamika / formule',
      '3D prikaz / evaluator',
      'Biblioteka naučnih zapisa',
    ],
  },
  {
    id: 'creative',
    title: 'Kreativni koncepti',
    short: 'IDEA',
    group: 'domains',
    state: 'planned',
    items: [
      'Muzički i vizuelni koncepti',
      '3D hologrami / baneri',
      'Digitalna industrija',
    ],
  },
  {
    id: 'nbs',
    title: 'NBS komunikacija',
    short: 'NBS',
    group: 'domains',
    state: 'planned',
    items: [
      'Dokumenti i formulari',
      'Pregled zahteva',
      'Spoljna komunikacija nije povezana',
    ],
  },
  {
    id: 'gpu',
    title: 'GPU Compute Cluster',
    short: 'GPU',
    group: 'foundation',
    state: 'planned',
    items: [
      'PyTorch / TensorFlow',
      'Auto-scaling · Load balancer',
      'Bare-metal GPU serveri',
    ],
  },
  {
    id: 'storage',
    title: 'Data & Storage Layer',
    short: 'DATA',
    group: 'foundation',
    state: 'partial',
    items: [
      'Lokalno: SQLite + revizijski događaji',
      'Plan: S3 · PostgreSQL · Redis',
      'Plan: Vector DB · Time series',
    ],
  },
  {
    id: 'cloud',
    title: 'Infrastructure & Cloud',
    short: 'INFRA',
    group: 'foundation',
    state: 'planned',
    items: [
      'Nezavisni SPAJA deploy',
      'GitHub · Docker · Kubernetes',
      'Cloudflare / Supabase adapteri',
    ],
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    short: 'SEC',
    group: 'operations',
    state: 'partial',
    items: [
      'Lokalno: loopback / origin provera',
      'Plan: RBAC · HSM · TLS / E2EE',
      'Sertifikacije nisu potvrđene',
    ],
  },
  {
    id: 'pipeline',
    title: 'Pipeline & Deployment',
    short: 'CI/CD',
    group: 'operations',
    state: 'planned',
    items: [
      'Planiranje → razvoj → test',
      'Validacija → deploy → monitoring',
      'Spoljni CI status nije telemetrija ove table',
    ],
  },
  {
    id: 'recovery',
    title: 'Failover & Recovery',
    short: 'RESTORE',
    group: 'operations',
    state: 'partial',
    items: [
      'Lokalno: prekid / retry / sačuvan rezultat',
      'Plan: backup GPU · snapshot rollback',
      'Nema automatskog cloud failover-a',
    ],
  },
  {
    id: 'monitoring',
    title: 'Live Monitoring & Alerts',
    short: 'OBS',
    group: 'operations',
    state: 'partial',
    items: [
      'Lokalno: status zadatka i audit',
      'Plan: Grafana · Prometheus · Loki',
      'Plan: spoljna obaveštenja',
    ],
  },
  {
    id: 'scp',
    title: 'Supervisor Control Panel',
    short: 'SCP',
    group: 'supervisor',
    state: 'local',
    items: [
      'Pregled skeleta',
      'Priprema i pokretanje VRH primera',
      'Postojeći SUOC pilot API',
    ],
  },
] as const;

export type OmegaModuleId = (typeof OMEGA_MODULES)[number]['id'];
export interface OmegaLink {
  from: OmegaModuleId;
  to: OmegaModuleId;
  kind: 'control' | 'data' | 'monitoring';
  state: 'local' | 'proposed';
}

/** Explicit architectural subset; image arrows are not 270 verified integrations. */
const local = (
  from: OmegaModuleId,
  to: OmegaModuleId,
  kind: OmegaLink['kind']
): OmegaLink => ({ from, to, kind, state: 'local' });
const proposed = (
  from: OmegaModuleId,
  to: OmegaModuleId,
  kind: OmegaLink['kind'] = 'data'
): OmegaLink => ({ from, to, kind, state: 'proposed' });
export const OMEGA_LINKS: readonly OmegaLink[] = [
  local('scp', 'suoc', 'control'),
  local('suoc', 'vrh', 'control'),
  local('vrh', 'storage', 'data'),
  local('storage', 'monitoring', 'monitoring'),
  proposed('snoe', 'openui'),
  proposed('openui', 'scp', 'control'),
  proposed('bank', 'backend'),
  proposed('company', 'creative'),
  proposed('games', 'backend'),
  proposed('poker', 'backend'),
  proposed('transformers', 'backend'),
  proposed('scp', 'agents', 'control'),
  proposed('agents', 'backend', 'control'),
  proposed('backend', 'vrh', 'control'),
  proposed('backend', 'automation', 'control'),
  proposed('ovsm', 'backend'),
  proposed('creative', 'backend'),
  proposed('nbs', 'bank'),
  proposed('gpu', 'agents'),
  proposed('backend', 'storage'),
  proposed('cloud', 'backend', 'control'),
  proposed('security', 'backend', 'control'),
  proposed('pipeline', 'cloud', 'control'),
  proposed('recovery', 'storage', 'control'),
  proposed('automation', 'monitoring', 'monitoring'),
];

export const OMEGA_SKELETON = {
  version: 'omega-skeleton-v1',
  title: 'SPAJA MASTER OMEGA',
  referenceConnectionTarget: 270,
  scope: 'Lokalni VRH pilot + plan arhitekture prema referentnoj slici.',
  modules: OMEGA_MODULES,
  links: OMEGA_LINKS,
} as const;
