# 🚀 DIREKŠN ZA PLATFORMU DEPLOY (SPAJA)

> **AI IQ SUPER PLATFORMA — v42.35.0+** | Kompanija SPAJA — Digitalna Industrija
>
> Kanonski dokument za deploy sekvencu — svih 12 faza od governance do sign-off.
>
> **Owner:** @spaja86 | **Security incidents:** security@kompanija-spaja.rs
>
> **GO uslov:** SVE sekcije u `docs/GOLIVE_CHECKLIST.md` moraju biti ✅ pre finalne produkcione promocije.

---

## Pregled stanja (AS-IS)

Platforma je zasnovana na **Next.js 16**, hostovana na **Vercel**, sa Supabase bazom, Stripe naplatom i Polygon blockchain integracijom. Sve CI/CD workflow definicije postoje i aktivne su. Dokumentacija faza 4 i 11 je već kompletna u `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md`; ovaj dokument je kanonski operativni vodič za izvršenje punog ciklusa.

---

## Linked documents

| Document | Purpose |
|---|---|
| [`docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md`](./MAKSIMUM-ALL-PLATFORMA-DEPLOY.md) | Master deploy tracking checklist — sve 12 faze |
| [`docs/GOLIVE_CHECKLIST.md`](./GOLIVE_CHECKLIST.md) | Operative per-deploy checklist (A–G sections) |
| [`docs/GO-LIVE.md`](./GO-LIVE.md) | Pre-launch gap report, environment variables, rollback |
| [`docs/DEPLOY-PORTFOLIO.md`](./DEPLOY-PORTFOLIO.md) | All-platform portfolio registry and pipeline model |
| [`docs/MULTI-REPO-LINKS.md`](./MULTI-REPO-LINKS.md) | Cross-repo coordination with IO-OPENUI-AO |
| [`docs/DEPLOYMENT-POWER-RESOLUTION.md`](./DEPLOYMENT-POWER-RESOLUTION.md) | Workload split, runtime model, reliability controls |
| [`CHANGELOG.md`](../CHANGELOG.md) | Version history |

---

## Deployment flow summary

```
dev branch
  ↓ (lint, tsc, unit test)
PR → main  [FAZA 0 — governance, labels, human review]
  ↓ (smoke, predeploy:check, security gate, secret scan)
  ↓ [FAZA 1–3: secrets, DB migrations, quality gates]
staging (Vercel)
  ↓ (canary feature flags, KPI check, cross-repo sync)
  ↓ [FAZA 4–9: CI/CD, platform rollouts, Stripe, enterprise, DNS]
production (Vercel) [FAZA 10–12: monitoring, rollback ready, sign-off]
```

---

## FAZA 0 — Pre-Deploy Governance (Issue → PR → Review)

- [ ] Otvoriti GitHub Issue sa deployment scope-om i linkovima na sve platforme
- [ ] Kreirati audit-ready PR sa sekcijama: Summary, Linked Issue, Cross-repo Impact, Validation, Rollout Plan, KPI Impact, Rollback
- [ ] Dodeliti `human-review` → `@spaja86` — **merge zabranjen bez odobrenja**
- [ ] Labelovati PR: `agent:config-change`, `nova-generacija`, `nova-generacija:review`
- [ ] Potvrditi tok: **issue → PR → review → release**

**Governance pravila:**
- Deploy credentials ostaju u GitHub/Vercel secrets — **nikada u repo-u**
- Human review je obavezan za deploy, config, security i cross-repo promene
- Redosled promocije: `dev → staging → production`

---

## FAZA 1 — Secrets & Environment Variables

Postaviti sve env vars u Vercel za `Production` okruženje.

### Auth & Core
- [ ] `OMEGA_JWT_SECRET` (min 32 karaktera, random)
- [ ] `OMEGA_VAULT_KEY` (64 hex karaktera)
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
- [ ] `VERCEL_DEPLOY_HOOK_AI_IQ` (za `deploy-platforma.yml` i `vercel-deploy.yml`)
- [ ] `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)

> ⛔ **Security boundary:** Svi secrets idu u GitHub Secrets / Vercel Environment Variables. Nikada ne commitovati `.env` fajlove ili hardkodovane kredencijale.

---

## FAZA 2 — Supabase Migracije

Primeniti sve migracije na produkcioni Supabase projekat, **striktno po redosledu**:

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

### Post-migration verifikacija
- [ ] RLS politike aktivne na svim tabelama
- [ ] Trigger `on_auth_user_created` aktivan (testirati registraciju)
- [ ] Service role ima write access na `profiles` tabelu
- [ ] Point-in-time recovery (PITR) aktivan
- [ ] `audit_events` tabela prima unose (testirati login event)

---

## FAZA 3 — Quality Gates

**Release gate je BLOKIRAN dok svih 7 kapija nisu zelene.**

Pokrenuti lokalno i u CI pre svakog deploymenta:

- [ ] `npx tsc --noEmit` — TypeScript bez grešaka
- [ ] `npm run lint` — ESLint bez grešaka (max-warnings 0)
- [ ] `npm test` — svi unit testovi prolaze (20+ test suita: menjačnica, novčanik, kripto, fairness, itd.)
- [ ] `npm run test:smoke` — smoke testovi prolaze
- [ ] `npm run predeploy:check` — operativni deploy guard prolazi
- [ ] `npm audit --audit-level=high` — nema kritičnih ranjivosti
- [ ] Secret scan — nema hardkodovanih kredencijala (`git grep -i "password\|secret\|key" --include="*.ts"`)

---

## FAZA 4 — CI/CD Workflow Aktivacija

Svi workflow-i postoje i aktivni su. Potvrditi da svaki prolazi na `main` branch-u pre promocije.

| Workflow | Trigger | Svrha | Status |
|---|---|---|---|
| `omega-auto-build.yml` | push/PR na main | Core CI gate: TypeScript, lint, test, smoke, predeploy | ✅ Active |
| `security-scanner.yml` | svaki PR, nightly | CodeQL SAST, dependency audit, secret heuristics | ✅ Active |
| `nova-generacija.yml` | NG label/putanje | NG KPI gate: ≤50ms eval, ≤3min build | ✅ Active |
| `deploy-platforma.yml` | push na main (deploy putanje), manual | Deploy Platforma hub pipeline | ✅ Active |
| `vercel-deploy.yml` | manual dispatch | Fallback Vercel deploy hook | ✅ Active |
| `depon-deploy.yml` | branch trigger | DEPON multi-phase pipeline | ✅ Active |
| `blockchain-deploy.yml` | manual | Smart contract deployment (Polygon) | ✅ Active |
| `back-to-spaces-another-races.yml` | label/putanje | Another Races fairness gate | ✅ Active |
| `finops-governance-gate.yml` | scheduled | FinOps KPI governance | ✅ Active |

- [ ] Potvrditi da svi workflow-i prolaze na trenutnom `main` branch-u pre promovisanja u produkciju

---

## FAZA 5 — Platform Deployments (Staged Rollout)

### 5a. SUPER PLATFORMA (`src/` → Vercel)
- [ ] Vercel Git Integration automatski deploye pri merge na `main`
- [ ] Verifikovati: `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] Verifikovati: `GET /api/status` → `operativa.readyState=READY`
- [ ] Verifikovati: `GET /deploy_status.json` → `status: success`

### 5b. Nova Generacija (Staged feature flag rollout)
- [ ] Feature flag `nova-generacija`: 20% canary aktivan → 50% → 100%
- [ ] Feature flag `nova-generacija-gaming`: 10% staging → 50% → 100%
- [ ] Feature flag `nova-generacija-hipermreza`: Enterprise/Unlimited planovi
- [ ] KPI check: eval p99 ≤50ms, build ≤3min, uptime ≥99.99%
- [ ] Verifikovati: `GET /api/nova-generacija` → HTTP 200

### 5c. IO OPENUI AO (`platforms/io-openui-ao/`)
- [ ] Build i test `platforms/io-openui-ao/`
- [ ] Sinhronizovati sa `spaja86/IO-OPENUI-AO` via `multi-repo-sync-agent`
- [ ] Ažurirati `docs/MULTI-REPO-LINKS.md` sa downstream deployment referencama

### 5d. AI IQ Menjačnica (`platforms/menjacnica/`)
- [ ] Build i deploy `platforms/menjacnica/`
- [ ] Pokrenuti: `menjacnica-fee.test.ts`, `menjacnica-novcanik.test.ts`, `menjacnica-max-order.test.ts`

### 5e. AI IQ World Bank (`platforms/world-bank/`)
- [ ] Build i deploy `platforms/world-bank/`
- [ ] Verifikovati health endpoint i database konekciju

### 5f. Poslovni Novčanik (`platforms/poslovni-novcanik/`)
- [ ] Build i deploy `platforms/poslovni-novcanik/`
- [ ] Pokrenuti: `novcanik-ledger.test.ts`, `wollet-balance.test.ts`, `wollet-audit.test.ts`, `wollet-transactions.test.ts`

### 5g. Kompanija SPAJA (`platforms/kompanija-spaja/`) — 🔧 U pripremi
- [ ] Verifikovati readiness kriterijume pre deploymenta
- [ ] Pokrenuti build, lint, smoke test kao preduslov za produkcioni deploy

### 5h. Blockchain (Smart Contracts — Polygon)
- [ ] `npm run blockchain:compile` — kompajlirati smart contracts
- [ ] `npm run blockchain:deploy:testnet` — deploy na Polygon Amoy (testnet)
- [ ] Verifikovati contracts na testnet (2–3 dana prozor verifikacije)
- [ ] `npm run blockchain:deploy:mainnet` — deploy na Polygon mainnet (**human approval required**)

### 5i. DEPON Multi-phase Pipeline
Pokrenuti via `.github/workflows/depon-deploy.yml`:

| Faza | DEPONs | Regioni | User Scale | Status |
|---|---|---|---|---|
| Phase 1 | DEPON-01 do DEPON-04 | 3 | 0–10M | ⬜ Pending |
| Phase 2 | DEPON-05 do DEPON-08 | 6 | 10–50M | ⬜ Pending |
| Phase 3 | DEPON-09 do DEPON-12 | 12 | 50–120M | ⬜ Pending |

SLA: ≥99.99% uptime, ≤100ms latency.

---

## FAZA 6 — Stripe & Billing Konfiguracija

- [ ] Kreirati produkcione Price ID-jeve u Stripe Dashboard: Basic, Pro, Enterprise, Unlimited, SpajaPro 16
- [ ] Registrovati produkcioni webhook endpoint: `POST https://DOMEN/api/stripe/webhook`
- [ ] Verifikovati event handling: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] End-to-end checkout flow test
- [ ] Konfigurisati Stripe Customer Portal

---

## FAZA 7 — Enterprise Requests (pokrenuti paralelno)

- [ ] **Vercel Enterprise** → `https://vercel.com/contact/sales` (MEGA CENTAR SVEGA, Smederevo 11300, Srbija)
  - Postaviti `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true` posle slanja
- [ ] **Vercel CDN/proxy trust** → via `/api/enterprise-zahtevi`
  - Postaviti `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true` posle slanja
- [ ] **GitHub Enterprise** → `https://github.com/enterprises/contact`
  - Postaviti `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true` posle slanja
- [ ] **OpenAI Enterprise + Partnership** → Nikola Spajić (spajicn@yahoo.com) → `https://openai.com/business/`
  - Postaviti `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true` posle slanja

---

## FAZA 8 — Vercel Konfiguracija & DNS

- [ ] Konfigurisati produkcioni domen i SSL sertifikat u Vercel Dashboard
- [ ] DNS propagacija kompletirana (A/CNAME rekord) — čekati do 24h posle promene
- [ ] Verifikovati Cron Jobs aktivnost (Vercel Dashboard → Cron Jobs):

| Cron putanja | Raspored |
|---|---|
| `/api/cron/zdravlje` | svakih 30 minuta |
| `/api/cron/evolucija` | svakih 6 sati |
| `/api/cron/protokoli-verifikacija` | svakih 15 minuta |
| `/api/cron/ekstremno-procesuiranje-svega` | svakih 20 minuta |
| `/api/analiza-svega-refresh` | u minutima 10, 30, 50 |

- [ ] Ručno testirati cron endpoint sa `Authorization: ****** ili `x-cron-secret` → 200
- [ ] (Opciono) Kreirati Vercel KV store i postaviti `VERCEL_KV_REST_API_URL` + `VERCEL_KV_REST_API_TOKEN` za globalni rate limiting

---

## FAZA 9 — Cross-Repo Sync (IO-OPENUI-AO)

- [ ] Pokrenuti `multi-repo-sync-agent` za sinhronizaciju verzija, labela, milestones i `.agent-config.json`
- [ ] Ažurirati `docs/MULTI-REPO-LINKS.md` sa bidirectional deployment audit referencama
- [ ] Verifikovati cross-repo sync coverage = 100% (Nova Generacija KPI)
- [ ] Pokrenuti `calculator-validator-agent` u IO-OPENUI-AO za gaming fairness verifikaciju
- [ ] Potvrditi label schema je alignovana između oba repo-ja

**Audit referenca konvencija:**
```
AI-IQ-SUPER-PLATFORMA#<issue> -> IO-OPENUI-AO#<follow-up>
```

---

## FAZA 10 — Post-Deploy Monitoring (Prvih 24 sata)

### Svaka 2 sata
- [ ] `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] Pregledati Vercel error logs
- [ ] Potvrditi da Stripe webhook prima događaje (Stripe Dashboard → Developers → Webhooks)

### Prvih 24 sata — checklist
- [ ] Testirati email delivery: `support@spaja.rs`, `billing@spaja.rs`, `sales@spaja.rs`, fallback `spajicn@yahoo.com`
- [ ] Testirati kompletni registration i login flow end-to-end
- [ ] Testirati Another Races fairness (rollout 20% → 100%, verifikovati KPI)
- [ ] Verifikovati `GET /api/deploy-portfolio` — live JSON snapshot svih platformi
- [ ] Verifikovati `GET /api/status` → `operativa.readyState=READY`

### KPI alert pragovi (aktivirati u Vercel Dashboard)
- [ ] API p95 latency > 2s → alert
- [ ] Error rate > 1% u 5 minuta → alert
- [ ] Checkout fail rate > 5% → alert
- [ ] Auth fail rate > 15% → alert
- [ ] Gaming session completion < 80% → alert

---

## FAZA 11 — Rollback Plan

| Nivo | Okidač | Akcija |
|---|---|---|
| **Nivo 1** — Greška u endpointu | Deploy regresija | `vercel rollback` u Vercel Dashboard → prethodna verzija automatski |
| **Nivo 2** — Auth kompromitovan | JWT/session breach | Rotirati `OMEGA_JWT_SECRET` u Vercel env → svi tokeni nevažeći |
| **Nivo 3** — Billing incident | Webhook/payment greška | Deaktivirati Stripe webhook → manuelna obrada `checkout.session.completed` |
| **Nivo 4** — Kritični sistemski kvar | Potpuni pad | Vercel Dashboard → Settings → Deployments → Pause → DNS na maintenance → forenzika |

Vidi: [`docs/GO-LIVE.md#rollback-plan`](./GO-LIVE.md#rollback-plan)

---

## FAZA 12 — Final Sign-Off & Dokumentacija

- [ ] `CHANGELOG.md` ažuriran sa svim promenama u ovoj verziji
- [ ] `docs/GO-LIVE.md` → Go/No-Go tabela → svi unosi = ✅ GO
- [ ] `public/deploy_status.json` ažuriran sa finalnim commit SHA i timestamp
- [ ] `docs/MULTI-REPO-LINKS.md` ažuriran sa DIREKŠN-DEPLOY audit referencom
- [ ] Tim notifikovan o svim novim env varijablama
- [ ] GitHub governance matrica potvrđena: `spaja86` owner, billing owner, repo admin backup, workflow owner
- [ ] PR labelovan `nova-generacija:validated` + `race:validated` posle uspešne validacije
- [ ] **Merge samo posle human-review odobrenja od @spaja86**

---

## Deployment KPI ciljevi

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
| Cross-repo sync coverage | 100% | < 100% | multi-repo-sync-agent |
| DEPON uptime SLA | ≥ 99.99% | < 99% | Operations |
| DEPON max latency | ≤ 100ms | > 200ms | Operations |

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

*AI IQ SUPER PLATFORMA — SpajaUltraOmegaCore -∞Ω+∞ | v42.35.0+*

*Kompanija SPAJA — Digitalna Industrija | MEGA CENTAR SVEGA, Smederevo 11300, Srbija*
