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
| Open-code deploy governance | Public code/docs/workflows exist, but contributor flow, deployment boundaries, and XP rules needed one aligned operating model | `README.md`, `CONTRIBUTING.md`, `docs/DEPLOYMENT-POWER-RESOLUTION.md` |

## Open-code deploy operating model

| Surface | Rule | Source of truth |
|---|---|---|
| Public repo surfaces | Application code, docs, workflow definitions, and agent policy remain reviewable in Git | `README.md`, `AGENTS.md` |
| Operational-only controls | Secrets, deploy hooks, environment credentials, and wallet/private keys stay in secret-management systems | `docs/GO-LIVE.md`, `docs/SECURITY.md` |
| Linked-repo work | `IO-OPENUI-AO` downstream impact must be recorded in PRs and tracked in multi-repo docs | `docs/MULTI-REPO-LINKS.md`, `.github/pull_request_template.md` |
| Runtime split | Vercel hosts frontend/SSR + light APIs; worker/container runtime handles heavy or long-running compute | `docs/DEPLOYMENT-POWER-RESOLUTION.md` |
| Release governance | GitHub Actions enforces quality gates, promotion evidence, and audit summaries | `.github/workflows/*`, `.agent-config.json` |

## Implementation phases

### Phase 1 — Core platform stabilization

- Keep `src/` as the production runtime surface.
- Use documentation and readiness tracking to standardize `portal/`, `shared/`, and `platforms/*`.
- Treat migration-state modules as explicitly tracked, not implicitly production-ready.

### Phase 2 — Automation and security completion

- Keep `omega-auto-build.yml` as the core quality gate.
- Run lint + unit test + smoke + predeploy validation in CI for every protected change path, and treat build as a tracked release gate even when specific workflows still rely on scoped enforcement.
- Activate the dedicated `security-scanner` workflow for CodeQL, dependency review, npm audit, and secret heuristics.

### Phase 3 — Multi-repo sync hardening

- Use `.agent-config.json` as the operational source of truth for linked repositories.
- Standardize sync fields for config, versions, labels, milestones, docs, and follow-up references.
- Require every cross-repo change to describe downstream impact in the PR template.

### Phase 3.5 — Open contribution and XP cadence

- Standardize the issue → PR → review → release flow for all public changes.
- Require audit-ready rollout and rollback notes on deployment/configuration PRs.
- Use human review as the mandatory asynchronous pairing mechanism for risky or cross-repo work.
- Encourage small, frequent releases and test-first discipline for risky paths instead of large batch changes.

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

## Gaming expansion track — Back to Spaces for Another Races

| Item | Status | Delivery rule |
|---|---|---|
| Goal and KPI baseline | Defined | Keep 95%+ completion, 100% fairness compliance, <=100ms action evaluation |
| V1 core mechanics | Beta implementation | Keep fairness constraints (2–8 players, nitro/latency/penalty caps) hard-validated |
| Feature rollout | Guarded | Rollout through `gaming-back-to-spaces-another-races-v1` with staged percentage |
| Cross-repo sync | Required | Track labels and follow-up references with `spaja86/IO-OPENUI-AO` |
| Validation workflow | Active | Use `.github/workflows/back-to-spaces-another-races.yml` for labeled/path changes |

### Phase 6 — GREAT SUMBION activation

- Ship `great-sumbion` module as a deterministic weighted-score engine with strict edge-case guards.
- Keep rollout staged: 20% canary → 50% staged → 100% production after KPI stability.
- Enforce validator workflow gates and keep docs/config/audit links synchronized.

### Phase 6.5 — TRENAŽER activation

- Ship `trenazer` module as a deterministic training-readiness engine with explicit intensity and duration recommendations.
- Keep v1 repo-local and CI-gated; defer history, wearable ingestion, and workout catalogs to follow-up phases.
- Enforce validator workflow gates and keep docs/config/audit links synchronized.

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
| `trenazer-validator-agent` | Repo-local training-readiness validation | `.github/workflows/trenazer-validator.yml`, `docs/TRENAZER.md` |
| `okrid-governance` | Weekly OKRID compliance and blocker reporting | `.github/workflows/okrid-weekly-review.yml`, `docs/OKRID.md` |
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
| PR review time | Human review / automation | Measure delivery feedback loop speed |
| Cross-repo sync stability | Multi-repo coordination | Track repeated success of downstream follow-up and reference hygiene |
| Change failure / regression rate | CI / release ops | Detect whether small releases and XP cadence reduce production regressions |
| OKRID compliance rate | Automation / governance | Ensure mandatory high-impact changes carry valid OKRID linkage |

## Exit criteria for the next roadmap cycle

- Security automation runs on PRs, `main`, schedule, and manual dispatch.
- CI and deploy workflows use the same documented lint/test/smoke/predeploy/security gate model, with build tracked as a required release gate.
- Cross-repo work with `IO-OPENUI-AO` follows a repeatable checklist.
- High-impact changes (config/deploy/cross-repo/risky) include valid OKRID linkage and status.
- README and config point contributors to the current roadmap and multi-repo operating model.
- Another Races rollout remains gated by fairness and regression checks before full activation.
- Open-code contribution guidance, deploy governance, and agent policy stay aligned across `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docs/GO-LIVE.md`, and `.agent-config.json`.

---

## Phase 5 — New Generation (Nova Generacija)

> Platform version: **v100.0.0+** | SpajaPro: **16 (Nova Generacija)** | Specification: `docs/NOVA-GENERACIJA.md`

### Strategic shift

"Nova Generacija" is the strategic leap beyond SpajaPro 6–15. It launches a new era of the platform with a completely redesigned AI orchestration layer, expanded industrial scope, and a new product identity.

### New Generation milestones

| Milestone | Status | Exit gate |
|---|---|---|
| Foundation (v100.0.0) | ✅ Complete | constants, feature flags, spec doc |
| SpajaPro 16 Hipermreza Engine | ✅ Complete | `src/lib/spaja-pro-nova-generacija.ts` |
| Nova Generacija Evolution Engine | ✅ Complete | `src/lib/evolucija/nova-generacija.ts` |
| `/api/nova-generacija` route | ✅ Complete | API available |
| `platforms/nova-generacija/` surface | ✅ Complete | Platform module documented |
| Nova Generacija Gaming | ✅ Complete | Kvantni fairness, 2–16 players |
| `nova-generacija-agent` registration | ✅ Complete | AGENTS.md + agent-config.json |
| CI workflow `.github/workflows/nova-generacija.yml` | ✅ Complete | KPI gates: ≤ 50ms, ≤ 3 min build |
| Multi-repo v2 contract | ✅ Complete | docs/MULTI-REPO-LINKS.md |
| `/nova-generacija` page | ✅ Complete | Sekvence renderer |
| SpajaPro 16 pricing plan | ✅ Complete | `spaja-pro-planovi.ts` |
| Security.md Nova Generacija threat model | ✅ Complete | docs/SECURITY.md |
| Enterprise SLA Nova Generacija tier | ✅ Complete | `enterprise-sla.ts` |
| Staged rollout 20% → 50% → 100% | 📋 Pending | Per exit criteria |

### New Generation KPI framework

| KPI | Target | Owner area |
|---|---|---|
| OMEGA AI persona count | 50 | AI / Platform |
| Octave layers | 16 | AI / Platform |
| Hipermreza nodes | 256 (16×16) | AI Architecture |
| Platform routes | 2000+ | Platform ops |
| Build duration | ≤ 3 min | CI / Platform ops |
| Action evaluation p99 | ≤ 50ms | AI Engine |
| Uptime SLA | 99.99% | Operations |
| Cross-repo sync coverage | 100% | nova-generacija-agent |
| Security scan coverage | 100% | security-scanner |
| Gaming session completion | ≥ 95% | Gaming |
| Fairness compliance | 100% | Gaming |

### New Generation exit criteria

1. SpajaPro 13, 14, and 15 are stabilized and measurable.
2. All `nova-generacija` modules pass lint, smoke, predeploy, and security checks.
3. `nova-generacija` feature flag deployed at 100% after staged rollout validation.
4. `AGENTS.md`, `ROADMAP.md`, and `.agent-config.json` reflect the new generation state.
5. Cross-repo references between SUPER-PLATFORMA and IO-OPENUI-AO synchronized under the v2 contract.
6. Nova Generacija KPI dashboard shows all metrics in green.

### New Generation agent and workflow map

| Agent / Workflow | Target state | Source |
|---|---|---|
| `nova-generacija-agent` | 🚀 Active | `.agent-config.json`, `AGENTS.md` |
| `.github/workflows/nova-generacija.yml` | Active | Nova Generacija CI |
| `nova-generacija` feature flag | 20% canary → 100% | `src/lib/feature-flags.ts` |
| `nova-generacija-gaming` flag | 10% staging | `src/lib/feature-flags.ts` |
| `nova-generacija-hipermreza` flag | enterprise/unlimited plans | `src/lib/feature-flags.ts` |
| `great-sumbion-validator-agent` + `.github/workflows/great-sumbion-validator.yml` | 🚀 Active | `AGENTS.md`, `.agent-config.json`, `docs/GREAT-SUMBION.md` |
