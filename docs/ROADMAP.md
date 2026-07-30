# ROADMAP — Future Implementation

## Purpose

This document turns the repo-wide future plan into an operational roadmap for `AI-IQ-SUPER-PLATFORMA`, with clear ownership across platform structure, roadmap delivery, automation, multi-repo coordination, and operational KPIs.

## Current implementation baseline

| Track | Current baseline | Source of truth |
|---|---|---|
| Core platform stabilization | `src/` is the primary production runtime; `portal/`, `shared/`, and `platforms/*` remain mixed between static modules and migration targets | `README.md`, `portal/README.md`, `platforms/*/README.md` |
| Product roadmap clarity | SpajaPro 6-15 status exists, but release intent is scattered across docs | `README.md` |
| Automation and delivery | CI, cron, branch sync, governance, and deploy fallback exist; security automation needed a dedicated workflow | `.github/workflows/*` |
| Multi-repo coordination | `IO-OPENUI-AO` is linked in config and docs, but follow-up rules needed to be formalized | `AGENTS.md`, `.agent-config.json` |
| Reliability and security maturity | FinOps, go-live, auth, payments, and cron guidance exist; KPI ownership needed a unified roadmap entry | `docs/SECURITY.md`, `docs/GO-LIVE.md`, `docs/finops-enterprise-operating-model.md` |

## Implementation phases

### Phase 1 — Core platform stabilization

- Keep `src/` as the production runtime surface.
- Use documentation and readiness tracking to standardize `portal/`, `shared/`, and `platforms/*`.
- Treat migration-state modules as explicitly tracked, not implicitly production-ready.

### Phase 2 — Automation and security completion

- Keep `omega-auto-build.yml` as the core quality gate.
- Run smoke + predeploy validation in CI for every protected change path.
- Activate the dedicated `security-scanner` workflow for CodeQL, dependency review, npm audit, and secret heuristics.

### Phase 3 — Multi-repo sync hardening

- Use `.agent-config.json` as the operational source of truth for linked repositories.
- Standardize sync fields for config, versions, labels, milestones, docs, and follow-up references.
- Require every cross-repo change to describe downstream impact in the PR template.

### Phase 4 — Product roadmap delivery

- Turn SpajaPro release status into an execution order.
- Separate production-ready surfaces from guarded or experimental ones.
- Use release milestones rather than ad-hoc feature growth.

## Core platform readiness matrix

| Area | Status | Direction |
|---|---|---|
| `src/` Next.js runtime | Production baseline | Continue to gate with lint, smoke, predeploy, and security workflows |
| `portal/` | Migration / lightweight module | Keep documentation aligned; avoid treating it as a separate deployment surface without shared standards |
| `shared/` | Shared-assets baseline | Expand only through clearly versioned contracts and ownership |
| `platforms/io-openui-ao/` | Linked platform / migration target | Coordinate changes through the linked-repo process in `docs/MULTI-REPO-LINKS.md` |
| `platforms/world-bank/`, `platforms/menjacnica/`, `platforms/poslovni-novcanik/`, `platforms/kompanija-spaja/` | Mixed readiness | Track as documented platform modules until promoted into the production runtime |
| `.github/workflows/` | Active governance surface | Keep agent policy, CI, deploy fallback, and security automation aligned |

## Release roadmap for unfinished product tracks

| Release track | Current status | Delivery rule |
|---|---|---|
| SpajaPro 11 — Proksi | Beta | Keep behind guarded operational rollout until runtime and monitoring are stable |
| SpajaPro 12 — Mobilni | Beta | Advance only with explicit mobile/platform readiness criteria |
| SpajaPro 13 — Evolucija | Development | Prioritize reliability and reviewability over autonomous scope expansion |
| SpajaPro 14 — Matriks | Development | Ship only after orchestration and observability requirements are documented |
| SpajaPro 15 — Omega | Planned | Treat as roadmap-only until earlier tracks are stable and measurable |

## Route and API readiness model

| Classification | Meaning | Current examples |
|---|---|---|
| Production baseline | Covered by current CI, smoke tests, or go-live docs | health/status, auth, cron protection, payments/go-live paths, main `src/` runtime |
| Guarded rollout | Supported but operationally sensitive; requires explicit rollout and monitoring | deploy fallback, blockchain deploy, financial and billing-adjacent flows |
| Experimental / roadmap | Exists in product surface but should not be treated as default production commitment | long-tail exploratory routes, beta SpajaPro capabilities, migration-linked platform experiences |

## Agent and workflow activation map

| Agent | Target state | Backing workflow / source |
|---|---|---|
| `ci-bot` | Active | `.github/workflows/omega-auto-build.yml` |
| `human-review` | Active | PR policy + CODEOWNERS |
| `security-scanner` | Active | `.github/workflows/security-scanner.yml` |
| `deploy-bot` | Planned fallback | `.github/workflows/vercel-deploy.yml` |
| `multi-repo-sync-agent` | Config-driven coordination | `docs/MULTI-REPO-LINKS.md`, `.agent-config.json` |
| `analytics-bot` | KPI/reporting source of truth | `.agent-config.json`, `docs/finops-enterprise-operating-model.md` |
| `calculator-validator-agent` | Linked-repo scoped | `spaja86/IO-OPENUI-AO` coordination only |

## Operational KPI framework

| KPI | Owner area | Purpose |
|---|---|---|
| Build duration | CI / platform ops | Detect workflow regressions |
| Deployment success rate | Deploy / release ops | Track release reliability |
| MTTR | Operations | Track recovery speed for incidents |
| Cost per deployment | FinOps | Control automation and hosting spend |
| Cost per active user | FinOps / product | Relate platform spend to usage |
| Agent reliability score | Automation | Measure agent-backed workflow health |
| Security scan coverage | Security | Ensure critical surfaces stay guarded |

## Exit criteria for the next roadmap cycle

- Security automation runs on PRs, `main`, schedule, and manual dispatch.
- CI uses the same smoke and predeploy checks as the documented local workflow.
- Cross-repo work with `IO-OPENUI-AO` follows a repeatable checklist.
- README and config point contributors to the current roadmap and multi-repo operating model.
