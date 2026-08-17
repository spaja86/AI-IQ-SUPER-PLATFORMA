# EPRINCIP — Principle Alignment Module

## Purpose

EPRINCIP is the initial contract for deterministic principle-alignment evaluation in this repository.
Because no prior `EPRINCIP` module, route, or spec existed, this first version defines EPRINCIP as a repo-local governance scorer for weighted principle compliance and evidence coverage.

## Scope boundaries

- **In scope**: weighted principle evaluation, required-principle threshold checks, evidence coverage warnings, health/KPI report, API exposure, validation, and audit-ready docs.
- **Out of scope**: persistence, external policy engines, autonomous enforcement, and linked-repo rollout automation.

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
| Persona | `eprincip-governance` |
| Routes | `/api/eprincip/evaluate`, `/api/eprincip/health` |
| Default minimum score | `70` |

## Input model

Each evaluation accepts a non-empty list of principles:

- `id` — stable machine-readable identifier
- `label` — human-readable principle name
- `score` — bounded `0..100`
- `weight` — non-negative weighted importance
- `required` — whether the principle must meet the minimum score
- `evidenceCount` — non-negative evidence count used for coverage warnings

## Status model

| Status | Meaning |
|---|---|
| `NON_COMPLIANT` | Low score or failed required principles |
| `PARTIAL` | Medium score or partial required-principle fulfillment |
| `ALIGNED` | Good score with required principles satisfied |
| `EXEMPLARY` | High score with required principles satisfied |

## Validation strategy

- Reject empty principle arrays
- Reject invalid IDs/labels and non-finite values
- Reject out-of-range scores and negative weights/evidence counts
- Guard against total weight = `0`
- Mark required principles below the minimum score as invalid
- Emit warnings when evidence coverage is incomplete
- Assert performance with focused tests

## Rollout plan

1. **Repo-local enablement** — introduce the module, routes, docs, and tests.
2. **Internal consumers** — connect principle-aware services only after stable validation.
3. **Cross-repo follow-up** — add downstream integration only when another repository needs the contract.

## Security and operations

- No secrets or credentials in module/API code.
- Validation rejects malformed payloads before evaluation.
- Health report is runtime-local and contains no sensitive payload data.
- All changes must pass lint, tests, build, code review, secret scan, and security scan.

## Linked repos

- No linked repo change required for the initial EPRINCIP version.
- Future downstream coupling must be recorded in `docs/MULTI-REPO-LINKS.md`.
