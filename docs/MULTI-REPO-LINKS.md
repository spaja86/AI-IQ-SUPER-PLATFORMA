# MULTI-REPO-LINKS — Coordination Operating Model

## Purpose

This document formalizes coordination between `spaja86/AI-IQ-SUPER-PLATFORMA` and linked repositories, especially `spaja86/IO-OPENUI-AO`.

## Linked repository registry

| Repository | Relationship | Sync cadence | Sync fields | Status |
|---|---|---|---|---|
| `spaja86/IO-OPENUI-AO` | Primary linked product repo | Weekly + on cross-repo change | versions, labels, milestones, agent-config, docs, shared contracts | Active coordination |
| `platforms/io-openui-ao/` | Local mirror / documentation surface | Per repo change | README, ownership, migration notes | Tracked locally |
| Other linked platform repos | Follow-up only until formally registered | Manual | links, milestones, release notes | Pending registration |

## Required sync fields

- Dependency/version expectations for shared packages and workflows
- Label schema used by agents and reviewers
- Milestone names for roadmap delivery
- `.agent-config.json` expectations and agent enablement notes
- README and documentation links that point contributors across repos
- Follow-up issue or PR references for linked changes
- Feature-track metadata for race launches (labels, validation workflow, release docs)

## Shared label schema

| Label | Meaning |
|---|---|
| `agent:config-change` | CI, workflow, deploy, or agent config changed |
| `security:needs-review` | Security-sensitive or scanner-flagged change |
| `calculator:logic-change` | Calculator logic changed in linked repo |
| `calculator:validated` | Calculator validator completed successfully |
| `calculator:needs-review` | Calculator validator requires human follow-up |
| `race:another-races` | Back to Spaces for Another Races change set |
| `race:fairness-review` | Fairness-rule logic changed and requires focused review |
| `race:validated` | Race validation workflow and tests completed |

## Version coherence policy

| Surface | Policy |
|---|---|
| Shared npm dependencies | Prefer minor-compatible alignment across linked repos |
| GitHub Actions | Prefer patch-exact alignment when workflow behavior is shared |
| Agent config fields | Keep schema-compatible and document field additions before rollout |
| Shared docs and cross-links | Update both repos in the same change window when links or responsibilities move |

## Cross-repo change workflow

1. Identify whether the change affects `IO-OPENUI-AO` behavior, docs, labels, milestones, or shared operational assumptions.
2. Record the impact in the PR template under **Cross-repo impact**.
3. For deploy, workflow, or shared-config changes, also document rollout, rollback, KPI impact, and environment-promotion notes in the PR.
4. Open or link the downstream PR / issue when the linked repo also needs updates.
5. Note the follow-up reference in commit, PR description, or linked issue trail.
6. Keep `.agent-config.json` aligned with any newly introduced coordination rule.

## Audit trail convention

Use explicit bidirectional references:

- `AI-IQ-SUPER-PLATFORMA#<number> -> IO-OPENUI-AO#<number>`
- `IO-OPENUI-AO#<number> -> AI-IQ-SUPER-PLATFORMA#<number>`

If only one repo changes immediately, document the deferred work as:

- `Follow-up required in spaja86/IO-OPENUI-AO`
- `No linked repo change required`

## Conflict resolution rules

- If labels or milestone names diverge, align the shared schema before feature rollout.
- If dependency versions diverge, prefer the repo that owns the runtime surface and open follow-up work for the consumer repo.
- If docs diverge from `.agent-config.json`, treat `.agent-config.json` as operational source of truth and update docs in the same change set.
- If rollout timing differs between repos, ship only the repo-local safe subset and document the blocked cross-repo dependency.

## Review expectations

- Human review remains required for critical changes.
- Security-sensitive cross-repo changes should include a security approver.
- Config and workflow changes should carry the `agent:config-change` label.
- Cross-repo work is not complete until docs, labels, and follow-up references are updated.

---

## Nova Generacija v2 Cross-Repo Contract

### Scope

The Nova Generacija release track introduces a new coordination layer for all changes that touch:

- `src/lib/spaja-pro-nova-generacija.ts` (SpajaPro 16 Hipermreza engine)
- `src/lib/evolucija/nova-generacija.ts` (Nova Generacija evolution engine)
- `src/lib/nova-generacija-gaming.ts` (Nova Generacija gaming mode)
- `platforms/nova-generacija/` (NG platform surface)
- `docs/NOVA-GENERACIJA.md` (NG specification)
- `.github/workflows/nova-generacija.yml` (NG CI workflow)

### Nova Generacija Label Schema

| Label | Meaning |
|---|---|
| `nova-generacija` | Nova Generacija change set — requires NG validation |
| `nova-generacija:review` | NG change requires focused human review |
| `nova-generacija:validated` | NG validation workflow and tests passed |
| `nova-generacija:needs-review` | NG validator requires human follow-up |

### Nova Generacija Linked Repos

| Repository | NG Sync Fields | Sync Trigger | Tracking Doc |
|---|---|---|---|
| `spaja86/IO-OPENUI-AO` | versions, labels, milestones, nova-generacija-gaming-refs | on-change + weekly | `docs/MULTI-REPO-LINKS.md` |
| Future linked repos | To be defined upon registration | Weekly | `docs/MULTI-REPO-LINKS.md` |

### Nova Generacija Cross-Repo Workflow

1. Identify whether the NG change affects `IO-OPENUI-AO` behavior, docs, labels, milestones, or shared gaming/calculator contracts.
2. Record the impact in the PR template under **Cross-repo impact**, noting `nova-generacija` scope.
3. Open or link the downstream PR / issue when the linked repo also needs NG-related updates.
4. Note the follow-up reference in commit, PR description, or linked issue trail.
5. Keep `.agent-config.json` `nova-generacija-agent.linkedReposV2` aligned with any newly added linked repo.
6. All Nova Generacija gaming changes must include a cross-repo fairness audit reference.

### Nova Generacija KPI Enforcement

The `nova-generacija-agent` enforces these KPIs on every cross-repo change:

| KPI | Target | Enforced by |
|---|---|---|
| Action evaluation | ≤ 50ms | `.github/workflows/nova-generacija.yml` |
| Build duration | ≤ 3 min | Build step timeout |
| Uptime SLA | 99.99% | `enterprise-sla.ts` nova-generacija tier |
| Gaming completion rate | ≥ 95% | NG gaming fairness checks |
| Cross-repo sync coverage | 100% | `nova-generacija-agent` |
| Security scan coverage | 100% | `security-scanner` workflow |
