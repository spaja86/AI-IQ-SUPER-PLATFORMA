# 🚀 MAKSIMUM ALL PLATFORMA DEPLOY (SPAJA)

> **AI IQ SUPER PLATFORMA — v42.35.0** | Kompanija SPAJA — Digitalna Industrija
>
> Master deploy tracking document. Update phase status as each step is completed.
>
> **Owner:** @spaja86 | **Security incidents:** security@kompanija-spaja.rs
>
> **GO uslov:** SVE sekcije u `docs/GOLIVE_CHECKLIST.md` moraju biti ✅ pre finalne produkcione promocije.

---

## Linked documents

| Document | Purpose |
|---|---|
| [`docs/DIREKŠN-DEPLOY-SPAJA.md`](./DIREKŠN-DEPLOY-SPAJA.md) | **Kanonski operativni vodič — 12-fazna deploy sekvenca (DIREKŠN)** |
| [`docs/GOLIVE_CHECKLIST.md`](./GOLIVE_CHECKLIST.md) | Operative per-deploy checklist (A–G sections) |
| [`docs/GO-LIVE.md`](./GO-LIVE.md) | Pre-launch gap report, environment variables, rollback |
| [`docs/DEPLOYMENT-POWER-RESOLUTION.md`](./DEPLOYMENT-POWER-RESOLUTION.md) | Workload split, runtime model, reliability controls |
| [`docs/DEPLOY-PORTFOLIO.md`](./DEPLOY-PORTFOLIO.md) | All-platform portfolio registry and pipeline model |
| [`docs/MULTI-REPO-LINKS.md`](./MULTI-REPO-LINKS.md) | Cross-repo coordination with IO-OPENUI-AO |
| [`docs/ROADMAP.md`](./ROADMAP.md) | Product roadmap and Nova Generacija milestones |
| [`CHANGELOG.md`](../CHANGELOG.md) | Version history |

---

## Phase status overview

| Phase | Name | Status |
|---|---|---|
| FAZA 0 | Pre-Deploy Governance | ⬜ Pending |
| FAZA 1 | Secrets & Environment Variables | ⬜ Pending |
| FAZA 2 | Supabase Migrations | ⬜ Pending |
| FAZA 3 | Quality Gates | ⬜ Pending |
| FAZA 4 | CI/CD Workflow Activation | ✅ Workflows exist |
| FAZA 5 | Platform Deployments (Staged Rollout) | ⬜ Pending |
| FAZA 6 | Stripe & Billing | ⬜ Pending |
| FAZA 7 | Enterprise Requests | ⬜ Pending |
| FAZA 8 | Vercel Config & DNS | ⬜ Pending |
| FAZA 9 | Cross-Repo Sync (IO-OPENUI-AO) | ⬜ Pending |
| FAZA 10 | Post-Deploy Monitoring (First 24h) | ⬜ Pending |
| FAZA 11 | Rollback Plan | ✅ Documented |
| FAZA 12 | Final Sign-Off & Documentation | 🔄 In progress |

---

## FAZA 0 — Pre-Deploy Governance (Issue → PR → Review)

- [ ] Open GitHub Issue with deployment scope and links to all platforms
- [ ] Create audit-ready PR with all required sections: Summary, Linked Issue, Cross-repo impact, Validation, Rollout Plan, Cost Impact & Rollback
- [ ] Assign human-review to `@spaja86` — **merge must not happen without approval**
- [ ] Label PR: `agent:config-change`, `nova-generacija`, `nova-generacija:review`, `mekartor`, `mekartor:review`
- [ ] Confirm PR follows flow: **issue → PR → review → release**

**Governance rules:**
- Deploy credentials stay in GitHub/Vercel secrets — never in the repo
- Human review is mandatory for deploy, config, security, and cross-repo changes
- Promotion order: `dev → staging → production`

---

## FAZA 1 — Secrets & Environment Variables (all platforms)

Set all env vars in Vercel for the `Production` environment.

### Auth & Core
- [ ] `OMEGA_JWT_SECRET` (min 32 characters, random)
- [ ] `OMEGA_VAULT_KEY` (64 hex characters)
- [ ] `CRON_SECRET` (random string)
- [ ] `NODE_ENV=production`

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Stripe
- [ ] `STRIPE_SECRET_KEY` (`sk_live_*`)
- [ ] `STRIPE_PUBLIC_KEY` (`pk_live_*`)
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_BASIC`
- [ ] `STRIPE_PRICE_PRO`
- [ ] `STRIPE_PRICE_ENTERPRISE`
- [ ] `STRIPE_PRICE_UNLIMITED`

### OpenAI & Communication
- [ ] `OPENAI_API_KEY`
- [ ] `SPAJA_MAIL_PROVIDER`
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Vercel governance
- [ ] `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`, `VERCEL_TOKEN`
- [ ] `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true` (after submitting form)
- [ ] `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true` (after submitting form)
- [ ] `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true` (after submitting form)
- [ ] `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true` (after submitting form)
- [ ] `VERCEL_DEPLOY_HOOK_MEKARTOR` (optional fallback deploy hook)
- [ ] `MEKARTOR_STATUS_WEBHOOK_URL` (optional rollout status webhook)
- [ ] `MEKARTOR_UPSTREAM_URL` (optional future upstream source)

> **Security boundary:** All secrets go into GitHub Secrets / Vercel Environment Variables. Never commit `.env` files or hardcoded credentials.

---

## FAZA 2 — Supabase Migrations

Apply all migrations to the production Supabase project in order:

- [ ] `001_initial_schema.sql`
- [ ] `002_threads_models_settings.sql`
- [ ] `003_audit_evolution.sql`
- [ ] `004_spaja_baza_knowledge.sql`
- [ ] `005_billing_hardening.sql`
- [ ] `006_billing_hardening_phase2.sql`
- [ ] `007_billing_hardening_phase3.sql`
- [ ] `008_enterprise_ugovori.sql`
- [ ] `009_b2b_procurement_workflow.sql`
- [ ] `010_poslovni_tok.sql`
- [ ] `011_menjacnica_novcanik.sql`
- [ ] `012_spaja_baza_indeksiranje.sql`
- [ ] `013_spaja_baza_indeksiranje_v2.sql`
- [ ] `014_spaja_baza_indeksiranje_v3.sql`
- [ ] `015_spaja_baza_indeksiranje_v4.sql`
- [ ] `016_pertenizacija_v2.sql`
- [ ] `017_pertenizacija_v3.sql`
- [ ] `018_unified_platform_integration.sql`
- [ ] `019_depon_us_states_platform.sql`
- [ ] `020_deploy_audit_log.sql`

### Post-migration verification
- [ ] RLS policies active on all tables
- [ ] Trigger `on_auth_user_created` active (test with registration)
- [ ] Service role has write access to `profiles` table
- [ ] Point-in-time recovery (PITR) active
- [ ] `audit_events` table receiving entries (test with login event)

---

## FAZA 3 — Quality Gates

**The release gate is BLOCKED until all 7 gates are green.**

Run locally and in CI before every deployment:

- [ ] `npx tsc --noEmit` — TypeScript without errors
- [ ] `npm run lint` — ESLint without errors
- [ ] `npm test` — All unit test suites pass
- [ ] `npm run test:smoke` — Smoke tests pass
- [ ] `npm run predeploy:check` — Operational deploy guard passes
- [ ] `npm audit --audit-level=high` — No critical vulnerabilities
- [ ] Secret scanning — No hardcoded credentials (`git grep -i "password\|secret\|key" --include="*.ts"`)

---

## FAZA 4 — CI/CD Workflow Activation

All workflows exist and are active. Verify each run passes before promotion.

| Workflow | Trigger | Purpose | Status |
|---|---|---|---|
| `omega-auto-build.yml` | push/PR on main | Core CI quality gate: TypeScript, lint, test, smoke, predeploy | ✅ Active |
| `security-scanner.yml` | every PR, nightly | CodeQL SAST, dependency audit, secret heuristics | ✅ Active |
| `nova-generacija.yml` | NG label/paths | NG KPI gate: ≤50ms eval, ≤3min build | ✅ Active |
| `deploy-platforma.yml` | push to main (deploy paths), manual | Deploy Platforma hub pipeline | ✅ Active |
| `vercel-deploy.yml` | manual dispatch | Fallback Vercel deploy hook | ✅ Active |
| `depon-deploy.yml` | branch trigger | DEPON multi-phase pipeline | ✅ Active |
| `blockchain-deploy.yml` | manual | Smart contract deployment (Polygon) | ✅ Active |
| `back-to-spaces-another-races.yml` | label/paths | Another Races fairness gate | ✅ Active |
| `finops-governance-gate.yml` | scheduled | FinOps KPI governance | ✅ Active |

- [ ] Confirm all workflows pass on the current `main` branch before promoting to production

---

## FAZA 5 — Platform Deployments (Staged Rollout)

### 5a. SUPER PLATFORMA (`src/` → Vercel)
- [ ] Vercel Git Integration deploys automatically on merge to main
- [ ] Verify: `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] Verify: `GET /api/status` → `operativa.readyState=READY`
- [ ] Verify: `GET /deploy_status.json` → `status: success`

### 5b. Nova Generacija (Staged rollout)
- [ ] Feature flag `nova-generacija`: 20% canary active → 50% → 100%
- [ ] Feature flag `nova-generacija-gaming`: 10% staging → 50% → 100%
- [ ] Feature flag `nova-generacija-hipermreza`: Enterprise/Unlimited plans
- [ ] KPI checks: eval p99 ≤50ms, build ≤3min, uptime ≥99.99%
- [ ] Verify: `GET /api/nova-generacija` → HTTP 200

### 5c. Mekartor (`platforms/mekartor/` + `/mekartor`)
- [ ] Verify: `GET /api/mekartor` → `status: healthy`
- [ ] Verify: `GET /api/deploy-platforma/health/mekartor` → healthy=true
- [ ] Rollout `10% canary → 50% staging → 100% production`
- [ ] Confirm repo-local release — no linked repo change required

### 5d. IO OPENUI AO (`platforms/io-openui-ao/`)
- [ ] Build and test `platforms/io-openui-ao/`
- [ ] Sync with `spaja86/IO-OPENUI-AO` via `multi-repo-sync-agent`
- [ ] Update `docs/MULTI-REPO-LINKS.md` with downstream deployment references

### 5e. AI IQ Menjačnica (`platforms/menjacnica/`)
- [ ] Build and deploy `platforms/menjacnica/`
- [ ] Run `menjacnica-fee.test.ts`, `menjacnica-novcanik.test.ts`, `menjacnica-max-order.test.ts`

### 5f. AI IQ World Bank (`platforms/world-bank/`)
- [ ] Build and deploy `platforms/world-bank/`
- [ ] Verify health endpoint and database connectivity

### 5g. Poslovni Novčanik (`platforms/poslovni-novcanik/`)
- [ ] Build and deploy `platforms/poslovni-novcanik/`
- [ ] Run `novcanik-ledger.test.ts`, `wollet-balance.test.ts`, `wollet-audit.test.ts`

### 5h. Kompanija SPAJA (`platforms/kompanija-spaja/`)
- [ ] **Status: 🔧 In preparation** — verify readiness criteria before deploying
- [ ] Run build, lint, smoke test as a prerequisite for production deploy

### 5i. Blockchain (Smart Contracts)
- [ ] `npm run blockchain:compile` — compile smart contracts
- [ ] `npm run blockchain:deploy:testnet` — deploy to Polygon Amoy (testnet)
- [ ] Verify contracts on testnet (2–3 days verification window)
- [ ] `npm run blockchain:deploy:mainnet` — deploy to Polygon mainnet (**human approval required**)

### 5j. DEPON Multi-phase Pipeline
Trigger via `.github/workflows/depon-deploy.yml`:

| Phase | DEPONs | Regions | User Scale | Status |
|---|---|---|---|---|
| Phase 1 | DEPON-01 to DEPON-04 | 3 | 0–10M | ⬜ Pending |
| Phase 2 | DEPON-05 to DEPON-08 | 6 | 10–50M | ⬜ Pending |
| Phase 3 | DEPON-09 to DEPON-12 | 12 | 50–120M | ⬜ Pending |

SLA: 99.99% uptime, ≤100ms latency.

---

## FAZA 6 — Stripe & Billing Configuration

- [ ] Create production Price IDs in Stripe Dashboard: Basic, Pro, Enterprise, Unlimited, SpajaPro 16
- [ ] Register production webhook endpoint: `https://DOMEN/api/stripe/webhook`
- [ ] Verify webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Test complete checkout flow end-to-end
- [ ] Configure Stripe Customer Portal

---

## FAZA 7 — Enterprise Requests (run in parallel)

- [ ] Submit **Vercel Enterprise** request at `https://vercel.com/contact/sales` (MEGA CENTAR SVEGA, Smederevo 11300, Serbia)
  - Set `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true` after submission
- [ ] Submit **Vercel CDN/proxy trust** request via `/api/enterprise-zahtevi`
  - Set `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true` after submission
- [ ] Submit **GitHub Enterprise** request at `https://github.com/enterprises/contact`
  - Set `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true` after submission
- [ ] Nikola Spajić (spajicn@yahoo.com) submits **OpenAI Enterprise + partnership** request at `https://openai.com/business/`
  - Set `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true` after submission

---

## FAZA 8 — Vercel Configuration & DNS

- [ ] Configure production domain and SSL certificate in Vercel Dashboard
- [ ] DNS propagation completed (A/CNAME records) — wait up to 24h after change
- [ ] Verify Vercel Cron jobs are active (`vercel.json` + Vercel Dashboard → Cron Jobs):

| Cron path | Schedule |
|---|---|
| `/api/cron/zdravlje` | every 30 minutes |
| `/api/cron/evolucija` | every 6 hours |
| `/api/cron/protokoli-verifikacija` | every 15 minutes |
| `/api/cron/ekstremno-procesuiranje-svega` | every 20 minutes |
| `/api/analiza-svega-refresh` | minutes 10, 30, 50 |

- [ ] Manual test cron endpoint with `Authorization: ****** or `x-cron-secret` → 200
- [ ] (Optional) Create Vercel KV store and set `VERCEL_KV_REST_API_URL` + `VERCEL_KV_REST_API_TOKEN` for global rate limiting

---

## FAZA 9 — Cross-Repo Sync (IO-OPENUI-AO)

- [ ] Trigger `multi-repo-sync-agent` to sync versions, labels, milestones, and agent-config between AI-IQ-SUPER-PLATFORMA and IO-OPENUI-AO
- [ ] Update `docs/MULTI-REPO-LINKS.md` with all deployment audit references (bidirectional)
- [ ] Verify cross-repo sync coverage = 100% (Nova Generacija KPI)
- [ ] Trigger `calculator-validator-agent` in IO-OPENUI-AO repo for gaming fairness verification
- [ ] Confirm label schema is aligned across both repos

**Audit reference convention:**
```
AI-IQ-SUPER-PLATFORMA#<issue> -> IO-OPENUI-AO#<follow-up>
```

---

## FAZA 10 — Post-Deploy Monitoring (First 24 hours)

### Every 2 hours
- [ ] `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] Review Vercel error logs
- [ ] Confirm Stripe webhook receiving events (Stripe Dashboard → Developers → Webhooks)

### First 24h checklist
- [ ] Test email delivery: `support@spaja.rs`, `billing@spaja.rs`, `sales@spaja.rs`, fallback `spajicn@yahoo.com`
- [ ] Test complete registration and login flow end-to-end
- [ ] Test Another Races fairness (rollout 20% → 100%, verify KPI)
- [ ] Verify `GET /api/deploy-portfolio` — live JSON snapshot of all platforms
- [ ] Verify `GET /api/status` → `operativa.modelStanja.runtime=runtime-ready`
- [ ] Verify `GET /api/status` → `operativa.readyState=READY`

### KPI alerts (activate in Vercel Dashboard)
- [ ] API p95 latency > 2s → alert
- [ ] Error rate > 1% in 5 minutes → alert
- [ ] Checkout fail rate > 5% → alert
- [ ] Auth fail rate > 15% → alert
- [ ] Gaming session completion < 80% → alert

---

## FAZA 11 — Rollback Plan

| Level | Trigger | Action |
|---|---|---|
| **Level 1** — Endpoint error | Deploy regression | `vercel rollback` in Vercel Dashboard → previous version auto-deployed |
| **Level 2** — Auth compromised | JWT/session breach | Rotate `OMEGA_JWT_SECRET` in Vercel env → all tokens invalidated |
| **Level 3** — Billing incident | Webhook/payment failure | Disable Stripe webhook → manual processing of `checkout.session.completed` events |
| **Level 4** — Full shutdown | Critical system failure | Vercel Dashboard → Settings → Deployments → Pause → DNS to maintenance page → forensic analysis |

See also: `docs/GO-LIVE.md#rollback-plan`

---

## FAZA 12 — Final Sign-Off & Documentation

- [ ] `CHANGELOG.md` updated with all changes in this version ✅ (this deploy)
- [ ] `docs/GO-LIVE.md` → Go/No-Go table → all entries `✅ GO`
- [ ] `public/deploy_status.json` updated with final commit SHA and timestamp ✅ (this deploy)
- [ ] `docs/MULTI-REPO-LINKS.md` updated with MAKSIMUM DEPLOY audit reference ✅ (this deploy)
- [ ] Team notified of all new env vars required
- [ ] GitHub governance matrix confirmed: `spaja86` owner, billing owner, repo admin backup, workflow owner
- [ ] PR labeled `nova-generacija:validated` + `race:validated` after successful validation
- [ ] **Merge only after human-review approval from `@spaja86`**

---

## Deployment KPI targets

| KPI | Target | Alert threshold |
|---|---|---|
| API latency p95 | ≤ 300ms | > 2s |
| Nova Generacija eval p99 | ≤ 50ms | > 100ms |
| Uptime SLA | ≥ 99.99% | < 99% |
| Build duration | ≤ 3 min | > 10 min |
| Cold start p95 | ≤ 1.5s | > 3s |
| Error rate | < 0.1% | > 1% |
| Checkout fail rate | < 2% | > 5% |
| Auth fail rate | < 5% | > 15% |
| Gaming session completion | ≥ 95% | < 80% |
| Fairness compliance | 100% | < 100% |
| Cross-repo sync coverage | 100% | < 100% |
| DEPON uptime SLA | ≥ 99.99% | < 99% |
| DEPON max latency | ≤ 100ms | > 200ms |

---

*SpajaUltraOmegaCore -∞Ω+∞ | Zero Trust | Kvantno-Otporno*

*Kompanija SPAJA — Digitalna Industrija | v42.35.0 | MEGA CENTAR SVEGA, Smederevo 11300, Srbija*
