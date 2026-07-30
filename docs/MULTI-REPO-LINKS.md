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

## Shared label schema

| Label | Meaning |
|---|---|
| `agent:config-change` | CI, workflow, deploy, or agent config changed |
| `security:needs-review` | Security-sensitive or scanner-flagged change |
| `calculator:logic-change` | Calculator logic changed in linked repo |
| `calculator:validated` | Calculator validator completed successfully |
| `calculator:needs-review` | Calculator validator requires human follow-up |

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
3. Open or link the downstream PR / issue when the linked repo also needs updates.
4. Note the follow-up reference in commit, PR description, or linked issue trail.
5. Keep `.agent-config.json` aligned with any newly introduced coordination rule.

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
