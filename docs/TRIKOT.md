# TRIKOT — Outfit Readiness Utility

## Purpose

TRIKOT is a deterministic outfit-readiness module for evaluating whether an outfit plan should be reworked, adjusted, marked ready, or promoted to prime readiness.
Version 1 is API-first to stabilize contract behavior, validation logic, and governance before UI integration.

## Scope boundaries

- **In scope**: canonical `trikot` slug, deterministic outfit/readiness/durability scoring, recommendation logic, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: personal shopping transactions, wardrobe inventory storage, legal/compliance automation, and cross-repo runtime coupling.

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
| Display name | `TRIKOT` |
| Canonical slug | `trikot` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `trikot-style-core` |
| Octave / hipermreza node | `6 / 54` |
| Routes | `/api/trikot/evaluate`, `/api/trikot/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `CASUAL | BUSINESS | SPORT | FORMAL`
- `season` — `SPRING | SUMMER | AUTUMN | WINTER`
- `dressCode` — `RELAXED | SMART | STRICT`
- `comfortScore` — finite bounded score `0..100`
- `weatherFitScore` — finite bounded score `0..100`
- `budgetFitScore` — finite bounded score `0..100`
- `mobilityScore` — finite bounded score `0..100`
- `maintenanceRisk` — finite bounded score `0..100`
- `prepTimeHours` — integer bounded `0..168`
- `accessoryComplexity` — integer bounded `0..10`

## Output model

- `styleScore` — style alignment estimate
- `practicalityScore` — budget and execution practicality estimate
- `readinessScore` — prep/readiness estimate
- `durabilityScore` — sustained-wear durability estimate
- `overallScore` — weighted deterministic summary score
- `status` — `REWORK | ADJUST | READY | PRIME`
- `recommendedAction` — `CHANGE_BASE_LAYER | SIMPLIFY_LOOK | VALIDATE_DETAILS | LOCK_COMBINATION`
- `recommendedReviewHours` — bounded follow-up guidance based on status/action
- `warnings` — explicit readiness/maintenance/complexity warnings
- `disclaimer` — always present, because TRIKOT is guidance only
- `rawObjective`, `rawSeason`, `rawDressCode` — optional raw invalid enum values for domain-debug context
- Invalid domain evaluations return `valid: false` and set `objective`, `season`, `dressCode`, `status`, and `recommendedAction` to `null`.

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/season/dressCode identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and non-integer prep/complexity fields
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate only after contract stability is proven.
3. **Cross-repo follow-up** — synchronize labels/persona/docs only if a linked repository adopts TRIKOT runtime usage.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repository runtime change is required for TRIKOT v1.
- If another repository adopts TRIKOT, document downstream sync in `docs/MULTI-REPO-LINKS.md`.
