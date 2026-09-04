import type { Sekvenca } from '@/lib/types';
import { deployRegistry } from '@/lib/deploy/deploy-registry';
import { APP_VERSION } from '@/lib/constants';

const ukupno = deployRegistry.length;
const triggable = deployRegistry.filter((p) => p.manualTriggerEnabled).length;
const saHealthCheck = deployRegistry.filter((p) => p.healthUrl !== null).length;
const aktivne = deployRegistry.filter((p) => p.status === 'aktivan').length;

export const deployPlatformaSekvence: Sekvenca[] = [
  {
    id: 'deploy-platforma-hero',
    tip: 'hero',
    naslov: '🚀 Deploy Portfolio — Platforma',
    podnaslov: `v${APP_VERSION} · Centralni hub za upravljanje deploymentima`,
    ikona: '🚀',
    redosled: 1,
    podaci: {
      opis: `Unified deploy management surface za sve platforme u ekosistemu. Live Vercel status, ručno pokretanje i audit log u jednom mestu. Ukupno ${ukupno} platformi registrovano — ${aktivne} aktivno.`,
      dugmad: [
        { tekst: 'Deploy Status API', href: '/api/deploy-platforma/status' },
        { tekst: 'Portfolio Status', href: '/api/deploy-portfolio' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'deploy-platforma-statistika',
    tip: 'statistika',
    naslov: 'Pregled platformi',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: ukupno, ikona: '🌐' },
        { naziv: 'Aktivne', vrednost: aktivne, ikona: '✅' },
        { naziv: 'Triggable', vrednost: triggable, ikona: '🚀' },
        { naziv: 'Health Check', vrednost: saHealthCheck, ikona: '🩺' },
      ],
    },
  },
  {
    id: 'deploy-platforma-portfolio-grid',
    tip: 'tabela',
    naslov: '📦 Portfolio platformi',
    redosled: 3,
    podaci: {
      zaglavlje: ['Platforma', 'Runtime / Framework', 'Putanja', 'Status', 'Manual Trigger'],
      redovi: deployRegistry.map((p) => [
        `${p.ikona} ${p.naziv}`,
        p.framework,
        p.id === 'ai-iq-super-platforma' ? 'src/ → Vercel' : `platforms/${p.id}/`,
        p.status === 'aktivan' ? '✅ Aktivan' : p.status === 'u_pripremi' ? '🔧 U pripremi' : '⛔ Neaktivan',
        p.manualTriggerEnabled ? '🚀 Da' : '—',
      ]),
    },
  },
  {
    id: 'deploy-platforma-pipeline',
    tip: 'lista',
    naslov: '🔄 CI/CD Pipeline — Workflow status',
    redosled: 4,
    podaci: {
      stavke: [
        {
          naslov: '🏗️ omega-auto-build.yml',
          opis: 'Quality gate: TypeScript, ESLint, unit testovi, smoke testovi, predeploy check. Pokretanje: push/PR na main i copilot/**.',
          ikona: '✅',
        },
        {
          naslov: '🛡️ security-scanner.yml',
          opis: 'CodeQL SAST, dependency review, npm audit, secret heuristics. Pokretanje: svaki PR, nightly schedule, manual dispatch.',
          ikona: '🛡️',
        },
        {
          naslov: '⚡ nova-generacija.yml',
          opis: 'Nova Generacija CI: KPI gate ≤50ms evaluacija, ≤3 min build. Pokreće se na nova-generacija label i putanjama.',
          ikona: '⚡',
        },
        {
          naslov: '🚀 vercel-deploy.yml',
          opis: 'Manualni fallback trigger za Vercel deploy hook. Zahteva confirmToken za production.',
          ikona: '🚀',
        },
        {
          naslov: '🔗 multi-repo-sync',
          opis: 'Sinhronizacija sa IO-OPENUI-AO: config verzije, labels, milestones. Pokretanje: push na main, weekly schedule.',
          ikona: '🔗',
        },
        {
          naslov: '🧭 Mekartor rollout',
          opis: 'Repo-local staged rollout kroz deploy-platforma workflow: 10% canary → 50% staging → 100% production, bez downstream linked-repo promene.',
          ikona: '🧭',
        },
      ],
    },
  },
  {
    id: 'deploy-platforma-kpi',
    tip: 'tabela',
    naslov: '📊 Deployment KPI — Ciljne vrednosti',
    redosled: 5,
    podaci: {
      zaglavlje: ['KPI', 'Ciljna vrednost', 'Alert prag', 'Owner'],
      redovi: [
        ['API latency p95', '≤ 300ms', '> 2s', 'Platform Ops'],
        ['Nova Generacija eval p99', '≤ 50ms', '> 100ms', 'AI Engine'],
        ['Uptime SLA', '≥ 99.99%', '< 99%', 'Operations'],
        ['Build duration', '≤ 3 min', '> 10 min', 'CI / Platform Ops'],
        ['Cold start p95', '≤ 1.5s', '> 3s', 'Platform Ops'],
        ['Error rate', '< 0.1%', '> 1%', 'CI / Release Ops'],
        ['Gaming session completion', '≥ 95%', '< 80%', 'Gaming'],
        ['Fairness compliance', '100%', '< 100%', 'Gaming'],
        ['Mekartor catalog sync latency p95', '≤ 250ms', '> 1s', 'Platform Ops'],
        ['Mekartor health endpoint SLA', '≥ 99.95%', '< 99%', 'Operations'],
        ['Checkout fail rate', '< 2%', '> 5%', 'Billing'],
        ['Auth fail rate', '< 5%', '> 15%', 'Auth'],
      ],
    },
  },
  {
    id: 'deploy-platforma-agenti',
    tip: 'kartice',
    naslov: '🤖 Agent aktivnost',
    redosled: 6,
    podaci: {
      kartice: [
        {
          naslov: 'ci-bot',
          opis: 'TypeScript, ESLint, unit/smoke testovi, auto-fix manjih problema. Multi-repo scope.',
          ikona: '🏗️',
          oznake: ['Active', 'omega-auto-build.yml', 'All repos'],
        },
        {
          naslov: 'security-scanner',
          opis: 'CodeQL SAST, dependency audit, secret scanning. Blokira merge na kritičnom nalazu.',
          ikona: '🛡️',
          oznake: ['Active', 'security-scanner.yml', 'All repos'],
        },
        {
          naslov: 'nova-generacija-agent',
          opis: 'NG orchestration: SpajaPro 16 integritet, 50 persona/16 oktava, fairness provere, self-healing.',
          ikona: '⚡',
          oznake: ['Active', 'nova-generacija.yml', 'All repos'],
        },
        {
          naslov: 'deploy-bot',
          opis: 'Deploy po green CI statusu, audit log u PR komentar. Multi-repo deployment sinhronizacija.',
          ikona: '🚀',
          oznake: ['Planned', 'vercel-deploy.yml', 'All repos'],
        },
        {
          naslov: 'multi-repo-sync-agent',
          opis: 'Sinhronizacija SUPER-PLATFORMA ↔ IO-OPENUI-AO: config, verzije, labels, milestones.',
          ikona: '🔗',
          oznake: ['Ready', 'Push/Weekly', 'SUPER-PLATFORMA ↔ IO-OPENUI-AO'],
        },
        {
          naslov: 'human-review',
          opis: 'Obavezna ljudska provera pre merge-a. QA na svim kritičnim promenama.',
          ikona: '👁️',
          oznake: ['Active', 'Manual', 'All repos'],
        },
      ],
    },
  },
  {
    id: 'deploy-platforma-env-status',
    tip: 'tekst',
    naslov: '🔑 Environment i infrastruktura',
    redosled: 7,
    podaci: {
      sadrzaj: 'Sve operativne kontrole ostaju van repozitorijuma. Tajni ključevi, deploy hook-ovi, env vrednosti i produkcioni kredencijali čuvaju se isključivo u GitHub Secrets i Vercel secret management sistemu.',
      istaknuteStavke: [
        'Vercel: Next.js 16 runtime — frontend/SSR + light APIs (auth, status, zdravlje, billing)',
        'Supabase: PostgreSQL sa RLS politikama — produkciona DB sa 001 + 002 migracijama',
        'Stripe: Checkout + Webhook + Customer Portal — STRIPE_SECRET_KEY isključivo u secrets',
        'OpenAI: SpajaPro AI Chat — OPENAI_API_KEY isključivo u secrets',
        'GitHub Actions: Quality gates — lint, test, smoke, predeploy, security pre svakog deploya',
        'OMEGA JWT + Vault: Server-side only — OMEGA_JWT_SECRET + OMEGA_VAULT_KEY u prod secrets',
        'Nova Generacija: Feature flag 20% canary → 50% → 100% staged rollout',
        'Mekartor: repo-local staged rollout 10% canary → 50% staging → 100% production',
        'deploy_status.json: Javni artifact na /deploy_status.json posle svakog CI run-a',
      ],
    },
  },
  {
    id: 'deploy-platforma-roadmap',
    tip: 'lista',
    naslov: '🗺️ Deployment roadmap — Sledeći koraci',
    redosled: 8,
    podaci: {
      stavke: [
        {
          naslov: 'Nova Generacija staged rollout: 20% → 50% → 100%',
          opis: 'Validacija KPI-jeva na svakom pragu pre promocije na sledeći nivo. Exit kriterijum: sve nova-generacija metrike u zelenoj zoni.',
          ikona: '⚡',
        },
        {
          naslov: 'Mekartor staged rollout',
          opis: 'Repo-local rollout uz /api/mekartor health signal, deploy hook fallback i audit-ready PR governance.',
          ikona: '🧭',
        },
        {
          naslov: 'SpajaPro 13 / 14 / 15 stabilizacija',
          opis: 'Evolucija (13), Matriks (14) i Omega (15) moraju proći reliability + observability checklist pre aktivacije Nova Generacija 100%.',
          ikona: '📈',
        },
        {
          naslov: 'Heavy compute migracija sa Vercel',
          opis: 'Analytics aggregation, ekstremno-procesuiranje-svega i large batch jobs → containerized worker compute. Vercel ostaje za UI/SSR i light APIs.',
          ikona: '🔧',
        },
        {
          naslov: 'Vercel Enterprise onboarding',
          opis: 'Team transfer, enterprise billing, central domain management, SSO/access governance. Zahtev poslati iz kompanijskih mejlova.',
          ikona: '🏢',
        },
        {
          naslov: 'Vercel KV za globalni rate limiting',
          opis: 'Cross-instance konzistentni rate limit. Trenutna implementacija je per-instance (serverless limitacija).',
          ikona: '🔒',
        },
        {
          naslov: 'E2E testovi (Playwright) za checkout i auth',
          opis: 'Automatizovani checkout i auth flow testovi kao CI gate. P2 prioritet iz GO-LIVE.md.',
          ikona: '🧪',
        },
        {
          naslov: 'Email notifikacije (Resend / Sendgrid)',
          opis: 'Plaćanje, registracija, support trijaza. SMTP_HOST + SMTP_PASS u secrets.',
          ikona: '📧',
        },
      ],
    },
  },
  {
    id: 'deploy-platforma-api',
    tip: 'lista',
    naslov: '🔌 API Rute',
    redosled: 9,
    podaci: {
      stavke: [
        {
          naslov: 'GET /api/deploy-platforma/status',
          opis: 'Live status svih platformi sa Vercel API-ja',
          ikona: '📊',
        },
        {
          naslov: 'GET /api/deploy-portfolio',
          opis: 'Portfolio pregled: sve platforme sa statusom, runtime-om, KPI snapshot-om i metapodacima',
          ikona: '📋',
        },
        {
          naslov: 'GET /api/mekartor',
          opis: 'Repo-local Mekartor health i rollout contract payload',
          ikona: '🧭',
        },
        {
          naslov: 'POST /api/deploy-platforma/trigger',
          opis: 'Pokretanje deploymenta (zahteva confirmToken za production)',
          ikona: '🚀',
        },
        {
          naslov: 'GET /api/deploy-platforma/history/[platformId]',
          opis: 'Istorija deploymenta za datu platformu (do 20 stavki)',
          ikona: '📜',
        },
        {
          naslov: 'GET /api/deploy-platforma/health/[platformId]',
          opis: 'HTTP health check prema konfiguriranom health URL-u platforme',
          ikona: '🩺',
        },
      ],
    },
  },
  {
    id: 'deploy-platforma-bezbednost',
    tip: 'tekst',
    naslov: '🛡️ Bezbednost i gating',
    redosled: 10,
    podaci: {
      sadrzaj: 'Deploy platforma koristi višeslojnu zaštitu: rate limiting, CSRF zaštita, IP blocking i production gate token.',
      istaknuteStavke: [
        'Production deploy zahteva confirmToken = DEPLOY_PRODUCTION',
        'Svaki deploy se audit-loguje sa platformId, okruženjem i triggerom',
        'Vercel token validan samo server-side (nikad ne odlazi klijentu)',
        'Deploy hook URL-ovi čuvani isključivo u GitHub Secrets',
        'OMEGA JWT middleware štiti sve trigger endpoint-e',
      ],
    },
  },
  {
    id: 'deploy-platforma-cta',
    tip: 'cta',
    naslov: '🚀 Deploy Management',
    redosled: 11,
    podaci: {
      opis: 'Upravljajte deploymentima svih platformi iz jednog mesta.',
      dugmad: [
        { tekst: 'Deploy Status API', href: '/api/deploy-platforma/status' },
        { tekst: 'Portfolio Status', href: '/api/deploy-portfolio' },
        { tekst: 'Stari Deploy', href: '/deploy', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
