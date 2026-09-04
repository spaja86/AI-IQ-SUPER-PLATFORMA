# TRU — Trust Readiness Utility

## Purpose

TRU is a deterministic trust-readiness module for deciding whether a workflow should block, proceed with caution, move into readiness, or proceed with strong trust.
Version 1 ships as an API-first module so the contract, validation, and quality gate can stabilize before UI integration.

## Scope boundaries

- **In scope**: canonical `tru` slug, deterministic trust/readiness/stability/pressure scoring, recommendation logic, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: legal/compliance automation, messaging-side effects, persistence/CRM storage, and cross-repo runtime coupling.

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
| Display name | `TRU` |
| Canonical slug | `tru` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `tru-trust-core` |
| Octave / hipermreza node | `7 / 63` |
| Routes | `/api/tru/evaluate`, `/api/tru/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `VERIFY | ALIGN | NEGOTIATE | COMMIT`
- `channel` — `ASYNC | CALL | MEETING | DOC_REVIEW`
- `evidenceLevel` — `NONE | PARTIAL | STRONG`
- `transparencyScore` — finite bounded score `0..100`
- `reliabilityScore` — finite bounded score `0..100`
- `reciprocityScore` — finite bounded score `0..100`
- `riskLevel` — finite bounded score `0..100`
- `responseLatencyHours` — integer bounded `0..240`
- `escalationCount` — integer bounded `0..10`

## Output model

- `trustScore` — trust confidence estimate
- `readinessScore` — execution readiness estimate
- `stabilityScore` — response and escalation stability estimate
- `pressureScore` — pressure resilience estimate
- `overallScore` — weighted deterministic summary score
- `status` — `BLOCK | CAUTION | READY | TRUSTED`
- `recommendedAction` — `REQUEST_EVIDENCE | RUN_PILOT | SCHEDULE_REVIEW | PROCEED`
- `recommendedReviewHours` — bounded follow-up guidance based on status and action
- `warnings` — explicit evidence/risk/escalation warnings
- `disclaimer` — always present, because TRU is guidance and not legal, compliance, financial, or emergency advice
- Invalid domain evaluations return `valid: false` and set `objective`, `channel`, `evidenceLevel`, `status`, and `recommendedAction` to `null`.

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/channel/evidence identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and non-integer count/hour fields
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate only after contract stability is proven.
3. **Cross-repo follow-up** — synchronize labels/persona/docs only if a linked repository adopts TRU runtime usage.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repository runtime change is required for TRU v1.
- If another repository adopts TRU, document downstream sync in `docs/MULTI-REPO-LINKS.md`.
