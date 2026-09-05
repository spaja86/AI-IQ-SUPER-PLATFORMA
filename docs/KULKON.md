# KULKON — Culture-Layer Cohesion Engine

## Purpose

KULKON is a deterministic collaboration-culture engine for evaluating team cohesion, resilience, cadence fit, and delivery pressure.
Version 1 ships as an API-first module so its contract, validation rules, and KPI gate can stabilize before UI expansion.

## Scope boundaries

- **In scope**: canonical `kulkon` slug, deterministic scoring, recommendation logic, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: HR case management workflows, private people-data storage, messaging platform integrations, and cross-repo runtime coupling.

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
| Display name | `KULKON` |
| Canonical slug | `kulkon` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `kulkon-core` |
| Octave / hipermreza node | `7 / 59` |
| Routes | `/api/kulkon/evaluate`, `/api/kulkon/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `ALIGNMENT | ONBOARDING | RETENTION | CONFLICT_RESET`
- `environment` — `REMOTE | HYBRID | ONSITE`
- `rhythm` — `ADHOC | WEEKLY | DAILY`
- `clarityScore` — finite bounded score `0..100`
- `trustScore` — finite bounded score `0..100`
- `accountabilityScore` — finite bounded score `0..100`
- `communicationLoad` — finite bounded score `0..100`
- `conflictRate` — finite bounded score `0..100`
- `participantCount` — integer bounded `1..50`
- `windowDays` — integer bounded `1..90`

## Output model

- `cohesionScore` — clarity/trust/accountability estimate
- `resilienceScore` — environment/rhythm/conflict resistance estimate
- `cadenceScore` — objective-window and rhythm fitness estimate
- `pressureScore` — communication/conflict/size pressure estimate
- `overallScore` — weighted deterministic summary score
- `status` — `FRAGILE | STABLE | COHESIVE | EXEMPLARY`
- `recommendedAction` — `CLARIFY_NORMS | SCHEDULE_RITUAL | RUN_RETRO | SCALE_PLAYBOOK`
- `recommendedWindowDays` — bounded timing guidance by status/action
- `warnings` — explicit risk warnings
- `disclaimer` — always present because KULKON is guidance, not legal/HR/emergency advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/environment/rhythm values
- Reject `NaN`, `Infinity`, negatives, out-of-range bounds, and non-integer count/window fields
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests including contract headers, health behavior, determinism, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumer adoption** — integrate callers only after stable KPI validation.
3. **Cross-repo follow-up** — sync docs/labels only if another repository starts consuming KULKON.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid input fails explicitly without silent fallback.
- Health report is aggregate-only and stores no private payload data.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked-repo runtime change is required for KULKON v1.
- If downstream adoption appears later, track it in `docs/MULTI-REPO-LINKS.md`.
