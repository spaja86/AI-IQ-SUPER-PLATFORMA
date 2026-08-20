# OKRID Registry — Source of Truth

This registry tracks active and archived OKRIDs for `spaja86/AI-IQ-SUPER-PLATFORMA`.

## Active OKRIDs

| OKRID ID | Scope | Status | Owner area | Roadmap item | KPI targets | Repo scope | Downstream refs |
|---|---|---|---|---|---|---|---|
| `OKRID-2026-NOVA-001` | initiative | active | Product + Platform ops + Automation | Nova Generacija rollout and KPI gating | eval p99 ≤ 50ms, build ≤ 3 min, fairness 100% | `AI-IQ-SUPER-PLATFORMA` + NG surfaces | `spaja86/IO-OPENUI-AO` follow-up required |
| `OKRID-2026-MULTIREPO-001` | release-governance | active | Platform ops + Automation | Multi-repo sync hardening | cross-repo sync coverage 100%, reference hygiene | `docs/MULTI-REPO-LINKS.md`, `.agent-config.json` | `spaja86/IO-OPENUI-AO` coordination |
| `OKRID-2026-GOV-001` | release-governance | active | Automation | OKRID governance enforcement in PR/workflows | OKRID linkage coverage on mandatory PRs | PR template + governance workflows | Linked repo impact when applicable |
| `OKRID-2026-GIGATRON-001` | release-governance | active | Business + Legal + Finance + Compliance | GIGATRON corporate subscription high-value governance | 100% validated amount evidence, 100% approval-chain completion, 0 activations before payment confirmation | `docs/GIGATRON.md`, `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md`, `BILLING.md` | No linked repo change required |
| `OKRID-2026-GROCKA-001` | release-governance | active | Business + Legal + Finance + Compliance | GROCKA VINOGRAD subscription governance with excise-focused qualification | 100% intake completeness, 100% legal/tax-excise validation before invoice, 0 activations before payment confirmation | `docs/GROCKA-VINOGRAD-PRETPLATA-PRIVREDNA-AKCIZNOST.md`, `docs/MULTI-REPO-LINKS.md`, `BILLING.md` | No linked repo change required |
| `OKRID-2026-MIRIKL-001` | release-governance | active | Platform ops + Automation + Release Engineering | MIRIKL GitHub ↔ Vercel governance and release-gate enforcement | build/lint/test/smoke/predeploy/security coverage 100%, rollback evidence on deploy/config changes, cross-repo impact logging 100% | `docs/MIRIKL.md`, `docs/MULTI-REPO-LINKS.md`, `.agent-config.json`, `.github/workflows/mirikl-validator.yml` | `spaja86/IO-OPENUI-AO` follow-up required |
| `OKRID-2026-EKSLUZIV-001` | release-governance | active | Platform ops + Automation + Release Engineering + domain owners | EKSLUZIV NETWORK domain-scoped deploy governance and segmented rollout | build ≤ 3 min, health green, NG eval ≤ 50ms, cross-repo sync 100%, audit coverage 100% | `docs/EKSLUZIV-NETWORK.md`, `docs/DEPLOY-PORTFOLIO.md`, `docs/MULTI-REPO-LINKS.md`, `.agent-config.json` | `spaja86/IO-OPENUI-AO` follow-up required when shared contracts or labels move |
| `OKRID-2026-EXTRIMLI-TRANCE-001` | release-governance | active | Platform ops + Automation + Release Engineering + EXTRIMLI domain | EXTRIMLI Trance Extrem Deploy — 6-phase high-velocity zero-downtime deploy on Platform SPAJA | eval ≤ 50ms, API p99 ≤ 200ms, hipermreza convergence ≥ 0.95, build ≤ 3 min, zero-downtime 100%, rollback ≤ 2 min | `.github/workflows/extrimli-trance-extrem-deploy.yml`, `docs/EXTRIMLI-TRANCE-EXTREM.md`, `docs/MULTI-REPO-LINKS.md` | `spaja86/IO-OPENUI-AO` gear catalog sync required |

## Archived OKRIDs

| OKRID ID | Scope | Archived date | Outcome summary | KPI outcome | Notes |
|---|---|---|---|---|---|
| _None yet_ | - | - | - | - | Archive completed items here |

## Maintenance rules

1. Add or update registry entry when opening high-impact work.
2. Keep roadmap item and KPI targets synchronized with `docs/ROADMAP.md`.
3. Keep downstream references synchronized with `docs/MULTI-REPO-LINKS.md`.
4. Move completed items to archived table only after KPI outcome is recorded.
