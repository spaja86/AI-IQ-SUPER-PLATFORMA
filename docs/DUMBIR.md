# ÐUMBIR — Ginger Wellness Evaluation Module

## Purpose

ÐUMBIR is the initial deterministic contract for ginger-oriented wellness evaluation in this repository.
Version 1 intentionally ships as an API-first module with no UI surface so the contract, validation rules, and quality gate can stabilize first.

## Scope boundaries

- **In scope**: canonical `dumbir` slug, deterministic blend evaluation, potency/comfort/goal-fit scoring, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: persistence, purchase/catalog flows, medical diagnosis, personalized nutrition history, and cross-repo runtime coupling.

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
| Display name | `ÐUMBIR` |
| Canonical slug | `dumbir` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `dumbir-wellness-core` |
| Octave / hipermreza node | `12 / 96` |
| Routes | `/api/dumbir/evaluate`, `/api/dumbir/health` |
| Linked-repo impact | `documentation-only` |

## Input model

Each evaluation accepts:

- `goal` — `DIGESTION | IMMUNITY | FOCUS | RECOVERY`
- `sensitivity` — `LOW | MEDIUM | HIGH`
- `preparation` — `TEA | SHOT | TONIC | MEAL`
- `gingerGrams` — finite positive grams, bounded by module limits
- `waterMl` — finite positive milliliters, bounded by module limits
- `steepMinutes` — bounded `0..60`
- `servings` — optional integer `1..12`
- `addons` — optional supported add-ons: `LEMON | HONEY | MINT | TURMERIC`

## Output model

- `potencyScore` — bounded warming/intensity estimate
- `comfortScore` — bounded comfort estimate adjusted by sensitivity/hydration/add-ons
- `goalFitScore` — bounded fit against the selected goal
- `balanceScore` — blended deterministic summary score
- `status` — `LIGHT | BALANCED | BOOSTED | INTENSE`
- `recommendedServingMl` — serving guidance derived from status
- `recommendedAddons` — deterministic add-on suggestions not already present
- `warnings` — explicit edge-case or fit warnings
- `disclaimer` — always present, because ÐUMBIR is not medical advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported goal/sensitivity/preparation/add-on identifiers
- Reject `NaN`, `Infinity`, negative values, empty/invalid numeric ranges, and unsupported serving counts
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

- No linked repo runtime change is required for ÐUMBIR v1.
- Documentation/label synchronization can be tracked later in `docs/MULTI-REPO-LINKS.md` if another repository adopts the contract.
