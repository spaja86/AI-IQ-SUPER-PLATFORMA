# EXTRIMLI — "START" Deploy Platform (SPAJA)

> AI IQ SUPER PLATFORMA — Kompanija SPAJA | OKRID: `OKRID-2026-EXTRIMLI-START-001`

Ovaj dokument je kanonski go-live tracking fajl za prvi produkcioni deployment EXTRIMLI modula
na SPAJA platformi. Prati sve faze, KPI rezultate, rollback plan i downstream koordinaciju.

---

## Status

Aktivacija je BLOCKED. Oznake Locked/Ready u istorijskim tabelama opisuju zahteve,
ne potvrđuju izvršene provere, TLS ili uspešan deployment.


<!-- START_DEPLOY_REQUIRED_LABELS -->
| Polje | Vrednost |
|-------|----------|
| **Module** | EXTRIMLI v1 + v3 |
| **Deploy target** | AI IQ SUPER PLATFORMA (Vercel) |
| **Workflow** | `.github/workflows/extrimli-spaja-deploy.yml` |
| **Persona** | `extrimli-core` (octave: 7, hipermreza node: 56) |
| **START project** | `START PROJEKAT` — EXTRONDOL rollout governance wrapper |
| **EXTRONDOL source-of-truth** | `/api/extrimli/extrondol` |
| **Contract version** | `EXTRIMLI_CONTRACT_VERSION = v1`, `EXTRIMLI3_CONTRACT_VERSION = v3` |
| **EXTRONDOL contract** | `EXTRONDOL_CONTRACT_VERSION = v1-extrondol`, `EXTRONDOL_MODULE_VERSION = 1.0.0` |
| **Downstream repo** | `spaja86/IO-OPENUI-AO` |
| **OKRID** | `OKRID-2026-EXTRIMLI-START-001` |
| **Required labels** | `extrimli:logic-change`, `extrimli:external-github`, `agent:config-change` |
| **Human review gate** | Mandatory before merge / release per `AGENTS.md` |

---

## Source-of-truth closure order

- Canonical route pair for deploy readiness remains:
  - `/api/vercel-status`
  - `/api/owner/vercel-ownership`
- The machine-readable `deployReadinessPlan` on both routes tracks the closure order for:
  1. source-of-truth confirmation
  2. billing gate
  3. evidence gate
  4. ownership / enterprise gate
  5. FinOps gate
  6. deploy infra gate
  7. domain gate
  8. WAWE 3 / release gate
  9. WAWE 4 production promotion + WAWE 5 post-release audit
- Production remains blocked until the plan no longer reports billing/evidence/ownership/FinOps/infra blockers and the remaining domain / downstream / human-review requirements are closed.

---

## Domain Strategy (SPAJA)

<!-- START_DEPLOY_CANONICAL_DOMAIN_STRATEGY -->
| Polje | Vrednost |
|-------|----------|
| **Logical SPAJA ID** | `spaja.nivo*spaja` — validan logički ID; ❌ Invalid kao DNS hostname |
| **Javna adresa** | `publicDomain = null` |
| **Kandidat** | Eksplicitni kandidatski hostname, bez tvrdnje o vlasništvu |
| **Wildcard** | Nema podrazumevane vrednosti; opcion, zahteva zasebnu proveru |
| **TLS** | Nepotvrđen; Vercel konfiguracija nije dokaz aktivnog sertifikata |

EXTRIMLI koristi model iz PR #1379 (`src/lib/deploy/spaja-network.ts`).
`canonical_domain` i `wildcard_domain` su kompatibilni nazivi kandidatskih ulaza.
Prazan unos ne bira domen. Stari `spaja.nivo-spaja` nije javni domen za aktivaciju.

`scripts/extrimli-network-gate.mjs` uvek blokira aktivaciju: workflow još nema
pouzdan serverski kanal za nezavisne dokaze. Dispatch inputi, env boolean zastavice,
confirm_production, predeploy exit 0, DNS sintaksa i provider konfiguracija ne otključavaju hook.
I staging hook ostaje blokiran jer postojeći zajednički hook ne dokazuje izolaciju od produkcije.
Postojeći servisi, tajne i DNS ostaju neizmenjeni. Buduća aktivacija zahteva zaseban pregled
integracije dokaza, sve release kontrole i izričito operativno odobrenje.

**DNS/TLS gate (pre WAWE 4):**
- [ ] Nezavisni sveži dokaz registracije i vlasništva tačnog kandidata
- [ ] Nezavisna provera DNS-a i dostupnosti aplikacija
- [ ] TLS za svaki tačan host: chain/hostname, fingerprint, rok i svežina do 24h
- [ ] Wildcard sertifikat i DNS provereni zasebno ako se wildcard koristi
- [ ] Billing/evidence/ownership/FinOps/infra, downstream i human-review kontrole zatvorene
- [ ] Odobrena integracija pouzdanog kanala dokaza; javna aktivacija ostaje blokirana

## EXTRONDOL START Scope

- `START PROJEKAT` tretira EXTRONDOL kao poseban rollout/governance source-of-truth modul.
- Orchestration inputs ostaju zaključani na:
  - `EXTRONDEND`
  - `EXTENDOL`
  - `KORON`
- DUET ostaje signalni sloj za WAWE promociju i onboarding hold, ne poseban rollout engine.
- START acceptance mora uključiti:
  - `rollout.currentWawe`
  - `rollout.eligibleNextWawe`
  - `rollout.promotionFreeze`
  - `nivoDuet`
  - `dinkos`
  - `distanceRatioEkvilaterTable`
- START governance ostaje additive-only i ne menja postojeći EXTRONDOL contract version.
- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA` ostaje bounded activation plan samo kao governance/audit refleksija nad postojećim EXTRIMLI + EXTREM + EXTRONDOL slojevima.
- Kanonski bounded vokabular za ovu aktivaciju ostaje `EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR`.

---

## WAWE execution evidence

<!-- START_DEPLOY_WAWE_1 -->
### WAWE 1 — Pre-release validation evidence

| Evidence | Source | Status |
|----------|--------|--------|
| TypeScript gate (`npx tsc --noEmit`) | `.github/workflows/extrimli-spaja-deploy.yml` → `validate` | ✅ Locked |
| Lint gate za EXTRIMLI / EXTRONDEND / EXTRONDOL / DUET / EXTRIMLI-CUZ | `.github/workflows/extrimli-spaja-deploy.yml` → `validate` | ✅ Locked |
| EXTRIMLI scoped tests + route tests | `.github/workflows/extrimli-spaja-deploy.yml` → `validate` | ✅ Locked |
| Smoke gate (`npm run test:smoke`) | `.github/workflows/extrimli-spaja-deploy.yml` → `security` | ✅ Locked |
| Predeploy gate (`npm run predeploy:check`) | `.github/workflows/extrimli-spaja-deploy.yml` → `security` | ✅ Locked |
| Security gate (`npm audit --audit-level=high` + secret scan) | `.github/workflows/extrimli-spaja-deploy.yml` → `security` | ✅ Locked |
| Required labels posture | `extrimli:logic-change`, `extrimli:external-github`, `agent:config-change` | ✅ Required |
| Human review remains mandatory pre-promotion | `AGENTS.md` + START governance | ✅ Locked |

<!-- START_DEPLOY_WAWE_2 -->
### WAWE 2 — Build + staging + KPI evidence

| Evidence | KPI / Gate | Status |
|----------|------------|--------|
| `npm run build` | build ≤ 3 min | ✅ Locked |
| Staging smoke via Vercel Git preview + `npm run test:smoke` | green staging smoke | ✅ Locked |
| `GET /api/extrimli/health` / `GET /api/extrimli/extrondol` / `POST /api/extrimli/risk` / `GET /api/extrimli/gear` | contract / route continuity | ✅ Tracked |
| Performance KPI summary | API ≤ 200ms, evaluacija ≤ 50ms, rollback ≤ 60s | ✅ Locked |
| Persona-bank snapshot + Nova Generacija integrity evidence | node 56 active, node 256 anchor active | ✅ Locked |

<!-- START_DEPLOY_WAWE_3 -->
### WAWE 3 — Downstream sync evidence

| Evidence | Target | Status |
|----------|--------|--------|
| `docs/MULTI-REPO-LINKS.md` START deploy section | `spaja86/IO-OPENUI-AO` | ✅ Updated |
| Logical ID / kandidat / potvrđena javna adresa mirror | linked deploy docs / runbooks | ✅ Required |
| EXTRONDOL START payload sync (`WAWE`, `B2B`, `DUET`, `DINKOS`, `distanceRatioEkvilaterTable`, `startProject`) | linked governance consumers | ✅ Required |
| Developer/Create activation summary sync (`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA`) | summary-only downstream reflection | ✅ Required |
| Cross-repo follow-up issue remains mandatory before WAWE 4 promotion | use concrete `IO-OPENUI-AO#<number>` reference once opened | ✅ Locked |

<!-- START_DEPLOY_WAWE_4 -->
### WAWE 4 — Production rollout evidence

| Evidence | Rule | Status |
|----------|------|--------|
| Vercel Git integration remains primary production source of truth | promotion without side-channel deploys | ✅ Locked |
| Network evidence gate | nedostajući dokazi blokiraju hook | ✅ Locked |
| Rollout rings remain `10% → 50% → 100%` | progressive rollout | ✅ Locked |
| Promotion freeze stays active unless audit/KPI/downstream/human-review evidence is complete | no premature activation | ✅ Locked |
| Rollback path validated | Vercel promote/revert + follow-up sync | ✅ Locked |

<!-- START_DEPLOY_WAWE_5 -->
### WAWE 5 — Post-release resilience + analytics + audit evidence

| Evidence | Source | Status |
|----------|--------|--------|
| Production health verification | workflow `post_deploy` / optional verify URL | ✅ Ready |
| Hipermreza convergence + self-healing check | workflow `post_deploy` | ✅ Locked |
| Analytics bot audit summary | workflow `audit` | ✅ Locked |
| Release audit summary includes rollout / rollback / KPI / downstream / human-review posture | START governance + workflow summary | ✅ Locked |
| Final audit keeps human-review gate visible before release completion | START governance | ✅ Locked |

---

## KPI Targets

| Metrika | Target |
|---------|--------|
| Build time | ≤ 3 min |
| API response | ≤ 200ms |
| Risk evaluacija | ≤ 50ms |
| Deploy downtime | 0s (Vercel zero-downtime) |
| Smoke test pass rate | 100% |
| Hipermreza konvergencija | ≥ 0.95 |
| Rollback time | ≤ 60s |
| Secrets in Git | 0 (Mandatory) |

---

## START Acceptance Lock (runtime checklist)

- [ ] EXTRONDOL ostaje `/api/extrimli/extrondol` source-of-truth
- [ ] START payload ostaje additive-only
- [ ] DUET ostaje signal-only sloj za WAWE odluke
- [ ] `spaja.nivo*spaja` ostaje logički ID, odbijen kao DNS
- [ ] Javni domen i wildcard ostaju null dok nisu nezavisno potvrđeni
- [ ] Downstream sync prema `spaja86/IO-OPENUI-AO` uključuje WAWE, B2B, DUET/DINKOS i distance-ratio polja
- [ ] Human review, audit trail, onboarding i downstream sync evidence kompletni pre promocije

Status ove checkliste se potvrđuje u workflow summary / release audit izlazu, ne unapred u source dokumentu.

---

## Rollback Plan

| Nivo | Metoda | Vreme |
|------|--------|-------|
| **Instant** | Vercel Dashboard → Deployments → Promote to Production | < 60s |
| **Git** | `git revert <merge-commit>` + PR sa labelom `hotfix` | < 5 min |
| **Multi-repo** | `multi-repo-sync-agent` revertuje gear catalog snapshot u IO-OPENUI-AO | < 10 min |

**Rollback trigeri:**
- Smoke failure (HTTP ≠ 2xx)
- API response > 200ms (KPI breach)
- Hipermreza konvergencija < 0.95
- Security finding post-deploy

---

## API rute (smoke test endpoints)

| Method | Route | Opis |
|--------|-------|------|
| `GET` | `/api/extrimli/health` | Health report (registry stats, module version) |
| `POST` | `/api/extrimli/risk` | Composite risk score kalkulacija |
| `GET` | `/api/extrimli/gear` | Gear catalog list (optional: `?category=&sportId=`) |
| `GET` | `/api/extrimli/sports` | Sport registry list |
| `GET` | `/api/extrimli/performance` | Athlete performance tracker |
| `GET` | `/api/extrimli/events` | Event registry |
| `GET` | `/api/extrimli-3/health` | EXTRIMLI v3 health report |
| `POST` | `/api/extrimli-3/risk` | EXTRIMLI v3 risk score (sport-specific profiles) |

---

## Downstream koordinacija

| Source | Target | Sync |
|--------|--------|------|
| `AI-IQ-SUPER-PLATFORMA` — gear catalog snapshot | `spaja86/IO-OPENUI-AO` | `multi-repo-sync-agent` |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI persona `extrimli-core` | Persona Bank | `persona-bank-agent` |
| `AI-IQ-SUPER-PLATFORMA` — EXTRIMLI 3 risk profiles | `spaja86/IO-OPENUI-AO` | Follow-up required |

---

## Workflow reference

- **Deploy workflow:** `.github/workflows/extrimli-spaja-deploy.yml`
- **Validator workflow:** `.github/workflows/extrimli-validator.yml`
- **MIRIKL governance:** `.github/workflows/mirikl-validator.yml`
- **MULTI-REPO-LINKS:** `docs/MULTI-REPO-LINKS.md`
- **Go-Live Checklist:** `docs/GOLIVE_CHECKLIST.md`
- **Deploy Portfolio:** `docs/DEPLOY-PORTFOLIO.md`

---

## Audit summary template (runtime-populated)

| Polje | Vrednost |
|-------|----------|
| agentId | `extrimli-spaja-deploy` |
| timestamp | — |
| branch | `main` |
| commit SHA | — |
| deploy URL | https://ai-iq-super-platforma.vercel.app |
| health URL | https://ai-iq-super-platforma.vercel.app/api/extrimli/health |
| deploy status | ⬜ Pending |
| rollback hook | Vercel Dashboard |
| analytics-bot | Post-deploy tracking aktiviran: ⬜ |

---

*Dokument kreiran: 2026-08-20 | Owner: @spaja86 | OKRID: OKRID-2026-EXTRIMLI-START-001*
