# DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN

## Purpose

DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN is a repo-local API-first orchestration module that turns existing `DOR PETLJA` and `DAR PETLJA` behavior into a deterministic distribution-readiness score.

## Scope

- **In scope**: canonical slug and persona, deterministic DOR/DAR composition, `DURIT`, `EKSER`, `FAR`, and `DIR` sub-scores, distribucija alignment, audit-ready health reporting, validation, and API exposure.
- **Out of scope**: persistence, background jobs, linked-repo synchronization, validator workflows, UI/dashboard pages, and autonomous changes to shared distribucija state.

## Canonical meaning

- **DOR** — raw target-distance traversal from `runDorPetlja`
- **DAR** — raw arithmetic-range average from `runDarPetlja`
- **DURIT** — normalized stability signal derived from DOR average deviation
- **EKSER** — target-anchor precision signal derived from DAR average-to-target distance
- **FAR** — reach/distribution signal combining petlja coverage with shared `distribucija` readiness
- **DIR** — execution-directness signal based on child petlja completion and shared distribution health
- **EKSTRIBUŠEN** — final aggregate score, status, warnings, and audit trail

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
| Slug | `durit-ekser-far-dir-dor-dar-ekstribusen` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `durit-ekser-ekstribusen-core` |
| Routes | `/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate`, `/api/durit-ekser-far-dir-dor-dar-ekstribusen/health` |
| Default minimum score | `70` |
| Default target score | `85` |
| Shared distribution source | `/api/distribucija` |

## Input model

Each evaluation accepts a PETLJE-compatible range payload:

- `start`, `end`, `step`, `target`
- `maxIterations`, `maxDurationMs`, `status`
- `referenceId`
- `minimumScore`, `targetScore`

## Output model

Each result returns:

- canonical `slug` and display `label`
- `overallScore`, `status`, `valid`, `warnings`, `durationMs`
- `targetDelta`, `minimumScore`, `targetScore`
- `signals` for `DURIT`, `EKSER`, `FAR`, and `DIR`
- raw delegated `dor` and `dar` petlja results
- `distribution` alignment snapshot from the shared distribucija model
- `audit` with expected iterations, completed child petlje count, and degraded sources

## Status model

| Status | Meaning |
|---|---|
| `BLOCKED` | Input invalid or child petlja blocked before meaningful execution |
| `DEGRADED` | Execution started but failed release quality gates or guardrails |
| `READY` | Valid deterministic result above the minimum threshold |
| `EKSTRIBUSEN` | Ready result that also meets the target score with healthy distribution readiness |

## Validation and failure rules

- Reject non-finite numbers and contradictory thresholds.
- Reject `targetScore < minimumScore`.
- Reuse PETLJE validation for range direction, zero-step, guard limits, and blocked statuses.
- Preserve explicit warnings when child petlje stop on `max-iterations`, `time-limit`, or blocked status.
- Keep final score bounded to `0..100` and expose degraded sources in the audit payload.

## Rollout

1. Ship the repo-local engine, routes, docs, and tests.
2. Reuse the shared distribucija model without introducing a duplicate distribution registry.
3. Add downstream or validator automation only when real consumers appear outside this repository.

## Linked repos

- No linked repo change is required for the initial version.
- Future downstream adoption must be recorded in `docs/MULTI-REPO-LINKS.md`.
