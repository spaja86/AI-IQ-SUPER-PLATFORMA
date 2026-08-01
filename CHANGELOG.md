# CHANGELOG — AI IQ SUPER PLATFORMA

*Kompanija SPAJA — Digitalna Industrija*

All notable changes to this project are documented in this file.

Format follows: **[version] — date | description**

---

## [42.36.0] — 2026-08-01 | MAKS PLAN NIVO LEVL

### 🔥 Scope

Formalizacija i implementacija MAKS PLAN NIVO LEVL — apsolutnog maksimum plana za AI IQ SUPER PLATFORMA. Pokriva svih 16 operativnih nivoa od governance gate-a do final sign-off-a, sa ciljem verzije v100.0.0 (SpajaPro 16 Nova Generacija).

### Added

- **`docs/MAKS-PLAN-NIVO-LEVL.md`** — Master operativni tracking dokument sa svih 16 nivoa, checkboxima za praćenje, KPI tabelom i deployment redosledom.
- **`public/deploy_status.json`** — Ažuriran da reflektuje MAKS PLAN NIVO LEVL inicijativu.
- **`docs/MULTI-REPO-LINKS.md`** — Dodat MAKS PLAN audit trail entry sa cross-repo referencom.

### Plan tracking (16 nivoa)

| Nivo | Naziv | Tip | Status |
|---|---|---|---|
| 0 | Governance Gate | Process | ⬜ Pending |
| 1 | Quality Gates (7 kapija) | CI/Code | ⬜ Pending |
| 2 | Secrets & Environment Setup | Operational | ⬜ Pending |
| 3 | Database Layer (Supabase 001–020) | Operational | ⬜ Pending |
| 4 | Platforma Stabilizacija (SP13/14/15) | Code | ⬜ Pending |
| 5 | Nova Generacija Staged Rollout | Code/Feature flags | ⬜ Pending (20% active) |
| 6 | Multi-Platform Deployment (a–g) | Operational | ⬜ Pending |
| 7 | Blockchain Deployment | Operational | ⬜ Pending |
| 8 | DEPON Pipeline (Phase 1–3) | Operational | ⬜ Pending |
| 9 | Billing & Stripe | Operational | ⬜ Pending |
| 10 | Enterprise Requests | Operational | ⬜ Pending |
| 11 | DNS & Vercel Konfiguracija | Operational | ⬜ Pending |
| 12 | Security & Agent Aktivacija | CI/Code | ⬜ Pending |
| 13 | SPAJA Baza Knowledge Index v4 | Code | ⬜ Pending |
| 14 | Post-Deploy Monitoring (24h) | Operational | ⬜ Pending |
| 15 | Rollback Plan (na standby) | Operational | ⬜ Pending |
| 16 | Final Sign-Off & Documentation | Process | ⬜ Pending |

### Cross-repo impact

Zahteva follow-up sync u `spaja86/IO-OPENUI-AO`:
- Verifikovati label schema alignment
- Ažurirati `docs/MULTI-REPO-LINKS.md` u IO-OPENUI-AO sa bidirekcionalnom referencom na ovaj inicijativi

### Operational requirements

- Svi secrets u Vercel Production env (ne u repo-u)
- Supabase migracije 001–020 primenjene pre deploymenta
- Nova Generacija staged rollout: 20% → 50% → 100% sa KPI gate-ovima
- Blockchain mainnet deployment zahteva human approval
- Sve enterprise requests van Git repo-a

---

## [42.35.0] — 2026-08-01 | MAKSIMUM ALL PLATFORMA DEPLOY (SPAJA)

### 🚀 Scope

Full production deployment of all 6 platforms in the AI IQ SUPER PLATFORMA ecosystem, including Nova Generacija activation, blockchain deployment, DEPON pipeline, and cross-repo synchronization with IO-OPENUI-AO.

### Added

- **`docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md`** — Master deploy tracking document covering all 12 deployment phases as a living operational checklist.
- **`CHANGELOG.md`** — This changelog; initial entry for v42.35.0 MAKSIMUM DEPLOY initiative.
- **`public/deploy_status.json`** — Updated with current deploy timestamp, branch, and commit SHA.
- **`docs/MULTI-REPO-LINKS.md`** — MAKSIMUM DEPLOY audit trail entry linking this initiative to IO-OPENUI-AO cross-repo coordination.

### Platforms in scope

| Platform | Path | Status |
|---|---|---|
| AI IQ SUPER PLATFORMA | `src/` → Vercel | ✅ Active |
| IO OPENUI AO | `platforms/io-openui-ao/` | ✅ Active |
| AI IQ Menjačnica | `platforms/menjacnica/` | ✅ Active |
| AI IQ World Bank | `platforms/world-bank/` | ✅ Active |
| Nova Generacija | `platforms/nova-generacija/` | ✅ Active |
| Kompanija SPAJA | `platforms/kompanija-spaja/` | 🔧 In preparation |

### Deployment phases

See `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md` for the full 12-phase plan and per-phase status.

### Operational requirements (must be completed out-of-band)

- All Vercel Production env vars set (OMEGA_JWT_SECRET, OMEGA_VAULT_KEY, CRON_SECRET, Supabase, Stripe, OpenAI)
- All Supabase migrations 001–020 applied to production project
- Stripe production Price IDs created and webhook registered
- Nova Generacija staged rollout: 20% → 50% → 100%
- Enterprise requests submitted (Vercel, GitHub, OpenAI)

### Quality gates

- `npm run build` — TypeScript compilation
- `npm run lint` — ESLint
- `npm test` — All unit test suites
- `npm run test:smoke` — Smoke tests
- `npm run predeploy:check` — Operational deploy guard
- `npm audit --audit-level=high` — No critical vulnerabilities

### Rollback plan

See `docs/MAKSIMUM-ALL-PLATFORMA-DEPLOY.md#faza-11` and `docs/GO-LIVE.md#rollback-plan`.

### Cross-repo impact

Requires follow-up sync in `spaja86/IO-OPENUI-AO`:
- Verify label schema alignment
- Confirm `multi-repo-sync-agent` sync coverage = 100%
- Update `docs/MULTI-REPO-LINKS.md` in IO-OPENUI-AO with bidirectional reference

---

## [42.34.0] — 2026-04-22 | Go/No-Go baseline

### Changed

- Go/No-Go document baseline established — all technical gates green.
- P0 items confirmed: Build ✅ GO, Lint ✅ GO, Unit tests ✅ GO, Smoke ✅ GO.
- Supabase production migrations and Stripe credentials marked as pending production env configuration.

---

*SpajaUltraOmegaCore -∞Ω+∞ | Zero Trust | Kompanija SPAJA*
