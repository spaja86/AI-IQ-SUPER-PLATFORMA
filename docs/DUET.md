# DUET — Two-Party Synchronization Module

## Purpose

DUET is a deterministic two-party synchronization module for evaluating whether a pair should reset expectations, run a stabilizing check-in, start a coordinated session, or lock into a harmonized operating window.
Version 1 intentionally ships as an API-first module so the contract, validation, and quality gate can stabilize before any UI or cross-repo consumer is added.

## Scope boundaries

- **In scope**: canonical `duet` slug, deterministic synchronization scoring, warning generation, recommendation logic, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: chat persistence, autonomous message generation, relationship mediation, linked-repo runtime coupling, and multi-party orchestration beyond two-party inputs.

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
| Display name | `DUET` |
| Canonical slug | `duet` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `duet-sync-core` |
| Octave / hipermreza node | `8 / 66` |
| Routes | `/api/duet/evaluate`, `/api/duet/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `CREATE | DELIVER | REPAIR | PERFORM`
- `mode` — `ASYNC | LIVE | HYBRID | RITUAL`
- `energyMatch` — `LOW | MEDIUM | HIGH`
- `clarityScore` — finite bounded score `0..100`
- `reciprocityScore` — finite bounded score `0..100`
- `trustScore` — finite bounded score `0..100`
- `rhythmScore` — finite bounded score `0..100`
- `tensionLevel` — finite bounded score `0..100`
- `sharedWindowHours` — integer bounded `1..168`

## Output model

- `alignmentScore` — clarity/reciprocity/trust/rhythm alignment estimate
- `resilienceScore` — duet resilience estimate under tension and mode load
- `timingScore` — objective-window fit estimate
- `harmonyScore` — deterministic blend of alignment, rhythm, energy match, and tension
- `overallScore` — weighted deterministic summary score
- `status` — `DISSONANT | FRAGILE | ALIGNED | HARMONIZED`
- `recommendedAction` — `RESET_EXPECTATIONS | RUN_CHECKIN | START_SESSION | LOCK_DUET`
- `recommendedWindowHours` — bounded next-window guidance derived from status and action
- `warnings` — explicit tension/trust/rhythm/window warnings
- `disclaimer` — always present, because DUET is guidance and not legal, medical, relationship, or emergency advice
- Invalid domain evaluations return `valid: false` and set `objective`, `mode`, and `energyMatch` to `null`

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/mode/energy-match identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and non-integer shared-window inputs
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate only after contract stability is proven.
3. **Cross-repo follow-up** — synchronize labels/persona/docs only if a linked repository adopts DUET runtime usage.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repository runtime change is required for DUET v1.
- If another repository adopts DUET, document downstream synchronization in `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/MULTI-REPO-LINKS.md`.
