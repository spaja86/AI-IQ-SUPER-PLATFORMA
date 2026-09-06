# NUDE — Normalized Unified Deterministic Evaluation Module

## Purpose

NUDE defines a deterministic readiness contract for balancing stress, context load, and recovery pressure during active execution blocks.
Version 1 is intentionally API-first with no UI dependency so validation, KPI behavior, and governance can stabilize before wider adoption.

## Scope boundaries

- **In scope**: canonical `nude` slug, deterministic readiness evaluation, regulation/clarity/recovery/readiness scoring, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: persistence, identity profiles, medical diagnosis, legal advice, personalized therapy plans, and cross-repo runtime coupling.

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
| Display name | `NUDE` |
| Canonical slug | `nude` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `nude-balance-core` |
| Octave / hipermreza node | `8 / 65` |
| Routes | `/api/nude/evaluate`, `/api/nude/health` |
| Linked-repo impact | `documentation-only` |

## Input model

Each evaluation accepts:

- `mode` — `RESET | FOCUS | RECOVERY | SOCIAL`
- `environment` — `HOME | WORK | TRANSIT | OUTDOOR`
- `priority` — `LOW | MEDIUM | HIGH`
- `stressLevel` — finite number bounded `0..100`
- `contextLoad` — finite number bounded `0..100`
- `sessionMinutes` — finite number bounded `0..240`
- `breaksTaken` — optional integer bounded `0..48`

## Output model

- `regulationScore` — bounded ability to remain regulated under current load
- `clarityScore` — bounded execution clarity score
- `recoveryScore` — bounded recovery pressure score
- `readinessScore` — deterministic blended readiness output
- `status` — `CALM | BALANCED | OVERLOADED | CRITICAL`
- `recommendedBreakMinutes` — deterministic break recommendation from status + session length
- `warnings` — explicit operational warnings when thresholds are breached
- `disclaimer` — always present; NUDE is not medical/legal/emergency advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported mode/environment/priority identifiers
- Reject `NaN`, `Infinity`, negative values, and out-of-range bounds
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including deterministic checks, shape guards, and response headers

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate after contract stability is proven.
3. **Cross-repo follow-up** — sync labels/persona/docs in linked repositories only if external consumers adopt the surface.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repo runtime change is required for NUDE v1.
- Documentation/label synchronization can be tracked later in `docs/MULTI-REPO-LINKS.md` if another repository adopts the contract.
