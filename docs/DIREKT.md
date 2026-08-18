# DIREKT — Direct Communication Evaluation Module

## Purpose

DIREKT is the initial repo-local contract for deterministic evaluation of direct communication quality in this repository.
The first version focuses on measuring whether a message, brief, or instruction is clear, specific, actionable, transparent, and respectful without introducing persistence or external runtime coupling.

## Scope boundaries

- **In scope**: weighted directness scoring, required-signal threshold checks, target-score alignment, evidence/example coverage warnings, health/KPI report, API exposure, validation, and audit-ready docs.
- **Out of scope**: persistence, LLM judgment, autonomous message rewriting, external moderation services, and linked-repo rollout automation.

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Score bounds | 0..100 |
| Determinism | Same input → same output |

## Contracts

| Field | Value |
|---|---|
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `direkt-communication-core` |
| Routes | `/api/direkt/evaluate`, `/api/direkt/health` |
| Default minimum score | `65` |
| Default target score | `78` |

## Input model

Each evaluation accepts a non-empty list of directness signals:

- `id` — stable machine-readable identifier
- `label` — human-readable signal name
- `score` — bounded `0..100`
- `weight` — non-negative weighted importance
- `required` — whether the signal must meet the minimum score
- `exampleCount` — non-negative example/evidence count used for coverage warnings

Recommended first-party signals:

- `clarity`
- `specificity`
- `actionability`
- `transparency`
- `respect`

## Status model

| Status | Meaning |
|---|---|
| `VAGUE` | Weak directness quality or multiple failed requirements |
| `PARTIAL` | Some useful directness but incomplete threshold fulfillment |
| `DIRECT` | Good directness quality with required signals satisfied |
| `PRECISE` | High directness quality with strong target alignment |

## Validation strategy

- Reject empty signal arrays
- Reject invalid IDs/labels and non-finite values
- Reject out-of-range scores and negative weights/example counts
- Guard against total weight = `0`
- Mark required signals below the minimum score as invalid
- Emit warnings when target alignment is weak
- Emit warnings when example coverage is incomplete
- Assert performance with focused tests

## Rollout plan

1. **Repo-local enablement** — introduce the module, routes, docs, and tests.
2. **Internal consumers** — connect prompt/governance surfaces only after stable validation.
3. **Downstream follow-up** — add linked-repo coupling only when another repository explicitly adopts the contract.
4. **Optional validator workflow** — introduce a dedicated validator only after usage grows beyond repo-local scope.

## Security and operations

- No secrets or credentials in module/API code.
- Validation rejects malformed payloads before evaluation.
- Health report is runtime-local and contains no sensitive payload data.
- All changes must pass lint, tests, build, code review, secret scan, and security scan.

## Linked repos

- No linked repo change required for the initial DIREKT version.
- Future downstream coupling must be recorded in `docs/MULTI-REPO-LINKS.md`.
