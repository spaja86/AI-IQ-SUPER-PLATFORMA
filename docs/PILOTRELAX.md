# PILOTRELAX — Relaxation Guidance Module

## Purpose

PILOTRELAX is a deterministic relaxation-guidance module for evaluating whether a user should run a reset, focus, recovery, or sleep wind-down protocol.
Version 1 intentionally ships as an API-first module with no UI surface so the contract, validation rules, and quality gate can stabilize first.

## Scope boundaries

- **In scope**: canonical `pilotrelax` slug, deterministic relaxation evaluation, calm/breathing/environment/focus scoring, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: persistence, biosensor integrations, scheduling, aviation telemetry, and cross-repo runtime coupling.

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
| Display name | `PILOTRELAX` |
| Canonical slug | `pilotrelax` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `pilotrelax-calm-core` |
| Octave / hipermreza node | `7 / 58` |
| Routes | `/api/pilotrelax/evaluate`, `/api/pilotrelax/health` |
| Linked-repo impact | `documentation-only` |

## Input model

Each evaluation accepts:

- `objective` — `RESET | FOCUS | RECOVERY | SLEEP`
- `environment` — `COCKPIT | HOME | LOUNGE | OUTDOOR`
- `phaseOfDay` — `MORNING | AFTERNOON | EVENING | NIGHT`
- `stressLoad` — finite bounded score `0..100`
- `availableMinutes` — integer positive minutes `1..180`
- `breathingCycles` — integer bounded `0..60`
- `noiseLevelDb` — finite bounded `0..120`
- `screenMinutesBeforeBreak` — integer bounded `0..240`

## Output model

- `calmScore` — bounded calm-readiness estimate
- `breathingScore` — deterministic recovery potential from breathing + time
- `environmentScore` — environment suitability adjusted by noise and phase
- `focusScore` — screen/stress recovery suitability
- `overallScore` — weighted deterministic summary score
- `status` — `GROUNDED | STEADY | CALM | DEEP_RESET`
- `recommendedProtocol` — `BREATH_RESET | SILENT_RESET | WALK_RESET | SLEEP_WINDDOWN`
- `recommendedMinutes` — bounded guidance derived from protocol and available time
- `warnings` — explicit environment or stress warnings
- `disclaimer` — always present, because PILOTRELAX is not aviation or medical advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/environment/phase identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and non-integer breathing cycles
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate only after contract stability is proven.
3. **Cross-repo follow-up** — sync labels/persona/docs in linked repositories only if external consumers need the surface.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repo runtime change is required for PILOTRELAX v1.
- Documentation/label synchronization can be tracked later in `docs/MULTI-REPO-LINKS.md` if another repository adopts the contract.
