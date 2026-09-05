# DELET — Deletion Readiness & Safety Module

## Purpose

DELET is a deterministic deletion-readiness module for evaluating whether a delete operation should be blocked, reviewed, scheduled, or executed.
It ships as an API-first module so contract behavior, safety validation, and quality gates can stabilize before wider runtime integration.

## Scope boundaries

- **In scope**: canonical `delet` slug, deterministic scoring, warnings, recommendation logic, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: direct storage deletion execution, secret handling, legal-policy source-of-truth management, and cross-repo mutation orchestration.
- **Linked-repo impact**: none for v1 (`linkedRepoImpact = none`).

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
| Display name | `DELET` |
| Canonical slug | `delet` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `delet-governance-core` |
| Octave / hipermreza node | `6 / 52` |
| Routes | `/api/delet/evaluate`, `/api/delet/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `SOFT_DELETE | HARD_DELETE | ANONYMIZE | RETENTION_EXPIRE`
- `scope` — `SINGLE_RECORD | BATCH | TENANT`
- `dataSensitivityScore` — finite bounded score `0..100`
- `retentionAgeDays` — integer bounded `1..3650`
- `recoveryWindowHours` — integer bounded `1..720`
- `dependencyCount` — integer bounded `0..1000`
- `backupCoverageScore` — finite bounded score `0..100`
- `legalHoldActive` — boolean legal hold flag

## Output model

- `safetyScore` — operational safety estimate
- `complianceScore` — compliance readiness estimate
- `reversibilityScore` — reversibility estimate
- `riskScore` — deletion risk estimate
- `overallScore` — weighted deterministic summary score
- `status` — `BLOCK | REVIEW | APPROVE | AUTO_APPROVE`
- `recommendedAction` — `ABORT | REQUEST_REVIEW | SCHEDULE_WINDOW | EXECUTE`
- `recommendedWindowHours` — bounded execution-window recommendation
- `warnings` — explicit risk/compliance/coverage warnings
- `disclaimer` — always present because DELET does not replace legal/compliance judgment
- Invalid evaluations return `valid: false` and set `objective` and `scope` to `null`

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/scope identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and non-integer fields where integers are required
- Return explicit invalid results for domain-level failures
- Cover unit + route tests including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — adopt DELET only after contract stability and validator reliability are proven.
3. **Cross-repo follow-up** — if downstream adoption appears later, record impact in `docs/MULTI-REPO-LINKS.md`.

## Security and operations

- No secrets or credentials in DELET module/API code.
- Invalid inputs fail explicitly with deterministic invalid responses.
- Health report is aggregate-only and stores no user payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.
