# OKRID — Objective and Governance ID Standard

## Purpose

OKRID is the canonical objective identifier used to connect issue/PR/review/release governance with KPI and cross-repo traceability.

## Scope and naming

- **Objective ID framework**: strategic objective and measurable outcome.
- **Initiative ID**: scoped delivery initiative under an objective.
- **Release-governance ID**: release/config/deploy governance tracking.

Canonical format:

`OKRID-YYYY-TRACK-###`

Examples:

- `OKRID-2026-NOVA-001`
- `OKRID-2026-MULTIREPO-004`
- `OKRID-2026-DEPLOY-009`

## Ownership model

| Area | Responsibilities |
|---|---|
| Product | objective intent, roadmap mapping, KPI targets |
| Platform ops | rollout/rollback controls, deploy readiness, incident path |
| Automation | workflow gates, audit signals, weekly OKRID reporting |

## Where OKRID is mandatory

OKRID linkage is required for:

1. CI/config/deploy changes (`.github/workflows/**`, `.agent-config.json`, `vercel.json`, runtime config).
2. Cross-repo changes (especially `spaja86/IO-OPENUI-AO` coordination surfaces).
3. Security-sensitive or risky feature work (security labels and major feature-track labels).
4. High-impact changes with rollout/rollback and KPI accountability requirements.

## Lifecycle and status model

| Status | Meaning |
|---|---|
| `proposed` | Created and awaiting prioritization |
| `active` | In delivery and tracked in current cycle |
| `at-risk` | KPI/quality/dependency risk detected |
| `blocked` | Delivery blocked by unresolved dependency or failed gate |
| `completed` | Delivery complete with validated KPI outcome |
| `archived` | Closed and retained for audit history |

## Required metadata

Each OKRID must include:

- OKRID ID
- Scope (`objective` / `initiative` / `release-governance`)
- Owner
- Roadmap item
- KPI targets
- KPI status
- Repository scope
- Cross-repo/downstream references
- Rollout plan and rollback plan (when applicable)
- Security/review gate status

## Delivery-flow integration

OKRID must be visible in:

- PR template (`.github/pull_request_template.md`)
- Multi-repo audit trail (`docs/MULTI-REPO-LINKS.md`)
- Weekly governance analytics workflow summary

Expected flow:

Issue → PR (with OKRID) → Review (gates + OKRID status) → Release (KPI + rollback audit)

## Rollout phases

1. **Pilot**: Nova Generacija and multi-repo sync changes.
2. **Expand**: all config/deploy/cross-repo workflows.
3. **Enforce**: all high-impact surfaces require valid OKRID linkage.

## Governance cadence and escalation

- Weekly OKRID review cadence for progress, KPI health, risk, and dependency coherence.
- Escalate when:
  - OKRID linkage is missing on mandatory surfaces.
  - KPI gates fail or remain at-risk.
  - Cross-repo sync/downstream references are missing.

## Exit criteria for OKRID-complete state

1. All high-impact changes carry valid OKRID linkage.
2. KPI and cross-repo impact are traceable from objective to PR to release.
3. Audit logs and weekly reporting consistently show OKRID compliance and blockers.
