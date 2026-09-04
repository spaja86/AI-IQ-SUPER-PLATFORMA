# REAL BIK POK CREATE MAKSIMUM — Initiative Definition

## Initiative metadata

| Field | Value |
|---|---|
| Initiative ID | `REAL-BIK-POK-CREATE-MAKSIMUM-001` |
| Status | Draft for implementation |
| Owner | `@spaja86` |
| Primary repo | `spaja86/AI-IQ-SUPER-PLATFORMA` |
| Linked repo | `spaja86/IO-OPENUI-AO` |
| Cross-repo tracking | `docs/MULTI-REPO-LINKS.md` |

## Scope, goals, non-goals

### Scope
- Define and govern the `REAL BIK POK CREATE MAKSIMUM` initiative as a traceable, audit-ready operating track.
- Standardize requirements, architecture boundaries, rollout phases, and quality/security gates.
- Enforce repeatable cross-repo coordination with `spaja86/IO-OPENUI-AO`.

### Goals
- Single source of truth for initiative behavior and delivery workflow.
- Measurable acceptance criteria and KPI-backed release decisions.
- Deterministic Issue → PR → Review → Release governance with mandatory human approval.

### Non-goals
- No direct runtime feature implementation in this initiative document.
- No bypass of existing CI/security checks or review policy.
- No movement of secrets into repository files.

## Impacted modules and linked dependencies

### AI-IQ-SUPER-PLATFORMA impacted modules

Task workspace root for this implementation:

- `REPO_ROOT=/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA`

| Module path (canonical) | Task path in current workspace | Purpose in this initiative | Owner surface |
|---|---|---|---|
| `docs/REAL-BIK-POK-CREATE-MAKSIMUM.md` | `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/REAL-BIK-POK-CREATE-MAKSIMUM.md` | Canonical initiative contract | Governance docs |
| `docs/MULTI-REPO-LINKS.md` | `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/MULTI-REPO-LINKS.md` | Cross-repo sync, labels, audit linkage | Multi-repo governance |
| `.github/pull_request_template.md` | `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/.github/pull_request_template.md` | PR evidence requirements | Review and release governance |
| `AGENTS.md` | `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/AGENTS.md` | Agent roles and ownership boundaries | Automation policy |
| `.agent-config.json` | `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/.agent-config.json` | Operational sync and agent enablement schema | Config source of truth |

### Linked repo dependency points (`spaja86/IO-OPENUI-AO`)

| Dependency point | Required alignment |
|---|---|
| `docs/MULTI-REPO-LINKS.md` | Add bidirectional audit reference for this initiative |
| `.agent-config.json` | Keep sync fields compatible (`versions`, `labels`, `milestones`, docs references) |
| Label schema | Keep shared labels aligned for validation/review (`agent:config-change`, `security:needs-review`, initiative labels if added) |
| PR governance template/process | Keep downstream PRs with rollout, rollback, KPI impact, and cross-repo reference |

## Functional requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-01 | Initiative must have explicit scope/goals/non-goals/ownership | This document includes all four and named owner |
| FR-02 | Cross-repo impact must be documented | `docs/MULTI-REPO-LINKS.md` includes dedicated audit entry |
| FR-03 | Delivery must be measurable | Phase gates and KPI thresholds are defined and reviewable |
| FR-04 | Release must be reversible | Rollback checklist and trigger conditions are defined |
| FR-05 | Governance must be traceable | Issue → PR → Review → Release flow with required artifacts is defined |

### Edge cases and failure-mode handling

| Scenario | Failure mode | Required handling |
|---|---|---|
| Linked repo update is blocked | Cross-repo drift risk | Mark as follow-up required, keep bidirectional placeholder reference, block full completion status |
| CI green except security scanner | Unsafe promotion | Do not release; resolve or formally classify false positive with human sign-off |
| KPI threshold missed during rollout | Reliability/performance regression | Stop promotion, rollback to last stable phase, open incident/issue with root-cause owner |
| Label or milestone divergence across repos | Process inconsistency | Align schema before continuing rollout |
| Missing OKRID for high-impact change | Audit gap | Block release until OKRID is added and status is set |

## Architecture and ownership boundaries

| Responsibility | Primary owner | Supporting owner | Handoff contract |
|---|---|---|---|
| Initiative governance and policy updates | `human-review` + repo owner | `ci-bot` | PR must include Summary, OKRID (when required), rollout/rollback, KPI impact |
| CI/quality gate execution | `ci-bot` | `security-scanner` | All mandatory checks pass before promotion |
| Security posture and secret hygiene | `security-scanner` | `human-review` | Critical findings block release until addressed |
| Cross-repo synchronization | `multi-repo-sync-agent` | Repo owner | Linked reference and dependency alignment required |
| Deployment promotion decision | `deploy-bot` (or manual owner) | `human-review` | Human approval required for config/deploy/cross-repo/risky scope |

### Escalation path
1. CI/security failure → assign owning agent + human reviewer.
2. If unresolved in phase window → mark rollout blocked and open issue with blocker reason.
3. If cross-repo dependency unresolved → keep this repo in safe subset mode and document deferred work.

## Phased implementation roadmap

| Phase | Entry criteria | Exit criteria |
|---|---|---|
| Foundation | Initiative approved in docs | Scope/goals/non-goals/ownership published; impacted modules mapped |
| Core logic | Foundation complete | Requirements + acceptance criteria + failure handling published |
| Integrations | Core logic complete | Cross-repo links, labels, and dependencies documented and reviewed |
| Validation | Integrations complete | Required quality/security gates are green; review evidence recorded |
| Rollout | Validation complete | Promotion executed with KPI checks and rollback readiness confirmed |

## CI / security / quality gates

Mandatory gates before release/promotion:
- `npm run lint`
- `npm test`
- `npm run test:smoke`
- `npm run build` (or documented blocker/exception with approval)
- Secret scanning check
- Code review check
- CodeQL/security checks
- Human review approval (required for config/deploy/cross-repo/risky changes)

## Multi-repo sync and audit requirements

- Required labels for config/governance changes: `agent:config-change`.
- Security-sensitive changes must use/keep `security:needs-review`.
- All linked changes must include downstream impact note in PR.
- Use bidirectional trace format:
  - `AI-IQ-SUPER-PLATFORMA#<ref> -> IO-OPENUI-AO#<ref>`
  - `IO-OPENUI-AO#<ref> -> AI-IQ-SUPER-PLATFORMA#<ref>`
- If downstream work is pending, explicitly state: `Follow-up required in spaja86/IO-OPENUI-AO`.

## Release and rollback playbook

### Release
1. Confirm all gates are green.
2. Confirm cross-repo references and follow-up links are recorded.
3. Promote through `dev → staging → production`.
4. Record KPI status in PR.

### Rollback triggers
- Critical security finding.
- KPI breach (performance/reliability threshold failure).
- Cross-repo contract break that affects release safety.

### Rollback actions
1. Revert to last known stable commit/release.
2. Disable/roll back affected flags.
3. Record rollback reason and impact.
4. Open follow-up issue for corrective action.

### KPI monitoring and post-release verification

| KPI | Target |
|---|---|
| Build duration | ≤ 3 min |
| Security scan coverage | 100% |
| Cross-repo sync coverage | 100% for required linked fields |
| Regression status | No new P0/P1 incidents post-release window |

Post-release checklist:
- Verify CI/security jobs remained green on release branch.
- Verify linked references exist and are reachable.
- Verify no unresolved critical findings.

## Governance flow (Issue → PR → Review → Release)

1. **Issue**: Create/identify issue or change-driver with scope and risk classification.
2. **PR**: Include required sections from PR template (summary, linked issue, cross-repo impact, validation, rollout, rollback, KPI impact).
3. **Review**: Mandatory human review; include security reviewer when sensitive.
4. **Release**: Promote only after all gates pass and approvals are present.
5. **Post-release**: Record KPI outcome and any follow-up work.
