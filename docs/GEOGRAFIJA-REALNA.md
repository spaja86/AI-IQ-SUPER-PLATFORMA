# GEOGRAFIJA REALNA — Real-World Geography Readiness Engine

## Purpose

GEOGRAFIJA REALNA is a deterministic geography-readiness module for evaluating whether a scenario has enough accuracy, context, freshness, and risk balance for reliable real-world geographic decisions.
Version 1 is API-first so contract stability, validation strictness, and KPI behavior are proven before broader UI adoption.

## Scope boundaries

- **In scope**: canonical `geografija-realna` slug, deterministic scoring, status/action mapping, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: turn-by-turn route guidance, private location data storage, legal compliance automation, and cross-repo runtime coupling.

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
| Display name | `GEOGRAFIJA REALNA` |
| Canonical slug | `geografija-realna` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `geografija-realna-core` |
| Octave / hipermreza node | `10 / 82` |
| Routes | `/api/geografija-realna/evaluate`, `/api/geografija-realna/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `LEARNING | NAVIGATION | ANALYSIS | PLANNING`
- `regionScale` — `LOCAL | REGIONAL | GLOBAL`
- `terrainComplexity` — `LOW | MEDIUM | HIGH`
- `accuracyScore` — finite bounded score `0..100`
- `contextScore` — finite bounded score `0..100`
- `dataFreshnessScore` — finite bounded score `0..100`
- `riskScore` — finite bounded score `0..100`
- `timeWindowHours` — integer bounded `1..168`
- `constraintsCount` — integer bounded `0..20`

## Output model

- `realismScore` — source precision + freshness estimate
- `clarityScore` — context and scale clarity estimate
- `feasibilityScore` — objective-window and constraints feasibility estimate
- `resilienceScore` — risk and operational resilience estimate
- `overallScore` — weighted deterministic summary score
- `status` — `UNSTABLE | VIABLE | PRECISE | ATLAS_READY`
- `recommendedAction` — `REFINE_DATA | ADD_CONTEXT | RUN_SCENARIOS | EXECUTE_PLAN`
- `recommendedWindowHours` — bounded timing guidance
- `warnings` — explicit quality/risk warnings
- `disclaimer` — always present because this is guidance, not official regulatory/emergency instruction

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/scale/terrain values
- Reject `NaN`, `Infinity`, negatives, out-of-range bounds, non-integer windows/counts, and zero-hour windows
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests including contract headers, health behavior, determinism, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumer adoption** — integrate callers only after stable KPI validation.
3. **Cross-repo follow-up** — sync docs/labels only if another repository adopts GEOGRAFIJA REALNA.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid input fails explicitly without silent fallback.
- Health report is aggregate-only and stores no private payload data.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked-repo runtime change is required for GEOGRAFIJA REALNA v1.
- If downstream adoption appears later, track it in `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/MULTI-REPO-LINKS.md`.
