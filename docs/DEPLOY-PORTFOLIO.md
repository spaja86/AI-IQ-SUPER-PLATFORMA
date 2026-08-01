# DEPLOY-PORTFOLIO.md — Centralni referentni dokument za deployment

> AI IQ SUPER PLATFORMA — v100.0.0+ | Deploy Portfolio Hub

## Svrha

Ovaj dokument je centralni referentni registar svih platformi u ekosistemu, njihovih deployment putanja, owner-a i statusa. Linked docs:

- [DEPLOYMENT-POWER-RESOLUTION.md](./DEPLOYMENT-POWER-RESOLUTION.md) — workload split, runtime model, reliability controls
- [GO-LIVE.md](./GO-LIVE.md) — pre-launch checklist, gap report, Go/No-Go dokument
- [GOLIVE_CHECKLIST.md](./GOLIVE_CHECKLIST.md) — operativna checklista za svaki deploy
- [MULTI-REPO-LINKS.md](./MULTI-REPO-LINKS.md) — cross-repo koordinacija sa IO-OPENUI-AO

---

## Portfolio platformi

| Platforma | Putanja | Runtime / Framework | Status | Manual Trigger | Health Check | Owner |
|---|---|---|---|---|---|---|
| 🏢 AI IQ SUPER PLATFORMA | `src/` → Vercel | Next.js 16 | ✅ Aktivan | 🚀 Da | `/api/health` | @spaja86 |
| 🔬 IO OPENUI AO | `platforms/io-openui-ao/` | React + SpajaPro | ✅ Aktivan | 🚀 Da | `/` | @spaja86 |
| 💱 AI IQ Menjačnica | `platforms/menjacnica/` | Next.js | ✅ Aktivan | — | — | @spaja86 |
| 🏦 AI IQ World Bank | `platforms/world-bank/` | Next.js | ✅ Aktivan | — | — | @spaja86 |
| 🚀 OMEGA AI za Vercel | — | Node.js | ✅ Aktivan | — | — | @spaja86 |
| 🏭 Kompanija SPAJA | `platforms/kompanija-spaja/` | Next.js | 🔧 U pripremi | — | — | @spaja86 |
| ⚡ Nova Generacija | `platforms/nova-generacija/` | Next.js 16 + SpajaPro 16 | ✅ Aktivan | 🚀 Da | `/api/nova-generacija` | @spaja86 |

**API**: `GET /api/deploy-portfolio` — live JSON pregled svih platformi sa KPI snapshot-om.

---

## Deployment pipeline — Release model

```
dev branch
  ↓ (lint, typecheck, unit test)
PR → main
  ↓ (smoke test, predeploy check, security gate, human review)
staging
  ↓ (confirmToken, explicit promotion)
production (Vercel)
```

### Quality gates (obavezni pre svakog deploymenta)

1. `npm run lint` — ESLint, bez grešaka
2. `npx tsc --noEmit` — TypeScript, bez grešaka
3. `npm test` — svi unit testovi prolaze
4. `npm run test:smoke` — svi smoke testovi prolaze
5. `npm run predeploy:check` — operativna deploy provera
6. Security gate — dependency audit + secret scanning bez kritičnih nalaza

### Open-code deploy governance

- PR prati tok **issue → PR → review → release**
- Human review obavezan za deploy, config, security i cross-repo promene
- PR opis sadrži: rollout plan, rollback plan, KPI uticaj, Cross-repo impact
- Deploy credentials ostaju u GitHub/Vercel secrets — **nikada u repo-u**
- Promocija prati redosled `dev → staging → production`

---

## CI/CD Workflow mapa

| Workflow | Trigger | Svrha | Status |
|---|---|---|---|
| `omega-auto-build.yml` | push/PR na main, copilot/** | Quality gate: TypeScript, lint, test, smoke, predeploy | ✅ Active |
| `security-scanner.yml` | svaki PR, nightly, manual | CodeQL SAST, dependency audit, secret heuristics | ✅ Active |
| `nova-generacija.yml` | nova-generacija label/putanje | NG KPI gate: ≤50ms eval, ≤3min build | ✅ Active |
| `vercel-deploy.yml` | manual dispatch | Fallback Vercel deploy hook trigger | ✅ Active |
| `depon-deploy.yml` | branch trigger | DEPON multi-phase pipeline | ✅ Active |
| `blockchain-deploy.yml` | manual | Smart contract deployment (Polygon) | ✅ Active |

---

## Agent mapa za deployment

| Agent | Status | Workflow | Scope |
|---|---|---|---|
| `ci-bot` | ✅ Active | `omega-auto-build.yml` | All repos |
| `human-review` | ✅ Active | Manual (PR policy + CODEOWNERS) | All repos |
| `security-scanner` | ✅ Active | `security-scanner.yml` | All repos |
| `nova-generacija-agent` | 🚀 Active | `nova-generacija.yml` | All repos (NG scope) |
| `deploy-bot` | ⏳ Planned | `vercel-deploy.yml` | All repos |
| `multi-repo-sync-agent` | 📋 Ready | Push/Weekly | SUPER-PLATFORMA ↔ IO-OPENUI-AO |
| `calculator-validator-agent` | 📋 Ready | PR label / calc-* branch | IO-OPENUI-AO only |

---

## Rollout model — Staged deployment

```
Canary (10–20%)  →  Staging (50%)  →  Production (100%)
```

### Nova Generacija rollout status

| Stage | Flag | Status |
|---|---|---|
| Feature flag canary | `nova-generacija` | 20% canary aktivan |
| Gaming flag | `nova-generacija-gaming` | 10% staging |
| Hipermreza flag | `nova-generacija-hipermreza` | Enterprise/unlimited planovi |
| Full production | — | 📋 Pending — exit kriterijumi u ROADMAP.md |

---

## Rollback putanje

### Nivo 1 — Greška u endpointu
1. Revert poslednji commit u Vercel Dashboard
2. Vercel automatski deploye prethodnu verziju

### Nivo 2 — Auth sistem kompromitovan
1. Promeniti `OMEGA_JWT_SECRET` u Vercel Environment Variables
2. Svi JWT tokeni automatski postaju nevažeći
3. Korisnici se moraju ponovo prijaviti
4. Pregledati audit log: `GET /api/auth/verify`

### Nivo 3 — Billing incident
1. Deaktivirati Stripe webhook u Stripe Dashboard
2. Manualno pregledati i obraditi `checkout.session.completed` događaje
3. Proveriti `profiles` tabelu u Supabase

### Nivo 4 — Kompletno isključivanje
1. U Vercel Dashboard: Settings → Deployments → Pause deployment
2. Promeniti DNS da ukazuje na maintenance stranicu
3. Forenzička analiza pre ponovnog pokretanja

---

## Deployment KPI — Ciljne vrednosti

| KPI | Ciljna vrednost | Alert prag | Owner |
|---|---|---|---|
| API latency p95 | ≤ 300ms | > 2s | Platform Ops |
| Nova Generacija eval p99 | ≤ 50ms | > 100ms | AI Engine |
| Uptime SLA | ≥ 99.99% | < 99% | Operations |
| Build duration | ≤ 3 min | > 10 min | CI / Platform Ops |
| Cold start p95 | ≤ 1.5s | > 3s | Platform Ops |
| Error rate | < 0.1% | > 1% | CI / Release Ops |
| Gaming session completion | ≥ 95% | < 80% | Gaming |
| Fairness compliance | 100% | < 100% | Gaming |
| Checkout fail rate | < 2% | > 5% | Billing |
| Auth fail rate | < 5% | > 15% | Auth |

---

## Deploy Status Artifact

Posle svakog CI run-a, `omega-auto-build.yml` generiše `public/deploy_status.json`:

```json
{
  "timestamp": "2026-08-01T12:00:00Z",
  "version": "100.0.0",
  "commit_sha": "abc1234",
  "branch": "main",
  "status": "success"
}
```

Dostupno na: `GET /deploy_status.json`

---

## Operativne granice (Open Code Program)

| Površina | Šta pripada ovde | Šta ne pripada ovde |
|---|---|---|
| Javni repo | App kod, docs, workflow definicije, agent policy | Secrets, private keys, produkcioni credentials |
| Linked-repo koordinacija | Downstream impact, sync fields, labels, milestone reference | Silent cross-repo breaking changes |
| Operativne kontrole | GitHub Secrets, Vercel secrets, deploy hook-ovi, env credentials | Hardcoded deploy tokens ili `.env` fajlovi |

---

## Kontakt

- **Owner**: Kompanija SPAJA — Digitalna Industrija
- **GitHub**: [@spaja86](https://github.com/spaja86)
- **Security incidents**: security@kompanija-spaja.rs
- **Support**: support@spaja.rs
- **Adresa**: MEGA CENTAR SVEGA, Smederevo 11300, Srbija

---

*AI IQ SUPER PLATFORMA — SpajaUltraOmegaCore -∞Ω+∞ | v100.0.0+*
