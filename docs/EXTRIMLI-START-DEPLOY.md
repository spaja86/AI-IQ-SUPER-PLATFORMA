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
| **Contract version** | `EXTRIMLI_CONTRACT_VERSION = v1`, `EXTRIMLI3_CONTRACT_VERSION = v3` |
| **Downstream repo** | `spaja86/IO-OPENUI-AO` |
| **OKRID** | `OKRID-2026-EXTRIMLI-START-001` |

---

## Deploy faze

### FAZA 1 — Pre-Deploy Readiness Gate

| Check | Agent | Status |
|-------|-------|--------|
| registry, risk-engine, performance-tracker, gear-catalog, event-engine, weather-adapter | `extrimli-validator-agent` | ⬜ Pending |
| Edge cases: NaN, Infinity, negativne cene, zero stock | `extrimli-validator-agent` | ⬜ Pending |
| Performance KPI: evaluacija ≤ 50ms, API ≤ 200ms | `extrimli-validator-agent` | ⬜ Pending |
| TypeScript + lint na `src/lib/extrimli/**`, `src/app/api/extrimli/**` | `ci-bot` | ⬜ Pending |
| Security scan: secrets + dependency audit | `security-scanner` | ⬜ Pending |
| PR label `extrimli:logic-change` → `extrimli:validated` | agent gate | ⬜ Pending |

### FAZA 2 — Build & Smoke

| Check | KPI | Status |
|-------|-----|--------|
| `next build` kompletiran | ≤ 3 min | ⬜ Pending |
| `GET /api/extrimli/health` | 200 OK | ⬜ Pending |
| `POST /api/extrimli/risk` | valid risk score | ⬜ Pending |
| `GET /api/extrimli/gear` | catalog items returned | ⬜ Pending |
| MIRIKL quality gate: lint → test → smoke → predeploy → security | `mirikl-validator-agent` | ⬜ Pending |

### FAZA 3 — Multi-Repo Sync Pre-Deploy

| Check | Agent | Status |
|-------|-------|--------|
| Gear catalog snapshot sync → `spaja86/IO-OPENUI-AO` | `multi-repo-sync-agent` | ⬜ Pending |
| `docs/MULTI-REPO-LINKS.md` ažuriran sa START deploy referencom | agent / human | ✅ Done |
| `extrimli-core` persona aktivna (octave: 7, node: 56) | `persona-bank-agent` | ⬜ Pending |

### FAZA 4 — Vercel Deploy (SPAJA)

| Check | Status |
|-------|--------|
| Push na `main` triggeruje Vercel Git auto-deploy | ⬜ Pending |
| GitHub Actions ostaje governance/audit layer | ✅ Konfigurisano |
| Deploy hook: Vercel preview → production promotion | ⬜ Pending |
| `deploy-bot` audit log u PR komentaru (URL, SHA, timestamp, rollback) | ⬜ Pending |

### FAZA 5 — Post-Deploy Validation

| Check | Agent | Status |
|-------|-------|--------|
| Produkcioni smoke test (extrimli rute) | automated | ⬜ Pending |
| EXTRIMLI integritet u hipermrezi (node 56) | `nova-generacija-agent` | ⬜ Pending |
| EXTRIMLI API metrika tracking start | `analytics-bot` | ⬜ Pending |
| PR opisan: rollout, rollback, KPI, downstream link | human | ⬜ Pending |

### FAZA 6 — Human Review & Release

| Check | Status |
|-------|--------|
| `human-review` approve pre merge na `main` | ⬜ Pending |
| Merge → automatski Vercel production deploy | ⬜ Pending |
| Release tag: `extrimli-v1.0.0` | ⬜ Pending |
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

## Rollback Plan

| Nivo | Metoda | Vreme |
|------|--------|-------|
| **Instant** | Vercel Dashboard → Deployments → Promote to Production | < 60s |
| **Git** | `git revert <merge-commit>` + PR sa labelom `hotfix` | < 5 min |
| **Multi-repo** | `multi-repo-sync-agent` revertuje gear catalog snapshot u IO-OPENUI-AO | < 10 min |

**Rollback trigeri:**
- Smoke failure (HTTP ≠ 2xx)
- API response > 500ms
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
