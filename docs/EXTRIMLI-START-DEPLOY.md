# EXTRIMLI — "START" Deploy Platform (SPAJA)

> AI IQ SUPER PLATFORMA — Kompanija SPAJA | OKRID: `OKRID-2026-EXTRIMLI-START-001`

Ovaj dokument je kanonski go-live tracking fajl za prvi produkcioni deployment EXTRIMLI modula
na SPAJA platformi. Prati sve faze, KPI rezultate, rollback plan i downstream koordinaciju.

---

## Status

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

---

## Domain Strategy (SPAJA)

| Polje | Vrednost |
|-------|----------|
| **Requested string** | `spaja.nivo*spaja` |
| **DNS validity** | ❌ Invalid (`*` ne može biti u sredini label-e) |
| **Canonical apex domain** | `spaja.nivo-spaja` |
| **Canonical wildcard domain** | `*.spaja.nivo-spaja` |
| **Routing model** | Apex + wildcard poddomeni |
| **TLS** | Vercel managed cert za apex + wildcard |

**DNS/TLS gate (pre WAWE 4):**
- [ ] Domen `spaja.nivo-spaja` dodat u Vercel projekat
- [ ] DNS zapisi kod provajdera usmereni na Vercel (A/CNAME prema Vercel uputstvu)
- [ ] `*.spaja.nivo-spaja` wildcard zapis aktivan
- [ ] TLS/SSL sertifikat za apex i wildcard status = Active
- [ ] Deploy hook i svi tokeni ostaju isključivo u GitHub/Vercel Secrets sloju

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

---

## Deploy faze

### FAZA 1 — Pre-Deploy Readiness Gate

| Check | Agent | Status |
|-------|-------|--------|
| registry, risk-engine, performance-tracker, gear-catalog, event-engine, weather-adapter | `extrimli-validator-agent` | ⬜ Pending |
| EXTRONDEND + EXTRONDOL + DUET contract tests | `extrimli-validator-agent` / `ci-bot` | ⬜ Pending |
| Edge cases: NaN, Infinity, negativne cene, zero stock | `extrimli-validator-agent` | ⬜ Pending |
| Performance KPI: evaluacija ≤ 50ms, API ≤ 200ms | `extrimli-validator-agent` | ⬜ Pending |
| TypeScript + lint na `src/lib/extrimli/**`, `src/lib/extrimli-extrondend/**`, `src/lib/extrimli-extrondol/**`, `src/lib/duet/**`, `src/app/api/extrimli/**`, `src/app/api/duet/**` | `ci-bot` | ⬜ Pending |
| Security scan: secrets + dependency audit | `security-scanner` | ⬜ Pending |
| PR label `extrimli:logic-change` → `extrimli:validated` | agent gate | ⬜ Pending |

### FAZA 2 — Build & Smoke

| Check | KPI | Status |
|-------|-----|--------|
| `next build` kompletiran | ≤ 3 min | ⬜ Pending |
| `GET /api/extrimli/health` | 200 OK | ⬜ Pending |
| `GET /api/extrimli/extrondol` | WAWE + START payload valid | ⬜ Pending |
| `POST /api/extrimli/risk` | valid risk score | ⬜ Pending |
| `GET /api/extrimli/gear` | catalog items returned | ⬜ Pending |
| MIRIKL quality gate: lint → test → smoke → predeploy → security | `mirikl-validator-agent` | ⬜ Pending |

### FAZA 3 — Multi-Repo Sync Pre-Deploy

| Check | Agent | Status |
|-------|-------|--------|
| Gear catalog snapshot sync → `spaja86/IO-OPENUI-AO` | `multi-repo-sync-agent` | ⬜ Pending |
| EXTRONDOL WAWE/B2B/DUET/DINKOS/distance-ratio sync → `spaja86/IO-OPENUI-AO` | `multi-repo-sync-agent` | ⬜ Pending |
| `docs/MULTI-REPO-LINKS.md` ažuriran sa START deploy referencom | agent / human | ✅ Done |
| `extrimli-core` persona aktivna (octave: 7, node: 56) | `persona-bank-agent` | ⬜ Pending |

### FAZA 4 — Vercel Deploy (SPAJA)

| Check | Status |
|-------|--------|
| Push na `main` triggeruje Vercel Git auto-deploy | ⬜ Pending |
| GitHub Actions ostaje governance/audit layer | ✅ Konfigurisano |
| Domen strategija potvrđena (`spaja.nivo-spaja` + `*.spaja.nivo-spaja`) | ⬜ Pending |
| EXTRONDOL promotion freeze ostaje aktivan bez governance evidence | ⬜ Pending |
| Deploy hook: Vercel preview → production promotion | ⬜ Pending |
| `deploy-bot` audit log u PR komentaru (URL, SHA, timestamp, rollback) | ⬜ Pending |

### FAZA 5 — Post-Deploy Validation

| Check | Agent | Status |
|-------|-------|--------|
| Produkcioni smoke test (extrimli rute) | automated | ⬜ Pending |
| EXTRONDOL START payload verifikacija | automated | ⬜ Pending |
| EXTRIMLI integritet u hipermrezi (node 56) | `nova-generacija-agent` | ⬜ Pending |
| EXTRIMLI API metrika tracking start | `analytics-bot` | ⬜ Pending |
| PR opisan: rollout, rollback, KPI, downstream link | human | ⬜ Pending |

### FAZA 6 — Human Review & Release

| Check | Status |
|-------|--------|
| `human-review` approve pre merge na `main` | ⬜ Pending |
| Merge → automatski Vercel production deploy | ⬜ Pending |
| Release tag: `extrimli-v1.0.0` | ⬜ Pending |
| EXTRONDOL START governance evidence kompletna | ⬜ Pending |
| Audit log finalizovan u GitHub Issue | ⬜ Pending |

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

## START Acceptance Lock

- [ ] EXTRONDOL ostaje `/api/extrimli/extrondol` source-of-truth
- [ ] START payload ostaje additive-only
- [ ] DUET ostaje signal-only sloj za WAWE odluke
- [ ] `spaja.nivo*spaja` ostaje odbijen obrazac
- [ ] `spaja.nivo-spaja` + `*.spaja.nivo-spaja` ostaju jedini kanonski domeni
- [ ] Downstream sync prema `spaja86/IO-OPENUI-AO` uključuje WAWE, B2B, DUET/DINKOS i distance-ratio polja
- [ ] Human review, audit trail, onboarding i downstream sync evidence kompletni pre promocije

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

## Audit Log (popuniti pri deploy-u)

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
