# OKRID Registry — Source of Truth

This registry tracks active and archived OKRIDs for `spaja86/AI-IQ-SUPER-PLATFORMA`.

## Active OKRIDs

| OKRID ID | Scope | Status | Owner area | Roadmap item | KPI targets | Repo scope | Downstream refs |
|---|---|---|---|---|---|---|---|
| `OKRID-2026-NOVA-001` | initiative | active | Product + Platform ops + Automation | Nova Generacija rollout and KPI gating | eval p99 ≤ 50ms, build ≤ 3 min, fairness 100% | `AI-IQ-SUPER-PLATFORMA` + NG surfaces | `spaja86/IO-OPENUI-AO` follow-up required |
| `OKRID-2026-MULTIREPO-001` | release-governance | active | Platform ops + Automation | Multi-repo sync hardening | cross-repo sync coverage 100%, reference hygiene | `docs/MULTI-REPO-LINKS.md`, `.agent-config.json` | `spaja86/IO-OPENUI-AO` coordination |
| `OKRID-2026-GOV-001` | release-governance | active | Automation | OKRID governance enforcement in PR/workflows | OKRID linkage coverage on mandatory PRs | PR template + governance workflows | Linked repo impact when applicable |
| `OKRID-2026-GIGATRON-001` | release-governance | active | Business + Legal + Finance + Compliance | GIGATRON corporate subscription high-value governance | 100% validated amount evidence, 100% approval-chain completion, 0 activations before payment confirmation | `docs/GIGATRON.md`, `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md`, `BILLING.md` | No linked repo change required |

## Archived OKRIDs

| OKRID ID | Scope | Archived date | Outcome summary | KPI outcome | Notes |
|---|---|---|---|---|---|
| _None yet_ | - | - | - | - | Archive completed items here |

## Maintenance rules

1. Add or update registry entry when opening high-impact work.
2. Keep roadmap item and KPI targets synchronized with `docs/ROADMAP.md`.
3. Keep downstream references synchronized with `docs/MULTI-REPO-LINKS.md`.
4. Move completed items to archived table only after KPI outcome is recorded.
