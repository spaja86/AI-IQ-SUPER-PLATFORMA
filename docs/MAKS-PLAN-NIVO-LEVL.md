# 🔥 MAKS PLAN NIVO LEVL — AI-IQ-SUPER-PLATFORMA

> **Verzija:** v42.35.0+ → v100.0.0  
> **Platforma:** AI IQ SUPER PLATFORMA — Kompanija SPAJA — Digitalna Industrija  
> **Owner:** @spaja86  
> **Datum inicijacije:** 2026-08-01  
> **Status:** 🚀 Aktivno — in progress  
> **Scope:** Svaki aktivni track, svaka platforma, svaki agent — apsolutni maksimum

Ovo je master operativni tracking dokument za MAKS PLAN NIVO LEVL inicijativu.  
Ažuriraj status svake stavke kako napreduje implementacija.

---

## Linked documents

| Document | Purpose |
|---|---|
| [`docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md`](./MAKSIMUM-ALL-PLATFORMA-DEPLOY.md) | 12-fazna deploy sekvenca (detaljni operativni vodič) |
| [`docs/ROADMAP.md`](./ROADMAP.md) | Product roadmap i Nova Generacija milestones |
| [`docs/NOVA-GENERACIJA.md`](./NOVA-GENERACIJA.md) | SpajaPro 16 specifikacija |
| [`docs/GOLIVE_CHECKLIST.md`](./GOLIVE_CHECKLIST.md) | Per-deploy operativni checklist (sekcije A–G) |
| [`docs/GO-LIVE.md`](./GO-LIVE.md) | Pre-launch gap report, env vars, rollback |
| [`docs/MULTI-REPO-LINKS.md`](./MULTI-REPO-LINKS.md) | Cross-repo koordinacija sa IO-OPENUI-AO |
| [`docs/SECURITY.md`](./SECURITY.md) | Security threat model i Nova Generacija bezbednost |
| [`CHANGELOG.md`](../CHANGELOG.md) | Version history |
| [`.agent-config.json`](../.agent-config.json) | Operativni agent konfiguracioni izvor istine |

---

## Redosled izvršavanja

```
NIVO 0 (Governance) → NIVO 1 (Quality Gates) → NIVO 2 (Secrets)
→ NIVO 3 (DB Migrations) → NIVO 4 (SpajaPro 13/14/15 stabilize)
→ NIVO 5 (Nova Generacija rollout 20%→50%→100%)
→ NIVO 6 (Multi-platform deploy — a,b,c,d,e,f,g paralelno gde je moguće)
→ NIVO 7 (Blockchain) → NIVO 8 (DEPON Phase 1→2→3)
→ NIVO 9 (Billing) + NIVO 10 (Enterprise requests) [paralelno]
→ NIVO 11 (DNS/Vercel config)
→ NIVO 12 (Security + Agents) → NIVO 13 (SPAJA Baza v4)
→ NIVO 14 (Post-deploy monitoring 24h)
→ NIVO 15 (Rollback na standby)
→ NIVO 16 (Final sign-off)
```

**GO uslov:** SVE stavke na svim nivoima moraju biti ✅ pre finalne produkcione promocije na v100.0.0.

---

## NIVO 0 — GOVERNANCE GATE

> Pre svakog release-a i deploymenta mora biti ispunjeno sledeće.

- [ ] Svaka promena ide kroz: **Issue → PR → human-review → release**
- [ ] PR mora imati sve sekcije: Summary, Linked Issue, Cross-repo impact, Validation, Rollout Plan, Cost Impact & Rollback
- [ ] Label `agent:config-change` primenjen na sve config PR-ove
- [ ] Merge blokiran dok `@spaja86` ne odobri
- [ ] Secrets ostaju van repo-a (GitHub Secrets / Vercel env) — nikad u kodu
- [ ] Sve commits potpisane (`git commit -S`)

**Governance pravila:**
- Deploy credentials ostaju u GitHub/Vercel secrets — nikad u repo-u
- Human review je obavezan za deploy, config, security i cross-repo promene
- Redosled promocije: `dev → staging → production`

---

## NIVO 1 — QUALITY GATES

> Svi 7 kapija moraju biti zeleni pre svake produkcione promocije.

- [ ] `npx tsc --noEmit` — TypeScript bez grešaka
- [ ] `npm run lint` — ESLint bez grešaka
- [ ] `npm test` — svi unit testovi prolaze
- [ ] `npm run test:smoke` — smoke testovi prolaze
- [ ] `npm run predeploy:check` — operativna deploy zaštita prolazi
- [ ] `npm audit --audit-level=high` — nema kritičnih ranjivosti
- [ ] Secret scanning — nema hardcoded kredencijala (`git grep -i "password\|secret\|key" --include="*.ts"`)

**CI workflow:** `omega-auto-build.yml` mora biti zelen na `main` pre svake promocije.

| Workflow | Status target |
|---|---|
| `omega-auto-build.yml` | ✅ Mora biti zelen |
| `security-scanner.yml` | ✅ Mora biti zelen |
| `nova-generacija.yml` | ✅ Mora biti zelen za NG promene |

---

## NIVO 2 — SECRETS & ENVIRONMENT SETUP

> Operativni zadatak — sve env varijable moraju biti setovane u Vercel Production.

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
- [ ] `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true` (posle slanja forme)
- [ ] `VERCEL_DEPLOY_HOOK_MEKARTOR` (opcioni fallback deploy hook)
- [ ] `MEKARTOR_STATUS_WEBHOOK_URL` (opcioni rollout status webhook)
- [ ] `MEKARTOR_UPSTREAM_URL` (opcioni buduci upstream)

> **Security boundary:** Svi secrets idu u GitHub Secrets / Vercel Environment Variables. Nikad `.env` fajlovi ili hardcoded kredencijali.

---

## NIVO 3 — DATABASE LAYER (Supabase)

> Primeniti sve migracije na produkcioni Supabase projekat u tačnom redosledu.

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
- [ ] RLS policies aktivni na svim tabelama
- [ ] Trigger `on_auth_user_created` aktivan (test sa registracijom)
- [ ] Service role ima write access na `profiles` tabelu
- [ ] Point-in-time recovery (PITR) aktivan
- [ ] `audit_events` tabela prima unose (test sa login eventom)

---

## NIVO 4 — PLATFORMA STABILIZACIJA (SpajaPro 13/14/15)

> Exit criteria za Nova Generacija aktivaciju — 13, 14 i 15 moraju biti stabilni.

### SpajaPro 13 — Evolucija (Development → Stable)
- [ ] Lint + smoke + security prolaze za sve Evolucija module
- [ ] Pouzdanost i reviewability prioritizovani nad scope ekspanzijom
- [ ] Bez otvorenih P0/P1 bugova

### SpajaPro 14 — Matriks (Development → Stable)
- [ ] Orchestration i observability zahtevi dokumentovani
- [ ] Lint + smoke + security prolaze
- [ ] Bez otvorenih P0/P1 bugova

### SpajaPro 15 — Omega (Planned → Development)
- [ ] Aktivirati tek kada su SpajaPro 13 i 14 stabilizovani i merljivi
- [ ] Roadmap entry u `docs/ROADMAP.md` ažuriran sa novim statusom

---

## NIVO 5 — NOVA GENERACIJA STAGED ROLLOUT

> SpajaPro 16 — Hipermreza (v100.0.0) — KPI gate na svakom koraku.

### Feature flag rollout

| Feature flag | Trenutno | Sledeći korak | Finalni cilj |
|---|---|---|---|
| `nova-generacija` | 20% canary | 50% staging | 100% production |
| `nova-generacija-gaming` | 10% staging | 50% staging | 100% production |
| `nova-generacija-hipermreza` | Enterprise/Unlimited | Pro+ planovi | Svi planovi |

### Rollout steps

**Korak 1 — 20% canary (AKTUELNO)**
- [ ] `GET /api/nova-generacija` → HTTP 200
- [ ] Action evaluation p99 ≤ 50ms
- [ ] Nema novih P0 grešaka

**Korak 2 — 50% staging**
- [ ] Sve Korak 1 KPI verifikacije zelene
- [ ] Build duration ≤ 3 min
- [ ] Uptime ≥ 99.99%
- [ ] Gaming session completion ≥ 95%, Fairness 100%
- [ ] `nova-generacija.yml` CI prodan na `main`

**Korak 3 — 100% production**
- [ ] Sve Korak 2 KPI verifikacije zelene
- [ ] Cross-repo sync coverage 100%
- [ ] Security scan coverage 100%
- [ ] `nova-generacija:validated` label primenjen na PR

### Nova Generacija CI checks
- [ ] `nova-generacija.yml` workflow prodan na `main`
- [ ] KPI gates: eval p99 ≤ 50ms, build ≤ 3 min
- [ ] `nova-generacija-agent` self-healing proveren (3 retries, auto-rollback)

---

## NIVO 6 — MULTI-PLATFORM DEPLOYMENT

### 6a. SUPER PLATFORMA (`src/` → Vercel)
- [ ] Vercel Git Integration auto-deploys na merge na main
- [ ] `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] `GET /api/status` → `operativa.readyState=READY`
- [ ] `GET /deploy_status.json` → `status: success`

### 6b. IO OPENUI AO (`platforms/io-openui-ao/`)
- [ ] Build + test lokalno
- [ ] Sync sa `spaja86/IO-OPENUI-AO` via `multi-repo-sync-agent`
- [ ] `docs/MULTI-REPO-LINKS.md` ažuriran sa deployment audit referencama (bidirekciono)
- [ ] Cross-repo ref format: `AI-IQ-SUPER-PLATFORMA#<issue> → IO-OPENUI-AO#<follow-up>`

### 6c. AI IQ Menjačnica (`platforms/menjacnica/`)
- [ ] Build + deploy
- [ ] `npx tsx src/tests/lib/menjacnica-fee.test.ts` — prolazi
- [ ] `npx tsx src/tests/lib/menjacnica-novcanik.test.ts` — prolazi
- [ ] `npx tsx src/tests/lib/menjacnica-max-order.test.ts` — prolazi

### 6d. AI IQ World Bank (`platforms/world-bank/`)
- [ ] Build + deploy
- [ ] Health endpoint verifikovan
- [ ] Database konekcija verifikovana

### 6e. Poslovni Novčanik (`platforms/poslovni-novcanik/`)
- [ ] Build + deploy
- [ ] `npx tsx src/tests/lib/novcanik-ledger.test.ts` — prolazi
- [ ] `npx tsx src/tests/lib/wollet-balance.test.ts` — prolazi
- [ ] `npx tsx src/tests/lib/wollet-audit.test.ts` — prolazi

### 6f. Kompanija SPAJA (`platforms/kompanija-spaja/`)
- [ ] Readiness criteria verifikovana (status: 🔧 In preparation)
- [ ] Build + lint + smoke prolaze
- [ ] Produkcioni deploy tek posle readiness ✅

### 6g. Mekartor (`platforms/mekartor/`)
- [ ] `GET /api/mekartor` → `status: healthy`
- [ ] `GET /api/deploy-platforma/health/mekartor` → `healthy: true`
- [ ] Rollout: 10% canary → 50% staging → 100% production

---

## NIVO 7 — BLOCKCHAIN DEPLOYMENT

- [ ] `npm run blockchain:compile` — kompajlirati smart contracts
- [ ] `npm run blockchain:deploy:testnet` — deploy na Polygon Amoy (testnet)
- [ ] Verifikacija na testnet-u (2–3 dana prozor)
- [ ] `npm run blockchain:deploy:mainnet` — deploy na Polygon mainnet (**human approval mandatory**)

> ⚠️ Mainnet deployment zahteva eksplicitno odobrenje `@spaja86` i nikad se ne radi bez verifikovanog testnet-a.

---

## NIVO 8 — DEPON PIPELINE (120M US korisnika)

> Pokrenuti `.github/workflows/depon-deploy.yml` u fazama. SLA: 99.99% uptime, ≤100ms latency.

| Faza | DEPONs | Regioni | User skala | Status |
|---|---|---|---|---|
| Phase 1 | DEPON-01 do DEPON-04 | 3 | 0–10M | ⬜ Pending |
| Phase 2 | DEPON-05 do DEPON-08 | 6 | 10–50M | ⬜ Pending |
| Phase 3 | DEPON-09 do DEPON-12 | 12 | 50–120M | ⬜ Pending |

- [ ] Phase 1 deploymeni prošli i SLA verifikovan
- [ ] Phase 2 deploymeni prošli i SLA verifikovan
- [ ] Phase 3 deploymeni prošli i SLA verifikovan

---

## NIVO 9 — BILLING & STRIPE

- [ ] Kreirati produkcione Price ID-ove u Stripe Dashboard: Basic, Pro, Enterprise, Unlimited, SpajaPro 16
- [ ] Registrovati produkcioni webhook endpoint: `https://DOMEN/api/stripe/webhook`
- [ ] Verifikovati webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Test kompletnog checkout flowa end-to-end
- [ ] Konfigurirati Stripe Customer Portal

---

## NIVO 10 — ENTERPRISE REQUESTS (pokrenuti paralelno)

- [ ] **Vercel Enterprise** — podneti zahtev na `https://vercel.com/contact/sales` → setovati `SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true`
- [ ] **Vercel CDN/proxy trust** — via `/api/enterprise-zahtevi` → setovati `SPAJA_VERCEL_CDN_PROXY_REQUEST_SUBMITTED=true`
- [ ] **GitHub Enterprise** — podneti zahtev na `https://github.com/enterprises/contact` → setovati `SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED=true`
- [ ] **OpenAI Enterprise** — Nikola Spajić (`spajicn@yahoo.com`) podnosi zahtev na `https://openai.com/business/` → setovati `SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED=true`

---

## NIVO 11 — DNS & VERCEL KONFIGURACIJA

- [ ] Produkcioni domen + SSL certifikat konfigurisan u Vercel Dashboard
- [ ] DNS propagacija završena (A/CNAME records) — čekati do 24h posle promene
- [ ] Vercel Cron jobs aktivni i verifikovani:

| Cron path | Schedule | Status |
|---|---|---|
| `/api/cron/zdravlje` | every 30 min | ⬜ |
| `/api/cron/evolucija` | every 6h | ⬜ |
| `/api/cron/protokoli-verifikacija` | every 15 min | ⬜ |
| `/api/cron/ekstremno-procesuiranje-svega` | every 20 min | ⬜ |
| `/api/analiza-svega-refresh` | min 10, 30, 50 | ⬜ |

- [ ] Ručno testirati cron endpoint sa `Authorization: ****** ili `x-cron-secret` header → 200
- [ ] (Opciono) Vercel KV store kreiran i `VERCEL_KV_REST_API_URL` + `VERCEL_KV_REST_API_TOKEN` setovani za global rate limiting

---

## NIVO 12 — SECURITY & AGENT AKTIVACIJA

- [ ] `security-scanner.yml` aktivan na svakom PR + nightly schedule
- [ ] CodeQL coverage gate aktivan na svim `nova-generacija` putanjama u CI
- [ ] `nova-generacija-agent` aktivan (`.agent-config.json`), self-healing enabled (max 3 retries, auto-rollback)
- [ ] `multi-repo-sync-agent` sinhronizuje weekly + on-push na main
- [ ] `analytics-bot` generiše nightly/weekly metrics reports
- [ ] `calculator-validator-agent` aktivan u IO-OPENUI-AO za gaming fairness verifikaciju
- [ ] Svi agenti poštuju `.agent-config.json` za custom ponašanje
- [ ] Svi agent commits potpisani (`git commit -S`)

---

## NIVO 13 — SPAJA BAZA KNOWLEDGE INDEX

> Semantic search pipeline unapređivanje v1 → v4.

| Pipeline verzija | Mehanizam | Quality gate | Status |
|---|---|---|---|
| v1 | ilike (lexical) | Fallback | Legacy |
| v2 | ilike + bigrams + keyword_density | `content.length >= 100` | Dual-mode |
| v3 | FTS textSearch (AND) + position_score | `chunk_index >= 0` | Primary |
| v4 | pgvector cosine similarity + hybrid | `OPENAI_API_KEY` set | Semantic-primary |

- [ ] v3 → v4 autopromotion aktivan (`index-auto-promote.yml`, nightly, batch 50)
- [ ] v4 na 75%+ completion (target: `targetCompletionPct: 75`)
- [ ] Degradation threshold ≤ 7.5% (`degradationThresholdPct: 7.5`)
- [ ] `/api/spaja-baza-knowledge/index-status` endpoint vraća zdravo stanje
- [ ] `OPENAI_API_KEY` setovan (potreban za v4 pgvector)

---

## NIVO 14 — POST-DEPLOY MONITORING (prve 24h)

### Svaka 2 sata
- [ ] `GET /api/health` → `status: healthy`, `zdravlje >= 80`
- [ ] Vercel error logs pregled
- [ ] Stripe webhook events verifikacija (Stripe Dashboard → Developers → Webhooks)

### First 24h checklist
- [ ] Test email delivery: `support@spaja.rs`, `billing@spaja.rs`, `sales@spaja.rs`, fallback `spajicn@yahoo.com`
- [ ] Test kompletnog registration + login flowa end-to-end
- [ ] Test Another Races fairness (rollout 20% → 100%, verifikovati KPI)
- [ ] `GET /api/deploy-portfolio` — live JSON snapshot svih platformi verifikovan
- [ ] `GET /api/status` → `operativa.modelStanja.runtime=runtime-ready`
- [ ] `GET /api/status` → `operativa.readyState=READY`

### KPI alerts (aktivirati u Vercel Dashboard)
- [ ] API p95 latency > 2s → alert
- [ ] Error rate > 1% u 5 min → alert
- [ ] Checkout fail rate > 5% → alert
- [ ] Auth fail rate > 15% → alert
- [ ] Gaming session completion < 80% → alert
- [ ] Nova Generacija eval > 100ms → alert

---

## NIVO 15 — ROLLBACK PLAN

> Rollback plan mora biti na standby pre svakog produkcijskog deploymenta.

| Level | Trigger | Akcija |
|---|---|---|
| **Level 1** — Endpoint greška | Deploy regression | `vercel rollback` u Vercel Dashboard → prethodna verzija auto-deployana |
| **Level 2** — Auth kompromitovan | JWT/session breach | Rotirati `OMEGA_JWT_SECRET` u Vercel env → svi tokeni invalidovani |
| **Level 3** — Billing incident | Webhook/payment failure | Disable Stripe webhook → manual processing `checkout.session.completed` eventa |
| **Level 4** — Full shutdown | Critical system failure | Vercel Dashboard → Settings → Deployments → Pause → DNS na maintenance page → forensic analiza |

- [ ] Rollback procedure dokumentovana i testerovana u staging
- [ ] Svi rollback levelovi razumljivi timu
- [ ] `docs/GO-LIVE.md#rollback-plan` ažuriran i validan

Vidi: `docs/GO-LIVE.md#rollback-plan` za detalje.

---

## NIVO 16 — FINAL SIGN-OFF & DOCUMENTATION

- [ ] `CHANGELOG.md` ažuriran sa svim promenama ove verzije
- [ ] `docs/GO-LIVE.md` → Go/No-Go tabela → sve stavke `✅ GO`
- [ ] `public/deploy_status.json` ažuriran sa finalnim commit SHA i timestamp-om
- [ ] `docs/MULTI-REPO-LINKS.md` ažuriran sa MAKS PLAN audit trail referencom
- [ ] Tim obavešten o svim novim env vars
- [ ] GitHub governance matrix potvrđena: `spaja86` owner, billing owner, repo admin backup, workflow owner
- [ ] PR labeliran `nova-generacija:validated` + `race:validated` posle uspešne validacije
- [ ] **Merge samo sa human-review odobrenjem od `@spaja86`**

---

## 📊 MAKSIMUM KPI TABELA

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
| OMEGA personas | 50 | — |
| Hipermreza čvorova | 256 (16×16) | — |
| Oktavnih slojeva | 16 | — |
| Platform routes | 2000+ | — |

---

## Napomene o implementaciji

Stavke na sledećim nivoima zahtevaju **operativne/spoljne akcije** van Git repozitorijuma:

- **NIVO 2** — Secrets i env vars → Vercel Dashboard / GitHub Secrets (ne u kodu)
- **NIVO 3** — Supabase migracije → produkcioni Supabase projekat
- **NIVO 7** — Blockchain mainnet → human approval + private keys van repo-a
- **NIVO 9** — Stripe Price ID-ovi i webhook → Stripe Dashboard
- **NIVO 10** — Enterprise requests → spoljni form submission
- **NIVO 11** — DNS + Vercel Cron → Vercel Dashboard

Sve code-level implementacije (workflows, feature flags, lib, tests) su u repozitorijumu i praćene kroz standardni Issue → PR → review → release flow.

---

*SpajaUltraOmegaCore -∞Ω+∞ | MAKS PLAN NIVO LEVL | Zero Trust | Kvantno-Otporno*  
*Kompanija SPAJA — Digitalna Industrija | MEGA CENTAR SVEGA, Smederevo 11300, Srbija*
